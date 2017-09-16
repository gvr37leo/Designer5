/// <reference path="../widget.ts" />
declare var moment; 

class DateWidget extends Widget<string>{
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
                        <b id="left">left</b> 
                        <b id="middle"></b> 
                        <b id="right">right</b> 
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
        
        this.element.appendChild(string2html(this.template)) 
        this.inputel = this.element.querySelector('#input') as HTMLInputElement 
        this.headerrow = this.element.querySelector('#headerrow') as HTMLElement
        this.left = this.element.querySelector('#left') as HTMLElement
        this.middle = this.element.querySelector('#middle') as HTMLElement
        this.right = this.element.querySelector('#right') as HTMLElement
        this.calendarbody = this.element.querySelector('#calendarbody') as HTMLElement
        this.displayMoment = moment()

        this.displayMonth(moment())
        
        this.value.onchange.listen((val) => {
            this.inputel.value = this.formatter(val)
        })

        this.left.addEventListener('click', () => {
            this.moveLeft()
        })

        this.right.addEventListener('click', () => {
            this.moveRight()
        })
    }

    displayHours(moment){

    }

    displayMonth(moment){
        this.calendarbody.innerHTML = ''
        var firstDayOfTheMonth = moment.date(1) 
        var firstDayOfTheCalendar = firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(),'days') 
        this.middle.innerText = this.displayMoment.format('MMMM YYYY')

        for(var row = 0; row < 6; row++){ 
            var rowelement = document.createElement('tr') 
            this.calendarbody.appendChild(rowelement) 
            for(var col = 0; col < 7; col++){
                var dateCell = new DateCell(createTableCell(rowelement) ,firstDayOfTheCalendar.clone(),(dateCell) => {
                    this.value.set(dateCell.moment.valueOf())
                })

                firstDayOfTheCalendar.add(1,'days') 
            } 
        }
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
        return moment(val).format("dddd, MMMM Do YYYY, h:mm:ss a")
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