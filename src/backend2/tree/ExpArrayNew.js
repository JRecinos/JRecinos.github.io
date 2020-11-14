import { NodoMM } from "./NodoMM";

export const ExpArrayNew = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    if (this.hijos.length == 0) {
      return [];
    }
    let listaExp = this.hijos[0].hijos;
    let val = [];
    let valInicial = listaExp[0].ejecutar();
    let current;
    val.push(valInicial);
    for (let i = 0; i < listaExp.length; i++) {
      current = listaExp[i].ejecutar();
      val.push(current);
      if (typeof valInicial != typeof current) {
        window.errores.push(
          new plantillaError(
            "Semantico",
            "En el array todos deben ser del mismo tipo.",
            decla.location["last_line"],
            decla.location["last_column"]
          )
        );
        return [];
      }
    }
    return val;
  }

  traducir(tipaso) {
    return "strc " + tipaso + "[" + this.hijos[0].traducir() + "]";
  }
};
