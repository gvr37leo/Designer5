/// <reference path="../widget.ts" />
/// <reference path="dateSubWidgets/dateCell.ts" />
/// <reference path="dateSubWidgets/dayWidget.ts" />
/// <reference path="dateSubWidgets/hourWidget.ts" />
/// <reference path="dateSubWidgets/monthWidget.ts" />
/// <reference path="dateSubWidgets/yearWidget.ts" />

/// <reference path="../moment.d.ts" />
/// <reference path="../main.ts" />


class DateWidget extends Widget<number>{
    displayLevel: DisplayLevel;
    subdatepicker: HTMLInputElement;
    container: HTMLInputElement;
    calendar: HTMLElement;
    displayMoment: any;
    right: HTMLElement; 
    middle: HTMLElement; 
    left: HTMLElement; 
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
        this.calendar = templateDiv.querySelector('#calendar') as HTMLElement
        this.left = templateDiv.querySelector('#left') as HTMLElement
        this.middle = templateDiv.querySelector('#middle') as HTMLElement
        this.right = templateDiv.querySelector('#right') as HTMLElement
        this.subdatepicker = templateDiv.querySelector('#subdatepicker') as HTMLInputElement
        
        
        var selectedMoment = moment(this.value.get())
        this.displayMoment = globalNow.clone();
        this.displayLevel = DisplayLevel.chain([
            new HourWidget(this.subdatepicker,this.displayMoment,selectedMoment),
            new DayWidget(this.subdatepicker,this.displayMoment,selectedMoment),
            new YearWidget(this.subdatepicker,this.displayMoment,selectedMoment)]
        )[1]
        this.displayMonth(this.displayMoment.clone())
        



        this.value.onchange.listen((val) => {
            this.inputel.value = this.formatter(val as any)
        })

        this.middle.addEventListener('click', () => {
            this.displayLevel = this.displayLevel.up
            this.displayLevel.val.render()
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

    displayHours(momentToDisplay:moment.Moment){
        this.middle.innerText = this.displayMoment.format('ddd')
        var widget = new HourWidget(this.subdatepicker,momentToDisplay.clone())
        widget.value.onchange.listen((val,old) => {
            this.value.set(val)
        })
    }

    displayMonth(momentToDisplay:moment.Moment){
        this.middle.innerText = this.displayMoment.format('MMMM YYYY')
        var widget = new DayWidget(this.subdatepicker,momentToDisplay.clone(),null)
        widget.value.onchange.listen((val,old) => {
            this.value.set(val)
        })
    }

    displayYear(momentToDisplay:moment.Moment){
        this.middle.innerText = this.displayMoment.format('YYYY')
        var widget = new YearWidget(this.subdatepicker,momentToDisplay.clone())
        widget.value.onchange.listen((val,old) => {
            this.value.set(val)
        })
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

class DisplayLevel{
    val:SubDateWidget
    up:DisplayLevel
    down:DisplayLevel

    constructor(val:SubDateWidget){
        this.val = val;
    }

    static chain(levels:SubDateWidget[]):DisplayLevel[]{
        var displayLevels:DisplayLevel[] = []
        for(var level of levels){
            displayLevels.push(new DisplayLevel(level))
        }

        displayLevels[0].down = displayLevels[0]
        displayLevels[0].up = displayLevels[1]
        for(var i = 1; i < displayLevels.length - 1; i++){
            displayLevels[i].down = displayLevels[i - 1]
            displayLevels[i].up = displayLevels[i + 1]
        }
        displayLevels[displayLevels.length - 1].down = displayLevels[displayLevels.length - 1]
        displayLevels[displayLevels.length - 1].up = displayLevels[displayLevels.length - 2]
        return displayLevels;
    }
}

