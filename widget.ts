/// <reference path="EventSystem.ts" />


abstract class Widget<T>{
    value:Box<T>
    element:HTMLElement
    constructor(element:HTMLElement){
        this.element = element
        this.value = new Box(null as any);
    }
}
