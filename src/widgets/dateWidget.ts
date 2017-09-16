/// <reference path="../widget.ts" />
declare var moment; 

class DateWidget extends Widget<string>{
    calendarbody: Element; 
    right: Element; 
    middle: Element; 
    left: Element; 
    headerrow: Element; 
    inputel: HTMLInputElement; 
    template: string = ` 
        <div style="display:flex;"> 
            <div id="container" style="position:relative; display:inline-block;">  
                <input class="form-control" id="input" type="text">  
 
                <div id="calendar" class="calendardropper"> 
                    <div id="calendar-navbar" style="display:flex;justify-content:space-between;"> 
                        <div id="left">left</div> 
                        <div id="middle">middle</div> 
                        <div id="right">right</div> 
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
        this.headerrow = this.element.querySelector('#headerrow') 
        this.left = this.element.querySelector('#left') 
        this.middle = this.element.querySelector('#middle') 
        this.right = this.element.querySelector('#right') 
        this.calendarbody = this.element.querySelector('#calendarbody') 
 
        var currentday = moment() 
        var firstDayOfTheMonth = moment().date(1) 
        var firstDayOfTheCalendar = firstDayOfTheMonth.subtract(firstDayOfTheMonth.day(),'days') 
         
        for(var row = 0; row < 6; row++){ 
            var rowelement = document.createElement('tr') 
            this.calendarbody.appendChild(rowelement) 
            for(var col = 0; col < 7; col++){ 
                var cell = createTableCell(rowelement) 
                cell.innerText = firstDayOfTheCalendar.date() 
                firstDayOfTheCalendar.add(1,'days') 
            } 
        } 
        
        this.inputel.addEventListener('input',(e) => {
            this.value.set(this.inputel.value)
        })

        this.value.onchange.listen((val) => {
            this.inputel.value = val
        })
    }

    displayer(){ 
        
   } 
    
    handleSetReadOnly(val: boolean) {
        
    }
}