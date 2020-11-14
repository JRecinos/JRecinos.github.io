import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
export const Condicional = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
    this.parentesis = false;
  }

  ejecutar() {
    switch (this.token) {
      case "AND": {
        let hijo1 = this.hijos[0].ejecutar();
        if (typeof hijo1 != "boolean") {
          window.errores.push(
            new plantillaError(
              "Semantico",
              "No se pude operar " +
                this.texto +
                " con tipo de dato: " +
                typeof hijo1 +
                ".",
              this.location["last_line"],
              this.location["last_column"]
            )
          );

          return false;
        }
        if (hijo1 == false) {
          return false;
        }
        let hijo2 = this.hijos[1].ejecutar();
        if (typeof hijo2 != "boolean") {
          window.errores.push(
            new plantillaError(
              "Semantico",
              "No se pude operar " +
                this.texto +
                " con tipo de dato: " +
                typeof hijo2 +
                ".",
              this.location["last_line"],
              this.location["last_column"]
            )
          );

          return false;
        }
        return hijo2;
      }
      case "OR": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        if (typeof hijo1 != "boolean" || typeof hijo2 != "boolean") {
          window.errores.push(
            new plantillaError(
              "Semantico",
              "No se pude operar " +
                this.texto +
                " con tipo de dato: " +
                typeof hijo1 +
                " y " +
                typeof hijo2 +
                ".",
              this.location["last_line"],
              this.location["last_column"]
            )
          );
          return false;
        }
        return hijo1 || hijo2;
      }
      case "NOT": {
        let hijo1 = this.hijos[0].ejecutar();
        if (typeof hijo1 != "boolean") {
          window.errores.push(
            new plantillaError(
              "Semantico",
              "No se pude operar " +
                this.texto +
                " con tipo de dato: " +
                typeof hijo1 +
                ".",
              this.location["last_line"],
              this.location["last_column"]
            )
          );
          return false;
        }
        return !hijo1;
      }
      default: {
        return false;
      }
    }
  }

  traducir() {
    if(this.parentesis){
      switch (this.token) {
        case "AND": {
          return "(" + this.hijos[0].traducir() + " && " + this.hijos[1].traducir() + ")";
        }
        case "OR": {
          return "(" + this.hijos[0].traducir() + " || " + this.hijos[1].traducir() + ")";
        }
        case "NOT": {
          return "(" + "!" + this.hijos[0].traducir() + ")";
        }
        default: {
          return "";
        }
      }
    }
    switch (this.token) {
      case "AND": {
        return this.hijos[0].traducir() + " && " + this.hijos[1].traducir();
      }
      case "OR": {
        return this.hijos[0].traducir() + " || " + this.hijos[1].traducir();
      }
      case "NOT": {
        return "!" + this.hijos[0].traducir();
      }
      default: {
        return "";
      }
    }
  }
};
