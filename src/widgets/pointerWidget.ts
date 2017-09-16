/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    referencedObjectDropdownAttribute: Attribute;
    referencedObject: ObjDef;
    delbuttoncontainer: HTMLElement;
    attribute: pointerAttribute;
    internalValue: Box<number>;
    selectedindex: Box<number>
    value:Box<any>
    onselect:EventSystem<any>
    container:HTMLElement
    input:HTMLInputElement
    dropper:HTMLElement
    link:HTMLAnchorElement
    drops:Element[]
    infoer:(val) => string
    optionslist
    template:string = `
        <div style="display:flex;">
            <div id="container" style="position:relative; display:inline-block;"> 
                <input class="form-control group-left" id="input" type="text"> 
                <div id="dropper" class="dropper"></div> 
            </div>
            <span id="delbuttoncontainer"></span>
            <a class="btn btn-info group-right" id="link">-></a>
        </div>` 

    constructor(element:HTMLElement, attribute:pointerAttribute, infoer:(val) => string){
        super(element)
        var that = this
        this.attribute = attribute

        this.element.appendChild(string2html(this.template))
        this.container = this.element.querySelector('#container') as HTMLElement
        this.link = this.element.querySelector('#link') as HTMLAnchorElement
        this.input = this.element.querySelector('#input') as HTMLInputElement
        this.dropper = this.element.querySelector('#dropper') as HTMLElement
        this.delbuttoncontainer = this.element.querySelector('#delbuttoncontainer') as HTMLElement
        this.drops = []

        this.referencedObject = window.objectMap.get(attribute.pointerType)
        this.referencedObjectDropdownAttribute = window.attributeMap.get(this.referencedObject.dropdownAttribute)

        this.value.value = 0;
        this.internalValue = new Box(0)
        this.selectedindex = new Box<number>(0)
        this.onselect = new EventSystem()

        getlist(this.referencedObject.name, (res) => {
            that.optionslist = res
            that.render(res)
        }, (error) => {

        })

        new Button(this.delbuttoncontainer,'X','btn btn-danger group-middle',() => {
            that.internalValue.set(null)
        })

        this.internalValue.onchange.listen((val) => {
            displayHasBeenSet = true
            if(val == null){
                that.input.value = 'nullptr'
                that.value.set(null)
            }else{
                that.input.value = that.getDisplayValue(val)
                that.value.set(val._id)
            }
        })

        var displayHasBeenSet = false
        this.value.onchange.listen((pointer) => {//handle the case where val = undefined or null
            //special case
            //set display for first time set
            if(!displayHasBeenSet){
                displayHasBeenSet = true

                if(pointer == null){
                    that.input.value = 'nullptr'
                }else{
                    getobject(window.objectMap.get(attribute.pointerType).name ,pointer,(data) => {
                        if(data == null){
                            that.input.value = 'null'
                        }else{
                            that.input.value = that.getDisplayValue(data)
                        }
                        
                    },(error) => {
                        
                    })
                }
            }
            that.link.href = `/#${attribute.name}/${pointer}`
        })

        this.onselect.listen(() =>{
            that.dropper.style.display = 'none'
        })

        this.selectedindex.onchange.listen((val, old) => {//for keydowns
            that.internalValue.set(that.optionslist[val])

            that.drops[val].classList.add('selected')
            that.drops[old].classList.remove('selected')
        })


        

        this.input.addEventListener('focus', () => {
            that.dropper.style.display = 'block'
        })

        document.addEventListener('click', (e) => {
            if(!that.container.contains(e.target as any)){
                that.dropper.style.display = 'none'
            }
        })

        this.input.addEventListener('keydown', (e) => {
            if(e.keyCode == 38){
                that.selectedindex.set(mod(that.selectedindex.get() - 1 ,that.optionslist.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 40){
                that.selectedindex.set(mod(that.selectedindex.get() + 1 ,that.optionslist.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 13 || e.keyCode == 27){
                that.dropper.style.display = 'none'
            }
        })

        

        
    }

    render(optionlist){
        var that = this;
        for(let option of optionlist){
            var drop = string2html(`<div class="hovereffect">${this.getDisplayValue(option)}</div>`)
            drop.addEventListener('click',() => {
                this.internalValue.set(option)
                this.onselect.trigger(option._id,0)
            })
            this.drops.push(drop)

            this.dropper.appendChild(drop)
        }
    }

    handleSetReadOnly(val: boolean) {
        if(val){
            this.delbuttoncontainer.style.display = 'none'
        }else{
            this.delbuttoncontainer.style.display = 'block'
        }
        
    }

    getDisplayValue(val){
        return val[this.referencedObjectDropdownAttribute.name] || val._id
    }
}