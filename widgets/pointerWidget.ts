/// <reference path="../widget.ts" />


class PointerWidget extends Widget<string>{
    constructor(element:HTMLElement, attribute:Attribute){
        super(element)
        
        var inputel = <HTMLInputElement>string2html('<input/>')
        this.element.appendChild(inputel)
        
        inputel.addEventListener('input',(e) => {
            this.value.set(inputel.value)
        })

        this.value.onchange.listen((val) => {
            inputel.value = val
        })
    }   
}