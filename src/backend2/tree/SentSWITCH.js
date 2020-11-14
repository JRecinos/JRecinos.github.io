import { NodoMM } from "./NodoMM";

export const SentSWITCH = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let condRaiz = this.hijos[0].ejecutar();
    let aDarle = false;
    let cond;
    let listaCase = this.hijos[1].hijos[0];

    window.indiceLoops = window.indiceLoops + 1;
    window.tablaSimbolos.meterAmbitoDebil();
    for (let i = 0; i < listaCase.hijos.length; i++) {
      cond = listaCase.hijos[i].hijos[0].ejecutar();
      if (condRaiz == cond) {
        aDarle = true;
      }
      if (aDarle) {
        let sent = listaCase.hijos[i].hijos[1].ejecutar();
        if (
          typeof sent == "object" &&
          sent.constructor.name == "EscapeEstructura" &&
          sent.nombre == "break"
        ) {
          break;
        }
        if (
          typeof sent == "object" &&
          sent.constructor.name == "EscapeEstructura" &&
          sent.nombre == "return"
        ) {
          return sent;
        }
      }
    }
    if (!aDarle) {
      let sent = this.hijos[1].hijos[1].ejecutar();
      if (
        typeof sent == "object" &&
        sent.constructor.name == "EscapeEstructura" &&
        sent.nombre == "return"
      ) {
        return sent;
      }
    }

    window.tablaSimbolos.sacarAmbitoDebil();
    window.indiceLoops = window.indiceLoops - 1;
  }

  traducir() {
    let str = "switch (" + this.hijos[0].traducir() + "){\n";
    let listaCase = this.hijos[1].hijos[0];
    for (let i = 0; i < listaCase.hijos.length; i++) {
      str += "case " + listaCase.hijos[i].hijos[0].traducir() + ":\n";
      str += listaCase.hijos[i].hijos[1].traducir();
    }
    str += "default: \n";
    str += this.hijos[1].hijos[1].traducir();
    str += "}";
    return str;
  }
};
