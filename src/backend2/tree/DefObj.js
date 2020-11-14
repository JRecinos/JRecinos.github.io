import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
import { AtributoEstructura } from "../estructuras/atributo-estructura";
import { ObjetoEstructura } from "../estructuras/objeto-estructura";
export const DefObj = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {}
  ejecutar2() {}

  ejecutar3() {
    let nombre = this.hijos[0].texto;
    let attrs = [];

    this.hijos[1].hijos.forEach((attr) => {
      if (attr.hijos.length == 2) {
        attrs.push(
          new AtributoEstructura(attr.hijos[0].texto, attr.hijos[1].texto, 0)
        );
      }
      if (attr.hijos.length == 3) {
        attrs.push(
          new AtributoEstructura(
            attr.hijos[0].texto,
            attr.hijos[1].texto,
            attr.hijos[2].hijos
          )
        );
      }
    });

    if (!window.tablaObjetos.meterObjeto(new ObjetoEstructura(nombre, attrs))) {
      window.errores.push(
        new plantillaError(
          "Semantico",
          "Tipo <<" +
            nombre +
            ">> no se puede declarar, ya existe uno con ese nombre.",
          this.location["last_line"],
          this.location["last_column"]
        )
      );
    }
  }

  traducir() {
    let str = "Define " + this.hijos[0].texto + " as [\n";

    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      let attr = this.hijos[1].hijos[i];
      if (attr.hijos.length == 2) {
        str += ((attr.hijos[1].texto.toLowerCase() == "number") ? "double": attr.hijos[1].texto);
        str += " " + attr.hijos[0].texto;
      }
      if (attr.hijos.length == 3) {
        str += ((attr.hijos[1].texto.toLowerCase() == "number") ? "double": attr.hijos[1].texto);
        for (let j = 0; j < attr.hijos[2].hijos; j++) {
          str += "[]";
        }
        str += " " + attr.hijos[0].texto;
      }
      if (i < this.hijos[1].hijos.length - 1) {
        str += ",\n";
      } else {
        str += "\n";
      }
    }
    str += "];\n";
    window.window.strObjetos += str;
    return "";
  }
};
