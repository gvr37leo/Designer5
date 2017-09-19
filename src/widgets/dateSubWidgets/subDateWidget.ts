/// <reference path="../../widget.ts" />


abstract class SubDateWidget extends Widget<number>{
    momentToDisplay:moment.Moment
    selectedMoment:moment.Moment

    constructor(element:HTMLElement, momentToDisplay:moment.Moment, selectedMoment:moment.Moment){
        super(element)
        this.momentToDisplay = momentToDisplay
        this.selectedMoment = selectedMoment
    }

    abstract render():SubDateWidget
}