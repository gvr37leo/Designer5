/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    optionsMap: Map<string, any>;
    dropdowncontainer: HTMLElement;
    referencedObjectDropdownAttribute: Attribute;
    referencedObject: ObjDef;
    delbuttoncontainer: HTMLElement;
    attribute: pointerAttribute;
    value:Box<any>
    dropdownWidget:DropDownWidget<any>
    link:HTMLAnchorElement
    template:string = `
        <div style="display:flex; max-width:220px;">
            <div id="dropdowncontainer">

            </div>
            <span id="delbuttoncontainer"></span>
            <a class="btn btn-info group-right" id="link">-></a>
        </div>` 

    constructor(element:HTMLElement, attribute:pointerAttribute, infoer:(val) => string){
        super(element)
        var that = this
        this.attribute = attribute

        createAndAppend(this.element,this.template)
        this.link = this.element.querySelector('#link') as HTMLAnchorElement
        this.delbuttoncontainer = this.element.querySelector('#delbuttoncontainer') as HTMLElement
        this.dropdowncontainer = this.element.querySelector('#dropdowncontainer') as HTMLElement

        this.referencedObject = window.objectMap.get(attribute.pointerType)
        this.referencedObjectDropdownAttribute = window.attributeMap.get(this.referencedObject.dropdownAttribute)

        this.value.value = 0;
        this.optionsMap = new Map<string,any>()

        getlist(this.referencedObject.name, (res) => {
            // for(var obj of res){
            //     that.optionsMap.set(obj._id,obj)
            // }

            that.dropdownWidget = new DropDownWidget<any>(that.dropdowncontainer,(val) => {
                return that.getDisplayValue(val)
            },res)

            that.dropdownWidget.value.onchange.listen((val) => {
                if(val == null){
                    that.value.set(null)
                }else{
                    that.value.set(val._id)
                }
            })
        }, (error) => {

        })

        new Button(this.delbuttoncontainer,'X','btn btn-danger group-middle',() => {
            that.dropdownWidget.value.set(null)
        })



        var displayHasBeenSet = false
        this.value.onchange.listen((pointer) => {
            if(!displayHasBeenSet){
                displayHasBeenSet = true

                if(pointer == null){
                    // that.dropdownWidget.input.value = 'nullptr'
                }else{
                    getobject(window.objectMap.get(attribute.pointerType).name ,pointer,(data) => {
                        if(data == null){
                            that.dropdownWidget.input.value = 'null'
                        }else{
                            that.dropdownWidget.input.value = that.getDisplayValue(data)
                        }
                    },(error) => {
                        
                    })
                }
            }
            that.link.href = `/#${attribute.name}/${pointer}`
        })
    }

    handleSetReadOnly(val: boolean) {
        if(val){
            this.delbuttoncontainer.style.display = 'none'
        }else{
            this.delbuttoncontainer.style.display = 'block'
        }
        
    }

    getDisplayValue(val):string{
        if(val == null){
            return 'nullptr'
        }else{
            return val[this.referencedObjectDropdownAttribute.name] || val._id
        }
    }
}