/// <reference path="main.ts" />


function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
}

function getWidget(attr:Attribute,element:HTMLElement):Widget<any>{
    var widget:Widget<any>
    switch (attr.type) {
        case 'boolean':
            widget = new BooleanWidget(element)
            break;
        case 'number':
            widget = new NumberWidget(element,{})
            break;
        case 'date':
            widget = new DateWidget(element)
            break;
        case 'pointer':
            widget = new PointerWidget(element, attr, (val) => val._id, (val) => val.naam)
            break;
        default://text
            widget = new TextWidget(element)
            break;
    }
    return widget
}

function string2html(string):HTMLElement{
    var div = document.createElement('div')
    div.innerHTML = string;
    return div.children[0] as HTMLElement;
}

function getlist(pointertype,callback:(data) => void){
    fetch(`/api/${pointertype}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'GET',
    }).then((res) => {
        return res.json()
    }).then((res) => {
        callback(res)
    })
}

function getlistfiltered(pointertype,filter,callback:(data) => void){
    fetch(`/api/search/${pointertype}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(filter)
    }).then((res) => {
        return res.json()
    }).then((res) => {
        callback(res)
    })
}

function getobject(pointertype,id,callback:(data) => void){
    fetch(`/api/${pointertype}/${id}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'GET',
    }).then((res) => {
        return res.json()
    }).then((res) => {
        callback(res)
    })
}

function create(pointertype,data,callback:() => void){
    fetch(`/api/${pointertype}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'POST',
        body:JSON.stringify(data)
    }).then((res) => {
        return res.text()
    })
    .then((res) => {
        toastr.success('created')
        callback()
    })
}

function del(pointertype, id,callback:() => void){
    fetch(`/api/${pointertype}/${id}`,{
        method:'DELETE',
    }).then((res) => {
        return res.text()
    })
    .then((res) => {
        toastr.success('deleted')
        callback()
    })
}

function update(pointertype,id,data,callback:() => void){
    fetch(`/api/${pointertype}/${id}`,{
        headers:{
            'Content-Type': 'application/json'
        },
        method:'PUT',
        body:JSON.stringify(data)
    }).then((res) => {
        return res.text()
    }).then((res) => {
        toastr.success('saved')
        callback()
    })
}

function createTableCell(row){
    var td = document.createElement('td')
    row.appendChild(td)
    return td
}

function addImplicitRefs(appDef:AppDef):AppDef{
    var map = appDefListToMap(appDef)

    for(var ObjDef of appDef.objdefinitions){
        for(var attribute of ObjDef.attributes){
            if(attribute.type == 'pointer' && attribute.pointerType != ObjDef.name){
                var referencedObject = map.get(attribute.pointerType)
                
                var newAttribute = new Attribute()
                newAttribute.type = 'array'
                newAttribute.pointerType = ObjDef.name
                newAttribute.column = attribute.name
                newAttribute.name = attribute.name

                referencedObject.attributes.push(newAttribute)
            }
        }
    }

    return mapToAppDefList(map)
}

function appDefListToMap(appdef:AppDef):Map<string,ObjDef>{
    var map = new Map<string,ObjDef>()
    for(var ObjDef of appDef.objdefinitions){
        map.set(ObjDef.name,ObjDef)
    }
    return map
}

function mapToAppDefList(map:Map<string,ObjDef>):AppDef{
    var appDef = new AppDef()

    for(var pair of map){
        var string = pair[0]
        var objDef = pair[1]

        appDef.objdefinitions.push(objDef)
    }

    return appDef;
}

class AppDef{
    objdefinitions:ObjDef[] = []
}

class ObjDef{
    name:string
    attributes:Attribute[] = []
}

class Attribute{
    name:string
    type:string
    pointerType:string //for pointer and array types
    column:string
}