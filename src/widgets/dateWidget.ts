/// <reference path="../widget.ts" />
/// <reference path="dateSubWidgets/dateCell.ts" />
/// <reference path="dateSubWidgets/dayWidget.ts" />
/// <reference path="dateSubWidgets/hourWidget.ts" />
/// <reference path="dateSubWidgets/monthWidget.ts" />
/// <reference path="dateSubWidgets/yearWidget.ts" />

/// <reference path="../moment.d.ts" />
/// <reference path="../main.ts" />


class DateWidget extends Widget<number>{
    attribute: dateAttribute;
    selectedMoment: moment.Moment;
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

    constructor(element:HTMLElement,attribute:dateAttribute){
        super(element)
        this.attribute = attribute
        var that = this
        var templateDiv = createAndAppend(this.element,this.template)
        this.container = templateDiv.querySelector('#container') as HTMLInputElement 
        this.inputel = templateDiv.querySelector('#input') as HTMLInputElement
        this.calendar = templateDiv.querySelector('#calendar') as HTMLElement
        this.left = templateDiv.querySelector('#left') as HTMLElement
        this.middle = templateDiv.querySelector('#middle') as HTMLElement
        this.right = templateDiv.querySelector('#right') as HTMLElement
        this.subdatepicker = templateDiv.querySelector('#subdatepicker') as HTMLInputElement
        // this.inputel.readOnly = this.attribute.readonly
        
        this.selectedMoment = moment(this.value.get())
        this.displayMoment = globalNow.clone();


        var subDateWidgets = [
            new HourWidget(this.subdatepicker),
            new DayWidget(this.subdatepicker),
            new YearWidget(this.subdatepicker)
        ]
        this.displayLevel = DisplayLevel.chain(subDateWidgets)[1]
        for (var subDateWidget of subDateWidgets){
            subDateWidget.value.onchange.listen((val, old) => {
                that.value.set(val)
            })
        }

        this.display(this.displayMoment)
        



        this.value.onchange.listen((val) => {
            that.inputel.value = that.formatter(val as any)
            this.selectedMoment = moment(val)
        })

        this.value.onClear.listen(() => {
            this.inputel.value = ''
        })

        this.middle.addEventListener('click', () => {
            that.displayLevel = that.displayLevel.up
            this.display(this.displayMoment)
        })

        this.left.addEventListener('click', () => {
            that.moveLeft()
        })

        this.right.addEventListener('click', () => {
            that.moveRight()
        })

        this.inputel.addEventListener('focus', () => {
            if(!this.readonly.value){
                that.calendar.style.display = 'block'
            }
        })

        document.addEventListener('click', (e) => {
            if (!that.container.contains(e.target as any)) {
                that.calendar.style.display = 'none'
            }
        })
    }

    display(momentToDisplay: moment.Moment){
        this.subdatepicker.innerHTML = ''
        this.middle.innerText = this.displayMoment.format(this.displayLevel.val.middleDisplay)
        this.displayLevel.val.render(this.displayMoment.clone(),this.selectedMoment)
    }

    moveLeft(){
        this.display(this.displayMoment.subtract(1, this.displayLevel.val.moveSize).clone())
    }

    moveRight(){
        this.display(this.displayMoment.add(1,this.displayLevel.val.moveSize).clone())
    }

    formatter(val:number):string{
        return moment(val).format("DD/MM/YYYY - HH:mm:ss")
    }
    
    handleSetReadOnly(val: boolean) {
        this.inputel.readOnly = val
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
        displayLevels[displayLevels.length - 1].down = displayLevels[displayLevels.length - 2]
        displayLevels[displayLevels.length - 1].up = displayLevels[displayLevels.length - 1]

        return displayLevels;
    }
}

