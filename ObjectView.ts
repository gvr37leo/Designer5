/// <reference path="main.ts" />
/// <reference path="DetailView.ts" />


class ObjectView extends DetailView{
    changeEvent: EventSystem<any>;

    constructor(element:Element,definition:ObjDef, id){
        super(element, definition)
        var that = this

        this.changeEvent = new EventSystem<any>()

        var savebtn = new SaveButton(this.buttonContainer as HTMLElement,this.changeEvent, () => {
            update(definition.name,id,that.data,() => {
                
            })
        })

        var deletebtn = new Button(that.buttonContainer, 'delete', 'btn btn-danger', () => {
            del(definition.name,id,() => {
            })
        })

        getobject(definition.name,id,(res) => {
            that.data = res;
            that.render(res)

            for(var key of that.widgetMap){
                var widget = key[1]
                var fieldname = key[0]
                widget.value.set(res[fieldname])
                
                widget.value.onchange.listen(() => {
                    this.changeEvent.trigger(0,0)
                }) 
            }
            
            var filter = {}
            filter[this.definition.name] = id

            for(let attribute of that.definition.attributes){
                if(attribute.type == 'array'){
                    new GridControl(that.gridcontainer,appDef.objdefinitions.find((val) => {
                        return val.name == attribute.pointerType
                    }), filter)
                }
            }
        })

        
    }

    render(data){
        var filter = {}
        filter[this.definition.name] = data._id

        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array'){
                new Button(this.tabs, attribute.pointerType, 'btn btn-default',() => {
                    this.gridcontainer.innerHTML = ''
                    new GridControl(this.gridcontainer,appDef.objdefinitions.find((val) => {
                        return val.name == attribute.pointerType
                    }), filter)
                })
            }else{
                this.addWidget(attribute)
            }
        }
    }
}