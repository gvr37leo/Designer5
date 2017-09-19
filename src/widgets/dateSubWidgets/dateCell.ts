class DateCell {
    dateCell: HTMLElement;
    callback: (dateCell: DateCell) => void;
    moment: any;
    parentElement: HTMLElement;
    template: string = `
        <div id="dateCell" class="dateCell hovereffect">
        </div>
    `


    constructor(element: HTMLElement, internalMoment, callback: (dateCell: DateCell) => void) {
        this.parentElement = element
        this.parentElement.appendChild(string2html(this.template))
        this.moment = internalMoment
        this.callback = callback
        this.dateCell = this.parentElement.querySelector('#dateCell') as HTMLElement
        this.dateCell.innerText = internalMoment.date()
        if (this.moment.isSame(moment(), 'day')) {
            this.dateCell.classList.add('today')
        }

        this.parentElement.addEventListener('click', () => {
            this.callback(this)
        })
    }
}