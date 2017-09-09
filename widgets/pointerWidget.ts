/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    attribute: Attribute;
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
        <span>
            <span id="container" style="position:relative; display:inline-block;"> 
                <input id="input" type="text"> 
                <div id="dropper" class="dropper"></div> 
            </span>
            <a id="link">-></a>
        </span>
` 

    constructor(element:HTMLElement, attribute:Attribute, infoer:(val) => string, displayer:(val) => string){
        super(element)
        var that = this
        this.attribute = attribute
        this.displayer = displayer

        this.element.appendChild(string2html(this.template))
        this.container = this.element.querySelector('#container') as HTMLElement
        this.link = this.element.querySelector('#link') as HTMLAnchorElement
        this.input = this.element.querySelector('#input') as HTMLInputElement
        this.dropper = this.element.querySelector('#dropper') as HTMLElement
        this.drops = []
        
        this.internalValue = new Box(0)
        this.selectedindex = new Box<number>(0)
        this.onselect = new EventSystem()

        this.internalValue.onchange.listen((val) => {
            that.input.value = this.displayer(val)
            this.value.set(val._id)
        })

        var displayHasBeenSet = false
        this.value.onchange.listen((val) => {
            //special case
            //set display for first time set
            if(!displayHasBeenSet){
                displayHasBeenSet = false
                getobject(attribute.pointerType,val,(data) => {
                    that.input.value = this.displayer(data)
                })
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
            if(e.keyCode == 87 || e.keyCode == 38){
                that.selectedindex.set(mod(that.selectedindex.get() - 1 ,that.optionslist.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 83 || e.keyCode == 40){
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
}