/// <reference path="main.ts" />


class Button{
    btnElement:HTMLButtonElement

    constructor(element:Element, html:string, classes:string, callback:() => void){
        this.btnElement = string2html(`<button class="${classes}">${html}</button>`) as HTMLButtonElement
        element.appendChild(this.btnElement)
        this.btnElement.addEventListener('click', callback)
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