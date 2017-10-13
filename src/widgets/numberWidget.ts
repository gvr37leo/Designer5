/// <reference path="../main.ts" />


function round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}

function numeral(string:any):Numeral{
    if(typeof string == 'number')return new Numeral(string)
    if(string == null)string = '0'
    string = string.replace(/[^0-9\.]+/,'')
    if(string == '')return new Numeral(0)
    return new Numeral(parseFloat(string))
}

class Numeral{
    val:number

    constructor(number:number){
        this.val = number
    }

    format(format:string):string{
        return round(this.val, 2).toString()
    }

    value():number{
        return this.val
    }
}

class NumberWidget extends Widget<number>{
    inputel: HTMLInputElement;

    mousePos
    mouseDownLoc
    mouseDown
    valueOnMouseDown
    stepSize
    tickSize
    decimals
    locale
    draggable
    type
    onchange
    formatter
    value:Box<number>
    stringProcessor

    constructor(element: HTMLElement, options){
        super(element)
        var that = this;
        //variables used for dragging(private)
        this.mousePos = {x:0,y:0}
        this.mouseDownLoc = null;
        this.mouseDown = false;
        this.valueOnMouseDown = 0
        
        //other variables (public)
        this.value = new Box(0)//internal value
        this.inputel = <HTMLInputElement>string2html('<input class="form-control" />')
        this.element = this.inputel
        element.appendChild(this.inputel)
        
        //defaults------------------------------
        this.stepSize = 5//pixels to drag per tick
        this.tickSize = 1//value added per tick
        this.decimals = 2
        this.locale = 'nl-nl'
        this.draggable = true
        this.type = 'decimal' //decimal integer money
        Object.assign(this,options)


        //keep internal value and displayed value in sync
        this.value.onchange.listen((value) => {
            that.inputel.value = this.formatter()
        })

        this.value.onClear.listen(() => {
            this.inputel.value = ''
        })

        //trigger onchange event for when user wants to know if the interal value has changed
        this.onchange = new EventSystem()
        this.value.onchange.listen((value) => {
            this.onchange.trigger(value)
        })

        this.formatter = () => {
            // return this.value.get();
            return numeral(this.value.get()).format('')
        }

        var stringprocessors = [
            (string) => {//decimal
                return round(numeral(string).value(), this.decimals)
            },
            (string) => {//integer
                return Math.floor(numeral(string).value())
            },
            (string) => {//money
                return round(numeral(string).value(), this.decimals)
            },
        ]

        switch(this.type){
            case 'integer':
                this.stringProcessor = stringprocessors[1]
                break;
            case 'money':
                this.stringProcessor = stringprocessors[2]
                break;
            default://decimal
                this.stringProcessor = stringprocessors[0]
        }

        //eventlisteners------------------------------------------------------------------
        this.element.addEventListener('keydown',(e) => {
            switch (e.keyCode) {
                case 13://enter
                that.inputel.value = this.formatter()
                    break;
                case 38://up
                    this.value.set(this.value.get() + 1)
                    break;
                case 40://down
                    this.value.set(this.value.get() - 1)
                    break;
            }
        })

        this.element.addEventListener('input', (e) => {
            this.value.set(this.stringProcessor(that.inputel.value))
        })

        if(this.draggable){
            this.element.addEventListener('mousedown', (e) => {
                this.mouseDown = true;
                this.mouseDownLoc = {x:e.clientX,y:e.clientY},
                this.valueOnMouseDown = this.value.get()
            })

            document.addEventListener('mouseup', (e) => {
                this.mouseDown = false;
            })

            document.addEventListener('mousemove', (e) => {
                this.mousePos.x = e.clientX
                this.mousePos.y = e.clientY

                if(this.mouseDown){
                    this.value.set(this.valueOnMouseDown + Math.round((this.mousePos.x - this.mouseDownLoc.x) / this.stepSize) * this.tickSize)
                }
            })
        }

        this.element.addEventListener('blur', (e) => {
            that.inputel.value = this.formatter()
        })
    }
    
    handleSetReadOnly(val: boolean) {
        
    }
}