/// <reference path="EventSystem.ts" />


abstract class Widget<T>{
    value:Box<T>
    element:HTMLElement
    readonly:Box<boolean>

    constructor(element:HTMLElement){
        this.element = element
        this.value = new Box(null as any);
        this.readonly = new Box(false)

        this.readonly.onchange.listen((val) =>{
            this.handleSetReadOnly(val)
        })
    }

    protected abstract handleSetReadOnly(val:boolean)
}
