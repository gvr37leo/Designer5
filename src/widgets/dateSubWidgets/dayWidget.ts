/// <reference path="../../widget.ts" />
/// <reference path="dateCell.ts" />
/// <reference path="../../main.ts" />
/// <reference path="subDateWidget.ts" />


class DayWidget extends SubDateWidget{


    template: string = `
        <table> 
            <thead> 
                <tr id="headerrow"></tr> 
            </thead> 
            <tbody id="calendarbody"> 
                    
            </tbody> 
        <table> 
    `
    headerrow: HTMLElement;
    calendarbody: HTMLElement;
    middleDisplay = 'MMMM YYYY'
    moveSize = 'month'

    constructor(element: HTMLElement) {
        super(element)
        
        this.selected.onchange.listen((val, old) => {
            val.dateCell.classList.add('selected-date')
            if(old){
                old.dateCell.classList.remove('selected-date')
            }
        })
    }

    render(momentToDisplay: moment.Moment, selectedMoment: moment.Moment): SubDateWidget {
        createAndAppend(this.element, this.template)
        this.headerrow = this.element.querySelector('#headerrow') as HTMLElement
        this.calendarbody = this.element.querySelector('#calendarbody') as HTMLElement

        this.fillHeaderRow()
        this.fillBody(momentToDisplay, selectedMoment)
        return this
    }

    fillHeaderRow() {
        var days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
        for (var day of days) {
            var cell = createTableCell(this.headerrow)
            cell.appendChild(string2html(`<b>${day}</b>`))
            cell.classList.add('dow')
        }
    }

    fillBody(momentToDisplay: moment.Moment, selectedMoment: moment.Moment){
        var firstDayOfTheMonth = momentToDisplay.date(1)
        var firstDayOfTheCalendar = firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(), 'days')

        for (var row = 0; row < 6; row++) {
            var rowelement = document.createElement('tr')
            this.calendarbody.appendChild(rowelement)
            for (var col = 0; col < 7; col++) {
                let dateCell = new DateCell(createTableCell(rowelement), firstDayOfTheCalendar.clone(), (dateCell) => {
                    this.value.set(dateCell.moment.valueOf())
                    this.selected.set(dateCell)
                })
                if (firstDayOfTheCalendar.isSame(selectedMoment, 'day')) {
                    this.selected.set(dateCell)
                }
                firstDayOfTheCalendar.add(1, 'days')
            }
        }
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}

