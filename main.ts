/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />
/// <reference path="ObjectNewView.ts" />
/// <reference path="Navbar.ts" />
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
    pointerType:string
}

class Button{
    btnElement:Element

    constructor(element:Element, text:string, callback:() => void){
        this.btnElement = string2html(`<button>${text}</button>`)
        element.appendChild(this.btnElement)
        this.btnElement.addEventListener('click', callback)
    }
}

var appDef = {
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
            },
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
}

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
        new ObjectView(element,objdefinition as ObjDef,object,id)
    },
});

router.init();

function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
}

