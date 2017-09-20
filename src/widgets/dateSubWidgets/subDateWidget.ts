/// <reference path="../../widget.ts" />


abstract class SubDateWidget extends Widget<number>{
    middleDisplay:string
    moveSize:string
    selected: Box<DateCell>;


    constructor(element:HTMLElement){
        super(element)
        this.selected = new Box<DateCell>(null)
    }

    abstract render(momentToDisplay: moment.Moment, selectedMoment: moment.Moment):SubDateWidget
}