/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    selected:Box<number>
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
        <span  style="position:relative">
            <div id="container">
                <input id="input" type="text">
                <div id="dropper" class="dropper"></div>
            </div>
            <a id="link">-></a>
        </span>
    `

    constructor(element:HTMLElement, attribute:Attribute, displayer:(val) => string){
        super(element)
        var that = this
        that.displayer = displayer
        that.selected = new Box(0)
        that.onselect = new EventSystem()
        that.element = element
        that.data = []
        this.element.appendChild(string2html(this.template))
        this.container = this.element.querySelector('#container') as HTMLElement
        that.link = this.element.querySelector('#link') as HTMLAnchorElement
        that.input = this.element.querySelector('#input') as HTMLInputElement
        that.dropper = this.element.querySelector('#dropper') as HTMLElement
        that.drops = []

        that.onselect.listen(() =>{
            that.dropper.style.display = 'none'
        })

        that.selected.onchange.listen((val, old) => {
            that.value.set(that.data[val])

            that.drops[val].classList.add('selected')
            that.drops[old].classList.remove('selected')
        })


        that.value.onchange.listen((val) => {
            that.input.value = val;
            this.link.href = `/#${attribute.pointerType}/${val}`
        })

        that.input.addEventListener('focus', () => {
            that.dropper.style.display = 'block'
        })

        document.addEventListener('click', (e) => {
            if(!this.container.contains(e.target as any)){
                that.dropper.style.display = 'none'
            }
        })

        that.input.addEventListener('keydown', (e) => {
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
                this.value.set(option._id)
                this.onselect.trigger(option._id,0)
            })
            this.drops.push(drop)

            this.dropper.appendChild(drop)
        }
    }
}