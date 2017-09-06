/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />
/// <reference path="Navbar.ts" />


class ObjDef{
    name:string
    attributes:Attribute[]
}

class Attribute{
    name:string
    type:string
    pointerType:string
}

var definition = {
    name:'person',
    attributes:[
        {
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
}

var data = [{
    id:'1',
    naam:'paul',
    homeless:false,
    birthday:'09/09/1994 12:00:00',
    lengte:178.3,
    vriend:'2'
},{
    id:'2',
    naam:'piet',
    homeless:true,
    birthday:'09/09/1998 12:00:00',
    lengte:182.9,
    vriend:'1'
}]
var navbarContainer = document.querySelector('#navbar')
var element = document.querySelector('#grid')
// var objectView = new ObjectView(element,definition as ObjDef,data[0])
var gridControl = new GridControl(element,{
    data:data,
    definition:definition
})

var navbar = new Navbar(navbarContainer,[definition] as ObjDef[])