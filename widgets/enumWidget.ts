/// <reference path="../main.ts" />


class EnumWidget extends Widget<string>{
    inputel: HTMLInputElement;

    constructor(element: HTMLElement, attribute:Attribute) {
        super(element)
        var that  = this;
        this.inputel = string2html('<input/>') as HTMLInputElement
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