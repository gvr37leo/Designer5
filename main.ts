/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />
/// <reference path="ObjectNewView.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="utils.ts" />
/// <reference path="buttons.ts" />
/// <reference path="modal.ts" />


//todo
//depends upon - hiding
//generate json button

declare var Router:any

var selfDef = new AppDef([
    new ObjDef('object',[
        new textAttribute('naam')//not calling this name causes errors becauses of the displayer function in pointerwidget
        //array of attributes is reffed
    ]),
    new ObjDef('attribute',[
        new textAttribute('naam'),
        new enumAttribute('type',['boolean','date','enum','number','pointer','text']),
        new pointerAttribute('pointerType','object'),
        new pointerAttribute('column','attribute')//but only attributes that exist in the object that pointertype points towards
        //array of attributes is reffed
    ]),
    new ObjDef('objectHasAttributes',[
        new pointerAttribute('object','object'),
        new pointerAttribute('attribute','attribute'),
    ])
])

var testDefinition = new AppDef([
    new ObjDef('person',[
        new textAttribute('naam'),
        new booleanAttribute('homeless'),
        new dateAttribute('birthday'),
        new numberAttribute('lengte'),
        new pointerAttribute('vriend','person'),
    ]),
    new ObjDef('bedrijf',[
        new textAttribute('naam'),
        new textAttribute('branch'),
        new numberAttribute('rating'),
        new enumAttribute('bankrating',['A+','A','B','D','F'])
    ]),
    new ObjDef('persoonwerktBijBedrijf',[
        new pointerAttribute('werknemer','person'),
        new pointerAttribute('werkgever','bedrijf'),
        new numberAttribute('salaris'),
    ])
])

var globalModal = new Modal()
// selfDef
// testDefinition
var appDef = addImplicitRefs(testDefinition)

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
    ":object/:id":(object,id) => {
        element.innerHTML = ''
        var objdefinition = appDef.objdefinitions.find((obj) => {
            return obj.name == object
        })
        new ObjectView(element,objdefinition as ObjDef,id)
    },
});

router.init();