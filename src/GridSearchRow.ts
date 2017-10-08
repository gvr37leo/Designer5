/// <reference path="EventSystem.ts" />
/// <reference path="defClasses.ts" />
/// <reference path="utils.ts" />


class GridSearhRow{
    filterCooldown: CoolUp;
    element: HTMLElement;
    definition: ObjDef;
    filter: any
    searchChange:EventSystem<any>
    
    constructor(element:HTMLElement, definition:ObjDef,filter){
        this.definition = definition
        this.searchChange = new EventSystem();
        this.element = element
        var row = this.element
        this.filterCooldown = new CoolUp(1000, () => {
            this.searchChange.trigger(0,0)
        })
        this.filter = filter
        //maybe ad set/unset boolean to searhrow fields
        
        for(let attribute of this.definition.attributes){
            if(attribute.enumType == 'array'|| attribute.hidden)continue;
            let tableCell = createTableCell(this.element)
            let innerCell = createAndAppend(tableCell,'<div style="display:flex; max-width:220px;"></div>')

            
            var searchfields = []

            if(attribute.enumType == 'date' || attribute.enumType == 'number'){
                var fromSerachField = getWidget(attribute, innerCell,{})
                fromSerachField.value.onchange.listen((val) => {
                    if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
                    this.filter[attribute.name].$gte  = val
                    this.filterCooldown.restartCast()
                })

                var toSerachField = getWidget(attribute, innerCell,{})
                toSerachField.value.onchange.listen((val) => {
                    if (!this.filter[attribute.name]) this.filter[attribute.name] = {}
                    this.filter[attribute.name].$lt = val
                    this.filterCooldown.restartCast()
                })
                searchfields.push(fromSerachField,toSerachField)
            }else{
                var searchField = getWidget(attribute, innerCell,{})
                searchField.value.set(filter[attribute.name]) 
                searchField.value.onchange.listen((val) => {
                    this.filter[attribute.name] = val
                    this.filterCooldown.restartCast()
                })
            }

            let clearSearchFields = new Button(innerCell, 'clear', 'btn btn-danger clearbtn', () => {
                for(let searchField of searchfields){
                    searchField.value.set(undefined)
                }
                this.filter[attribute.name] = undefined
                this.searchChange.trigger(0,0)
            })
        }
    }
}

// class Filter{
//     value:{[key:string]:any}

//     constructor(){
//         this.value = {}
//     }

//     set(atribute:Attribute,box:Box<any>,range:boolean){
//         box.onchange.listen((val) => {
//             this.value[atribute.name] = val;
//         })
//     }

//     toJson(){
//         return this.value;
//     }   
// }