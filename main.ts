/// <reference path="GridControl.ts" />
class ObjDef{
    name:string
    attributes:Attribute[]
}

class Attribute{
    name:string
    type:string
    pointerType:string
}

var element = document.querySelector('#grid')

var gridControl = new GridControl(element,{
    data:[{
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
    }],
    definition:{
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
})