import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
export const Expresion = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
    this.parentesis = false;
  }

  ejecutar() {
    switch (this.token) {
      case "MAS": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo2, "MAS");
        if (res == null) {
        }
        return res;
      }
      case "MENOS": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo2, "MENOS");
        return res;
      }
      case "POR": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo2, "POR");
        return res;
      }
      case "DIV": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo2, "DIV");
        return res;
      }
      case "POTENCIA": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo2, "POTENCIA");
        return res;
      }
      case "MODULO": {
        let hijo1 = this.hijos[0].ejecutar();
        let hijo2 = this.hijos[1].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo2, "MODULO");
        return res;
      }
      case "NEGADO": {
        let hijo1 = this.hijos[0].ejecutar();
        let res = this.comprobarOperacion(hijo1, hijo1, "NEGADO");
        return res;
      }
      case "NUMERICO": {
        return Number(this.texto);
      }
      case "STRING": {
        return String(this.texto);
      }
      case "BOOLEAN": {
        return this.texto.toLowerCase() == "true" ? true : false;
      }
      case "NULL": {
        return null;
      }
      case "UNDEFINED": {
        return undefined;
      }
      default: {
        return 0;
      }
    }
  }

  traducir() {
    if(this.parentesis){
      switch (this.token) {
        case "MAS": {
          return "(" + this.hijos[0].traducir() + " + " + this.hijos[1].traducir() + ")";
        }
        case "MENOS": {
          return "(" +this.hijos[0].traducir() + " - " + this.hijos[1].traducir() + ")";
        }
        case "POR": {
          return "(" +this.hijos[0].traducir() + " * " + this.hijos[1].traducir() + ")";
        }
        case "DIV": {
          return "(" +this.hijos[0].traducir() + " / " + this.hijos[1].traducir() + ")";
        }
        case "POTENCIA": {
          return "(" +this.hijos[0].traducir() + " ^^ " + this.hijos[1].traducir() + ")";
        }
        case "MODULO": {
          return "(" +this.hijos[0].traducir() + " % " + this.hijos[1].traducir() + ")";
        }
        case "NEGADO": {
          return "(" + "-" + this.hijos[0].traducir() + ")";
        }
        case "NUMERICO": {
          return "(" + this.texto + ")";
        }
        case "NUMERICOE": {
          return "(" + this.texto + ".0)";
        }
        case "STRING": {
          return "(" + '"' + this.texto + '"' + ")";
        }
        case "BOOLEAN": {
          return this.texto.toLowerCase() == "true" ? "(" +"true" + ")": "(" +"false" + ")";
        }
        case "NULL": {
          return "(" + "null" + ")";
        }
        case "UNDEFINED": {
          return "(" + "undefined" + ")";
        }
        default: {
          return "";
        }
      }
    }
    switch (this.token) {
      case "MAS": {
        return this.hijos[0].traducir() + " + " + this.hijos[1].traducir();
      }
      case "MENOS": {
        return this.hijos[0].traducir() + " - " + this.hijos[1].traducir();
      }
      case "POR": {
        return this.hijos[0].traducir() + " * " + this.hijos[1].traducir();
      }
      case "DIV": {
        return this.hijos[0].traducir() + " / " + this.hijos[1].traducir();
      }
      case "POTENCIA": {
        return this.hijos[0].traducir() + " ^^ " + this.hijos[1].traducir();
      }
      case "MODULO": {
        return this.hijos[0].traducir() + " % " + this.hijos[1].traducir();
      }
      case "NEGADO": {
        return "-" + this.hijos[0].traducir();
      }
      case "NUMERICO": {
        return this.texto;
      }
      case "NUMERICOE": {
        return this.texto+".0";
      }
      case "STRING": {
        return '"' + ((this.texto)? this.texto.replaceAll("\n","\\n").replaceAll("\t","\\t").replaceAll('\"','\\"'): "") + '"';
      }
      case "BOOLEAN": {
        return this.texto.toLowerCase() == "true" ? "true" : "false";
      }
      case "NULL": {
        return "null";
      }
      case "UNDEFINED": {
        return "undefined";
      }
      default: {
        return "";
      }
    }
  }

  comprobarOperacion(hijo1, hijo2, operacion) {
    switch (operacion) {
      case "MAS":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1 + hijo2);
        }
        if (typeof hijo1 === "number" && typeof hijo2 === "string") {
          return String(hijo1 + hijo2);
        }
        if (typeof hijo1 === "string" && typeof hijo2 === "number") {
          return String(hijo1 + hijo2);
        }
        if (typeof hijo1 === "string" && typeof hijo2 === "string") {
          return String(hijo1 + hijo2);
        }
        if (typeof hijo1 === "string" && typeof hijo2 === "boolean") {
          return String(hijo1 + hijo2);
        }
        if (typeof hijo1 === "boolean" && typeof hijo2 === "string") {
          return String(hijo1 + hijo2);
        }
        break;
      case "MENOS":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1 - hijo2);
        }
        return null;
        break;
      case "POR":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1 * hijo2);
        }
        break;
      case "DIV":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1 / hijo2);
        }
        break;
      case "POTENCIA":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1 ** hijo2);
        }
        break;
      case "MODULO":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1 % hijo2);
        }
        break;
      case "NEGADO":
        if (typeof hijo1 === "number" && typeof hijo2 === "number") {
          return Number(hijo1) * -1;
        }
        break;
      default:
        return 0;
        break;
    }
    window.errores.push(
      new plantillaError(
        "Semantico",
        "No se pude operar (" +
          this.texto +
          ") con tipo de dato: " +
          typeof hijo1 +
          " y " +
          typeof hijo2 +
          ".",
        this.location["last_line"],
        this.location["last_column"]
      )
    );
    return 0;
  }

  copyWithChildren() {
    const nodo = new Expresion(this.token, this.texto, this.location, []);
    this.hijos.forEach((item) => nodo.addChild(item.copyWithChildren()));
    return nodo;
  }

  addChild(...args) {
    args.forEach((element) => {
      this.hijos.push(element);
    });
  }
};
