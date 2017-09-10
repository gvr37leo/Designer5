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