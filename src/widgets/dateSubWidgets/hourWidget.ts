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
    middleDisplay = 'ddd'
    moveSize = 'day'

    constructor(element: HTMLElement) {
        super(element)
    }

    render(momentToDisplay: moment.Moment, selectedMoment: moment.Moment): SubDateWidget {
        return null;
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}