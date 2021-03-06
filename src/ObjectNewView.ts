/// <reference path="main.ts" />
/// <reference path="DetailView.ts" />

class ObjectNewView extends DetailView{
    saveSucceeded: EventSystem<{}>;
    savebtn: Button;

    constructor(element:HTMLElement,definition:ObjDef){
        super(element,definition)
        var that = this
        this.arraycontainer.remove()
        this.data = {}
        this.saveSucceeded = new EventSystem()
        this.uplink.remove()
        
        this.savebtn = new Button(this.buttonContainer, 'create', 'btn btn-success',() => {
            this.save()
        })

        this.render(this.data)
    }

    save(){
        create(this.definition.name,this.data,() => {
            this.saveSucceeded.trigger(0,0)
        },(error) => {
            
        })
    }

    render(data){
        for(let attribute of this.definition.attributes){
            if(attribute.name == '_id')continue;
            if(attribute.enumType == 'array') continue;

            this.addWidget(attribute)
        }
    }
}