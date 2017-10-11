/// <reference path="EventSystem.ts" />
/// <reference path="defClasses.ts" />
/// <reference path="utils.ts" />


class GridSearhRow{
    filterCooldown: CoolUp;
    element: HTMLElement;
    definition: ObjDef;
    filter: Filter
    searchChange:EventSystem<any>
    
    constructor(element:HTMLElement, definition:ObjDef,filter){
        this.definition = definition
        this.searchChange = new EventSystem();
        this.element = element
        var row = this.element
        this.filterCooldown = new CoolUp(1000, () => {
            this.searchChange.trigger(0,0)
        })
        this.filter = new Filter()
        // this.filter = filter
        
        for(let attribute of this.definition.attributes){
            if(attribute.enumType == 'array'|| attribute.hidden)continue;
            let tableCell = createTableCell(this.element)
            let innerCell = createAndAppend(tableCell,'<div style="display:flex; max-width:220px;"></div>')

            
            let searchfields:Widget<any>[] = []

            // if(attribute.enumType == 'date' || attribute.enumType == 'number'){
            //     var fromSerachField = getWidget(attribute, innerCell,{})
            //     fromSerachField.value.onchange.listen((val) => {
            //         if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
            //         this.filter[attribute.name].$gte  = val
            //         this.filterCooldown.restartCast()
            //     })

            //     var toSerachField = getWidget(attribute, innerCell,{})
            //     toSerachField.value.onchange.listen((val) => {
            //         if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
            //         this.filter[attribute.name].$lt = val
            //         this.filterCooldown.restartCast()
            //     })
            //     searchfields.push(fromSerachField,toSerachField)
            // }else{
            let searchField = getWidget(attribute, innerCell,{})
            // searchField.value.set(filter[attribute.name])
            this.filter.set(attribute,searchField.value,false)
            searchField.value.onchange.listen((val) => {
                // this.filter[attribute.name] = val
                this.filterCooldown.restartCast()
            })
            searchfields.push(searchField)
            // }

            let clearSearchFields = new Button(innerCell, 'clear', 'btn btn-danger clearbtn', () => {
                for(let _searchField of searchfields){
                    _searchField.value.clear()
                    // searchField.value.set(undefined)
                }
                // this.filter[attribute.name] = undefined
                this.searchChange.trigger(0,0)
            })
        }
    }
}

class Filter{
    map:Map<string,Box<any>>

    constructor(){
        this.map = new Map<string, any>()
    }

    set(atribute:Attribute,box:Box<any>,range:boolean){
        this.map.set(atribute.name,box)
    }

    toJson(){
        var filter = {}

        for(let pair of this.map){
            var key = pair[0]
            var value = pair[1]
            if(value.isSet){
                filter[key] = value.get()
            }

        }

        return filter;
    }   
}