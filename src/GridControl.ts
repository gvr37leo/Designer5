/// <reference path="widget.ts" />
/// <reference path="widgets/booleanWidget.ts" />
/// <reference path="widgets/dateWidget.ts" />
/// <reference path="widgets/numberWidget.ts" />
/// <reference path="widgets/pointerWidget.ts" />
/// <reference path="widgets/textWidget.ts" />
/// <reference path="widgets/enumWidget.ts" />
/// <reference path="widgets/idWidget.ts" />
/// <reference path="GridRow.ts" />
/// <reference path="GridSearchRow.ts" />


var types = ['text','boolean','number','date','pointer','array']



class GridControl{
    rows: GridRow[];
    searchRow: GridSearhRow;
    sort: {};
    sortDirection: number;
    buttonContainer: Element;
    filterCooldown: CoolUp;
    createButton: Button;
    createlinkContainer: Element;
    gridtitle: HTMLElement;
    tablebody: Element;
    titlerow: Element;
    searchrow: HTMLElement;
    filter: any;
    element: Element
    data
    definition:ObjDef
    template:string = `
        <div class="grid">
            <h2 id="gridtitle"></h2>
            <div id="button-container">
                <span id="createlink-container"></span>
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
        this.element = element;
        this.definition = definition
        this.rows = []
        this.sort = {};
        this.sortDirection = 1

        this.element.appendChild(string2html(this.template))
        this.buttonContainer = this.element.querySelector('#button-container')
        this.gridtitle = this.element.querySelector('#gridtitle') as HTMLElement
        this.tablebody = this.element.querySelector('#tablebody') 
        this.titlerow = this.element.querySelector('#titlerow')
        this.searchrow = this.element.querySelector('#searchrow') as HTMLElement
        this.createlinkContainer = this.element.querySelector('#createlink-container');
        this.gridtitle.innerText = this.definition.name
        
        this.createButton = new Button(this.createlinkContainer,'create','btn btn-success',() => {
            globalModal.contentcontainer.innerHTML = ''
            let objectNewView = new ObjectNewView(globalModal.contentcontainer, this.definition)
            globalModal.show()

            objectNewView.saveSucceeded.listen(() => {
                globalModal.hide()
                this.refetchbody()
            })
        })

        new Button(this.buttonContainer,'refresh','btn btn-info', () => {
            this.refetchbody()
        })

        for (let customButton of this.definition.customButtons){
            new Button(this.buttonContainer, customButton.name,'btn btn-default clearbtn',() => {
                customButton.callback(this)
            })
        }

        this.appendHeader()

        this.searchRow =new GridSearhRow(this.searchrow, this.definition)
        this.searchRow.searchChange.listen(() => {
            this.refetchbody()
        })

        this.refetchbody()
    }

    refetchbody(){
        getlistfiltered(this.definition.name,{filter:this.searchRow.filter.toJson(),sort:this.sort},(res) => {
            this.data = res
            this.tablebody.innerHTML = ''
            this.appendBody(res)
        },() => {

        })
    }

    appendHeader(){
        var selectedHeader:HTMLElement = null

        for(let attribute of this.definition.attributes){
            if(attribute.enumType == 'array' || attribute.hidden)continue;

            var titleCell = createTableCell(this.titlerow)
            var innerTitleCell = createAndAppend(titleCell, `<div class="sortableheader" style="display:flex; max-width:220px;">
                <b>${attribute.name}</b>
                <span id="sortordersymbol"></span>
            </div>`)
            let sortordersymbol = innerTitleCell.querySelector('#sortordersymbol') as HTMLElement

            innerTitleCell.addEventListener('click',() => {
                this.sortDirection *= -1;
                this.sort = {}
                this.sort[attribute.name] = this.sortDirection
                this.refetchbody()
                if(selectedHeader){
                    selectedHeader.classList.remove('glyphicon')
                    selectedHeader.classList.remove('glyphicon-triangle-top')
                    selectedHeader.classList.remove('glyphicon-triangle-bottom')
                }
                sortordersymbol.classList.add('glyphicon')
                if(this.sortDirection == 1){
                    sortordersymbol.classList.add('glyphicon-triangle-top')
                }else{
                    sortordersymbol.classList.add('glyphicon-triangle-bottom')
                }
                selectedHeader = sortordersymbol

                
            })
        }
    }

    appendBody(data){
        for(let rows = 0; rows < data.length; rows++){
            var row = new GridRow(this.definition,data[rows])
            this.tablebody.appendChild(row.element)

            row.deleteEvent.listen((val) => {
                this.refetchbody()
            })
            this.rows.push(row)
        }
    }
}
