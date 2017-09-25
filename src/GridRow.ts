/// <reference path="defClasses.ts" />
/// <reference path="EventSystem.ts" />
/// <reference path="utils.ts" />


class GridRow{
    data: any;
    definition: ObjDef;
    element: HTMLElement
    deleteEvent:EventSystem<any> = new EventSystem();
    dirtied:EventSystem<any> = new EventSystem();

    constructor(objdef:ObjDef, data){
        this.data = data
        this.definition = objdef
        this.element = document.createElement('tr')
        var row = this.element
        
        for(let attribute of this.definition.attributes){
            if(attribute.enumType == 'array' || attribute.hidden)continue;
            var widget = getWidget(attribute,createTableCell(row),this.data)
            widget.value.set(data[attribute.name])

            widget.value.onchange.listen((val) => {
                data[attribute.name] = val;
                this.dirtied.trigger(0,0)
            })
        }

        // save button
        let savebtn = new SaveButton(createTableCell(row),this.dirtied,() => {
            update(this.definition.name,data._id,data,() => {},() => {})
        })

        // delete button
        let deletebutton = new Button(createTableCell(row),'delete', 'btn btn-danger',() => {
            del(this.definition.name,data._id,() => {
                this.deleteEvent.trigger(0,0)
            },() => {})
        })
    }
}