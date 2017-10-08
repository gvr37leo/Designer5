/// <reference path="utils.ts" />
/// <reference path="buttons.ts" />
/// <reference path="modal.ts" />
/// <reference path="Designer.ts" />
/// <reference path="pathFinder.ts" />
/// <reference path="widgets/dropDownWidget.ts" />



//todo
//depends upon - hiding

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
        for (var keyvaluepair of objectMap) {
			var key = keyvaluepair[0]
			var obj = keyvaluepair[1]
            objectMap.set(key, new ObjDef(obj._id,obj.name, obj.dropdownAttribute, [],[], obj.hidden)) 
        } 

        for(var pair of attributeMap){
            pair[1].enumType = enumMap.get(pair[1].enumType).value

            var reffedObj: ObjDef = objectMap.get(pair[1].belongsToObject)
            reffedObj.attributes.push(Attribute.makeAttributeFromObject(pair[1]))
        }

        var appdef = new AppDef([], Array.from(objectMap.values()),[])
        download(JSON.stringify(appdef, null, '\t'), "appDef.json", "application/json")
    })
}

var selfDef = new AppDef([new CustomButton<AppDef>('generate app definition', generateAppDefenition)],[
    new ObjDef('1','object', '1',[
        new TextAttribute('1','name'),
        new pointerAttribute('2','dropdownAttribute','2','7'),
        new booleanAttribute('3','hidden'),
        new booleanAttribute('4','advancedSearch'),
	], []),
    new ObjDef('2','attribute', '5',[
        new TextAttribute('5', 'name'),
        new pointerAttribute('6','enumType','3'),
        new pointerAttribute('7','belongsToObject', '1'),
        new booleanAttribute('8','readonly','2',true),
        new booleanAttribute('9','hidden','2',true),
        new booleanAttribute('10','required','2',true),
        new pointerAttribute('11','pointerType','1',null,'1',true),
	], []),
    new ObjDef('3','enumType','13',[
        new TextAttribute('13', 'value'),
	], [])
],[
    new Column('1','pointer specific','2'),
    new Column('2','secondary','2')
])

var testDefinition = new AppDef([],[
    new ObjDef('1','person', '1',[
        new TextAttribute('1','name'),
        new booleanAttribute('2','homeless','1'),
        new dateAttribute('3','birthday'),
        new numberAttribute('4','lengte',null,true),
        new pointerAttribute('5','vriend','1'),
	], [new CustomButton<GridControl>('filter', (grid: GridControl) => {
		grid.filter.name = 'paul'
		grid.refetchbody()
	})]),
    new ObjDef('2', 'bedrijf', '1',[
        new TextAttribute('6','name'),
        new TextAttribute('7','branch'),
        new numberAttribute('8','rating'),
	], []),
    new ObjDef('3','persoonwerktBijBedrijf',null,[
        new pointerAttribute('10','werknemer','1'),
        new pointerAttribute('11','werkgever','2'),
        new numberAttribute('12','salaris'),
	], [],true)
],[
    new Column('1','adress info','1'),
])

toastr.options.showDuration = 300; 
toastr.options.hideDuration = 500; 
toastr.options.timeOut = 800; 
toastr.options.extendedTimeOut = 500; 

var globalModal = new Modal()
var globalNow = moment()
var designer = new Designer(document.querySelector('#grid'), selfDef)
