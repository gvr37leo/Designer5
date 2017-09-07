/// <reference path="../widget.ts" />


// class PointerWidget extends Widget<string>{
//     constructor(element:HTMLElement, attribute:Attribute){
//         super(element)
        
//         var inputel = <HTMLInputElement>string2html('<input/>')
//         this.element.appendChild(inputel)
//         var link = string2html(`<a>-></a>`) as HTMLAnchorElement
//         this.element.appendChild(link)
        
//         inputel.addEventListener('input',(e) => {
//             this.value.set(inputel.value)
//         })

//         this.value.onchange.listen((val) => {
//             inputel.value = val
//             link.href = `/#${attribute.pointerType}/${val}`;
//         })
//     }   
// }

class PointerWidget extends Widget<string>{
    selected:Box<number>
    value:Box<any>
    onselect:EventSystem<any>
    input:HTMLInputElement
    dropper:HTMLElement
    drops:Element[]



    constructor(element:HTMLElement, attribute:Attribute, options){
        super(element)
        this.selected = new Box(0)
        this.onselect = new EventSystem()
        this.element = element
        var link = string2html(`<a>-></a>`) as HTMLAnchorElement

        this.input = document.querySelector('#input') as HTMLInputElement
        this.dropper = document.querySelector('#dropper') as HTMLElement
        this.drops = []

        

        this.onselect.listen(() =>{
            this.dropper.style.display = 'none'
        })

        this.selected.onchange.listen((val, old) => {
            this.value.set(options[val])

            this.drops[val].classList.add('selected')
            this.drops[old].classList.remove('selected')
        })

        this.value.onchange.listen((val) => {
            this.input.value = val;
        })

        this.input.addEventListener('focus', () => {
            this.dropper.style.display = 'block'
        })

        this.input.addEventListener('keydown', (e) => {
            e.preventDefault()
            if(e.keyCode == 87 || e.keyCode == 38){
                this.selected.set(mod(this.selected.get() - 1 ,options.length))
                this.dropper.style.display = 'block'
            }

            if(e.keyCode == 83 || e.keyCode == 40){
                this.selected.set(mod(this.selected.get() + 1 ,options.length))
                this.dropper.style.display = 'block'
            }

            if(e.keyCode == 13 || e.keyCode == 27){
                this.dropper.style.display = 'none'
            }
        })

        this.render(options)
    }

    render(options){
        for(let option of options){
            var drop = string2html(`<div class="drop">${option}</div>`)
            drop.addEventListener('click',() => {
                this.value.set(option)
                this.onselect.trigger(option,0)
            })
            this.drops.push(drop)

            this.dropper.appendChild(drop)
        }
    }
}