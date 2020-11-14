import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
import { VariableStructura } from "../estructuras/variable-structura";
export const Recursivo = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let current;
    for (let i = 0; i <= this.hijos.length - 1; i++) {
      switch (this.hijos[i].token) {
        case "ID":
          if (i == 0) {
            current = window.tablaSimbolos.buscarVariableSoloNombre(
              this.hijos[i].texto
            );
            if (!current) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Variable <<" +
                    this.hijos[i].texto +
                    ">> no econtrada. Se retorno 0 para recuperar.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            if (current.asigIndice > 1) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Variable <<" +
                    this.hijos[i].texto +
                    ">> no se puede acceder ya que no se definio.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            current = current;
          } else {
            //aca es atributo de un objeto
            if (current.rol != "tipo") {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Desea acceder a atributo en <<" +
                    current.nombre +
                    ">> pero no es un tipo.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            if (current == null || current == undefined) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Tipo <<" + current.nombre + ">> no esta definido.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            let aux = current.valor.buscarAtributo(this.hijos[i].texto);
            if (!aux) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Atributo <<" + this.hijos[i].texto + ">> no existe.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            current = aux;
          }
          break;
        case "LENGTH":
          if (current.rol != "array") {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Desea acceder a posiciones en <<" +
                  current.nombre +
                  ">> pero no es un arreglo.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (current.valor == null || current.valor == undefined) {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Imposible acceder a arreglo <<" +
                  current.nombre +
                  ">> no esta definido.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          current = new VariableStructura(
            "let",
            current.nombre,
            current.valor.length,
            "number",
            "variable",
            0,
            1
          );
          break;
        case "POP":
          if (current.rol != "array") {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Desea acceder a posiciones en <<" +
                  current.nombre +
                  ">> pero no es un arreglo.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (current.valor == null || current.valor == undefined) {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Imposible acceder a arreglo <<" +
                  current.nombre +
                  ">> no esta definido.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          current = new VariableStructura(
            "let",
            current.nombre,
            current.valor.pop(),
            "number",
            "variable",
            0,
            1
          );
          break;
        case "PUSH":
          if (current.rol != "array") {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Desea acceder a posiciones en <<" +
                  current.nombre +
                  ">> pero no es un arreglo.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (current.valor == null || current.valor == undefined) {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Imposible acceder a arreglo <<" +
                  current.nombre +
                  ">> no esta definido.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          let pusVal = this.hijos[i].hijos[0].ejecutar();
          if (this.getTipo(current.valor) != this.getTipo(pusVal)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No se puede hacer push a <<" +
                  current.nombre +
                  ">> tipos (" +
                  current.tipo +
                  ", " +
                  this.getTipo(pusVal) +
                  ") no compatibles.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          current.valor.push(pusVal);
          current = new VariableStructura(
            "let",
            "auxtmp",
            0,
            "number",
            "variable",
            0,
            1
          );
          break;
        case "LISTAACCESODIMS":
          if (current.rol != "array") {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Desea acceder a posiciones en <<" +
                  current.nombre +
                  ">> pero no es un arreglo.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (current.valor == null || current.valor == undefined) {
            //tirar erro solo se pude con arreglos
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Imposible acceder a arreglo <<" +
                  current.nombre +
                  ">> no esta definido.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (current.dimensiones < this.hijos[i].hijos.length) {
            //tirar error mas dimensiones de las que posee
            window.errores.push(
              new plantillaError(
                "Semantico",
                "El arreglo <<" +
                  current.nombre +
                  ">> es de " +
                  current.dimensiones +
                  " dimensiones y se quiere acceder a " +
                  this.hijos[i].hijos.length +
                  ".",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          let listaDims = [];
          let auxDim;
          for (let j = 0; j < this.hijos[i].hijos.length; j++) {
            auxDim = this.hijos[i].hijos[j].ejecutar();
            if (!Number.isInteger(auxDim)) {
              //tirar error de que se accede a dimension con algo no entero
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Solo se puede acceder a posicion por medio de ENTEROS.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            listaDims.push(auxDim);
          }
          let auxVar;
          let str = "";
          //let guardar = current;
          //current = current.valor[0];
          //current[0] = 22;
          //current = guardar;
          for (let j = 0; j < listaDims.length; j++) {
            auxVar = current.valor[listaDims[j]];
            str += "[" + listaDims[j] + "]";
            if (
              auxVar == null ||
              auxVar == undefined ||
              (j < listaDims.length - 1 && auxVar.constructor.name != "Array")
            ) {
              //tirar error porque solo se puede iterar en un array
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "En arreglo <<" +
                    current.nombre +
                    ">> se intenta acceder a una dimension que no esta definida (" +
                    str +
                    ").",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            current = new VariableStructura(
              "let",
              current.nombre,
              auxVar,
              current._tipo,
              this.getRol(auxVar),
              current.dimensiones
            );
          }
          break;
        default:
          break;
      }
    }
    return current.valor;
  }

  getRol(_tipo) {
    if (
      typeof _tipo == "number" ||
      typeof _tipo == "string" ||
      typeof _tipo == "boolean" ||
      typeof _tipo == "undefined" ||
      typeof _tipo == "null"
    ) {
      return "variable";
    }
    if (typeof _tipo == "object") {
      if (_tipo.constructor.name == "Array") {
        return "array";
      } else {
        return "tipo";
      }
    }
    return "variable";
  }

  getTipo(_tipo) {
    if (typeof _tipo == "number") {
      return "number";
    }
    if (typeof _tipo == "string") {
      return "string";
    }
    if (typeof _tipo == "boolean") {
      return "boolean";
    }
    if (typeof _tipo == "undefined") {
      return "undefined";
    }
    if (typeof _tipo == "null") {
      return "null";
    }
    if (typeof _tipo == "void") {
      return "void";
    }
    if (_tipo.constructor.name == "Objeto") {
      //retornar el nombre del objeto, el array es tipo no rol
      return _tipo.getTipaso();
    }
    if (_tipo.constructor.name == "Array") {
      let current = _tipo;
      while (Array.isArray(current)) {
        current = current[0];
      }
      return typeof current;
    }
    //meter los tipos de los objetos
    return "undefined";
  }

  traducir() {
    let str = "";
    for (let i = 0; i < this.hijos.length; i++) {
      switch (this.hijos[i].token) {
        case "ID":
          str += i == 0 ? this.hijos[i].texto : "." + this.hijos[i].texto;
          break;
        case "LISTAACCESODIMS":
          for (let j = 0; j < this.hijos[i].hijos.length; j++) {
            str += "[" + this.hijos[i].hijos[j].traducir() + "]";
          }
          break;
        case "LENGTH":
          str += ".length";
          break;
        case "POP":
          str += ".pop()";
          break;
        case "PUSH":
          str += ".push(" + this.hijos[i].hijos[0].traducir() + ")";
          break;
        case "TOLOWER":
          str += ".toLowerCase()";
          break;
        case "TOUPPER":
            str += ".toUpperCase()";
            break;
        default:
      }
    }
    return str;
  }
};
