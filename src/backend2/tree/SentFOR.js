import { NodoMM } from "./NodoMM";

export const SentFOR = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let cond;
    window.tablaSimbolos.meterAmbitoDebil();
    this.hijos[0].ejecutar();
    while (true) {
      cond = this.hijos[1].ejecutar();
      if (typeof cond != "boolean") {
        window.errores.push(
          new plantillaError(
            "Semantico",
            "Solo se aceptan valores de falso o verdadero en FOR.",
            this.location["last_line"],
            this.location["last_column"]
          )
        );
        return;
      }
      if (!cond) {
        break;
      }
      window.indiceLoops = window.indiceLoops + 1;
      window.tablaSimbolos.meterAmbitoDebil();
      let sent = this.hijos[3].ejecutar();
      this.hijos[2].ejecutar();
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
    }
    window.tablaSimbolos.sacarAmbitoDebil();
  }

  traducir() {
    let str ="";

    if(this.token == "FOR"){
      str = "for(" +
      this.hijos[0].traducirFOR() +
      " " +
      this.hijos[1].traducir() +
      "; " +
      this.hijos[2].traducir() +
      "){\n";
    window.currentTabs++;
    str += this.hijos[3].traducir();
    window.currentTabs--;
    str += "}";
    }else{
      let aux = window.forincorrelativo++;
      str = "var arraux" + aux + " := " + this.hijos[1].traducir() + ";\n";
      str += "for( integer idx = 0; idx < arraux"  + aux + ".length; idx++){\n"+
      "var " + this.hijos[0] + " := arraux" + aux + "[idx];\n" ;      
      window.currentTabs++;
      str += this.hijos[2].traducir();
      window.currentTabs--;
      str += "}";
    }
      

    return str;
  }
};
