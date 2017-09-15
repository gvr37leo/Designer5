/// <reference path="utils.ts" />
/// <reference path="buttons.ts" />
/// <reference path="modal.ts" />
/// <reference path="Designer.ts" />


//todo
//depends upon - hiding
//filtering
//datewidget
//enum should maybe point to another object instead of being a string array
declare var download:(contents:string,filename:string,mimetype:string) => void
declare var Router:any
interface Window { objectMap: Map<string, ObjDef>; }
interface Window { attributeMap: Map<string, Attribute>; }

var selfDef = new AppDef([new CustomButton('generate app definition',(appdef:AppDef) => {
    var objectMap:Map<string,ObjDef> = new Map()
    var attributeMap: Map<string, Attribute> = new Map()

    getlist('object', (objects: ObjDef[]) => {
        for (var obj of objects) {
            objectMap.set(obj._id, new ObjDef(obj._id,obj.name, null, [], obj.hidden))
        }
        console.log('objects', objects)

        getlist('attribute', (attributes: Attribute[]) => {
            for (var attribute of attributes) {
                var objReferencedByAttributeBelongsToObject: ObjDef = objectMap.get(attribute.belongsToObject as any)
                objReferencedByAttributeBelongsToObject.attributes.push(attribute)
            }

            console.log('attributes', attributes)


            var appdef = addImplicitRefs(new AppDef([], Array.from(objectMap.values())))
            download(JSON.stringify(appdef, null, '\t'), "appDef.json", "application/json")
        }, () => {})
    }, () => {})
})],[
    new ObjDef('1','object', '1',[
        new TextAttribute('1','name'),
        new pointerAttribute('2','dropdownAttribute','2'),
        new booleanAttribute('3','hidden'),
        new booleanAttribute('4','advancedSearch'),
    ]),
    new ObjDef('2','attribute', '5',[
        new TextAttribute('5', 'name'),
        // new pointerAttribute('6','enumType','3'),
        new pointerAttribute('7','belongsToObject', '1'),
        new booleanAttribute('8','readonly',true),
        new booleanAttribute('9','hidden',true),
        new booleanAttribute('10','required',true),
        
        new pointerAttribute('11','pointerType','1',true),
        new TextAttribute('12','enumtypes',true),
    ]),
    new ObjDef('3','enumType',null,[
        new TextAttribute('13', 'value'),
    ])
])

var testDefinition = new AppDef([],[
    new ObjDef('1','person', '1',[
        new TextAttribute('1','name'),
        new booleanAttribute('2','homeless'),
        new dateAttribute('3','birthday'),
        new numberAttribute('4','lengte',true),
        new pointerAttribute('5','vriend','1'),
    ]),
    new ObjDef('2', 'bedrijf', '1',[
        new TextAttribute('6','name'),
        new TextAttribute('7','branch'),
        new numberAttribute('8','rating'),
    ]),
    new ObjDef('3','persoonwerktBijBedrijf',null,[
        new pointerAttribute('10','werknemer','1'),
        new pointerAttribute('11','werkgever','2'),
        new numberAttribute('12','salaris'),
    ],true)
])

var globalModal = new Modal()

var designer = new Designer(document.querySelector('#grid'),selfDef)