class AppDef{
    objdefinitions:ObjDef[]

    constructor(objdefinitions:ObjDef[]){
        this.objdefinitions = objdefinitions
    }
}

class ObjDef{
    name:string
    attributes:Attribute[]

    constructor(name:string, attributes:Attribute[]){
        this.name = name
        this.attributes = attributes
    }
}

abstract class Attribute{
    name:string
    type:string
    readonly:boolean = false

    constructor(name:string, type:string){
        this.name = name;
        this.type = type;
    }
}

class booleanAttribute extends Attribute{
    constructor(name:string){
        super(name, 'boolean')
    }
}

class dateAttribute extends Attribute{
    constructor(name:string){
        super(name, 'date')
    }
}

class numberAttribute extends Attribute{
    constructor(name:string){
        super(name, 'number')
    }
}

class enumAttribute extends Attribute{
    enumtypes:string[]//for type enum

    constructor(name:string, enumtypes:string[]){
        super(name, 'enum')
        this.enumtypes = enumtypes
    }
}

class textAttribute extends Attribute{
    constructor(name:string){
        super(name, 'text')
    }
}

class identityAttribute extends Attribute{
    pointerType:string
    
    constructor(pointerType:string){
        super('_id', 'id')
        this.pointerType = pointerType
    }
}


class arrayAttribute extends Attribute{
    pointerType:string
    column:string
    constructor(name:string,pointerType:string,column:string){
        super(name, 'array')
        this.pointerType = pointerType
        this.column = column
    }
}

class pointerAttribute extends Attribute{
    pointerType:string
    constructor(name:string,pointerType:string){
        super(name, 'pointer')
        this.pointerType = pointerType
    }
}

