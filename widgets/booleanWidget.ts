/// <reference path="../widget.ts" />


class BooleanWidget extends Widget<boolean>{
    constructor(element:HTMLElement){
        super(element)
        
        var inputel = <HTMLInputElement>string2html('<input type="checkbox"/>')
        this.element.appendChild(inputel)
        
        inputel.addEventListener('change',(e) => {
            this.value.set(inputel.checked as any)
        })

        this.value.onchange.listen((val) => {
            inputel.checked = val
        })
    }   
}