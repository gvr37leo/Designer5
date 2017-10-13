/// <reference path="../widget.ts" />
/// <reference path="../utils.ts" />


class RangeWidget extends Widget<number>{
    inputel: HTMLInputElement;
    
    constructor(element:HTMLElement){
        super(element);
        
        this.inputel = createAndAppend(element,'<input type="range">') as HTMLInputElement
        this.inputel.min = '0'
        this.inputel.max = '1'
        this.inputel.step = '0.01'

        this.inputel.addEventListener('change',() => {
            this.value.set(this.inputel.valueAsNumber)
        })

        this.value.onchange.listen((val, old) => {
            this.inputel.valueAsNumber = val
        })
    }

    protected handleSetReadOnly(val: boolean) {
        
    }
}