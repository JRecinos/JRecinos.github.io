import { AmbitoEstructura } from "./ambito-estructura";
import { plantillaError } from "../utilities/plantillaError";
export const Objeto = class {
  constructor() {
    this.tabla = new AmbitoEstructura("");
  }

  buscarAtributo(_nombre) {
    return this.tabla.buscarVariableSoloNombre(_nombre);
  }

  generarObjeto(listaDefiniciones, fila, columna) {
    for (let i = 0; i < listaDefiniciones.length; i++) {
      let nombre = listaDefiniciones[i][0];
      let valor = listaDefiniciones[i][1];
      /////lo de aca lo desconozco
      let tipo = this.getTipo(valor);
      let rol = this.getRol(valor);
      let dimensiones = this.getDimensiones(valor);

      if (!this.validarTipo(tipo)) {
        window.errores.push(
          new plantillaError(
            "Semantico",
            "La variable <<" +
              nombre +
              ">> se declara con tipo (" +
              tipo +
              ") pero ese tipo no existe.",
            fila,
            columna
          )
        );
        return;
      }
      this.tabla.meterVariable("let", nombre, valor, tipo, rol, dimensiones, 1);
    }
  }

  getTipaso() {
    let contarCoincidencias = 0;
    let aux = "objeto";
    let lista = window.tablaObjetos.getLista();
    for (let i = 0; i < lista.length; i++) {
      if (this.comprobarElTipo(lista[i].nombre)) {
        contarCoincidencias = contarCoincidencias + 1;
        aux = lista[i].nombre;
      }
    }
    if (contarCoincidencias == 1) {
      return aux;
    }
    return "objeto";
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

  comprobarCoincidenciaTipos(_enum, _tipo) {
    if (_tipo == null || _tipo == undefined) {
      return true;
    }
    if (_enum == "null" || _enum == "undefined") {
      return true;
    }
    if (_enum == "number" && typeof _tipo == "number") {
      return true;
    }
    if (_enum == "string" && typeof _tipo == "string") {
      return true;
    }
    if (_enum == "boolean" && typeof _tipo == "boolean") {
      return true;
    }
    if (typeof _tipo == "object") {
      if (_tipo.constructor.name == "Array") {
        let current = _tipo;
        while (current.constructor.name == "Array") {
          let llaves = Array.from(current.keys());
          if (llaves.length == 0) {
            return true;
          }
          current = current[llaves[0]];
        }
        return this.comprobarCoincidenciaTipos(_enum, current);
      }
      //comprobar con el nombre del objeto
    }
    return false;
  }

  comprobarElTipo(_nombre) {
    let objStructure = window.tablaObjetos.buscarObjeto(_nombre);
    if (!objStructure) {
      return false;
    }
    let listaAttrs = objStructure.listaAttrs;
    if (listaAttrs.length != this.tabla.getVarLength()) {
      return false;
    }

    for (let i = 0; i < listaAttrs.length; i++) {
      let definicion = this.tabla.buscarVariableSoloNombre(
        listaAttrs[i].nombre
      );
      if (!definicion) {
        return false;
      }
      if (definicion.valor == null || definicion.valor == undefined) {
        return true;
      }
      if (definicion.dimensiones != listaAttrs[i].dimensiones) {
        return false;
      }
      if (definicion.tipo == "objeto") {
        let subDefincion = definicion.valor.comprobarElTipo(listaAttrs[i].tipo);
        if (!subDefincion) {
          return false;
        }
        definicion.tipo = listaAttrs[i].tipo;
      }
      if (definicion.tipo != listaAttrs[i].tipo) {
        return false;
      }
    }
    return true;
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

  getRol(_tipo) {
    if (
      typeof _tipo == "number" ||
      typeof _tipo == "string" ||
      typeof _tipo == "boolean" ||
      typeof _tipo == "undefined" ||
      _tipo == null
    ) {
      return "variable";
    }
    if (typeof _tipo == "object") {
      if (_tipo.constructor.name == "Array") {
        return "array";
      } else {
        return "tipo";
      }
    }
    return "variable";
  }

  validarTipo(_tipo) {
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
    if (_tipo == "null") {
      return true;
    }
    let pruebasa = window.tablaObjetos.buscarObjeto(_tipo);
    if (pruebasa) {
      return true;
    }
    return false;
  }
};
