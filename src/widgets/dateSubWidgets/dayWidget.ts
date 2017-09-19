/// <reference path="../../widget.ts" />
/// <reference path="dateCell.ts" />
/// <reference path="../../main.ts" />

class DayhWidget extends Widget<any>{
    template: string = `
        <table> 
            <thead> 
                <tr id="headerrow"></tr> 
            </thead> 
            <tbody id="calendarbody"> 
                    
            </tbody> 
        <table> 
    `
    constructor(element: HTMLElement, momentToDisplay:moment.Moment) {
        super(element)
        this.fillHeaderRow()

        var firstDayOfTheMonth = momentToDisplay.date(1)
        var firstDayOfTheCalendar = firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(), 'days')

        var selectedMoment = moment(this.value.get())

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

    fillHeaderRow() {
        var days = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
        for (var day of days) {
            var cell = createTableCell(this.headerrow)
            cell.appendChild(string2html(`<b>${day}</b>`))
            cell.classList.add('dow')
        }
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}

