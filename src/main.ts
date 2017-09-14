/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />
/// <reference path="ObjectNewView.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="utils.ts" />
/// <reference path="buttons.ts" />
/// <reference path="modal.ts" />


//todo
//depends upon - hiding
//filtering
//datewidget
//enum should maybe point to another object instead of being a string array
declare var download:(contents:string,filename:string,mimetype:string) => void
declare var Router:any


var objectName = new textAttribute('name')
var attributeName = new textAttribute('name')

var selfDef = new AppDef([new CustomButton('generate app definition',(appdef:AppDef) => {
    var objectMap:Map<string,ObjDef> = new Map()

    getlist('object', (objects: ObjDef[]) => {
        for (var obj of objects) {
            objectMap.set(obj._id, new ObjDef(obj.name, obj.dropdownAttribute, [], obj.hidden))
        }
        
        getlist('attribute', (attributes: Attribute[]) => {
            for (var attribute of attributes) {
                var objReferencedByAttributeBelongsToObject: ObjDef = objectMap.get(attribute.belongsToObject as any)
                objReferencedByAttributeBelongsToObject.attributes.push(attribute)
            }
            var appdef = addImplicitRefs(new AppDef([], Array.from(objectMap.values())))
            download(JSON.stringify(appdef, null, '\t'), "appDef.json", "application/json")
        }, () => {})

    }, () => {})
})],[
    new ObjDef('object', objectName,[//zou eigenlijk ref moeten zijn
        objectName,
        new pointerAttribute('dropdownAttribute','attribute'),
        new booleanAttribute('hidden'),
        new booleanAttribute('advancedSearch'),
    ]),
    new ObjDef('attribute', attributeName,[
        attributeName,
        new enumAttribute('type',['boolean','date','enum','number','pointer','text']),
        new pointerAttribute('belongsToObject', 'object'),
        new booleanAttribute('readonly',true),
        new booleanAttribute('hidden',true),
        new booleanAttribute('required',true),
        
        new pointerAttribute('pointerType','object',true),
        new textAttribute('enumtypes',true),
    ]),
    // new ObjDef('objectHasAttributes',null,[
    //     // new pointerAttribute('object','object'),
    //     new pointerAttribute('attribute','attribute'),
    // ],true)
])

var personName = new textAttribute('name')
var bedrijfName = new textAttribute('name')
var testDefinition = new AppDef([],[
    new ObjDef('person', personName,[
        personName,
        new booleanAttribute('homeless'),
        new dateAttribute('birthday'),
        new numberAttribute('lengte',true),
        new pointerAttribute('vriend','person'),
    ]),
    new ObjDef('bedrijf', bedrijfName,[
        bedrijfName,
        new textAttribute('branch'),
        new numberAttribute('rating'),
        new enumAttribute('bankrating',['A+','A','B','D','F'])
    ]),
    new ObjDef('persoonwerktBijBedrijf',null,[
        new pointerAttribute('werknemer','person'),
        new pointerAttribute('werkgever','bedrijf'),
        new numberAttribute('salaris'),
    ],true)
])

var globalModal = new Modal()
// selfDef
// testDefinition
var appDef = addImplicitRefs(testDefinition)

var navbarContainer = document.querySelector('#navbar')
var element = document.querySelector('#grid')

var navbar = new Navbar(navbarContainer, appDef)

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