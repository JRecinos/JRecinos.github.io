//import { tree_types } from "../ast/tree-types";
import { CompilerTypesNames } from "../compiler-types";
import { Backend } from '../backend';

export class SymImp {

    constructor(...args) {
        this.identifier = args[0];
        this.rol = args[1];
        this.type = args[2];
        this.scope = args[3];
        this.position = args[4]
        this.auxType = args[5]
        this.params = args[6];
        this.dimensions = args[7];
        this.modifiers = args[8] || null;
        this.code = args[9];
        this.constant = (this.modifiers) ? this.modifiers.final : false;
        this.temporary = null;
        this.code = null;
        this.symbols = null;
    }

    getIdentifier() {
        return this.identifier;
    }

    setIdentifier(identifier) {
        this.identifier = identifier;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position) {
        this.position = position;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getRol() {
        return this.rol;
    }

    setRol(rol) {
        this.rol = rol;
    }

    getDimensions() {
        return this.dimensions;
    }

    setDimensions(dimensions) {
        this.dimensions = dimensions;
    }

    getParameters() {
        return this.params;
    }

    setAuxType(aux) {
        this.auxType = aux;
    }

    setParameters(parameters) {
        this.params = parameters;
    }

    getNode() {
        return this.node;
    }

    getAuxType() {
        return this.auxType;
    }

    copy() {
        let symbol = new SymImp(this.identifier,
            this.rol,
            this.type,
            this.scope,
            this.position,
            this.auxType,
            (this.params != null ? [...this.params] : null),
            this.dimensions);
        this.symbol.constant = this.constant;
        this.symbol.container = this.container;
    }

    setConstant() {
        this.constant = true;
    }

    isConstant() {
        return this.constant;
    }

    setContainer(cont) {
        this.container = cont;
    }

    getContainer() {
        return this.container;
    }

    getScope() {
        return this.scope;
    }

    setScope(scope) {
        this.scope = scope;
    }

    setTemporary(tmp) {
        this.temporary = tmp;
    }

    setCode(code) {
        this.code = code;
    }

    getTemporary() {
        return this.temporary;
    }

    getCode() {
        return this.code;
    }

    jsonify() {

        let jObject = {};

        // "identifier","position","type", "rol","constant","dimensions", "parameters"
        jObject["identifier"] = this.identifier;
        jObject["position"] = (this.position != "-") ? "+" + this.position : this.position;
        jObject["type"] = CompilerTypesNames[this.type];
        jObject["aux-type"] = (this.auxType == null) ? "-" : Backend.Classes.reverseMap(this.auxType);
        jObject["rol"] = CompilerTypesNames[this.rol];
        jObject["constant"] = this.constant;
        jObject["scope"] = this.scope;
        jObject["dimensions"] = this.dimensions == null ? '-' : this.dimensions;
        jObject["parameters"] = this.params == null ? '-' : this.params.length;

        //console.log(jObject);

        return jObject;
    }

    setSymbols(symbol) {
        this.symbols = symbol;
    }

    getSymbols() {
        return this.symbols;
    }
}