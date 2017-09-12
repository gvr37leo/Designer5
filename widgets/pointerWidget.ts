/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
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
    displayer:(val) => string
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

    constructor(element:HTMLElement, attribute:pointerAttribute, infoer:(val) => string, displayer:(val) => string){
        super(element)
        var that = this
        this.attribute = attribute
        this.displayer = displayer

        this.element.appendChild(string2html(this.template))
        this.container = this.element.querySelector('#container') as HTMLElement
        this.link = this.element.querySelector('#link') as HTMLAnchorElement
        this.input = this.element.querySelector('#input') as HTMLInputElement
        this.dropper = this.element.querySelector('#dropper') as HTMLElement
        this.delbuttoncontainer = this.element.querySelector('#delbuttoncontainer') as HTMLElement
        this.drops = []
        
        this.value.value = 0;
        this.internalValue = new Box(0)
        this.selectedindex = new Box<number>(0)
        this.onselect = new EventSystem()

        new Button(this.delbuttoncontainer,'X','btn btn-danger group-middle',() => {
            this.internalValue.set(null)
        })

        this.internalValue.onchange.listen((val) => {
            displayHasBeenSet = true
            if(val == null){
                that.input.value = 'nullptr'
                this.value.set(null)
            }else{
                that.input.value = this.displayer(val)
                this.value.set(val._id)
            }
        })

        var displayHasBeenSet = false
        this.value.onchange.listen((val) => {//handle the case where val = undefined or null
            //special case
            //set display for first time set
            if(!displayHasBeenSet){
                displayHasBeenSet = true

                if(val == null){
                    that.input.value = 'nullptr'
                }else{
                    getobject(attribute.pointerType,val,(data) => {
                        if(data == null){
                            that.input.value = 'null'
                        }else{
                            that.input.value = this.displayer(data)
                        }
                        
                    },(error) => {
                        
                    })
                }
            }
            that.link.href = `/#${attribute.pointerType}/${val}`
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


        getlist(attribute.pointerType, (res) => {
            this.optionslist = res
            that.render(res)
        },(error) => {
            
        })
    }

    render(optionlist){
        var that = this;
        for(let option of optionlist){
            var drop = string2html(`<div class="drop">${that.displayer(option)}</div>`)
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
}