/// <reference path="../widget.ts" />

class PointerWidget extends Widget<string>{
    selected:Box<number>
    value:Box<any>
    onselect:EventSystem<any>
    input:HTMLInputElement
    dropper:HTMLElement
    drops:Element[]
    displayer:(val) => string
    data


    constructor(element:HTMLElement, attribute:Attribute, displayer:(val) => string){
        super(element)
        var that = this
        that.displayer = displayer
        that.selected = new Box(0)
        that.onselect = new EventSystem()
        that.element = element
        that.data = []
        var link = string2html(`<a>-></a>`) as HTMLAnchorElement

        var container = string2html('<span id="test" style="position:relative"></span>')

        that.input = string2html('<input id="input" type="text">') as HTMLInputElement;
        that.dropper = string2html('<div id="dropper" class="dropper"></div>') as HTMLElement
        container.appendChild(that.input)
        container.appendChild(that.dropper)
        that.element.appendChild(container)
        that.element.appendChild(link)

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
            link.href = `/#${attribute.pointerType}/${val}`
        })

        that.input.addEventListener('focus', () => {
            that.dropper.style.display = 'block'
        })

        document.addEventListener('click', (e) => {
            if(!container.contains(e.target as any)){
                that.dropper.style.display = 'none'
            }
        })

        that.input.addEventListener('keydown', (e) => {
            e.preventDefault()
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