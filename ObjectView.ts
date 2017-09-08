/// <reference path="main.ts" />

class ObjectView{
    fieldContainer: Element;
    buttonContainer: Element;
    gridcontainer: Element;
    tabs: Element;
    arrayContainer: Element;
    element: Element
    definition:ObjDef
    data
    template:string = `
        <div>
            <a id="uplink">Up</a>
            <span id="buttoncontainer"></span>
            
            <div id="fieldcontainer"></div>
            <div><div id="tabs"></div><div id="gridcontainer"></div></div>
        </div>
    `

    constructor(element:Element,definition:ObjDef, object, id){
        this.element = element
        this.definition = definition
        this.data = {};
        

        this.element.appendChild(string2html(this.template))
        this.fieldContainer = this.element.querySelector('#fieldcontainer')
        this.gridcontainer = this.element.querySelector('#gridcontainer')
        this.tabs = this.element.querySelector('#tabs')
        
        var uplink = this.element.querySelector('#uplink') as HTMLAnchorElement
        uplink.href = `/#${this.definition.name}`

        this.buttonContainer = this.element.querySelector('#buttoncontainer')

        var savebtn = new Button(this.buttonContainer, 'save', () => {
            update(definition.name,id,this.data,() => {

            })
        })

        var deletebtn = new Button(this.buttonContainer, 'delete', () => {
            del(definition.name,id,() => {
            })
        })

        getobject(definition.name,id,(res) => {
            this.data = res;
            this.render(res)
        })
    }

    render(data){
        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array'){
                new Button(this.tabs,attribute.pointerType,() => {
                    this.gridcontainer.innerHTML = ''
                    var def = appDef as AppDef
                    new GridControl(this.gridcontainer,def.objdefinitions.find((val) => {
                        return val.name == attribute.pointerType
                    }))
                })
            }else{
                var container = string2html('<div></div>')
                container.appendChild(string2html(`<span>${attribute.name}</span>`))
                var widget = getWidget(attribute, container)

                this.fieldContainer.appendChild(container)
    
                widget.value.onchange.listen((val) => {
                    data[attribute.name] = val;
                })
                widget.value.set(data[attribute.name])
            }
        }
    }
}