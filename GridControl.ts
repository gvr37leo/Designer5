/// <reference path="widget.ts" />
/// <reference path="widgets/booleanWidget.ts" />
/// <reference path="widgets/dateWidget.ts" />
/// <reference path="widgets/numberWidget.ts" />
/// <reference path="widgets/pointerWidget.ts" />
/// <reference path="widgets/textWidget.ts" />
/// <reference path="widgets/enumWidget.ts" />
/// <reference path="widgets/idWidget.ts" />


var types = ['text','boolean','number','date','pointer','array']



class GridControl{
    filterCooldown: CoolUp;
    createButton: Button;
    createlinkContainer: Element;
    gridtitle: HTMLElement;
    tablebody: Element;
    titlerow: Element;
    searchrow: Element;
    filter: any;
    element: Element
    data
    definition:ObjDef
    onchange:EventSystem<any>
    template:string = `
        <div class="grid">
            <h2 id="gridtitle"></h2>
            <div id="createlink-container">
                
            </div>
            <table id="table" class="table table-striped" style="width:100%;">
                <thead>
                    <tr id="titlerow"></tr>
                    <tr id="searchrow"></tr>
                </thead>
                <tbody id="tablebody">

                </tbody>
            </table>
        </div>
    `

    constructor(element:Element, definition:ObjDef, filter){
        var that = this
        this.onchange = new EventSystem()
        this.element = element;
        this.definition = definition
        this.filter = filter
        this.filterCooldown = new CoolUp(1000, () => {
            this.refetchbody()
        })

        this.element.appendChild(string2html(this.template))
        this.gridtitle = this.element.querySelector('#gridtitle') as HTMLElement
        this.tablebody = this.element.querySelector('#tablebody') 
        this.titlerow = this.element.querySelector('#titlerow')
        this.searchrow = this.element.querySelector('#searchrow')
        this.createlinkContainer = this.element.querySelector('#createlink-container');
        this.gridtitle.innerText = this.definition.name
        
        this.createButton = new Button(this.createlinkContainer,'create','btn btn-success createbtn',() => {
            globalModal.contentcontainer.innerHTML = ''
            let objectNewView = new ObjectNewView(globalModal.contentcontainer, this.definition)
            globalModal.show()

            objectNewView.saveSucceeded.listen(() => {
                globalModal.hide()
            })
        })

        this.appendHeader()
        this.refetchbody()
        
    }

    refetchbody(){
        getlistfiltered(this.definition.name,this.filter,(res) => {
            this.data = res
            this.tablebody.innerHTML = ''
            this.appendBody(res)
        },() => {

        })
    }

    appendHeader(){
        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array')continue;

            //titlerow
            createTableCell(this.titlerow).appendChild(string2html(`<b>${attribute.name}</b>`))

            //columnrow
            var searchField = new TextWidget(createTableCell(this.searchrow))
            searchField.value.onchange.listen((val) => {
                if(val == ''){
                    delete this.filter[attribute.name]
                }else{
                    this.filter[attribute.name] = val
                }
                this.filterCooldown.restartCast()
            })
        }

    }

    appendBody(data){
        for(let rows = 0; rows < data.length; rows++){
            let rowchange = new EventSystem();
            var row = document.createElement('tr')
            this.tablebody.appendChild(row)

            for(let attribute of this.definition.attributes){
                if(attribute.type == 'array')continue;
                var widget = getWidget(attribute,createTableCell(row))
                widget.value.set(data[rows][attribute.name])

                widget.value.onchange.listen((val) => {
                    data[rows][attribute.name] = val;
                    this.onchange.trigger(0,0)
                    rowchange.trigger(0,0)
                })
            }

            // save button
            let savebtn = new SaveButton(createTableCell(row),rowchange,() => {
                update(this.definition.name,data[rows]._id,data[rows],() => {},() => {})
            })

            // delete button
            let deletebutton = new Button(createTableCell(row),'delete', 'btn btn-danger',() => {
                del(this.definition.name,data[rows]._id,() => {},() => {})
            })
        }
    }
}
