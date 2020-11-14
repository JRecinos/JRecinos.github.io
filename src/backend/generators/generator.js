
class Gen {

    constructor(){
        this.label = 0;
        this.temporary = 0;
        this.functionID = 0;
    }

    genLabel(){
        return `L${this.label++}`;
    }

    genTemporary(){
        return `t${this.temporary++}`;
    }

    reset(){
        this.label       = 0;
        this.temporary   = 0;
        this.functionID = 0;
    }

    getTemporary(){
        return this.temporary;
    }

    genFunctionId(class_name, identifier){
        return `${class_name}_${identifier}_${this.functionID++}`;
    }
}

export const Generator = new Gen();