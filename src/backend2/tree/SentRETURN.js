import { NodoMM } from "./NodoMM";
import { EscapeEstructura } from "../estructuras/escape-estuctura";
export const SentRETURN = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    if (this.hijos.length == 1) {
      window.pilaRetornos[
        window.pilaRetornos.length - 1
      ] = this.hijos[0].ejecutar();
    }
    return new EscapeEstructura("return");
  }

  traducir() {
    if (this.hijos.length == 1) {
      return "return " + this.hijos[0].traducir() + ";";
    }
    return "return;";
  }
};
