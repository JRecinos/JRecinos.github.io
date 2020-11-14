import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
import { AtributoEstructura } from "../estructuras/atributo-estructura";
export const DeclaFuncion = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }
  ejecutar() {}
  ejecutar2() {
    let nombre = this.hijos[0].texto;
    let tipo = this.hijos[2].texto;
    let dims = this.hijos[3].hijos;
    let sentencias = this.hijos[4];

    if (!this.validarTipo(tipo)) {
      window.errores.push(
        new plantillaError(
          "Semantico",
          "No pudo declararse funcion<<" +
            nombre +
            ">>. El tipo (" +
            tipo +
            ") no existe.",
          this.location["last_line"],
          this.location["last_column"]
        )
      );
      return;
    }

    let params = [];
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      let currentTipoParam = this.hijos[1].hijos[i].hijos[1].texto;
      let currentIdParam = this.hijos[1].hijos[i].hijos[0].texto;
      let currentDimsParam = this.hijos[1].hijos[i].hijos[2].hijos;
      if (!this.validarTipo(currentTipoParam)) {
        window.errores.push(
          new plantillaError(
            "Semantico",
            "No pudo declararse funcion<<" +
              nombre +
              ">>. El tipo (" +
              currentTipoParam +
              ") no existe.",
            this.location["last_line"],
            this.location["last_column"]
          )
        );
        return;
      }
      params.push(
        new AtributoEstructura(
          currentIdParam,
          currentTipoParam,
          currentDimsParam
        )
      );
    }

    if (
      !window.tablaSimbolos.meterFuncion(nombre, params, tipo, sentencias, dims)
    ) {
      window.errores.push(
        new plantillaError(
          "Semantico",
          "Funcion <<" +
            nombre +
            ">> no se pude insertar ya que existe una con la misma firma.",
          this.location["last_line"],
          this.location["last_column"]
        )
      );
    }
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
    if (_tipo == "void") {
      return true;
    }
    let pruebasa = window.tablaObjetos.buscarObjeto(_tipo);
    if (pruebasa) {
      return true;
    }
    return false;
  }

  traducir() {
    let str = "";

    str += ((this.hijos[2].texto.toLowerCase() == "number") ? "double": this.hijos[2].texto);
    for (let j = 0; j < this.hijos[3].hijos; j++) {
      str += "[]";
    }

      str += " " + this.hijos[0].texto +
      //"_" +
      //window.coorelativoFunciones++ +
      " (";
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      str += ((this.hijos[1].hijos[i].hijos[1].texto.toLowerCase() == "number") ? "double": this.hijos[1].hijos[i].hijos[1].texto)
        ;
      for (let j = 0; j < this.hijos[1].hijos[i].hijos[2].hijos; j++) {
        str += "[]";
      } 
      str +=  " " +
        this.hijos[1].hijos[i].hijos[0].texto;
      
      if (i < this.hijos[1].hijos.length - 1) {
        str += ", ";
      }
    }
    str += ")"; 
    str += "{\n" + this.hijos[4].traducir() + "}\n";
    window.strFunciones += str;
    return "";
  }
};
