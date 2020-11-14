import { NodoMM } from "./NodoMM";

export const SentDO = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let cond;
    do {
      window.indiceLoops = window.indiceLoops + 1;
      window.tablaSimbolos.meterAmbitoDebil();
      let sent = this.hijos[1].ejecutar();
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
        sent.nombre == "continue"
      ) {
        continue;
      }
      if (
        typeof sent == "object" &&
        sent.constructor.name == "EscapeEstructura" &&
        sent.nombre == "return"
      ) {
        return sent;
      }
      window.tablaSimbolos.sacarAmbitoDebil();
      window.indiceLoops = window.indiceLoops - 1;
      cond = this.hijos[0].ejecutar();
      if (typeof cond != "boolean") {
        window.errores.push(
          new plantillaError(
            "Semantico",
            "Solo se aceptan valores de falso o verdadero en WHILE.",
            this.location["last_line"],
            this.location["last_column"]
          )
        );
        return;
      }
      if (!cond) {
        break;
      }
    } while (true);
  }

  traducir() {
    let str = "do {\n";
    window.currentTabs++;
    str += this.hijos[1].traducir();
    window.currentTabs--;
    str += "} while (" + this.hijos[0].traducir() + ");";
    return str;
  }
};
