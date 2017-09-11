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
    enumtypes:string[] = []//for type enum

    constructor(name:string, type:string){
        this.name = name;
        this.type = type;
    }
}

class pointerAttribute extends Attribute{
    constructor(name:string, type:string){
        super(name, type)
    }
}

class enumAttribute extends Attribute{
    
    constructor(name:string, type:string){
        super(name, type)
    }
}