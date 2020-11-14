import { NodoMM } from "./NodoMM";

export const SentIF = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let cond = false;
    for (let i = 0; i < this.hijos.length; i++) {
      if (this.hijos[i].token == "IF" || this.hijos[i].token == "IFELSE") {
        cond = this.hijos[i].hijos[0].ejecutar();
        if (typeof cond != "boolean") {
          window.errores.push(
            new plantillaError(
              "Semantico",
              "Solo se aceptan valores de falso o verdadero en IF.",
              this.location["last_line"],
              this.location["last_column"]
            )
          );
          return;
        }
        if (cond == true) {
          window.tablaSimbolos.meterAmbitoDebil();
          let sent = this.hijos[i].hijos[1].ejecutar();
          window.tablaSimbolos.sacarAmbitoDebil();
          return sent;
        }
      }
      if (this.hijos[i].token == "else") {
        window.tablaSimbolos.meterAmbitoDebil();
        let sent = this.hijos[i].hijos[0].ejecutar();
        window.tablaSimbolos.sacarAmbitoDebil();
        return sent;
      }
    }
  }

  traducir() {
    let str = "";
    for (let i = 0; i < this.hijos.length; i++) {
      if (this.hijos[i].token == "IF") {
        str += "if (" + this.hijos[i].hijos[0].traducir() + "){\n";
        window.currentTabs++;
        str += this.hijos[i].hijos[1].traducir();
        window.currentTabs--;
        str += "}";
      }
      if (this.hijos[i].token == "IFELSE") {
        str += "else if (" + this.hijos[i].hijos[0].traducir() + "){\n";
        window.currentTabs++;
        str += this.hijos[i].hijos[1].traducir();
        window.currentTabs--;
        str += "}";
      }
      if (this.hijos[i].token == "else") {
        str += "else {\n";
        window.currentTabs++;
        str += this.hijos[i].hijos[0].traducir();
        window.currentTabs--;
        str += "}";
      }
    }
    return str;
  }
};
