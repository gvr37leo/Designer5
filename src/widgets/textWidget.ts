/// <reference path="../widget.ts" />


class TextWidget extends Widget<string>{
    inputel: HTMLInputElement;

    constructor(element: HTMLElement) {
        super(element)
        var that  = this;
        this.inputel = string2html('<input class="form-control"/>') as HTMLInputElement
        this.element.appendChild(this.inputel)
        
        this.inputel.addEventListener('input',(e) => {
            that.value.set(that.inputel.value)
        })

        this.value.onchange.listen((val) => {
            that.inputel.value = val
        })
    }
    
    handleSetReadOnly(val: boolean) {
        var that = this
        that.inputel.readOnly = val;
    }
}