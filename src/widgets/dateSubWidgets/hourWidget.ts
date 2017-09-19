/// <reference path="../../widget.ts" />


class HourWidget extends SubDateWidget{

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
    constructor(element: HTMLElement, momentToDisplay:moment.Moment, selectedMoment:moment.Moment) {
        super(element,momentToDisplay,selectedMoment)
    }

    render(): SubDateWidget {
        throw new Error("Method not implemented.");
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}