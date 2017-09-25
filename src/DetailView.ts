/// <reference path="main.ts" />

class DetailView{
    arraycontainer: HTMLElement;
    objectTitle: HTMLElement;
    uplink: HTMLAnchorElement;
    definition: ObjDef;
    template: string = `
        <div>
            <h2 id="objecttitle"></h2>
            <a class="btn btn-default" id="uplink">Up</a>
            <span id="buttoncontainer"></span>
            
            <div id="fieldcontainer"></div>
            
            <div id="arraycontainer" class="arraycontainer" >
                <div id="tabs"></div>
                <div id="gridcontainer"></div>
            </div>
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
        this.objectTitle = this.element.querySelector('#objecttitle') as HTMLElement
        this.fieldContainer = this.element.querySelector('#fieldcontainer')
        this.arraycontainer = this.element.querySelector('#arraycontainer') as HTMLElement 
        this.gridcontainer = this.element.querySelector('#gridcontainer')
        this.tabs = this.element.querySelector('#tabs')
        this.buttonContainer = this.element.querySelector('#buttoncontainer')
        this.uplink = this.element.querySelector('#uplink') as HTMLAnchorElement
        this.uplink.href = `/#${this.definition.name}`
        this.objectTitle.innerText = this.definition.name
        
    }

    addWidget(attribute:Attribute,data){
        var container = string2html('<div></div>')
        container.appendChild(string2html(`<div><b>${attribute.name}</b></div>`))
        var widget = getWidget(attribute, container,data)

        this.fieldContainer.appendChild(container)

        widget.value.onchange.listen((val) => {
            this.data[attribute.name] = val;
        })
        this.widgetMap.set(attribute.name,widget)
        return widget
    }

    
}