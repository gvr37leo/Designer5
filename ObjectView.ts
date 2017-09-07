/// <reference path="main.ts" />

class ObjectView{
    element:Element
    definition:ObjDef
    data

    constructor(element:Element,definition:ObjDef, object, id){
        this.element = element
        this.definition = definition
        this.data = {};

        var savebtn = new Button(element, 'save',() => {
            fetch(`/api/${definition.name}/${id}`,{
                headers:{
                    'Content-Type': 'application/json'
                },
                method:'PUT',
                body:JSON.stringify(this.data)
            }).then((res) => {
                return res.text()
            }).then((res) => {
                console.log(res)
            })
        })

        var deletebtn = new Button(element, 'delete', () => {
            fetch(`/api/${definition.name}/${id}`,{
                method:'DELETE',
            }).then((res) => {
                return res.text()
            })
            .then((res) => {
                console.log(res)
            })
        })

        fetch(`/api/${definition.name}/${id}`,{
            headers:{
                'Content-Type': 'application/json'
            },
            method:'GET',
        }).then((res) => {
            return res.json()
        }).then((res) => {
            this.data = res;
            this.render(res)
        })
    }

    render(data){
        for(let attribute of this.definition.attributes){
            var container = string2html('<div></div>')
            container.appendChild(string2html(`<span>${attribute.name}</span>`))
            var widget = getWidget(attribute, container)
            this.element.appendChild(container)

            widget.value.onchange.listen((val) => {
                data[attribute.name] = val;
            })
            widget.value.set(data[attribute.name])
        }
    }
}