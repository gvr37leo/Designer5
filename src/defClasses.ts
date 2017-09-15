class AppDef{
    customButtons: CustomButton[];
    databaseName: string
    objdefinitions:ObjDef[]
    dateformat:string

    constructor(customButtons:CustomButton[],objdefinitions:ObjDef[]){
        this.objdefinitions = objdefinitions
        this.customButtons = customButtons
    }
}

class ObjDef{
    _id:string
    name:string
    attributes:Attribute[]
    advancedSearch:boolean
    hidden:boolean
    dropdownAttribute:string

    constructor(_id:string, name:string, highlightAttribute:string, attributes:Attribute[],hidden:boolean = false){
        this._id = _id
        this.name = name
        this.attributes = attributes
        this.hidden = hidden
        this.dropdownAttribute = highlightAttribute
    }
}

abstract class Attribute{
    _id:string
    name:string
    type:string
    belongsToObject:string
    readonly:boolean = false
    hidden:boolean
    required:boolean

    constructor(_id:string, name: string, type: string, hidden: boolean = false) {//, belongsToObject: ObjDef
        this._id = _id;
        this.name = name;
        this.type = type;
        // this.belongsToObject = belongsToObject
        this.hidden = hidden
    }
}

class booleanAttribute extends Attribute{
    constructor(_id: string,name:string,hidden:boolean = false){
        super(_id,name, 'boolean',hidden)
    }
}

class dateAttribute extends Attribute{
    constructor(_id: string,name:string,hidden:boolean = false){
        super(_id,name, 'date',hidden)
    }
}

class numberAttribute extends Attribute{
    constructor(_id: string,name:string,hidden:boolean = false){
        super(_id,name, 'number',hidden)
    }
}

class enumAttribute extends Attribute{
    enumtypes:string[]//for type enum

    constructor(_id: string,name:string, enumtypes:string[],hidden:boolean = false){
        super(_id,name, 'enum',hidden)
        this.enumtypes = enumtypes
    }
}

class TextAttribute extends Attribute{
    constructor(_id: string,name:string,hidden:boolean = false){
        super(_id,name, 'text',hidden)
    }
}

class identityAttribute extends Attribute{
    pointerType:string
    
    constructor(_id: string,pointerType:string,hidden:boolean = false){
        super(_id,'_id', 'id',hidden)
        this.pointerType = pointerType
    }
}


class arrayAttribute extends Attribute{
    pointerType:string
    column:string
    constructor(_id: string,name:string,pointerType:string,column:string,hidden:boolean = false){
        super(_id,name, 'array',hidden)
        this.pointerType = pointerType
        this.column = column
    }
}

class pointerAttribute extends Attribute{
    pointerType:string
    constructor(_id: string,name:string,pointerType:string,hidden:boolean = false){
        super(_id,name, 'pointer',hidden)
        this.pointerType = pointerType
    }
}

