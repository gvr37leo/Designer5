
class AppDef{
    customButtons: CustomButton[];
    databaseName: string
    objdefinitions:ObjDef[]
    dateformat:string

    constructor(customButtons:CustomButton[],objdefinitions:ObjDef[]){
        this.customButtons = customButtons
        this.objdefinitions = objdefinitions
    }
}

class ObjDef{
    _id:string
    name:string
    attributes:Attribute[]
    advancedSearch:boolean
    hidden:boolean
    dropdownAttribute:string

    constructor(_id:string, name:string, dropdownAttribute:string, attributes:Attribute[],hidden:boolean = false){
        this._id = _id
        this.name = name
        this.attributes = attributes
        this.hidden = hidden
        this.dropdownAttribute = dropdownAttribute
    }
}

class EnumType{
    _id: string;
    value: string;
    constructor(_id: string, value: string) {
        this._id = _id
        this.value = value
    }
}

abstract class Attribute{
    _id:string
    name:string
    enumType:string
    belongsToObject:string//added by addimplicitrefsmethod
    readonly:boolean = false
    hidden:boolean
    required:boolean

    constructor(_id:string, name: string, type: string, hidden: boolean = false) {//, belongsToObject: ObjDef
        this._id = _id;
        this.name = name;
        this.enumType = type;
        this.hidden = hidden
    }

    static makeAttributeFromObject(attribute:Attribute):Attribute{
        var newAttribute:Attribute = null;
        switch(attribute.enumType){
            case 'text':
                newAttribute = new TextAttribute(attribute._id,attribute.name,attribute.hidden)
                break;
            case 'boolean':
                newAttribute = new booleanAttribute(attribute._id,attribute.name,attribute.hidden)
                break;
            case 'pointer':
                newAttribute = new pointerAttribute(attribute._id,attribute.name,(attribute as pointerAttribute).pointerType,attribute.hidden)
                break;
            case 'date':
                newAttribute = new dateAttribute(attribute._id,attribute.name,attribute.hidden)
                break;
            case 'number':
                newAttribute = new numberAttribute(attribute._id,attribute.name,attribute.hidden)
                break;

// these should never be hit because they shouldnt have to be made in the editor and are added automatically in the addimplicitrefs function
            case 'id':
                newAttribute = new identityAttribute(attribute._id,(attribute as identityAttribute).pointerType,attribute.hidden)
                break;

            case 'array':
                newAttribute = new arrayAttribute(attribute._id,attribute.name,(attribute as arrayAttribute).pointerType,(attribute as arrayAttribute).column,attribute.hidden)
                break;
        }
        newAttribute.belongsToObject = attribute.belongsToObject
        newAttribute.required = attribute.required
        newAttribute.readonly = attribute.readonly

        return newAttribute
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

