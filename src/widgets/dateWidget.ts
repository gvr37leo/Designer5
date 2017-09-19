/// <reference path="../widget.ts" />
/// <reference path="dateSubWidgets/dateCell.ts" />
/// <reference path="../moment.d.ts" />
/// <reference path="../main.ts" />


class DateWidget extends Widget<string>{
    subdatepicker: HTMLInputElement;
    selected: Box<DateCell>;
    container: HTMLInputElement;
    calendar: HTMLElement;
    displayMoment: any;
    // calendarbody: HTMLElement; 
    right: HTMLElement; 
    middle: HTMLElement; 
    left: HTMLElement; 
    // headerrow: HTMLElement; 
    inputel: HTMLInputElement; 
    template: string = ` 
        <div style="display:flex;"> 
            <div id="container" style="position:relative; display:inline-block; width:100%;">  
                <input class="form-control" id="input" type="text">  
 
                <div id="calendar" class="calendardropper"> 
                    <div id="calendar-navbar" style="display:flex;justify-content:space-between;"> 
                        <b id="left"   class="hovereffect rounded-corners">left</b> 
                        <b id="middle" class="hovereffect rounded-corners"></b> 
                        <b id="right"  class="hovereffect rounded-corners">right</b> 
                    </div> 
                    <div id="subdatepicker">

                    </div>
                </div>  
            </div> 
        </div> 
    `

    constructor(element:HTMLElement){
        super(element)

        var templateDiv = createAndAppend(this.element,this.template)

        this.container = templateDiv.querySelector('#container') as HTMLInputElement 
        this.inputel = templateDiv.querySelector('#input') as HTMLInputElement
        this.subdatepicker = templateDiv.querySelector('#subdatepicker') as HTMLInputElement
        this.left = templateDiv.querySelector('#left') as HTMLElement
        this.middle = templateDiv.querySelector('#middle') as HTMLElement
        this.right = templateDiv.querySelector('#right') as HTMLElement
        this.calendar = templateDiv.querySelector('#calendar') as HTMLElement
        this.selected = new Box<DateCell>(null)

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

        this.inputel.addEventListener('focus', () => {
            this.calendar.style.display = 'block'
        })

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target as any)) {
                this.calendar.style.display = 'none'
            }
        })
    }



    displayHours(moment){

    }

    displayMonth(momentToDisplay){
        this.calendarbody.innerHTML = ''
        this.middle.innerText = this.displayMoment.format('MMMM YYYY')


        
    }

    displayYear(momentToDisplay:moment.Moment){

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

