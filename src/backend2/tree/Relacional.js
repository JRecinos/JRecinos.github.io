import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
export const Relacional = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
    this.parentesis = false;
  }

  ejecutar() {
    switch (this.token) {
      case "MAYOR": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        if (typeof hijo1 != "number" || typeof hijo2 != "number") {
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
        return hijo1 > hijo2;
      }
      case "MENOR": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        if (typeof hijo1 != "number" || typeof hijo2 != "number") {
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
        return hijo1 < hijo2;
      }
      case "MAYOROIGUAL": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        if (typeof hijo1 != "number" || typeof hijo2 != "number") {
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
        return hijo1 >= hijo2;
      }
      case "MENOROIGUAL": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        if (typeof hijo1 != "number" || typeof hijo2 != "number") {
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
        return hijo1 <= hijo2;
      }
      case "IGUALIGUAL": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        return hijo1 == hijo2;
      }
      case "DIFERENTE": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        return hijo1 != hijo2;
      }
      default: {
        return false;
      }
    }
  }

  traducir() {
    if(this.parentesis){
      switch (this.token) {
        case "MAYOR": {
          return "(" + this.hijos[0].traducir() + " > " + this.hijos[1].traducir() + ")";
        }
        case "MENOR": {
          return "(" + this.hijos[0].traducir() + " < " + this.hijos[1].traducir() + ")";
        }
        case "MAYOROIGUAL": {
          return "(" + this.hijos[0].traducir() + " >= " + this.hijos[1].traducir() + ")";
        }
        case "MENOROIGUAL": {
          return "(" + this.hijos[0].traducir() + " <= " + this.hijos[1].traducir() + ")";
        }
        case "IGUALIGUAL": {
          return "(" + this.hijos[0].traducir() + " == " + this.hijos[1].traducir() + ")";
        }
        case "DIFERENTE": {
          return "(" + this.hijos[0].traducir() + " != " + this.hijos[1].traducir() + ")";
        }
        default: {
          return "";
        }
      }

    }
    switch (this.token) {
      case "MAYOR": {
        return this.hijos[0].traducir() + " > " + this.hijos[1].traducir();
      }
      case "MENOR": {
        return this.hijos[0].traducir() + " < " + this.hijos[1].traducir();
      }
      case "MAYOROIGUAL": {
        return this.hijos[0].traducir() + " >= " + this.hijos[1].traducir();
      }
      case "MENOROIGUAL": {
        return this.hijos[0].traducir() + " <= " + this.hijos[1].traducir();
      }
      case "IGUALIGUAL": {
        return this.hijos[0].traducir() + " == " + this.hijos[1].traducir();
      }
      case "DIFERENTE": {
        return this.hijos[0].traducir() + " != " + this.hijos[1].traducir();
      }
      default: {
        return "";
      }
    }
  }
};
