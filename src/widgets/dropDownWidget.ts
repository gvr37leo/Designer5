/// <reference path="../widget.ts" />
/// <reference path="../main.ts" />

class DropDownWidget<T> extends Widget<T>{
    displayer: (val: T) => string;
    dropper: HTMLElement;
    template: string = `
        <div id="container" style="position:relative; display:inline-block;"> 
            <input class="form-control group-left" id="input" type="text"> 
            <div id="dropper" class="dropper"></div> 
        </div>`
    optionlist:T[]

    constructor(element:HTMLElement,displayer:(val:T) => string,optionlist:T[]){
        super(element)
        this.optionlist = optionlist;
        this.displayer = displayer
        createAndAppend(this.element,this.template)

        this.dropper = this.element.querySelector('#dropper') as HTMLElement

        for (let option of this.optionlist) {
            var drop = string2html(`<div class="hovereffect">${this.displayer(option)}</div>`)
            drop.addEventListener('click', () => {
                this.value.set(option)
            })

            this.dropper.appendChild(drop)
        }
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}