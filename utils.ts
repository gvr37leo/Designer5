function mod(number, modulus){
    return ((number%modulus)+modulus)%modulus;
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
        callback()
    })
}