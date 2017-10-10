/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    filterAttribute: PointerAttribute;
    dropDownLoaded: EventSystem<any>;
    optionsMap: Map<string, any>;
    dropdowncontainer: HTMLElement;
    referencedObjectDropdownAttribute: Attribute;
    referencedObject: ObjDef;
    delbuttoncontainer: HTMLElement;
    attribute: PointerAttribute;
    value:Box<any>
    dropdownWidget:DropDownWidget<any>
    link:HTMLAnchorElement
    template:string = `
        <div style="display:flex; max-width:220px;">
            <div id="dropdowncontainer">
                <input class="form-control group-left" type="text"> 
            </div>
            <span id="delbuttoncontainer"></span>
            <a class="btn btn-info group-right" id="link">-></a>
        </div>` 

    constructor(element:HTMLElement, attribute:PointerAttribute, row:any){
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
        this.dropDownLoaded = new EventSystem()
        var filter = {}

        if(attribute.filterOnColumn){
            this.filterAttribute = window.attributeMap.get(attribute.filterOnColumn) as PointerAttribute
            if (row){
                if(attribute.usingOwnColumn){
                    filter[this.filterAttribute.name] = row[window.attributeMap.get(attribute.usingOwnColumn).name]
                }else{
                    filter[this.filterAttribute.name] = row._id
                }
            }else{
                filter[this.filterAttribute.name] = null
            }
        }
        getlistfiltered(this.referencedObject.name,{filter:filter,sort:undefined,paging:{skip:0,limit:50}}, (res) => {
            // for(var obj of res){
            //     that.optionsMap.set(obj._id,obj)
            // }
            that.dropdowncontainer.innerHTML = '';
            that.dropdownWidget = new DropDownWidget<any>(that.dropdowncontainer,'group-left',(val) => {
                return that.getDisplayValue(val)
            },res)
            that.dropDownLoaded.trigger(0,0)

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
                    that.executeWhenLoaded(() => {
                        that.dropdownWidget.input.value = 'nullptr'
                    })
                }else{
                    getobject(window.objectMap.get(attribute.pointerType).name ,pointer,(data) => {
                        that.executeWhenLoaded(() => {
                            if(data == null){
                                that.dropdownWidget.input.value = 'null'
                            }else{
                                that.dropdownWidget.value.set(data,true)
                                that.dropdownWidget.input.value = that.getDisplayValue(data)
                            }
                        })
                    },(error) => {
                        
                    })
                }
            }
            that.link.href = `/#${that.referencedObject.name}/${pointer}`
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

    executeWhenLoaded(callback:()=>void){
        if(this.dropdownWidget){
            callback();
        }else{
            this.dropDownLoaded.listen(() => {
                callback()
            })
        }
    }
}