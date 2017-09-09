/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />
/// <reference path="ObjectNewView.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="utils.ts" />

declare var Router:any

class AppDef{
    objdefinitions:ObjDef[]
}

class ObjDef{
    name:string
    attributes:Attribute[]
}

class Attribute{
    name:string
    type:string
    pointerType:string //for pointer and array types
    column
}

class Button{
    btnElement:Element

    constructor(element:Element, text:string, callback:() => void){
        this.btnElement = string2html(`<button>${text}</button>`)
        element.appendChild(this.btnElement)
        this.btnElement.addEventListener('click', callback)
    }
}

var appDef:AppDef = {
    objdefinitions:[{
        name:'person',
        attributes:[
            {
                name:'_id',
                type:'text'
            },{
                name:'naam',
                type:'text'
            },{
                name:'homeless',
                type:'boolean'
            },{
                name:'birthday',
                type:'date'
            },{
                name:'lengte',
                type:'number'
            },{
                name:'vriend',
                type:'pointer',
                pointerType:'person'
            }
            ,{
                type:'array',
                pointerType:'persoonwerktBijBedrijf',
                field:'person'
            }
        ]
    },{
        name:'bedrijf',
        attributes:[
            {
                name:'_id',
                type:'text'
            },{
                name:'naam',
                type:'text'
            },{
                name:'branch',
                type:'text'
            },{
                name:'rating',
                type:'number'
            }
            ,{
                type:'array',
                pointerType:'persoonwerktBijBedrijf',
                field:'bedrijf'
            }
        ]
    },{
        name:'persoonwerktBijBedrijf',
        attributes:[
            {
                name:'_id',
                type:'text'
            },{
                name:'person',
                type:'pointer',
                pointerType:'person'
            },{
                name:'bedrijf',
                type:'pointer',
                pointerType:'bedrijf'
            },{
                name:'salaris',
                type:'number'
            }
        ]
    }]
} as AppDef

var navbarContainer = document.querySelector('#navbar')
var element = document.querySelector('#grid')

var navbar = new Navbar(navbarContainer,appDef as AppDef)

var router = Router({
    "":() => {
        element.innerHTML = ''
        new GridControl(element, appDef.objdefinitions[0] as ObjDef)
    },
    ":object":(object) => {
        element.innerHTML = ''
        var objdefinition = appDef.objdefinitions.find((obj) => {
            return obj.name == object
        })
        new GridControl(element, objdefinition as ObjDef)
    },
    ":object/new":(object) => {
        element.innerHTML = ''
        var objdefinition = appDef.objdefinitions.find((obj) => {
            return obj.name == object
        })
        new ObjectNewView(element,objdefinition as ObjDef)
    },
    ":object/:id":(object,id) => {
        element.innerHTML = ''
        var objdefinition = appDef.objdefinitions.find((obj) => {
            return obj.name == object
        })
        new ObjectView(element,objdefinition as ObjDef,id)
    },
});

router.init();