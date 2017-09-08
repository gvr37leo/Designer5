/// <reference path="main.ts" />

class ObjectNewView{
    element:Element

    constructor(element:Element,definition:ObjDef){
        var data = {}
        this.element = element

        this.element.appendChild(string2html(`<a href="/#${definition.name}">Up</a>`))

        var savebtn = new Button(element, 'create',() => {
            fetch(`/api/${definition.name}`,{
                headers:{
                    'Content-Type': 'application/json'
                },
                method:'POST',
                body:JSON.stringify(data)
            }).then((res) => {
                return res.text()
            })
            .then((res) => {
                console.log(res)
                router.setRoute(definition.name)
            })
        })

        for(let attribute of definition.attributes){
            if(attribute.name == '_id')continue;
            var container = string2html('<div></div>')
            container.appendChild(string2html(`<span>${attribute.name}</span>`))
            var widget = getWidget(attribute, container)
            this.element.appendChild(container)

            widget.value.onchange.listen((val) => {
                data[attribute.name] = val;
            })
        }

    }
}