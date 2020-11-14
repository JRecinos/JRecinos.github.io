import { tree_types } from "../../../ast/tree-types";
import { CompilerTypes } from "../../../compiler-types";
import { ExpressionBaseTranslator } from '../../expression/expression-base-translator';
import { Generator } from "../../../generators/generator";
import { TranslatorHelpers } from "../../../generators/translator-helpers";
import { ExpressionTranslator } from "../expression-translator";

export class ArrayLiteralTranslator extends ExpressionBaseTranslator {

  constructor(parent) {
    super(parent);
    this.position_code = "";
    this.access_code = "";
    this.symtab = null;
    this.symbol = null;
  }

  translate(INode /* , SymTabImp symbols */) {
    this.temporary = Generator.genTemporary();
    let tHelper = Generator.genTemporary();

    this.code = TranslatorHelpers.comment('array initialization');
    this.code += TranslatorHelpers.moveHeapPointer(1);
    this.code += TranslatorHelpers.unaryAssign("H", this.temporary);
    this.code += TranslatorHelpers.generateHeapAssign(this.temporary, INode.childrenSize());
    this.code += TranslatorHelpers.moveHeapPointer(INode.childrenSize());

    /**
     * THERE ARE ONLY TWO CASES
     *    1. ARRAY LITERAL
     *    2. LITERAL
     *    3. NEW
     */
    let type = INode.getChild(0).getType();
    let eValues = [];
    let eTranslator = null;

    for (let node of INode.getChildren()) {

      if (node.getType() != type)
        throw `TYPES IN THE ARRAY LITERAL INITIALIZATION ARE NOT THE SAME, UNABLE TO CONTINUE ${this.parseSemanticError(node)}`;

      eTranslator = new ExpressionTranslator(this);
      eTranslator.translate(node);

      eValues.push(eTranslator);

    }

    this.type = eValues[0].getType();
    this.aux_type = eValues[0].getAuxType();
    let dims = eValues[0].dimensions;
    let is_array = eValues[0].is_array;

    for (let i = 1; i < eValues.length; i++)
      if (this.type != eValues[i].getType() || this.aux_type != eValues[i].getAuxType()
        || dims != eValues[1].dimensions || is_array != eValues[i].is_array)
        throw `TYPES IN THE ARRAY LITERAL INITIALIZATION ARE NOT THE SAME, UNABLE TO CONTINUE ${this.parseSemanticError(node)}`;

    /** starting the assign code using the temporary */
    this.code += TranslatorHelpers.arithmeticOperation("+", this.temporary, 1, tHelper);

    for (let j = 0; j < eValues.length; j++) {
      this.code += eValues[j].getCode();
      this.code += TranslatorHelpers.generateHeapAssign(tHelper, eValues[j].temporary);
      if (j != eValues.length - 1)
        this.code += TranslatorHelpers.arithmeticOperation("+", tHelper, 1, tHelper);
    }

    this.is_array = true;
    this.dimensions = 1 + eValues[0].dimensions;

  }
}