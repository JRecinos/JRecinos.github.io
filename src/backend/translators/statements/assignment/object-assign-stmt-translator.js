import { Translator } from '../../translator';
import { ExpressionTranslator } from '../../expression/expression-translator';
import { Generator } from '../../../generators/generator';
import { TranslatorHelpers } from '../../../generators/translator-helpers';
import { CompilerTypes } from '../../../compiler-types';

export class ObjectAssignStmtTranslator extends Translator {

    constructor(parent) {
        super(parent);
    }

    translate(INode, symbol){

        this.iNode = INode;

        let rol = symbol.getRol();

        let eTranslator = new ExpressionTranslator(this);
        eTranslator.translate(INode.getChild(1));

        let code = "";
        let temporary = Generator.genTemporary();

        // Para una asignación de un objeto sólo pueden haber 4 posibilidades, a decir:
        // 1. Objeto nulo
        // 2. Otro objeto o Una función que devuelva ese tipo
        // 3. Malloc

        if (eTranslator.getType() == CompilerTypes.NULL) {

            if (rol == CompilerTypes.GLOBAL) {
                code += TranslatorHelpers.unaryAssign(symbol.getPosition(), temporary);
                code += TranslatorHelpers.generateHeapAssign(temporary, "0");
            } else if (rol == CompilerTypes.VARIABLE) {
                // we should check
                code += TranslatorHelpers.arithmeticOperation("+", "P", symbol.getPosition() + "", temporary);
                code += TranslatorHelpers.generateHeapAssign(temporary, "0");
            } else if (rol == CompilerTypes.REF_PARAM) {
                // we should check where the information is stored
                code += TranslatorHelpers.arithmeticOperation("+", "P", symbol.getPosition() + "", temporary);
                code += TranslatorHelpers.generateStackAccess(temporary, temporary);
                code += TranslatorHelpers.generateHeapAssign(temporary, "0");
            } else if (rol == CompilerTypes.VAL_PARAM)
                throw new Exception("OBJECTS CAN NOT BE PASSED BY VALUE.");

        } else if (eTranslator.getType() == CompilerTypes.OBJECT
                && eTranslator.getauxType() == symbol.getauxType()) {

            code += eTranslator.getCode();
            if (symbol.getRol() == CompilerTypes.FUNCTION) {

                // TODO: check if there is a function in the dipslay helper
                if (Display.FunctionCallStack.empty()
                        || Display.FunctionCallStack.peek()[0].toString().compareTo(symbol.getIdentifier()) != 0)
                    throw new Exception("UNABLE TO ASSIGN TO A FUNCTION" + this.parseSemanticError(this.iNode));
                code += TranslatorHelpers.unaryAssign("P", temporary);
                code += TranslatorHelpers.generateStackAssign(temporary, eTranslator.getTemporary());

            } else if (symbol.getRol() == CompilerTypes.PROCEDURE)
                throw new Exception("CAN'T ASSIGN A VALUE TO A PROCEDURE" + this.parseSemanticError(this.iNode)
                        + this.parseSemanticError(this.iNode));
            else if (rol == CompilerTypes.GLOBAL) {
                code += TranslatorHelpers.unaryAssign(symbol.getPosition() + "", temporary);
                code += TranslatorHelpers.generateHeapAssign(temporary, eTranslator.getTemporary());
            } else if (rol == CompilerTypes.VARIABLE) {
                code += TranslatorHelpers.arithmeticOperation("+", "P", symbol.getPosition() + "", temporary);
                code += TranslatorHelpers.generateStackAssign(temporary, eTranslator.getTemporary());
            } else if (rol == CompilerTypes.REF_PARAM) {
                code += TranslatorHelpers.generateByRefAssign(symbol.getPosition(), eTranslator.getTemporary());
            } else if (rol == CompilerTypes.VAL_PARAM)
                throw new Exception("YOU CANT PASS OBJECTS BY VALUE.");
        } else if (eTranslator.getType() == CompilerTypes.VOID) {
            // we check if there is something in the DisplayHelper
            if (Backend.Display.NativeFunc.empty())
                throw new Exception("YOU CAN NOT ASSIGN A TYPE VOID TO A VARIABLE OF TYPE REGISTER"
                        + this.parseSemanticError(this.iNode));
            else {
                let size = Backend.Display.NativeFunc.pop();
                // symbol.setInMemory(true);
                // symbol.setSymbols(Backend.RecordsTemplates.get(symbol.getauxType()).copy());

                code += TranslatorHelpers.moveHeapPointer(1);
                if (rol == CompilerTypes.GLOBAL) {
                    code += TranslatorHelpers.unaryAssign(symbol.getPosition() + "", temporary);
                    code += TranslatorHelpers.generateHeapAssign(temporary, "H");
                } else if (rol == CompilerTypes.VARIABLE) {
                    code += TranslatorHelpers.arithmeticOperation("+", "P", symbol.getPosition() + "", temporary);
                    code += TranslatorHelpers.generateStackAssign(temporary, "H");
                } else if (rol == CompilerTypes.REF_PARAM) {
                    code += TranslatorHelpers.generateByRefAssign(symbol.getPosition(), "H");
                } else if (rol == CompilerTypes.VAL_PARAM)
                    throw new Exception("CAN'T PASS AN OBJECT BY VALUE" + this.parseSemanticError(this.iNode));

                for (let i = 0; i < size - 1; i++) {
                    code += TranslatorHelpers.generateHeapAssign("H", "0");
                    code += TranslatorHelpers.moveHeapPointer(1);
                }
            }
        }
        this.setCode(code);
    }

}