/// <reference path="../widget.ts" />


class BooleanWidget extends Widget<boolean>{
    inputel: HTMLInputElement;


    constructor(element:HTMLElement){
        super(element)
        
        this.inputel = string2html('<input type="checkbox"/>') as HTMLInputElement
        this.element.appendChild(this.inputel)
        
        this.inputel.addEventListener('change',(e) => {
            this.value.set(this.inputel.checked as any)
        })

        this.value.onchange.listen((val) => {
            this.inputel.checked = val
        })
    }

    handleSetReadOnly(val: boolean) {
        this.inputel.readOnly = val;
    }
}