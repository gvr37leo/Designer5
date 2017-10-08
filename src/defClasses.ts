
class AppDef{
    customButtons: CustomButton<AppDef>[];
    databaseName: string
    objdefinitions:ObjDef[]
    dateformat:string
    columns:Column[]
    attributes:Attribute[]

    constructor(customButtons:CustomButton<AppDef>[],objdefinitions:ObjDef[],columns:Column[]){
        this.customButtons = customButtons
        this.objdefinitions = objdefinitions
        this.columns = columns
    }
}

class ObjDef{
    _id:string
    name:string
    attributes:Attribute[]
    advancedSearch:boolean
    hidden:boolean
    dropdownAttribute:string
    customButtons: CustomButton<GridControl>[];
    columns:Column[] = []

    constructor(_id: string, name: string, dropdownAttribute: string, attributes: Attribute[], customButtons: CustomButton<GridControl>[],hidden:boolean = false){
        this._id = _id
        this.name = name
        this.hidden = hidden
        this.dropdownAttribute = dropdownAttribute
        this.customButtons = customButtons
        this.attributes = attributes
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

class Column{
    _id:string
    name:string
    // grow:number = 0;
    // basis:string

    belongsToObject:string
    attributes:Attribute[]

    constructor(_id:string,name:string,belongsToObject:string){
        this._id = _id
        this.name = name
        this.belongsToObject = belongsToObject
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
    belongsToColumn:string

    constructor(_id:string, name: string, type: string,belongsToColumn:string = null, hidden: boolean = false) {//, belongsToObject: ObjDef
        this._id = _id;
        this.name = name;
        this.enumType = type;
        this.hidden = hidden
        this.belongsToColumn = belongsToColumn
    }

    static makeAttributeFromObject(attribute:Attribute):Attribute{
        var newAttribute:Attribute = null;
        switch(attribute.enumType){
            case 'text':
                newAttribute = new TextAttribute(attribute._id,attribute.name,null,attribute.hidden)
                break;
            case 'boolean':
                newAttribute = new booleanAttribute(attribute._id,attribute.name,null,attribute.hidden)
                break;
            case 'pointer':
                newAttribute = new pointerAttribute(attribute._id,attribute.name,(attribute as pointerAttribute).pointerType,null,null,attribute.hidden)
                break;
            case 'date':
                newAttribute = new dateAttribute(attribute._id,attribute.name,null,attribute.hidden)
                break;
            case 'number':
                newAttribute = new numberAttribute(attribute._id,attribute.name,null,attribute.hidden)
                break;

// these should never be hit because they shouldnt have to be made in the editor and are added automatically in the addimplicitrefs function
            case 'id':
                newAttribute = new IdentityAttribute(attribute._id,(attribute as IdentityAttribute).pointerType,null,attribute.hidden)
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
    constructor(_id: string,name:string,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'boolean',belongsToColumn,hidden)
    }
}

class dateAttribute extends Attribute{
    constructor(_id: string,name:string,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'date',belongsToColumn,hidden)
    }
}

class numberAttribute extends Attribute{
    constructor(_id: string,name:string,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'number',belongsToColumn,hidden)
    }
}

class enumAttribute extends Attribute{
    enumtypes:string[]//for type enum

    constructor(_id: string,name:string, enumtypes:string[],belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'enum',belongsToColumn,hidden)
        this.enumtypes = enumtypes
    }
}

class TextAttribute extends Attribute{
    constructor(_id: string,name:string,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'text',belongsToColumn,hidden)
    }
}

class IdentityAttribute extends Attribute{
    pointerType:string
    
    constructor(_id: string,pointerType:string,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,'_id', 'id',belongsToColumn,hidden)
        this.pointerType = pointerType
        this.readonly = true
    }
}


class arrayAttribute extends Attribute{
    pointerType:string
    column:string
    constructor(_id: string,name:string,pointerType:string,column:string,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'array',belongsToColumn,hidden)
        this.pointerType = pointerType
        this.column = column
    }
}

class pointerAttribute extends Attribute{
    pointerType:string
    filterOnColumn:string
    constructor(_id: string,name:string,pointerType:string,filterOnColumn:string = null,belongsToColumn:string = null,hidden:boolean = false){
        super(_id,name, 'pointer',belongsToColumn,hidden)
        this.pointerType = pointerType
        this.filterOnColumn = filterOnColumn
    }
}

