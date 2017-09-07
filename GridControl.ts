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

    constructor(element:Element, definition:ObjDef){
        this.onchange = new EventSystem()
        this.element = element;
        this.definition = definition
        
        //create link
        var createspan = document.createElement('span')
        createspan.appendChild(string2html(`<a href="/#${this.definition.name}/new">create</a>`))
        element.appendChild(createspan)
        
        this.table = string2html('<table id="table" style="width:100%;"></table>')
        this.element.appendChild(this.table)
        var testdiv = document.querySelector('#test')

        this.appendHeader()
        
        this.onchange.listen((val) => {
            testdiv.innerHTML = JSON.stringify(this.data)
        })
        
        fetch(`/api/${definition.name}`,{
            headers:{
                'Content-Type': 'application/json'
            },
            method:'GET',
        }).then((res) => {
            return res.json()
        }).then((res) => {
            this.data = res
            this.appendBody(res)
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

    appendBody(data){
        for(let rows = 0; rows < data.length; rows++){
            var row = document.createElement('tr')
            this.table.appendChild(row)
            for(let attribute of this.definition.attributes){
                var td = document.createElement('td')
                row.appendChild(td)

                var widget = getWidget(attribute,td)
                
                widget.value.set(data[rows][attribute.name])
                widget.value.onchange.listen((val) => {
                    data[rows][attribute.name] = val;
                    this.onchange.trigger(0)
                })
                
            }

            // save button
            var savetd = document.createElement('td')
            var savebtn = new Button(savetd, 'save',() => {
                fetch(`/api/${this.definition.name}/${data[rows]._id}`,{
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    method:'PUT',
                    body:JSON.stringify(data[rows])
                }).then((res) => {
                    return res.text()
                }).then((res) => {
                    console.log(res)
                })
            })
            row.appendChild(savetd)

            // delete button
            var deltd = document.createElement('td')
            var deletebutton = new Button(deltd,'delete',() => {
                fetch(`/api/${this.definition.name}/${data[rows]._id}`,{
                    method:'DELETE',
                }).then((res) => {
                    return res.text()
                })
                .then((res) => {
                    console.log(res)
                })
            })
            row.appendChild(deltd)

            //inspect link
            var deltd = document.createElement('td')
            deltd.appendChild(string2html(`<a href="/#${this.definition.name}/${data[rows]._id}">inspect</a>`))
            row.appendChild(deltd)
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
