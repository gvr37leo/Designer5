/// <reference path="main.ts" />


class ObjectView{
    element:HTMLElement

    constructor(element:HTMLElement,definition:ObjDef, data){
        this.element = element

        

        for(var attribute of definition.attributes){
            var container = string2html('<div></div>')
            getWidget(attribute, container)
            this.element.appendChild(container)
        }

    }
}