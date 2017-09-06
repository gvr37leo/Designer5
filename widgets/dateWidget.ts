/// <reference path="../widget.ts" />


class DateWidget extends Widget<string>{
    constructor(element:HTMLElement){
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