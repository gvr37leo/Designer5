/// <reference path="main.ts" />
/// <reference path="DetailView.ts" />


class ObjectView extends DetailView{

    constructor(element:Element,definition:ObjDef, id){
        super(element, definition)
        var savebtn = new Button(this.buttonContainer, 'save', () => {
            update(definition.name,id,this.data,() => {

            })
        })

        var deletebtn = new Button(this.buttonContainer, 'delete', () => {
            del(definition.name,id,() => {
            })
        })

        getobject(definition.name,id,(res) => {
            this.data = res;
            this.render(res)

            for(var key of this.widgetMap){
                var widget = key[1]
                var fieldname = key[0]
                widget.value.set(res[fieldname]) 
            }
        })

        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array'){
                new GridControl(this.gridcontainer,appDef.objdefinitions.find((val) => {
                    return val.name == attribute.pointerType
                }))
            }
        }
    }

    render(data){
        for(let attribute of this.definition.attributes){
            if(attribute.type == 'array'){
                new Button(this.tabs,attribute.pointerType,() => {
                    this.gridcontainer.innerHTML = ''
                    new GridControl(this.gridcontainer,appDef.objdefinitions.find((val) => {
                        return val.name == attribute.pointerType
                    }))
                })
            }else{
                this.addWidget(attribute)
            }
        }
    }
}