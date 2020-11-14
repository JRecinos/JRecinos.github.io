import { NodoMM } from "./NodoMM";
import { EscapeEstructura } from "../estructuras/escape-estuctura";
export const SentBREAK = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    if (window.indiceLoops <= 0) {
      //tirar error que no esta dentro de un loop
    }
    return new EscapeEstructura("break");
  }

  traducir() {
    return "break;";
  }
};
