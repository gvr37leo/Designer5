/// <reference path="main.ts" />


class Navbar{

    constructor(el:Element, definition:ObjDef[]){
        for(var objdef of definition){
            var html = string2html(`<a href=${'#' + objdef.name} >${objdef.name}</a>`)
            el.appendChild(html)
        }
    }
}