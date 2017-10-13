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

        for(let attribute of this.definition.attributes){
            let dirtiedEvent:EventSystem<any> = new EventSystem<any>()
            if(attribute.enumType == 'array'|| attribute.hidden)continue;
            let tableCell = createTableCell(this.element)
            let innerCell = createAndAppend(tableCell,'<div style="display:flex; max-width:220px;"></div>')

            
            let searchfields:Widget<any>[] = []

            if(attribute.enumType == 'date' || attribute.enumType == 'number'){
                var fromSerachField = getWidget(attribute, innerCell,{})
                this.filter.setLow(attribute,fromSerachField.value)

                var toSerachField = getWidget(attribute, innerCell,{})
                this.filter.setHigh(attribute, toSerachField.value)
                
                searchfields.push(fromSerachField,toSerachField)
            }else{
                let searchField = getWidget(attribute, innerCell,{})
                this.filter.set(attribute,searchField.value)
                searchfields.push(searchField)
            }

            for(let searchField of searchfields){
                searchField.value.onchange.listen((val) => {
                    if (attribute.enumType == 'text' || attribute.enumType == 'number'){
                        this.filterCooldown.restartCast()
                    }else{
                        this.searchChange.trigger(0, 0)
                    }
                    dirtiedEvent.trigger(0,0)
                })
            }

            let clearSearchFieldsButton = new DisableableButton(innerCell, 'clear', 'btn btn-danger clearbtn',dirtiedEvent, () => {
                for(let _searchField of searchfields){
                    _searchField.value.clear()
                    // searchField.value.set(undefined)
                }
                // this.filter[attribute.name] = undefined
                this.searchChange.trigger(0,0)
            })
        }

        for(var key in filter){
            this.filter.map.get(key).set(filter[key])
        }
    }
}

class Filter{
    map:Map<string,Box<any>>
    lowMap: Map<string, Box<any>>
    highMap: Map<string, Box<any>>
    attributeMap:Map<string,Attribute>

    constructor(){
        this.map = new Map<string, Box<any>>()
        this.lowMap = new Map<string, Box<any>>()
        this.highMap = new Map<string, Box<any>>()
        this.attributeMap = new Map<string,Attribute>()
    }

    set(attribute:Attribute,box:Box<any>){
        this.map.set(attribute.name,box)
        this.attributeMap.set(attribute.name,attribute)
    }

    setLow(attribute: Attribute, box: Box<any>){
        this.lowMap.set(attribute.name, box)
        this.attributeMap.set(attribute.name, attribute)
    }

    setHigh(attribute: Attribute, box: Box<any>){
        this.highMap.set(attribute.name, box)
        this.attributeMap.set(attribute.name, attribute)
    }

    toJson(){
        var filter = {}

        for(let pair of this.map){
            var key:string = pair[0]
            var value:Box<any> = pair[1]
            var attribute:Attribute = this.attributeMap.get(key)
            if(value.isSet){
                if(attribute.enumType == 'text'){
                    filter[key] = {$regex:`${value.get()}`,$options:''}
                }else{
                    filter[key] = value.get()
                }
            }
        }

        for (let pair of this.lowMap) {
            var key: string = pair[0]
            var lowbox: Box<any> = pair[1]
            var highbox: Box<any> = this.highMap.get(key)

            var rangefilter:any = {}

            if (lowbox.isSet) {
                rangefilter.$gte = lowbox.get()
            }

            if(highbox.isSet){
                rangefilter.$lt = highbox.get()
            }
            
            if(highbox.isSet || lowbox.isSet){
                filter[key] = rangefilter
            }
        }

        return filter;
    }   
}