/// <reference path="../widget.ts" />
/// <reference path="../main.ts" />

class DropDownWidget<T> extends Widget<T>{
    container: HTMLElement;
    input: HTMLInputElement;
    displayer: (val: T) => string;
    dropper: HTMLElement;
    template: string = `
        <div id="container" style="position:relative; display:inline-block;"> 
            <input class="form-control" id="input" type="text"> 
            <div id="dropper" class="dropper"></div> 
        </div>`;
    dropTemplate:string = `
        <div class="drop hovereffect"></div>
    `
    optionlist:T[]

    constructor(element:HTMLElement,displayer:(val:T) => string,optionlist:T[]){
        super(element)
        var that = this;
        createAndAppend(this.element, this.template)
        this.container = this.element.querySelector('#container') as HTMLElement
        this.input = this.element.querySelector('#input') as HTMLInputElement
        this.dropper = this.element.querySelector('#dropper') as HTMLElement

        this.value.onchange.listen((val, old) => {
            that.input.value = that.displayer(val)
            that.dropper.style.display = 'none'
        })

        this.optionlist = optionlist;
        this.displayer = displayer
        


        for (let option of this.optionlist) {
            var drop = createAndAppend(this.dropper,this.dropTemplate)
            drop.innerHTML = this.displayer(option)

            drop.addEventListener('click', () => {
                that.value.set(option)
            })
        }

        this.input.addEventListener('focus', () => {
            that.dropper.style.display = 'block'
        })

        document.addEventListener('click', (e) => {
            if (!that.container.contains(e.target as any)) {
                that.dropper.style.display = 'none'
            }
        })
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}