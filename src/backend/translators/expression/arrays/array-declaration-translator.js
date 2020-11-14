import { Generator } from "../../../generators/generator";
import { ExpressionTranslator } from "../expression-translator";
import { TranslatorHelpers } from "../../../generators/translator-helpers";

class ArrayTypeTranslator {

    translate(dims) {

        let code = "";

        /**
         * The current variables display the next roles
         *      1. eTranslator evaluates the dimension
         *      2. currCx is the counter we are iterating trough
         *      3. lastCx the last counter so we multiply by it
         *      4. address the current address we are saving at
         *      5. temporaryCx the counter for each new array dim
         */
        let eTranslator = new ExpressionTranslator(this);
        let currCX = Generator.genTemporary(), lastCX = Generator.genTemporary(), address = Generator.genTemporary(),
            lastAddress = Generator.genTemporary(), temporaryCX = Generator.genTemporary(),
            tmpLastCX = Generator.genTemporary();

        code += TranslatorHelpers.unaryAssign("1", lastCX);

        for (let i = 0; i < dims.length; i++) {

            eTranslator.translate(dims[i].getChild(0));
            code += TranslatorHelpers.comment(`Limites de vector ${i}`);
            code += eTranslator.getCode();
            /*
             * THIS PART IS FOR EVERYTHING
             */
            if (i == 0) {

                code += TranslatorHelpers.unaryAssign("H", address);
                code += this.vectorTranslator("H", currCX, eTranslator.temporary, null);

            } else {
                // we create a temporary to store the last address, i.e. the adress where we
                // will save
                // the information of the new array. this will we updated inside the loop

                // we create a temporary counter
                code += TranslatorHelpers.comment("ronda" + i + "\n");
                // code += TranslatorHelpers.moveHeapPointer(1);
                code += TranslatorHelpers.unaryAssign(address, lastAddress);
                code += TranslatorHelpers.comment("last adrress \n");
                code += TranslatorHelpers.arithmeticOperation("+", "1", "H", address);

                let fLoopLabelIn = Generator.genLabel(), fLoopLabelOut = Generator.genLabel(),
                    sLoopLabelIn = Generator.genLabel(), sLoopLabelOut = Generator.genLabel(),
                    tmpCX = Generator.genTemporary();

                code += TranslatorHelpers.unaryAssign(lastCX, tmpLastCX);
                code += TranslatorHelpers.generateLabel(fLoopLabelIn);
                code += TranslatorHelpers.conditionalJMP("==", tmpLastCX, "0", fLoopLabelOut);
                code += TranslatorHelpers.arithmeticOperation("+", lastAddress, "1", lastAddress);
                code += TranslatorHelpers.comment("Aqui se asigna el contador actual al temporal\n");
                code += TranslatorHelpers.unaryAssign(currCX, tmpCX);
                code += TranslatorHelpers.generateLabel(sLoopLabelIn);
                code += TranslatorHelpers.conditionalJMP("==", tmpCX, "0", sLoopLabelOut);
                code += TranslatorHelpers.moveHeapPointer(1);
                code += this.vectorTranslator("H", temporaryCX, eTranslator.temporary, lastAddress);
                code += TranslatorHelpers.arithmeticOperation("+", lastAddress, "1", lastAddress);
                code += TranslatorHelpers.arithmeticOperation("-", tmpCX, "1", tmpCX);
                code += TranslatorHelpers.inconditionalJMP(sLoopLabelIn);
                code += TranslatorHelpers.generateLabel(sLoopLabelOut);
                code += TranslatorHelpers.arithmeticOperation("-", tmpLastCX, "1", tmpLastCX);
                code += TranslatorHelpers.inconditionalJMP(fLoopLabelIn);
                code += TranslatorHelpers.generateLabel(fLoopLabelOut);
                code += TranslatorHelpers.arithmeticOperation("*", lastCX, currCX, lastCX);
                code += TranslatorHelpers.unaryAssign(temporaryCX, currCX);
                code += TranslatorHelpers.comment("ULTIMA LINEA DE RONDA " + i + " \n");
            }
        }

        return code;

    }

    vectorTranslator(pHelper, currCX, maxT, vPos) {

        let code = "";

        /**
         * 0. El apuntador actual ya se encuentra en la posición de inicio -----------
         * 1. Coloca el mínimo en el heap --------------------------------------------
         * 2. Coloca el tamaño en la siguiente posición al mínimo --------------------
         * 3. Si hay un VPos (osea no es sólo una dim), guarda el h en esa pos -------
         * 4. Mueve el apuntador
         */
        if (vPos != null)
            code += TranslatorHelpers.generateHeapAssign(vPos, "H");

        code += TranslatorHelpers.unaryAssign(maxT, currCX);
        code += TranslatorHelpers.generateHeapAssign(pHelper, currCX);
        code += TranslatorHelpers.arithmeticOperation("+", "H", currCX, "H");
        return code;
    }
}

export const ArrayDeclarationTranslator = new ArrayTypeTranslator();