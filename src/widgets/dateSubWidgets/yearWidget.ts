/// <reference path="../../widget.ts" />


class YearWidget extends SubDateWidget{
    template: string = `
        <table> 
            <thead> 
                <tr id="headerrow"></tr> 
            </thead> 
            <tbody id="calendarbody"> 
                    
            </tbody> 
        <table> 
    `
    middleDisplay = 'YYYY'
    moveSize = 'year'

    constructor(element: HTMLElement){
        super(element)
    }

    render(momentToDisplay: moment.Moment, selectedMoment: moment.Moment): SubDateWidget {
        return null;
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}