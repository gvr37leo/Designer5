/// <reference path="main.ts" />

class DetailView{
    columnMap: Map<string, ColumnView>;
    generalColumn: ColumnView;
    columnContainer: HTMLElement;
    arraycontainer: HTMLElement;
    objectTitle: HTMLElement;
    uplink: HTMLAnchorElement;
    definition: ObjDef;
    template: string = `
        <div>
            <h2 id="objecttitle"></h2>
            
            <div id="button-container">
                <a class="btn btn-default" id="uplink">Up</a>
            </div>
            
            <div id="columnContainer" style="display: flex;" ></div>
            
            
            <div id="arraycontainer" class="arraycontainer" >
                <div id="tabs"></div>
                <div id="gridcontainer"></div>
            </div>
        </div>`

    
    element:Element
    // fieldContainer: Element;
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
        this.columnContainer = this.element.querySelector('#columnContainer') as HTMLElement
        this.arraycontainer = this.element.querySelector('#arraycontainer') as HTMLElement 
        this.gridcontainer = this.element.querySelector('#gridcontainer')
        this.tabs = this.element.querySelector('#tabs')
        this.buttonContainer = this.element.querySelector('#button-container')
        this.uplink = this.element.querySelector('#uplink') as HTMLAnchorElement
        this.uplink.href = `/#${this.definition.name}`
        this.objectTitle.innerText = this.definition.name
        
        this.generalColumn = new ColumnView(this.columnContainer,'General')
        this.generalColumn.element.classList.add('panel-primary')
        this.columnMap = new Map<string,ColumnView>();
        for(var column of definition.columns){
            this.columnMap.set(column._id,new ColumnView(this.columnContainer,column.name))
        }
    }

    addWidget(attribute:Attribute,data){
        var container = string2html('<div></div>')
        container.appendChild(string2html(`<div><b>${attribute.name}</b></div>`))
        var widget = getWidget(attribute, container,data)
        widget.readonly.set(attribute.readonly)
        if(attribute.belongsToColumn != null){
            this.columnMap.get(attribute.belongsToColumn).body.appendChild(container)
        }else{
            this.generalColumn.body.appendChild(container)
        }

        widget.value.onchange.listen((val) => {
            this.data[attribute.name] = val;
        })
        this.widgetMap.set(attribute.name,widget)
        return widget
    }

    
}

class ColumnView{
    name: string;
    element: HTMLElement
    title:HTMLElement
    body:HTMLElement
    columnTemplate:string = `
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 id="title" class="panel-title"></h3>
        </div>
        <div id="body" class="panel-body">
        </div>
    </div>`

    constructor(element:HTMLElement,name:string){
        this.name = name
        this.element = createAndAppend(element,this.columnTemplate)

        this.title = this.element.querySelector('#title') as HTMLElement
        this.body = this.element.querySelector('#body') as HTMLElement

        this.title.innerText = this.name
    }
}