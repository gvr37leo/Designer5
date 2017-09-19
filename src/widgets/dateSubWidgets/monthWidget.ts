/// <reference path="../../widget.ts" />


class MonthWidget extends Widget<any>{

    constructor(element: HTMLElement) {
        super(element)
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}