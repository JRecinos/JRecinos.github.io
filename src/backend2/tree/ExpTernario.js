import { NodoMM } from "./NodoMM";

export const ExpTernario = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let cond = this.hijos[0].ejecutar();
    let aux;
    if (cond == true) {
      aux = this.hijos[1].ejecutar();
      return aux;
    } else {
      aux = this.hijos[2].ejecutar();
      return aux;
    }
  }

  traducir() {
    return (
      this.hijos[0].traducir() +
      " ? " +
      this.hijos[1].traducir() +
      " : " +
      this.hijos[2].traducir()
    );
  }
};
