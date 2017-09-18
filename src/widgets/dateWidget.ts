/// <reference path="../widget.ts" />
declare var moment; 

class DateWidget extends Widget<string>{
    selected: Box<DateCell>;
    container: HTMLInputElement;
    calendar: HTMLElement;
    displayMoment: any;
    calendarbody: HTMLElement; 
    right: HTMLElement; 
    middle: HTMLElement; 
    left: HTMLElement; 
    headerrow: HTMLElement; 
    inputel: HTMLInputElement; 
    template: string = ` 
        <div style="display:flex;"> 
            <div id="container" style="position:relative; display:inline-block;">  
                <input class="form-control" id="input" type="text">  
 
                <div id="calendar" class="calendardropper"> 
                    <div id="calendar-navbar" style="display:flex;justify-content:space-between;"> 
                        <b id="left"   class="hovereffect rounded-corners">left</b> 
                        <b id="middle" class="hovereffect rounded-corners"></b> 
                        <b id="right"  class="hovereffect rounded-corners">right</b> 
                    </div> 
                    <table> 
                        <thead> 
                            <tr id="headerrow"></tr> 
                        </thead> 
                        <tbody id="calendarbody"> 
                             
                        </tbody> 
                    <table> 
                </div>  
            </div> 
        </div> 
    ` 

    constructor(element:HTMLElement){
        super(element)
        
        var templateDiv = string2html(this.template)
        this.element.appendChild(templateDiv) 
        this.container = templateDiv.querySelector('#container') as HTMLInputElement 
        this.inputel = templateDiv.querySelector('#input') as HTMLInputElement 
        this.headerrow = templateDiv.querySelector('#headerrow') as HTMLElement
        this.left = templateDiv.querySelector('#left') as HTMLElement
        this.middle = templateDiv.querySelector('#middle') as HTMLElement
        this.right = templateDiv.querySelector('#right') as HTMLElement
        this.calendar = templateDiv.querySelector('#calendar') as HTMLElement
        this.calendarbody = templateDiv.querySelector('#calendarbody') as HTMLElement
        this.selected = new Box<DateCell>(null)
        this.fillHeaderRow()

        this.selected.onchange.listen((val, old) => {
            val.dateCell.classList.add('selected-date')
            if(old){
                old.dateCell.classList.remove('selected-date')
            }
        })
        
        this.displayMoment = globalNow.clone();
        this.displayMonth(this.displayMoment.clone())
        
        this.value.onchange.listen((val) => {
            this.inputel.value = this.formatter(val as any)
        })

        this.left.addEventListener('click', () => {
            this.moveLeft()
        })

        this.right.addEventListener('click', () => {
            this.moveRight()
        })
    }

    fillHeaderRow(){
        var days = ['Zo','Ma','Di','Wo','Do','Vr','Za']
        for(var day of days){
            var cell = createTableCell(this.headerrow)
            cell.appendChild(string2html(`<b>${day}</b>`))
            cell.classList.add('dow')
        }
    }

    displayHours(moment){

    }

    displayMonth(momentToDisplay){
        this.calendarbody.innerHTML = ''
        var firstDayOfTheMonth = momentToDisplay.date(1) 
        var firstDayOfTheCalendar = firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(),'days') 
        this.middle.innerText = this.displayMoment.format('MMMM YYYY')
        
        var selectedMoment = moment(this.value.get())

        for(var row = 0; row < 6; row++){ 
            var rowelement = document.createElement('tr') 
            this.calendarbody.appendChild(rowelement) 
            for(var col = 0; col < 7; col++){
                let dateCell = new DateCell(createTableCell(rowelement) ,firstDayOfTheCalendar.clone(),(dateCell) => {
                    this.value.set(dateCell.moment.valueOf())
                    this.selected.set(dateCell)
                })
                if(firstDayOfTheCalendar.isSame(selectedMoment,'day')){
                    this.selected.set(dateCell)
                }
                firstDayOfTheCalendar.add(1,'days') 
            } 
        }

        this.inputel.addEventListener('focus', () => {
            this.calendar.style.display = 'block'
        })

        document.addEventListener('click', (e) => {
            if(!this.container.contains(e.target as any)){
                this.calendar.style.display = 'none'
            }
        })
    }

    displayYear(moment){

    }

    moveLeft(){
        this.displayMonth(this.displayMoment.subtract(1,'months').clone())
    }

    moveRight(){
        this.displayMonth(this.displayMoment.add(1,'months').clone())
    }

    formatter(val:number):string{ 
        return moment(val).format("DD/MM/YYYY - HH:mm:ss")
    }
    
    handleSetReadOnly(val: boolean) {
        
    }
}

class DateCell{
    dateCell: HTMLElement;
    callback: (dateCell: DateCell) => void;
    moment: any;
    parentElement: HTMLElement;
    template:string = `
        <div id="dateCell" class="dateCell hovereffect">
        </div>
    `


    constructor(element: HTMLElement, internalMoment, callback: (dateCell:DateCell) => void) {
        this.parentElement = element
        this.parentElement.appendChild(string2html(this.template))
        this.moment = internalMoment
        this.callback = callback
        this.dateCell = this.parentElement.querySelector('#dateCell') as HTMLElement
        this.dateCell.innerText = internalMoment.date()
        if(this.moment.isSame(moment(),'day')){
            this.dateCell.classList.add('today')
        }

        this.parentElement.addEventListener('click', () => {
            this.callback(this)
        })
    }
}