import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
import { Declaracion } from "./Declaracion";
import { Expresion } from "./Expresion";

export const ExpLlamadaFuncion = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let nombre = this.hijos[0].texto;
    let paramsVals = [];
    let paramsTipos = [];
    let paramsDims = [];
    let current;
    let retorno = 0;
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      current = this.hijos[1].hijos[i].ejecutar();
      paramsVals.push(current);
      paramsTipos.push(this.getTipo(current));
      paramsDims.push(this.getDimensiones(current));
    }
    let funcion = window.tablaSimbolos.buscarFuncionLlamada(
      nombre,
      paramsTipos,
      paramsDims
    );
    if (funcion == null) {
      window.errores.push(
        new plantillaError(
          "Semantico",
          "No pudo ejecutarse funcion <<" + nombre + ">>. No se encontro.",
          this.location["last_line"],
          this.location["last_column"]
        )
      );
      return 0;
    }

    window.tablaSimbolos.meterAmbitoDebil();
    //armando nodos decla por parametro
    for (let i = 0; i < funcion.params.length; i++) {
      if (this.esTipoNormal(paramsTipos[i])) {
        let currentDecla;

        if (funcion.params[i].dimensiones == 0) {
          currentDecla = new Declaracion("DECLA", "DECLA", this.location, [
            new NodoMM("let", "let", this.location, []),
            new Declaracion("LISTADECLA", "LISTADECLA", this.location, [
              new Declaracion("DECLAVAR1", "DECLAVAR1", this.location, [
                new NodoMM("ID", funcion.params[i].nombre, this.location, []),
                new NodoMM("ID", funcion.params[i].tipo, this.location, []),
                this.getTipo2(paramsVals[i], this.hijos[1].hijos[i]),
              ]),
            ]),
          ]);
        } else {
          currentDecla = new Declaracion("DECLA", "DECLA", this.location, [
            new NodoMM("let", "let", this.location, []),
            new Declaracion("LISTADECLA", "LISTADECLA", this.location, [
              new Declaracion("DECLAARR1", "DECLAARR1", this.location, [
                new NodoMM("ID", funcion.params[i].nombre, this.location, []),
                new NodoMM("ID", funcion.params[i].tipo, this.location, []),
                new NodoMM(
                  "LISTADIMS",
                  "LISTADIMS",
                  this.location,
                  funcion.params[i].dimensiones
                ),
                this.hijos[1].hijos[i],
              ]),
            ]),
          ]);
        }
        currentDecla.ejecutarChafa();
      } else {
        //estoy declarando objeto
        window.tablaSimbolos.meterVariableChafa(
          "let",
          funcion.params[i].nombre,
          paramsVals[i],
          paramsTipos[i],
          "tipo",
          paramsDims[i],
          1
        );
      }
    }

    window.pilaRetornos.push(0);
    window.tablaSimbolos.meterAmbitoFuerte(nombre, funcion.esAnidada);
    window.tablaSimbolos.vaciadoEstructura();
    //ejecutando
    funcion.sentencias.ejecutar2();
    funcion.sentencias.ejecutar();
    retorno = [...window.pilaRetornos];
    retorno = retorno.pop();
    window.pilaRetornos.pop();
    window.tablaSimbolos.sacarAmbitoFuerte();
    return retorno;
  }

  getDimensiones(_val) {
    let dimsCounter = 0;
    let current = _val;
    while (Array.isArray(current)) {
      current = current[0];
      dimsCounter = dimsCounter + 1;
    }
    return dimsCounter;
  }

  getTipo2(_tipo, _nodo) {
    if (typeof _tipo == "number") {
      return new Expresion("NUMERICO", _tipo, this.location, []);
    }
    if (typeof _tipo == "string") {
      return new Expresion("STRING", _tipo, this.location, []);
    }
    if (typeof _tipo == "boolean") {
      return new Expresion("BOOLEAN", _tipo, this.location, []);
    }
    if (typeof _tipo == "undefined") {
      return new Expresion("UNDEFINED", "undefined", this.location, []);
    }
    return _nodo;
  }

  esTipoNormal(_tipo) {
    if (_tipo == "number") {
      return true;
    }
    if (_tipo == "string") {
      return true;
    }
    if (_tipo == "boolean") {
      return true;
    }
    if (_tipo == "undefined") {
      return true;
    }
    return false;
  }

  getTipo(_tipo) {
    if (typeof _tipo == "number") {
      return "number";
    }
    if (typeof _tipo == "string") {
      return "string";
    }
    if (typeof _tipo == "boolean") {
      return "boolean";
    }
    if (typeof _tipo == "undefined") {
      return "undefined";
    }
    if (_tipo == null) {
      return "null";
    }
    if (typeof _tipo == "void") {
      return "void";
    }
    if (_tipo.constructor.name == "Objeto") {
      //retornar el nombre del objeto, el array es tipo no rol
      return _tipo.getTipaso();
    }
    if (_tipo.constructor.name == "Array") {
      let current = _tipo;
      while (Array.isArray(current)) {
        current = current[0];
      }
      return typeof current;
    }
    //meter los tipos de los objetos
    return "undefined";
  }

  traducir() {
    let str = this.hijos[0].texto + "(";
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      str += this.hijos[1].hijos[i].traducir();
      if (i < this.hijos[1].hijos.length - 1) {
        str += ", ";
      }
    }
    str += ")";
    return str;
  }
};
