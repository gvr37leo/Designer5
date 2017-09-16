
class Box<T>{
    onchange:EventSystem<T>
    value:T

    constructor(value:T){
        this.onchange = new EventSystem();
        this.value = value
    }

    get():T{
        return this.value
    }

    set(value:T,silent:boolean = false){
        var old = this.value
        this.value = value
        if(old != value){
            if(!silent){
                this.onchange.trigger(this.value, old)
            }
        }
    }
}

class EventSystem<T>{
    callbacks: ((val:T, old:T) => void)[]

    constructor(){
        this.callbacks = []
    }

    listen(callback:(val:T, old:T) => void){
        this.callbacks.push(callback)
    }

    deafen(callback:(val:T) => void){
        this.callbacks.splice(this.callbacks.findIndex(v => v === callback), 1)
    }

    trigger(value:T, old:T){
        for(var callback of this.callbacks){
            callback(value, old)
        }
    }
}