/// <reference path="main.ts" />

class DetailView{
    uplink: HTMLAnchorElement;
    definition: ObjDef;
    template: string = `
        <div>
            <a id="uplink">Up</a>
            <span id="buttoncontainer"></span>
            
            <div id="fieldcontainer"></div>
            <div><div id="tabs"></div><div id="gridcontainer"></div></div>
        </div>`
    element:Element
    fieldContainer: Element;
    buttonContainer: Element;
    gridcontainer: Element;
    tabs: Element;
    widgetMap:Map<string,Widget<any>> = new Map()
    data

    constructor(element:Element, definition:ObjDef){
        this.definition = definition
        this.element = element

        this.element.appendChild(string2html(this.template))
        this.fieldContainer = this.element.querySelector('#fieldcontainer')
        this.gridcontainer = this.element.querySelector('#gridcontainer')
        this.tabs = this.element.querySelector('#tabs')
        this.buttonContainer = this.element.querySelector('#buttoncontainer')
        this.uplink = this.element.querySelector('#uplink') as HTMLAnchorElement
        this.uplink.href = `/#${this.definition.name}`

        
    }

    addWidget(attribute:Attribute){
        var container = string2html('<div></div>')
        container.appendChild(string2html(`<span>${attribute.name}</span>`))
        var widget = getWidget(attribute, container)

        this.fieldContainer.appendChild(container)

        widget.value.onchange.listen((val) => {
            this.data[attribute.name] = val;
        })
        this.widgetMap.set(attribute.name,widget)
    }

    
}