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

    constructor(element: HTMLElement, momentToDisplay:moment.Moment, selectedMoment:moment.Moment){
        super(element,momentToDisplay,selectedMoment)
    }

    render(): SubDateWidget {
        throw new Error("Method not implemented.");
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}