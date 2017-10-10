/// <reference path="main.ts" />
/// <reference path="defClasses.ts" />


function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
}

function getWidget(attr:Attribute,element:HTMLElement,row:any):Widget<any>{
    var widget:Widget<any>
    switch (attr.enumType) {
        case 'boolean':
            widget = new BooleanWidget(element)
            break;
        case 'number':
            widget = new NumberWidget(element,{})
            break;
        case 'date':
            widget = new DateWidget(element,attr)
            break;
        case 'id':
            widget = new idWidget(element, attr as IdentityAttribute)
            break;
        case 'enum':
            widget = new EnumWidget(element,attr as enumAttribute)
            break;
        case 'pointer':
            widget = new PointerWidget(element, attr as PointerAttribute, row)
            break;
        default://text
            widget = new TextWidget(element)
            break;
    }
    return widget
}

function createAndAppend(element:HTMLElement, html:string):HTMLElement{ 
    var result = string2html(html); 
    element.appendChild(result) 
    return result; 
} 

function string2html(string):HTMLElement{
    var div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0] as HTMLElement;
}

function handleResponse(response){
    return response.json()
    .then(json => {
        if (response.ok) {
            return json
        } else {
            let error = Object.assign({}, json, {
                status: response.status,
                statusText: response.statusText
            })
            return Promise.reject(error)
        }
    })
}

function handleError(error){
    console.log(error)
    toastr.error(JSON.stringify(error))
}

function getlist(pointertype:string,callback:(data) => void,errorCB:(error) => void){
    fetch(`/api/${pointertype}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'GET',
    })
    .then(handleResponse)
    .then((res) => {
        callback(res)
    }).catch((err) => {
        handleError(err)
        errorCB(err)
    })
}

function getlistfiltered(pointertype: string,filter:Query,callback:(data) => void,errorCB:(error) => void){
    fetch(`/api/search/${pointertype}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(filter)
    })
    .then(handleResponse)
    .then((res) => {
        callback(res)
    }).catch((err) => {
        handleError(err)
        errorCB(err)
    })
}

function getobject(pointertype: string, id: string,callback:(data) => void,errorCB:(error) => void){
    fetch(`/api/${pointertype}/${id}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'GET',
    })
    .then(response => response.text())
    .then((res) => {
        if(res == ""){
            callback(null);
        }
        else{
            callback(JSON.parse(res))
        }
    }).catch((err) => {
        handleError(err)
        errorCB(err)
    })
}

function create(pointertype: string,data,callback:() => void,errorCB:(error) => void){
    fetch(`/api/${pointertype}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(data)
    })
    .then(handleResponse)
    .then((res) => {
        toastr.success('created')
        callback()
    }).catch((err) => {
        handleError(err)
        errorCB(err)
    })
}

function del(pointertype: string, id: string,callback:() => void,errorCB:(error) => void){
    fetch(`/api/${pointertype}/${id}`,{
        method:'DELETE',
    })
    .then(handleResponse)
    .then((res) => {
        toastr.success('deleted')
        callback()
    }).catch((err) => {
        handleError(err)
        errorCB(err)
    })
}

function update(pointertype: string, id: string,data,callback:() => void,errorCB:(error) => void){
    fetch(`/api/${pointertype}/${id}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'PUT',
        body:JSON.stringify(data)
    })
    .then(handleResponse)
    .then((res) => {
        toastr.success('saved')
        callback()
    }).catch((err) => {
        handleError(err)
        errorCB(err)
    })
}

function createTableCell(row){
    var td = document.createElement('td')
    row.appendChild(td)
    return td
}

// function addImplicitRefs(appDef:AppDef):AppDef{
//     var map = appDefListToMap(appDef)
//     var objMap = new Map<string,ObjDef>()

//     for(var objDef of appDef.objdefinitions){
//         objMap.set(objDef._id,objDef)
//         objDef.columns.push(new Column('genCol','generatedFields',objDef._id))
        
//         objDef.attributes.unshift(new IdentityAttribute(null,objDef.name,'genCol'))

//         for(var attribute of objDef.attributes){
//             attribute.belongsToObject = objDef._id
//             if(attribute.enumType == 'pointer'){
//                 var referencedObject = map.get((attribute as PointerAttribute).pointerType)
//                 var newAttribute = new arrayAttribute(null,attribute.name,objDef._id,attribute._id)
//                 referencedObject.attributes.push(newAttribute)
//             }
//         }

//         var lastupdateAttribute = new dateAttribute(null, 'lastupdate','genCol')
//         lastupdateAttribute.readonly = true;
//         objDef.attributes.push(lastupdateAttribute)
//     }

//     for(var column of appDef.columns){
//         objMap.get(column.belongsToObject).columns.push(column)
//     }

//     appDef.objdefinitions = mapToAppDefList(map).objdefinitions
//     return appDef
// }
interface IHasID{
    _id:string
}
function createMap <T extends IHasID>(entitys:T[]):Map<string,T>{
    var map = new Map<string,T>();
    for(var entity of entitys){
        map.set(entity._id,entity)
    }
    return map;
}

function addImplicitRefs2(appdef: AppDef): AppDef{
    var attributeMap = createMap(appdef.attributes);
    var columnMap = createMap(appdef.columns);
    var objMap = createMap(appdef.objdefinitions);

    for(var obj of appdef.objdefinitions){
        obj.attributes.push(new IdentityAttribute(null,obj.name,obj._id))
        var lastupdateAttribute = new dateAttribute(null, 'lastupdate',obj._id)
        lastupdateAttribute.readonly = true;
        obj.attributes.push(lastupdateAttribute)
    }

    for(var attribute of appdef.attributes){
        objMap.get(attribute.belongsToObject).attributes.push(attribute)
        if(attribute.belongsToColumn){
            columnMap.get(attribute.belongsToColumn).attributes.push(attribute)
        }
        if(attribute.enumType == 'pointer'){
            var referencedObject = objMap.get((attribute as PointerAttribute).pointerType)
            var newAttribute = new arrayAttribute(null, attribute.name, attribute.belongsToObject, attribute._id,referencedObject._id)
            referencedObject.attributes.push(newAttribute)
        }
    }

    for(var column of appdef.columns){
        objMap.get(column.belongsToObject).columns.push(column)
    }
    return appdef
}

// function appDefListToMap(appdef:AppDef):Map<string,ObjDef>{
//     var map = new Map<string,ObjDef>()
//     for(var ObjDef of appdef.objdefinitions){
//         map.set(ObjDef._id,ObjDef)
//     }
//     return map
// }

// function mapToAppDefList(map:Map<string,ObjDef>):AppDef{
//     var appDef = new AppDef([],[],[],[])

//     for(var pair of map){
//         var string = pair[0]
//         var objDef = pair[1]

//         appDef.objdefinitions.push(objDef)
//     }

//     return appDef;
// }

class CoolUp{
    timeout: number = null;
    callback: () => void;
    cooldownMS:number

    constructor(cooldownMS:number, callback: () => void){
        this.cooldownMS = cooldownMS
        this.callback = callback
    }

    restartCast(){
        if(this.timeout != null){
            clearTimeout(this.timeout)
        }
        this.timeout = window.setTimeout(this.callback,this.cooldownMS)
    }
}

function isEmpty(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

function removeHash(string: string): string {
    if (string[0] == "#") {
        string = string.slice(1)
    }
    return string
}

declare class Query{
    filter:any
    sort:any
    paging:{
        skip:number,
        limit:number
    }
}