import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
import { VariableStructura } from "../estructuras/variable-structura";
export const Asignacion = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let nuevoValor = this.hijos[1].ejecutar();
    let current;
    for (let i = 0; i < this.hijos[0].hijos.length - 1; i++) {
      switch (this.hijos[0].hijos[i].token) {
        case "ID":
          if (i == 0) {
            current = window.tablaSimbolos.buscarVariableSoloNombre(
              this.hijos[0].hijos[i].texto
            );
            if (!current) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Variable <<" +
                    this.hijos[0].hijos[i].texto +
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
                    this.hijos[0].hijos[i].texto +
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
            let aux = current.valor.buscarAtributo(
              this.hijos[0].hijos[i].texto
            );
            if (!aux) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "Atributo <<" +
                    this.hijos[0].hijos[i].texto +
                    ">> no existe.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return 0;
            }
            current = aux;
          }
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
          if (current.dimensiones < this.hijos[0].hijos[i].hijos.length) {
            //tirar error mas dimensiones de las que posee
            window.errores.push(
              new plantillaError(
                "Semantico",
                "El arreglo <<" +
                  current.nombre +
                  ">> es de " +
                  current.dimensiones +
                  " dimensiones y se quiere acceder a " +
                  this.hijos[0].hijos[i].hijos.length +
                  ".",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          let listaDims = [];
          let auxDim;
          for (let j = 0; j < this.hijos[0].hijos[i].hijos.length; j++) {
            auxDim = this.hijos[0].hijos[i].hijos[j].ejecutar();
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
    let i = this.hijos[0].hijos.length - 1;
    switch (this.hijos[0].hijos[i].token) {
      case "ID":
        if (i == 0) {
          current = window.tablaSimbolos.buscarVariableSoloNombre(
            this.hijos[0].hijos[i].texto
          );
          if (!current) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Variable <<" +
                  this.hijos[0].hijos[i].texto +
                  ">> no econtrada. Se retorno 0 para recuperar.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (current.asigIndice <= 2) {
            if (!this.comprobarCoincidenciaTipos(current.tipo, nuevoValor)) {
              window.errores.push(
                new plantillaError(
                  "Semantico",
                  "No se puede asignar variable <<" +
                    this.hijos[0].hijos[i].texto +
                    ">> los tipos (" +
                    current.tipo +
                    ", " +
                    typeof nuevoValor +
                    ") no son compatibles.",
                  this.location["last_line"],
                  this.location["last_column"]
                )
              );
              return;
            }
            current.valor = nuevoValor;
            current.tipo = this.getTipo(nuevoValor);
            current.rol = this.getRol(nuevoValor);
            current.dimensiones = this.getDimensiones(nuevoValor);
            return current.valor;
            return;
          }
          if (current.asigIndice == 3) {
            let tipoAux = this.getTipo(nuevoValor);
            let rolAux = this.getRol(nuevoValor);
            let dimensAux = this.getDimensiones(nuevoValor);
            current.valor = nuevoValor;
            current.tipo = tipoAux;
            current.rol = rolAux;
            current.dimensiones = dimensAux;
            current.asigIndice = 1;
            return;
          }
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
          let aux = current.valor.buscarAtributo(this.hijos[0].hijos[i].texto);
          if (!aux) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "Atributo <<" + this.hijos[0].hijos[i].texto + ">> no existe.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          if (!this.comprobarCoincidenciaTipos(aux.tipo, nuevoValor)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No se puede asignar valor a atributo <<" +
                  this.hijos[0].hijos[i].texto +
                  ">> tipos (" +
                  aux.tipo +
                  ", " +
                  typeof nuevoValor +
                  ") no son compatibles.",
                this.location["last_line"],
                this.location["last_column"]
              )
            );
            return 0;
          }
          aux.valor = nuevoValor;
          aux.tipo = this.getTipo(nuevoValor);
          aux.rol = this.getRol(nuevoValor);
          aux.dimensiones = this.getDimensiones(nuevoValor);
          return aux.valor;
          return;
        }
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
        if (current.dimensiones < this.hijos[0].hijos[i].hijos.length) {
          //tirar error mas dimensiones de las que posee
          window.errores.push(
            new plantillaError(
              "Semantico",
              "El arreglo <<" +
                current.nombre +
                ">> es de " +
                current.dimensiones +
                " dimensiones y se quiere acceder a " +
                this.hijos[0].hijos[i].hijos.length +
                ".",
              this.location["last_line"],
              this.location["last_column"]
            )
          );
          return 0;
        }
        let listaDims = [];
        let auxDim;
        for (let j = 0; j < this.hijos[0].hijos[i].hijos.length; j++) {
          auxDim = this.hijos[0].hijos[i].hijos[j].ejecutar();
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
        for (let j = 0; j < listaDims.length - 1; j++) {
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
            current.tipo,
            this.getRol(auxVar),
            current.dimensiones
          );
        }
        if (!this.comprobarCoincidenciaTipos(current.tipo, nuevoValor)) {
          window.errores.push(
            new plantillaError(
              "Semantico",
              "No se puede asignar <<" +
                current.nombre +
                ">> tipos (" +
                current.tipo +
                ", " +
                typeof current[listaDims[listaDims.length - 1]] +
                ") no son compatibles.",
              this.location["last_line"],
              this.location["last_column"]
            )
          );
          return;
        }
        current.valor[listaDims[listaDims.length - 1]] = nuevoValor;
        return current.valor[listaDims[listaDims.length - 1]];
        break;
      default:
        break;
    }
    return;
  }

  getDimensiones(_val) {
    let dimsCounter = 0;
    let current = _val;
    while (Array.isArray(current)) {
      current = current[0];
      dimsCounter = dimsCounter + 1;
    }
    return dimsCounter;
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
    if (_tipo == null) {
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

  getRol(_tipo) {
    if (
      typeof _tipo == "number" ||
      typeof _tipo == "string" ||
      typeof _tipo == "boolean" ||
      typeof _tipo == "undefined" ||
      _tipo == null
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

  comprobarCoincidenciaTipos(_enum, _tipo) {
    if (_tipo == null || _tipo == undefined) {
      return true;
    }
    if (_enum == "null" || _enum == "undefined") {
      return true;
    }
    if (_enum == "number" && typeof _tipo == "number") {
      return true;
    }
    if (_enum == "string" && typeof _tipo == "string") {
      return true;
    }
    if (_enum == "boolean" && typeof _tipo == "boolean") {
      return true;
    }
    if (typeof _tipo == "object") {
      if (_tipo.constructor.name == "Array") {
        let current = _tipo;
        while (current.constructor.name == "Array") {
          let llaves = Array.from(current.keys());
          if (llaves.length == 0) {
            return true;
          }
          current = current[llaves[0]];
        }
        return this.comprobarCoincidenciaTipos(_enum, current);
      }
      if (_tipo.constructor.name == "Objeto") {
        //retornar el nombre del objeto, el array es tipo no rol
        return _tipo.comprobarElTipo(_enum);
      }
    }
    return false;
  }

  traducir() {
    return this.hijos[0].traducir() + " = " + this.hijos[1].traducir();
  }
};
