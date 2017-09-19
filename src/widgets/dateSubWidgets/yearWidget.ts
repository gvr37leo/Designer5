/// <reference path="../../widget.ts" />


class YearWidget extends Widget<any>{
    template: string = `
        <table> 
            <thead> 
                <tr id="headerrow"></tr> 
            </thead> 
            <tbody id="calendarbody"> 
                    
            </tbody> 
        <table> 
    `

    constructor(element:HTMLElement){
        super(element) 
    }

    protected handleSetReadOnly(val: boolean) {
        throw new Error("Method not implemented.");
    }

}