
class Box<T>{
    onchange:EventSystem<T>
    onClear:EventSystem<any>
    value:T
    isSet:boolean = false;

    constructor(value:T){
        this.onchange = new EventSystem();
        this.value = value
        this.onClear = new EventSystem();
    }

    get():T{
        return this.value
    }

    set(value:T,silent:boolean = false){
        var old = this.value
        this.value = value
        if(old != value || !this.isSet){
            this.isSet = true;
            if(!silent){
                this.onchange.trigger(this.value, old)
            }
        }
    }

    clear(){
        this.isSet = false;
        this.onClear.trigger(0,0)
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