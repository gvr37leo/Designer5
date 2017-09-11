/// <reference path="../main.ts" />


class EnumWidget extends Widget<string>{
    attribute: enumAttribute;
    selectedindex: Box<number>
    value:Box<any>
    onselect:EventSystem<any>
    container:HTMLElement
    input:HTMLInputElement
    dropper:HTMLElement
    drops:Element[]
    template:string = `
        <div>
            <div id="container" style="position:relative; display:inline-block;"> 
                <input id="input" class="form-control" type="text"> 
                <div id="dropper" class="dropper"></div> 
            </div>
        </div>` 

    constructor(element:HTMLElement, attribute:enumAttribute){
        super(element)
        var that = this
        this.attribute = attribute

        this.element.appendChild(string2html(this.template))
        this.container = this.element.querySelector('#container') as HTMLElement
        this.input = this.element.querySelector('#input') as HTMLInputElement
        this.dropper = this.element.querySelector('#dropper') as HTMLElement
        this.drops = []
        
        this.selectedindex = new Box<number>(0)
        this.onselect = new EventSystem()


        this.value.onchange.listen((val) => {
            that.input.value = val
        })

        this.onselect.listen(() =>{
            that.dropper.style.display = 'none'
        })

        this.selectedindex.onchange.listen((val, old) => {//for keydowns
            that.drops[val].classList.add('selected')
            that.drops[old].classList.remove('selected')
            that.value.set(that.attribute.enumtypes[val])
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
                that.selectedindex.set(mod(that.selectedindex.get() - 1 ,that.attribute.enumtypes.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 40){
                that.selectedindex.set(mod(that.selectedindex.get() + 1 ,that.attribute.enumtypes.length))
                that.dropper.style.display = 'block'
            }

            if(e.keyCode == 13 || e.keyCode == 27){
                that.dropper.style.display = 'none'
            }
        })

        this.render(this.attribute.enumtypes)
    }

    render(optionlist){
        var that = this;
        for(let option of optionlist){
            var drop = string2html(`<div class="drop">${option}</div>`)
            drop.addEventListener('click',() => {
                this.value.set(option)
                this.onselect.trigger(option._id,0)
            })
            this.drops.push(drop)
            this.dropper.appendChild(drop)
        }
    }

    handleSetReadOnly(val: boolean) {
        
    }
}