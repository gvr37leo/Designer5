/// <reference path="defClasses.ts" />
/// <reference path="modal.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="GridControl.ts" />
/// <reference path="ObjectView.ts" />

class Designer{
    definition:AppDef

    constructor(element:Element, appDef:AppDef){
        window.objectMap = new Map<string,ObjDef>()
        window.attributeMap = new Map<string,Attribute>()
        for(var obj of appDef.objdefinitions){
            window.objectMap.set(obj._id, obj);
            for(var attribute of obj.attributes){
                window.attributeMap.set(attribute._id, attribute)
            }
        }


        this.definition = addImplicitRefs(appDef)
        var navbarContainer = document.querySelector('#navbar')
        var navbar = new Navbar(navbarContainer, appDef)


        var router = Router({
            "": () => {
                element.innerHTML = ''
                new GridControl(element, this.definition.objdefinitions[0] as ObjDef, {})
            },
            ":object": (object) => {
                element.innerHTML = ''
                var objdefinition = this.definition.objdefinitions.find((obj) => {
                    return obj.name == object
                })
                new GridControl(element, objdefinition as ObjDef, {})
            },
            ":object/:id": (object, id) => {
                element.innerHTML = ''
                var objdefinition = this.definition.objdefinitions.find((obj) => {
                    return obj.name == object
                })
                new ObjectView(element, objdefinition as ObjDef, id)
            },
        });

        router.init();
    }

}