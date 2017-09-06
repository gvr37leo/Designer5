/// <reference path="main.ts" />


class ObjectView{
    element:Element

    constructor(element:Element,definition:ObjDef, data){
        this.element = element

        

        for(var attribute of definition.attributes){
            var container = string2html('<div></div>')
            var widget = getWidget(attribute, container)
            this.element.appendChild(container)

            widget.value.set(data[attribute.name])
        }

    }
}