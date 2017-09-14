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
//filtering
//datewidget

declare var Router:any
var naam = new textAttribute('name')

var selfDef = new AppDef([new CustomButton('generate app definition',(appdef:AppDef) => {
    var objectMap:Map<string,ObjDef> = new Map()
    var attributeMap: Map<string, Attribute> = new Map()

    var getobjects = new Promise((resolve, reject) => {
        getlist('object', (objects: ObjDef[]) => {
            for (var obj of objects) {
                objectMap.set(obj._id, new ObjDef(obj.name, null, [], obj.hidden))
            }
            console.log('objects', objects)
            resolve(objects)
        }, () => { 
            reject()
        })
    }) 
    
    var getattributes = new Promise((resolve,reject) => {
        getlist('attribute', (attributes: Attribute[]) => {
            for (var attribute of attributes) {
                switch (attribute.type) {
                    case 'text':
                        break;

                    default:
                        break;
                }
                attributeMap.set(attribute._id, new Attribute(attribute.name, attribute.type, attribute.hidden))
            }

            console.log('attributes', attributes)
            resolve(attributes)
        }, () => { 
            reject()
        })
    })
    

    Promise.all([getobjects, getattributes]).then((values) => {
        getlist('objectHasAttributes', (objectHasAttributes: { object: string, attribute: string }[]) => {
            for (var objectHasAttribute of objectHasAttributes) {
                objectMap.get(objectHasAttribute.object).attributes.push(attributeMap.get(objectHasAttribute.attribute))
            }
            console.log('objectHasAttributes', objectHasAttributes)

            
            console.log(addImplicitRefs(new AppDef([], Array.from(objectMap.values()))))
        }, () => { })
    })


})],[
    new ObjDef('object',naam,[
        naam,
        new booleanAttribute('hidden'),
        new booleanAttribute('advancedSearch'),
    ]),
    new ObjDef('attribute',naam,[
        naam,
        new enumAttribute('type',['boolean','date','enum','number','pointer','text']),
        new booleanAttribute('readonly',true),
        new booleanAttribute('hidden',true),
        
        new pointerAttribute('pointerType','object',true),
        // new pointerAttribute('column','attribute',true),//but only attributes that exist in the object that pointertype points towards
        new textAttribute('enumtypes',true)
        //array of attributes is reffed
    ]),
    new ObjDef('objectHasAttributes',null,[
        new pointerAttribute('object','object'),
        new pointerAttribute('attribute','attribute'),
    ],true)
])

var testDefinition = new AppDef([],[
    new ObjDef('person',naam,[
        naam,
        new booleanAttribute('homeless'),
        new dateAttribute('birthday'),
        new numberAttribute('lengte',true),
        new pointerAttribute('vriend','person'),
    ]),
    new ObjDef('bedrijf',naam,[
        naam,
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
var appDef = addImplicitRefs(selfDef)

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