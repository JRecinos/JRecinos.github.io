import { NodoMM } from "./NodoMM";

export const GraficarTS = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let toPrint = window.tablaSimbolos.graficarTabla().split("\n");
    window.textoConsola = window.textoConsola.concat(toPrint);
    window.dispatchEvent(
      new CustomEvent("console-changed", { detail: window.textoConsola })
    );
  }

  traducir() {
    return "graficar_ts();";
  }
};
