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
    sort: {};
    sortDirection: number;
    buttonContainer: Element;
    filterCooldown: CoolUp;
    createButton: Button;
    createlinkContainer: HTMLElement;
    gridtitle: HTMLElement;
    tablebody: HTMLElement;
    titlerow: HTMLElement;
    searchrow: HTMLElement;
    filter: any;
    element: HTMLElement
    data
    definition:ObjDef
    onchange:EventSystem<any>
    template:string = `
        <div class="grid">
            <h2 id="gridtitle"></h2>
            <div id="button-container">
                <span id="createlink-container"></span>
            </div>

            <div id="table">
                <div id="tablehead">
                    <div id="titlerow" class="tablerow"></div>
                    <div id="searchrow" class="tablerow"></div>
                </div>
                <div id="tablebody">
                
                </div>
            </div>
        </div>
    `

    constructor(element:HTMLElement, definition:ObjDef, filter){
        var that = this
        this.onchange = new EventSystem()
        this.element = element;
        this.definition = definition
        this.filter = filter
        this.sort = {}
        this.sortDirection = 1
        this.filterCooldown = new CoolUp(1000, () => {
            this.refetchbody()
        })

        this.element.appendChild(string2html(this.template))
        this.buttonContainer = this.element.querySelector('#button-container')
        this.gridtitle = this.element.querySelector('#gridtitle') as HTMLElement
        this.tablebody = this.element.querySelector('#tablebody')  as HTMLElement
        this.titlerow = this.element.querySelector('#titlerow') as HTMLElement
        this.searchrow = this.element.querySelector('#searchrow') as HTMLElement
        this.createlinkContainer = this.element.querySelector('#createlink-container') as HTMLElement
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

        this.appendHeader()
        this.refetchbody()
        
    }

    refetchbody(){
        getlistfiltered(this.definition.name,{filter:this.filter,sort:this.sort},(res) => {
            this.data = res
            this.tablebody.innerHTML = ''
            this.appendBody(res)
        },() => {

        })
    }

    appendHeader(){
        for(let attribute of this.definition.attributes){
            if(attribute.enumType == 'array' || attribute.hidden)continue;

            //titlerow
            
            var titleCell = createAndAppend(this.titlerow,`<b style="display:flex;" class="cell"">${attribute.name}</b>`)

            new Button(titleCell,'^','btn btn-default',() => {
                this.sortDirection *= -1;
                this.sort = {}
                this.sort[attribute.name] = this.sortDirection
                this.refetchbody()
            })


            //columnrow
            var tableCell = createAndAppend(this.searchrow,'<div style="display:flex;" class="cell""></div>')
            
            var searchFields:Widget<any>[] = []

            if(attribute.enumType == 'date' || attribute.enumType == 'number'){
                var fromSerachField = getWidget(attribute, tableCell)
                fromSerachField.value.onchange.listen((val) => {
                    if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
                    this.filter[attribute.name].$gte  = val
                    this.filterCooldown.restartCast()
                })

                var toSerachField = getWidget(attribute, tableCell)
                toSerachField.value.onchange.listen((val) => {
                    if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
                    this.filter[attribute.name].$lt = val
                    this.filterCooldown.restartCast()
                })

            }else{
                var searchField = getWidget(attribute, tableCell)
                searchField.value.onchange.listen((val) => {
                    this.filter[attribute.name] = val
                    this.filterCooldown.restartCast()
                })
            }

            var clearSearchField = new Button(tableCell, 'clear', 'btn btn-danger', () => {
                delete this.filter[attribute.name]
                this.refetchbody()
            })
        }
        createAndAppend(this.titlerow,'<div class="cell"></div>')
        createAndAppend(this.titlerow,'<div class="cell"></div>')
        createAndAppend(this.searchrow,'<div class="cell"></div>')
        createAndAppend(this.searchrow,'<div class="cell"></div>')

    }

    appendBody(data){
        for(let rows = 0; rows < data.length; rows++){
            let rowchange = new EventSystem();
            var row = createAndAppend(this.tablebody,'<div class="tablerow"></div>')
            
            for(let attribute of this.definition.attributes){
                if(attribute.enumType == 'array' || attribute.hidden)continue;
                var widget = getWidget(attribute,createAndAppend(row,'<div class="cell"></div>'))
                widget.value.set(data[rows][attribute.name])

                widget.value.onchange.listen((val) => {
                    data[rows][attribute.name] = val;
                    this.onchange.trigger(0,0)
                    rowchange.trigger(0,0)
                })
            }

            // save button
            let savebtn = new SaveButton(createAndAppend(row,'<div class="cell"></div>'),rowchange,() => {
                update(this.definition.name,data[rows]._id,data[rows],() => {},() => {})
            })

            // delete button
            let deletebutton = new Button(createAndAppend(row,'<div class="cell"></div>'),'delete', 'btn btn-danger',() => {
                del(this.definition.name,data[rows]._id,() => {
                    this.refetchbody()
                },() => {})
            })
        }
    }
}
