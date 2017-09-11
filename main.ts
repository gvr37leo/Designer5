/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />
/// <reference path="ObjectNewView.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="utils.ts" />
/// <reference path="buttons.ts" />


declare var Router:any

var selfDef:AppDef = {
    objdefinitions:[{
        name:'object',
        attributes:[{
            name:'name',
            type:'string'
        }]//array of attributes is reffed
    },{
        name:'attribute',
        attributes:[{
            name:'name',
            type:'string'
        },{
            name:'type',
            type:'enum',
            enumTypes:['text','number','date','enum','pointer']
        },{
            name:'pointerType',
            type:'pointer',
            pointerType:'object'
        },{
            name:'column',
            type:'pointer',
            pointerType:'attribute'//but only attributes that exist in the object that pointertype points towards
        }]
    },{
        name:'objectHasAttributes',
        attributes:[{
            type:'array',
            pointerType:'object',
            name:'object',
        },{
            type:'array',
            pointerType:'attribute',
            name:'attribute'
        }]
    }]
} as AppDef

var appDef:AppDef = {
    objdefinitions:[{
        name:'person',
        attributes:[{
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
        attributes:[{
                name:'naam',
                type:'text'
            },{
                name:'branch',
                type:'text'
            },{
                name:'rating',
                type:'number'
            },{
                name:'bankrating',
                type:'enum',
                enumtypes:['A+','A','B','D','F']
            }
        ]
    },{
        name:'persoonwerktBijBedrijf',
        attributes:[{
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

var appDef = addImplicitRefs(appDef)

var navbarContainer = document.querySelector('#navbar')
var element = document.querySelector('#grid')

var navbar = new Navbar(navbarContainer,appDef as AppDef)

var router = Router({
    "":() => {
        element.innerHTML = ''
        new GridControl(element, appDef.objdefinitions[0] as ObjDef,{})
    },
    ":object":(object) => {
        element.innerHTML = ''
        var objdefinition = appDef.objdefinitions.find((obj) => {
            return obj.name == object
        })
        new GridControl(element, objdefinition as ObjDef,{})
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