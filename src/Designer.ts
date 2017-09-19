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

        var pathFinder = new PathFinder()
        pathFinder.register("", () => {
            element.innerHTML = ''
            new GridControl(element, this.definition.objdefinitions[0] as ObjDef, {})
        })      
        pathFinder.register(":object", (params) => {
            element.innerHTML = ''
            var objdefinition = this.definition.objdefinitions.find((obj) => {
                return obj.name == params[0]
            })
            new GridControl(element, objdefinition as ObjDef, {})
        })
        pathFinder.register(":object/:id", (params) => {
            element.innerHTML = ''
            var objdefinition = this.definition.objdefinitions.find((obj) => {
                return obj.name == params[0]
            })
            new ObjectView(element, objdefinition as ObjDef, params[1])
        })

        pathFinder.trigger(location.hash)
        window.addEventListener("hashchange", (e: HashChangeEvent) => {
            var path = location.hash
            if (path[0] == "#"){
                path = path.slice(1)
            } 
            pathFinder.trigger(path)
        })
    }

}