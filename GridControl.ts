/// <reference path="widget.ts" />
/// <reference path="widgets/booleanWidget.ts" />
/// <reference path="widgets/dateWidget.ts" />
/// <reference path="widgets/numberWidget.ts" />
/// <reference path="widgets/pointerWidget.ts" />
/// <reference path="widgets/textWidget.ts" />


class GridControl{
    element:Element
    data
    definition:ObjDef
    table
    onchange:EventSystem<any>

    constructor(element:Element, options){
        this.onchange = new EventSystem()
        this.element = element;
        this.data = options.data
        this.definition = options.definition
        this.table = string2html('<table id="table" style="width:100%;"></table>')
        this.element.appendChild(this.table)
        var testdiv = document.querySelector('#test')

        this.appendHeader()
        this.appendBody()

        this.onchange.listen((val) => {
            testdiv.innerHTML = JSON.stringify(this.data)
        })
        

    }

    appendHeader(){
        var nameHeader = document.createElement('tr')
        this.table.appendChild(nameHeader)
        for(let attribute of this.definition.attributes){
            var td = document.createElement('td')
            nameHeader.appendChild(td)

            var columnTitle = new TextWidget(td)
            columnTitle.value.set(attribute.name)
        }


        var searchHeader = document.createElement('tr')
        this.table.appendChild(searchHeader)
        for(let attribute of this.definition.attributes){
            var td = document.createElement('td')
            searchHeader.appendChild(td)

            var searchField = new TextWidget(td)
        }
    }

    appendBody(){
        for(let rows = 0; rows < this.data.length; rows++){
            var row = document.createElement('tr')
            this.table.appendChild(row)
            for(let attribute of this.definition.attributes){
                var td = document.createElement('td')
                row.appendChild(td)

                var widget = getWidget(attribute,td)
                
                widget.value.set(this.data[rows][attribute.name])
                widget.value.onchange.listen((val) => {
                    this.data[rows][attribute.name] = val;
                    this.onchange.trigger(0)
                })
                
            }
        }
    }
}

function getWidget(attr:Attribute,element:HTMLElement):Widget<any>{
    var widget:Widget<any>
    switch (attr.type) {
        case 'boolean':
            widget = new BooleanWidget(element)
            break;
        case 'number':
            widget = new NumberWidget(element,{})
            break;
        case 'date':
            widget = new DateWidget(element)
            break;
        case 'pointer':
            widget = new PointerWidget(element, attr)
            break;
        default://text
            widget = new TextWidget(element)
            break;
    }
    return widget
}

function string2html(string):HTMLElement{
    var div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0] as HTMLElement;
}
var types = ['text','boolean','number','date','pointer']
