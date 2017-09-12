/// <reference path="main.ts" />


class Navbar{

    constructor(el:Element, definition:AppDef){
        for(var objdef of definition.objdefinitions){
            if(objdef.hidden)continue;
            var html = string2html(`<a class="navitem" href=${'#' + objdef.name} >${objdef.name}</a>`)
            el.appendChild(html)
        }
    }
}