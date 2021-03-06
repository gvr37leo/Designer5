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
            for(var obj of data.data){
                map.set(obj._id,obj)
            }
            resolve(map)
        },() => {})
    })
}

function generateAppDefenition(appdef:AppDef){
    Promise.all([fillMap<ObjDef>('object'), fillMap<Attribute>('attribute'), fillMap<EnumType>('enumType'), fillMap<Column>('column')])
    .then((maps) => {
        var objectMap:Map<string,ObjDef> = maps[0]
        var attributeMap: Map<string, Attribute> = maps[1]
        var enumMap:Map<string,EnumType> = maps[2]
        var columnMap: Map<string, Column> = maps[3]
        var attributes:Attribute[] = []

        for (let keyvaluepair of objectMap) {
			var key = keyvaluepair[0]
			var obj = keyvaluepair[1]
            objectMap.set(key, new ObjDef(obj._id,obj.name, obj.dropdownAttribute,[], obj.hidden)) 
        } 

        for(let pair of attributeMap){
            pair[1].enumType = enumMap.get(pair[1].enumType).value

            // attributes.push(Attribute.makeAttributeFromObject(pair[1]))
        }
        var appdef = new AppDef([], Array.from(objectMap.values()), Array.from(attributeMap.values()),Array.from(columnMap.values()))
        download(JSON.stringify(appdef, null, '\t'), "appDef.json", "application/json")
    })
}

var selfDef = new AppDef([new CustomButton<AppDef>('generate app definition', generateAppDefenition)],[
    new ObjDef('1','object', '1',[]),
    new ObjDef('2','attribute', '5',[]),
    new ObjDef('3','enumType','13',[],),
    new ObjDef('4','column','14',[]),
],[
    new TextAttribute('1', 'name','1'),
    new PointerAttribute('2', 'dropdownAttribute', '2','1', '7'),
    new BooleanAttribute('3', 'hidden','1','3'),
    new BooleanAttribute('4', 'advancedSearch','1','3'),
    new TextAttribute('5', 'name','2'),
    new PointerAttribute('6', 'enumType', '3','2'),
    new PointerAttribute('7', 'belongsToObject', '1','2'),
    new BooleanAttribute('8', 'readonly', '2','2', true),
    new BooleanAttribute('9', 'hidden','2', '2', true),
    new BooleanAttribute('10', 'required','2', '2', true),
    new PointerAttribute('11', 'pointerType', '1','2', null,null, '1', true),
    new PointerAttribute('12', 'filter on column','2', '2', '7','11', '1', true),
    new PointerAttribute('17','usingOwnColumn','2','2','7','7','1',true),
    new TextAttribute('13', 'value','3'),
    new PointerAttribute('16', 'place in column','4', '2', null,null, '2', true),
    new TextAttribute('14', 'name','4'),
    new PointerAttribute('15', 'belongsToObject','1', '4', null, null),
],[
    new Column('1','pointer specific','2'),
    new Column('2','secondary','2'),
    new Column('3','secondary','1'),
])

var testDefinition = new AppDef([],[
    new ObjDef('1', 'person', '1', [new CustomButton<GridControl>('filter', (grid: GridControl) => {
        grid.refetchbody()
    })]),
    new ObjDef('2', 'bedrijf', '1',[]),
    new ObjDef('3', 'persoonwerktBijBedrijf', null, [], true)
],[
    new TextAttribute('1', 'name','1'),
    new BooleanAttribute('2', 'homeless', '1','1'),
    new dateAttribute('3', 'birthday','1'),
    new numberAttribute('4', 'lengte','1', null, true),
    new PointerAttribute('5', 'vriend', '1','1'),
    new TextAttribute('6', 'name','2'),
    new TextAttribute('7', 'branch','2'),
    new numberAttribute('8', 'rating','2'),
    new PointerAttribute('10', 'werknemer', '1','3'),
    new PointerAttribute('11', 'werkgever', '2','3'),
    new numberAttribute('12', 'salaris','3'),
],[
    new Column('1', 'adress info', '1'),
])

var gendef = {
	"customButtons": [],
	"objdefinitions": [
		{
			"attributes": [],
			"columns": [],
			"_id": "5a9e8c04307c3d129cee74ee",
			"name": "vrijwilliger",
			"hidden": false,
			"dropdownAttribute": "5a9e8e28307c3d129cee74fa",
			"customButtons": []
		},
		{
			"attributes": [],
			"columns": [],
			"_id": "5a9e8c0c307c3d129cee74ef",
			"name": "oudere",
			"hidden": false,
			"dropdownAttribute": "5a9e8e46307c3d129cee74fb",
			"customButtons": []
		},
		{
			"attributes": [],
			"columns": [],
			"_id": "5a9e8c15307c3d129cee74f0",
			"name": "afspraak",
			"hidden": false,
			"dropdownAttribute": "5a9e8e11307c3d129cee74f9",
			"customButtons": []
		}
	],
	"attributes": [
		{
			"_id": "5a9e8df2307c3d129cee74f7",
			"belongsToObject": "5a9e8c15307c3d129cee74f0",
			"enumType": "pointer",
			"name": "rijder",
			"pointerType": "5a9e8c04307c3d129cee74ee",
			"lastupdate": 1520340466120
		},
		{
			"_id": "5a9e8e08307c3d129cee74f8",
			"belongsToObject": "5a9e8c15307c3d129cee74f0",
			"name": "passagier",
			"enumType": "pointer",
			"pointerType": "5a9e8c0c307c3d129cee74ef",
			"lastupdate": 1520340488157
		},
		{
			"_id": "5a9e8e11307c3d129cee74f9",
			"belongsToObject": "5a9e8c15307c3d129cee74f0",
			"name": "datum",
			"enumType": "date",
			"lastupdate": 1520340497461
		},
		{
			"_id": "5a9e8e28307c3d129cee74fa",
			"belongsToObject": "5a9e8c04307c3d129cee74ee",
			"name": "naam",
			"enumType": "text",
			"lastupdate": 1520340520197
		},
		{
			"_id": "5a9e8e46307c3d129cee74fb",
			"belongsToObject": "5a9e8c0c307c3d129cee74ef",
			"name": "naam",
			"enumType": "text",
			"lastupdate": 1520340550118
		}
	],
	"columns": []
}

toastr.options.showDuration = 300; 
toastr.options.hideDuration = 500; 
toastr.options.timeOut = 800; 
toastr.options.extendedTimeOut = 500; 

var globalModal = new Modal()
var globalNow = moment()
var designer = new Designer(document.querySelector('#grid'), gendef as any)
