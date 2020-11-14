import { Translator } from '../translator';

export class StmtBaseTranslator extends Translator {

    constructor(parent) {
        super(parent);
        this.siguiente = null;
    }

    setSiguiente(label) {
        this.siguiente = label;
    }
}