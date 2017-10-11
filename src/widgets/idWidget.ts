/// <reference path="../widget.ts" />


//change this to pointertype and remove the delete button when readonly

class idWidget extends Widget<string>{
    attribute: IdentityAttribute;
    inspectLink: HTMLAnchorElement;
    inputel: HTMLInputElement;
    template:string = `
        <div style="display:flex; max-width:220px;">
            <input id="inputel" style="padding-right:0;" class="form-control group-left"/>
            <a id="inspectlink" class=" btn btn-info group-right">-></a>
        </div>
    `

    constructor(element: HTMLElement,attribute:IdentityAttribute) {
        super(element)
        var that  = this;
        this.attribute = attribute

        this.element.appendChild(string2html(this.template))
        this.inputel = this.element.querySelector('#inputel') as HTMLInputElement
        this.inspectLink = this.element.querySelector('#inspectlink') as HTMLAnchorElement

        this.inputel.addEventListener('input',(e) => {
            that.value.set(that.inputel.value)
        })

        this.value.onchange.listen((val) => {
            that.inputel.value = val
            this.inspectLink.href = `/#${this.attribute.pointerType}/${this.value.get()}`
        })
    }
    
    handleSetReadOnly(val: boolean) {
        var that = this
        that.inputel.readOnly = val;
    }
}