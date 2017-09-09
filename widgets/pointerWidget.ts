/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    attribute: Attribute;
    displayValue: Box<number>;
    selected: Box<number>
    value:Box<any>
    onselect:EventSystem<any>
    container:HTMLElement
    input:HTMLInputElement
    dropper:HTMLElement
    link:HTMLAnchorElement
    drops:Element[]
    displayer:(val) => string
    data
    template:string = `
        <span>
            <span id="container" style="position:relative; display:inline-block;"> 
                <input id="input" type="text"> 
                <div id="dropper" class="dropper"></div> 
            </span>
            <a id="link">-></a>
        </span>
` 

    constructor(element:HTMLElement, attribute:Attribute, displayer:(val) => string){
        //werkt nog niet helemaal
        //moet een waarde hebben voor value die wordt bijgehouden maar niet gebruikt

        super(element)
        var that = this
        this.displayValue = new Box(0)

        this.attribute = attribute
        this.displayer = displayer
        this.selected = new Box(0)
        this.onselect = new EventSystem()
        this.element = element
        this.data = []
        this.element.appendChild(string2html(this.template))
        this.container = this.element.querySelector('#container') as HTMLElement
        this.link = this.element.querySelector('#link') as HTMLAnchorElement
        this.input = this.element.querySelector('#input') as HTMLInputElement
        this.dropper = this.element.querySelector('#dropper') as HTMLElement
        this.drops = []

        this.displayValue.onchange.listen((val) => {
            that.input.value = this.displayer(val)
        })

        this.value.onchange.listen((val) => {
            //now is setup that only triggering from outside call this function:bad
            //should probably give options in constructor instead of getting them in this widget
            //is also desing wise better
            getobject(attribute.pointerType,val,(data) => {
                that.displayValue.set(data)
            })
            that.link.href = `/#${attribute.pointerType}/${val}`
        })

        this.onselect.listen(() =>{
            that.dropper.style.display = 'none'
        })

        this.selected.onchange.listen((val, old) => {
            that.value.set(that.data[val])

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
                that.selected.set(mod(that.selected.get() - 1 ,that.data.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 83 || e.keyCode == 40){
                that.selected.set(mod(that.selected.get() + 1 ,that.data.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 13 || e.keyCode == 27){
                that.dropper.style.display = 'none'
            }
        })

        getlist(attribute.pointerType, (res) => {
            that.render(res)
        })
    }

    render(options){
        var that = this;
        for(let option of options){
            var drop = string2html(`<div class="drop">${that.displayer(option)}</div>`)
            drop.addEventListener('click',() => {
                that.link.href = `/#${this.attribute.pointerType}/${option._id}`
                this.value.set(option._id, true)
                this.displayValue.set(option)
                this.onselect.trigger(option._id,0)
            })
            this.drops.push(drop)

            this.dropper.appendChild(drop)
        }
    }
}