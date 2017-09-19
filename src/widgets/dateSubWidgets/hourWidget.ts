/// <reference path="../../widget.ts" />


class HourhWidget extends Widget<any>{
    template: string = `
        <div style="display:flex;">
            <div style="display:flex; flex-direction:column; justify-content:space-around;">
                <div>^</div>
                <div>12</div>
                <div>v</div>
            </div>
            <div style="display:flex; flex-direction:column; justify-content:space-around;">
                <div>:</div>
            </div>
            <div style="display:flex; flex-direction:column; justify-content:space-around;">
                <div>^</div>
                <div>12</div>
                <div>v</div>
            </div>
        </div>
    `
    constructor(element: HTMLElement) {
        super(element)
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}