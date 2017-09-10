/// <reference path="widget.ts" />
/// <reference path="widgets/booleanWidget.ts" />
/// <reference path="widgets/dateWidget.ts" />
/// <reference path="widgets/numberWidget.ts" />
/// <reference path="widgets/pointerWidget.ts" />
/// <reference path="widgets/textWidget.ts" />

var types = ['text','boolean','number','date','pointer','array']

class GridControl{
    tablebody: Element;
    titlerow: Element;
    searchrow: Element;
    createlink: HTMLAnchorElement;
    filter: any;
    element: Element
    data
    definition:ObjDef
    onchange:EventSystem<any>
    template:string = `
        <div>
            <a id="createlink">create</a>
            <table id="table" style="width:100%;">
                <thead>
                    <tr id="titlerow"></tr>
                    <tr id="searchrow"></tr>
                </thead>
                <tbody id="tablebody">

                </tbody>
            </table>
        </div>
    `

    constructor(element:Element, definition:ObjDef){
        this.onchange = new EventSystem()
        this.element = element;
        this.definition = definition

        this.element.appendChild(string2html(this.template))
        this.tablebody = this.element.querySelector('#tablebody') 
        this.titlerow = this.element.querySelector('#titlerow')
        this.searchrow = this.element.querySelector('#searchrow')
        this.createlink = this.element.querySelector('#createlink') as HTMLAnchorElement
        this.createlink.href = `/#${this.definition.name}/new`

        this.appendHeader()
        
        getlist(definition.name,(res) => {
            this.data = res
            this.appendBody(res)
        })
    }

    appendHeader(){
        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array')continue;

            //titlerow
            var columnTitle = new TextWidget(createTableCell(this.titlerow))
            columnTitle.value.set(attribute.name)

            //columnrow
            var searchField = new TextWidget(createTableCell(this.searchrow))
        }

    }

    appendBody(data){
        for(let rows = 0; rows < data.length; rows++){
            var row = document.createElement('tr')
            this.tablebody.appendChild(row)

            for(let attribute of this.definition.attributes){
                if(attribute.type == 'array')continue
                var td = document.createElement('td')
                row.appendChild(td)

                var widget = getWidget(attribute,td)
                widget.value.set(data[rows][attribute.name])
                widget.value.onchange.listen((val) => {
                    data[rows][attribute.name] = val;
                    this.onchange.trigger(0,0)
                })
            }

            // save button
            var savebtn = new Button(createTableCell(row), 'save',() => {
                update(this.definition.name,data[rows]._id,data[rows],() => {})
            })

            // delete button
            var deletebutton = new Button(createTableCell(row),'delete',() => {
                del(this.definition.name,data[rows]._id,() => {})
            })

            //inspect link
            createTableCell(row).appendChild(string2html(`<a href="/#${this.definition.name}/${data[rows]._id}">inspect</a>`))
        }
    }
}
