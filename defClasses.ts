class AppDef{
    objdefinitions:ObjDef[]
    dateformat:string
    callbacks:((appDef:AppDef) => void)[]

    constructor(callbacks:((appDef:AppDef) => void)[],objdefinitions:ObjDef[]){
        this.objdefinitions = objdefinitions
        this.callbacks = callbacks
    }
}

class ObjDef{
    name:string
    attributes:Attribute[]
    advancedSearch:boolean
    hidden:boolean
    dropdownAttribute:Attribute

    constructor(name:string, highlightAttribute:Attribute, attributes:Attribute[],hidden:boolean = false){
        this.name = name
        this.attributes = attributes
        this.hidden = hidden
        this.dropdownAttribute = highlightAttribute
    }
}

abstract class Attribute{
    name:string
    type:string
    readonly:boolean = false
    hidden:boolean

    constructor(name:string, type:string,hidden:boolean = false){
        this.name = name;
        this.type = type;
        this.hidden = hidden
    }
}

class booleanAttribute extends Attribute{
    constructor(name:string,hidden:boolean = false){
        super(name, 'boolean',hidden)
    }
}

class dateAttribute extends Attribute{
    constructor(name:string,hidden:boolean = false){
        super(name, 'date',hidden)
    }
}

class numberAttribute extends Attribute{
    constructor(name:string,hidden:boolean = false){
        super(name, 'number',hidden)
    }
}

class enumAttribute extends Attribute{
    enumtypes:string[]//for type enum

    constructor(name:string, enumtypes:string[],hidden:boolean = false){
        super(name, 'enum',hidden)
        this.enumtypes = enumtypes
    }
}

class textAttribute extends Attribute{
    constructor(name:string,hidden:boolean = false){
        super(name, 'text',hidden)
    }
}

class identityAttribute extends Attribute{
    pointerType:string
    
    constructor(pointerType:string,hidden:boolean = false){
        super('_id', 'id',hidden)
        this.pointerType = pointerType
    }
}


class arrayAttribute extends Attribute{
    pointerType:string
    column:string
    constructor(name:string,pointerType:string,column:string,hidden:boolean = false){
        super(name, 'array',hidden)
        this.pointerType = pointerType
        this.column = column
    }
}

class pointerAttribute extends Attribute{
    pointerType:string
    constructor(name:string,pointerType:string,hidden:boolean = false){
        super(name, 'pointer',hidden)
        this.pointerType = pointerType
    }
}

