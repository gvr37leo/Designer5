/// <reference path="utils.ts" />


class Modal{
    contentcontainer: HTMLElement;
    backdrop: HTMLElement;
    element: HTMLElement;
    template:string = `
        <div id="backdrop" style="
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,0.5);
            display: none;
        ">
            <div id="contentcontainer" style="
                overflow-y: auto;
                padding:10px;
                background-color: white;
                position: absolute;
                top: 100px;
                bottom: 100px;
                left: 100px;
                right: 100px;
                border-radius: 5px;
            ">
                hello yall
            </div>
        </div>`


    constructor(){
        
        this.element = document.createElement('div')
        document.body.appendChild(this.element)
        this.element.appendChild(string2html(this.template))

        this.backdrop = this.element.querySelector('#backdrop') as HTMLElement
        this.contentcontainer = this.element.querySelector('#contentcontainer') as HTMLElement

        this.backdrop.addEventListener('click',(e) => {
            if(!this.contentcontainer.contains(e.target as any)){
                this.hide()
            }
        })
    }

    set(htmlElement:HTMLElement){
        this.contentcontainer.innerHTML = ''
        this.contentcontainer.appendChild(htmlElement)
    }

    show(){
        this.backdrop.style.display = 'block'   
    }

    hide(){
        this.backdrop.style.display = 'none'
    }
}