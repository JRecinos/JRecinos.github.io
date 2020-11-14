import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
export const Sentencias = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    for (let i = 0; i < this.hijos.length; i++) {
      let sent = this.hijos[i].ejecutar();
      if (
        typeof sent == "object" &&
        sent != null &&
        sent.constructor.name == "EscapeEstructura"
      ) {
        return sent;
      }
    }
  }

  ejecutar2() {
    for (let i = 0; i < this.hijos.length; i++) {
      this.hijos[i].ejecutar2();
    }
  }

  ejecutar3() {
    for (let i = 0; i < this.hijos.length; i++) {
      this.hijos[i].ejecutar3();
    }
  }

  traducir() {
    let str = "";
    for (let i = 0; i < this.hijos.length; i++) {
      for (let j = 0; j < window.currentTabs; j++) {
        str += "\t";
      }
      str += this.hijos[i].traducir();
      if (
        this.hijos[i].token == "ASIGNACION" ||
        this.hijos[i].token == "LLAMADARECURSIVA" ||
        this.hijos[i].token == "LLAMADAFUNCION"
      ) {
        str += ";\n";
      } else if (
        this.hijos[i].token == "DECLA" 
      ) {
        str += "";
      } else {
        str += "\n";
      }
    }
    return str;
  }

  declasGlobales() {
    let str = "";
    for (let i = 0; i < this.hijos.length; i++) {
      str += this.hijos[i].declasGlobales();
      if (
        this.hijos[i].token == "DECLA" 
      ) {
        str += "\n";
      } 
    }
    return str;
  }
};
