/// <reference path="main.ts" />
/// <reference path="DetailView.ts" />

class ObjectNewView extends DetailView{

    constructor(element:Element,definition:ObjDef){
        super(element,definition)
        var that = this
        this.arraycontainer.remove()
        this.data = {}
        
        var savebtn = new Button(this.buttonContainer, 'create', 'btn btn-success',() => {
            create(definition.name,that.data,() => {
                router.setRoute(definition.name)
            })
        })

        this.render(this.data)
    }

    render(data){
        for(let attribute of this.definition.attributes){
            if(attribute.name == '_id')continue;
            if(attribute.type == 'array') continue;

            this.addWidget(attribute)
        }
    }
}