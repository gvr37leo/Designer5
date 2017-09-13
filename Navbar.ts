/// <reference path="main.ts" />


class Navbar{
    element: Element;

    constructor(el:Element, definition:AppDef){
        this.element = el

        for(var objdef of definition.objdefinitions){
            if(objdef.hidden)continue;
            var html = string2html(`<a class="navitem" href=${'#' + objdef.name} >${objdef.name}</a>`)
            this.element.appendChild(html)
        }
        for(var b of definition.customButtons){
            new Button(this.element,b.name,'btn btn-default',() => {
                b.callback(definition)
            })
        }
    }
}