/// <reference path="../widget.ts" />


class BooleanWidget extends Widget<boolean>{
    slidertbn: HTMLElement;
    slider: HTMLElement;
    inputel: HTMLInputElement;
    template:string = `
        <div class="slider">
            <input class="sliderinput" type="checkbox"/>
            <div id="sliderbtn" class="sliderbtn slideroff"></div>
        </div>
    `

    constructor(element:HTMLElement){
        super(element)
        this.slider = createAndAppend(this.element,this.template)

        this.inputel = this.element.querySelector("input") as HTMLInputElement
        this.slidertbn = this.element.querySelector("#sliderbtn") as HTMLElement

        this.slider.addEventListener('click',(e) => {
            this.inputel.checked = !this.inputel.checked
            this.value.set(this.inputel.checked as any)
        })

        this.value.onchange.listen((val) => {
            this.inputel.checked = val
            if (this.inputel.checked) {
                this.slidertbn.classList.add('slideron')
                this.slidertbn.classList.remove('slideroff')
            } else {
                this.slidertbn.classList.add('slideroff')
                this.slidertbn.classList.remove('slideron')
            }
        })


        this.value.onClear.listen(() => {
            this.slidertbn.classList.add('slideroff')
            this.slidertbn.classList.remove('slideron')
        })
    }

    handleSetReadOnly(val: boolean) {
        this.inputel.readOnly = val;
    }
}