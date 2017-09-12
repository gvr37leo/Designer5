/// <reference path="main.ts" />
/// <reference path="DetailView.ts" />


class ObjectView extends DetailView{
    buttons: Button[] = [];
    changeEvent: EventSystem<any>;

    constructor(element:Element,definition:ObjDef, id){
        super(element, definition)
        var that = this
        this.arraycontainer.style.display = 'none'
        this.changeEvent = new EventSystem<any>()

        var savebtn = new SaveButton(this.buttonContainer as HTMLElement,this.changeEvent, () => {
            update(definition.name,id,that.data,() => {
                
            },(error) => {
                
            })
        })
        savebtn.btnElement.classList.add('margin-right')

        var deletebtn = new Button(that.buttonContainer, 'delete', 'btn btn-danger', () => {
            del(definition.name,id,() => {
            },(error) => {
                
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
            
            

            for(let attribute of that.definition.attributes){
                if(attribute.type == 'array'){
                    this.arraycontainer.style.display = 'block'
                    that.buttons[0].btnElement.click()
                    break;
                }
            }
        },(error) => {

        })

        
    }

    render(data){
        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array'){
                let castedAttribute = attribute as arrayAttribute

                let filter = {}
                filter[castedAttribute.column] = data._id
                
                this.buttons.push(new Button(this.tabs, `${castedAttribute.pointerType} : ${castedAttribute.column}`, 'btn btn-default margin-right',() => {
                    this.gridcontainer.innerHTML = ''
                    let gridDefinition = appDef.objdefinitions.find((val) => {
                        return val.name == castedAttribute.pointerType
                    })
                    let gridControl = new GridControl(this.gridcontainer,gridDefinition, filter)

                    gridControl.createButton.btnElement.remove()
                    gridControl.createButton = new Button(gridControl.createlinkContainer,'create','btn btn-success createbtn',() => {
                        globalModal.contentcontainer.innerHTML = ''
                        let objectNewView = new ObjectNewView(globalModal.contentcontainer, gridDefinition)
                        globalModal.show()
                        objectNewView.widgetMap.get(castedAttribute.column).value.set(this.data._id)
                        objectNewView.widgetMap.get(castedAttribute.column).readonly.set(true)

                        objectNewView.saveSucceeded.listen(() => {
                            globalModal.hide()
                        })
                    }) 

                }))
            }else{
                this.addWidget(attribute)
            }
        }
    }
}