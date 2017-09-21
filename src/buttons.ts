/// <reference path="main.ts" />


class Button{
    btnElement:HTMLButtonElement
    callback:() => void

    constructor(element:Element, html:string, classes:string, callback:() => void){
        this.callback = callback
        this.btnElement = string2html(`<button class="${classes}">${html}</button>`) as HTMLButtonElement
        element.appendChild(this.btnElement)
        this.btnElement.addEventListener('click', () => {
            this.callback()
        })
    }
}

class SaveButton extends Button{
    constructor(element:HTMLElement,event:EventSystem<any>, callback:() => void){
        super(element,'save','btn btn-success',()=>{
            this.btnElement.disabled = true;//onclick
            callback()
        })

        this.btnElement.disabled = true;//initial

        event.listen((val) => {
            this.btnElement.disabled = false;
        })
    }
}

class CustomButton<T>{
    name: string;
    callback: (appDef: T) => void;

    constructor(name: string, callback: (appDef: T) => void) {
        this.name = name
        this.callback = callback
    }
}