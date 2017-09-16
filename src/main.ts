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

function fillMap<T>(objname:string):Promise<Map<string,T>>{
    return new Promise((resolve,reject) => {
        var map:Map<string,T> = new Map()
        getlist(objname,(data:any) => {
            for(var obj of data){
                map.set(obj._id,obj)
            }
            resolve(map)
        },() => {})
    })
}

function generateAppDefenition(appdef:AppDef){
    Promise.all([fillMap<ObjDef>('object'),fillMap<Attribute>('attribute'),fillMap<EnumType>('enumType')])
    .then((maps) => {
        var objectMap:Map<string,ObjDef> = maps[0]
        var attributeMap: Map<string, Attribute> = maps[1]
        var enumMap:Map<string,EnumType> = maps[2]
        for (var obj of objectMap) { 
            objectMap.set(obj[1]._id, new ObjDef(obj[1]._id,obj[1].name, obj[1].dropdownAttribute, [], obj[1].hidden)) 
        } 

        for(var pair of attributeMap){
            pair[1].enumType = enumMap.get(pair[1].enumType).value

            var reffedObj: ObjDef = objectMap.get(pair[1].belongsToObject)
            reffedObj.attributes.push(Attribute.makeAttributeFromObject(pair[1]))
        }

        var appdef = new AppDef([], Array.from(objectMap.values()))
        download(JSON.stringify(appdef, null, '\t'), "appDef.json", "application/json")
    })
}

var selfDef = new AppDef([new CustomButton('generate app definition', generateAppDefenition)],[
    new ObjDef('1','object', '1',[
        new TextAttribute('1','name'),
        new pointerAttribute('2','dropdownAttribute','2'),
        new booleanAttribute('3','hidden'),
        new booleanAttribute('4','advancedSearch'),
    ]),
    new ObjDef('2','attribute', '5',[
        new TextAttribute('5', 'name'),
        new pointerAttribute('6','enumType','3'),
        new pointerAttribute('7','belongsToObject', '1'),
        new booleanAttribute('8','readonly',true),
        new booleanAttribute('9','hidden',true),
        new booleanAttribute('10','required',true),
        new pointerAttribute('11','pointerType','1',true),
    ]),
    new ObjDef('3','enumType','13',[
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