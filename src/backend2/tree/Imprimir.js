import { NodoMM } from "./NodoMM";

export const Imprimir = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let hijo1;
    let toPrint = "";
    for (let i = 0; i < this.hijos[0].hijos.length; i++) {
      hijo1 = this.hijos[0].hijos[i].ejecutar();
      if (typeof hijo1 === "number") {
        toPrint += String(hijo1);
      }
      if (typeof hijo1 === "string") {
        toPrint += hijo1;
      }
      if (typeof hijo1 == "boolean") {
        toPrint += String(hijo1);
      }
      if (hijo1.constructor.name == "Array") {
        toPrint += "[" + hijo1.toString() + "]";
      }
    }
    window.textoConsola = window.textoConsola.concat(toPrint.split("\n"));
    window.dispatchEvent(
      new CustomEvent("console-changed", { detail: window.textoConsola })
    );
  }

  traducir() {
    let str = "print(";
    for (let i = 0; i < this.hijos[0].hijos.length; i++) {
      str += this.hijos[0].hijos[i].traducir();
      if (i < this.hijos[0].hijos.length - 1) {
        str += ", ";
      }
    }
    str += ', "\\n");';

    return str;
  }
};
