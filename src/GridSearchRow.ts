/// <reference path="EventSystem.ts" />
/// <reference path="defClasses.ts" />
/// <reference path="utils.ts" />


class GridSearhRow{
    filterCooldown: CoolUp;
    element: HTMLElement;
    definition: ObjDef;
    filter: Filter
    searchChange:EventSystem<any>
    
    constructor(element:HTMLElement, definition:ObjDef){
        this.definition = definition
        this.searchChange = new EventSystem();
        this.element = element
        var row = this.element
        this.filterCooldown = new CoolUp(1000, () => {
            this.searchChange.trigger(0,0)
        })
        this.filter = new Filter()

        
        for(let attribute of this.definition.attributes){
            if(attribute.enumType == 'array'|| attribute.hidden)continue;
            let tableCell = createTableCell(this.element)
            let innerCell = createAndAppend(tableCell,'<div style="display:flex; max-width:220px;"></div>')

            let searchField = getWidget(attribute, innerCell,{} as any)
            this.filter.set(attribute,searchField.value,false)

            searchField.value.onchange.listen(() => {
                this.searchChange.trigger(0,0)
            })
            // searchField.value.onchange.listen((val) => {
            //     this.filter.set(attribute,,val)
            //     this.filterCooldown.restartCast()
            // })

            // if(attribute.enumType == 'date' || attribute.enumType == 'number'){
            //     var fromSerachField = getWidget(attribute, innerCell)
            //     fromSerachField.value.onchange.listen((val) => {
            //         if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
            //         this.filter[attribute.name].$gte  = val
            //         this.filterCooldown.restartCast()
            //     })

            //     var toSerachField = getWidget(attribute, innerCell)
            //     toSerachField.value.onchange.listen((val) => {
            //         if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
            //         this.filter[attribute.name].$lt = val
            //         this.filterCooldown.restartCast()
            //     })

            // }else{
            //     var searchField = getWidget(attribute, innerCell)
            //     searchField.value.onchange.listen((val) => {
            //         this.filter[attribute.name] = val
            //         this.filterCooldown.restartCast()
            //     })
            // }

            let clearSearchField = new Button(innerCell, 'clear', 'btn btn-danger clearbtn', () => {
                searchField.value.set(undefined)
                this.searchChange.trigger(0,0)
            })
        }
    }
}

class Filter{
    value:{[key:string]:any}

    constructor(){
        this.value = {}
    }

    set(atribute:Attribute,box:Box<any>,range:boolean){
        box.onchange.listen((val) => {
            this.value[atribute.name] = val;
        })
    }

    toJson(){
        return this.value;
    }   
}