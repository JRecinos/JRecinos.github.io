import { Objeto } from "../estructuras/objeto";
import { NodoMM } from "./NodoMM";

export const ExpObjeto = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let obj = new Objeto();
    let listaAttrs = [];
    this.hijos.forEach((element) => {
      listaAttrs.push([element.hijos[0].texto, element.hijos[1].ejecutar()]);
    });
    obj.generarObjeto(
      listaAttrs,
      this.location["last_line"],
      this.location["last_column"]
    );
    return obj;
  }

  traducir() {
    let str = "[\n";
    for (let i = 0; i < this.hijos.length; i++) {
      let element = this.hijos[i];
      str += element.hijos[0].texto + " : " + element.hijos[1].traducir();
      if (i < this.hijos.length - 1) {
        str += ",\n";
      } else {
        str += "\n";
      }
    }
    str += "]";
    return str;
  }

  

};
