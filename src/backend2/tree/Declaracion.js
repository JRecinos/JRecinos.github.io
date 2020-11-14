import { NodoMM } from "./NodoMM";
import { plantillaError } from "../utilities/plantillaError";
import "../estructuras/tipos";
export const Declaracion = class extends NodoMM {
  constructor(_token, _texto, _location, _hijos) {
    super(_token, _texto, _location, _hijos);
  }

  ejecutar() {
    let cambio = this.hijos[0].texto;
    let nombre = "";
    let tipo = "";
    let valor;
    let rol = "";
    let dimensiones = 0;
    this.hijos[1].hijos.forEach((decla) => {
      switch (decla.token) {
        case "DECLAARR1":
          nombre = decla.hijos[0].texto;
          tipo = decla.hijos[1].texto;
          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          valor = decla.hijos[3].ejecutar();
          dimensiones = decla.hijos[2].hijos;
          if (
            valor.length > 0 &&
            !this.comprobarCoincidenciaTipos(tipo, valor)
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero se le esta asignando un tipo (" +
                  typeof valor +
                  "). No se declaro.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          rol = "array";
          if (
            !window.tablaSimbolos.meterVariable(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              1
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAARR2":
          nombre = decla.hijos[0].texto;
          if (cambio == "const") {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" +
                  nombre +
                  ">> ya que es const y no se definio.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          tipo = decla.hijos[1].texto;
          /////lo de aca lo desconozco
          valor = undefined;
          rol = "array";
          dimensiones = decla.hijos[2].hijos;

          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }

          if (
            !window.tablaSimbolos.meterVariable(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              2
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAVAR1":
          nombre = decla.hijos[0].texto;
          tipo = decla.hijos[1].texto;
          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          valor = decla.hijos[2].ejecutar();
          dimensiones = this.getDimensiones(valor);
          if (!this.comprobarCoincidenciaTipos(tipo, valor)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero se le esta asignando un tipo (" +
                  typeof valor +
                  "). No se declaro.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          rol = this.getRol(valor);
          if (
            !window.tablaSimbolos.meterVariable(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              1
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;

        case "DECLAVAR2":
          nombre = decla.hijos[0].texto;
          valor = decla.hijos[1].ejecutar();
          /////lo de aca lo desconozco
          tipo = this.getTipo(valor);
          rol = this.getRol(valor);
          dimensiones = this.getDimensiones(valor);

          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }

          if (
            !window.tablaSimbolos.meterVariable(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              1
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAVAR3":
          nombre = decla.hijos[0].texto;
          if (cambio == "const") {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" +
                  nombre +
                  ">> ya que es const y no se definio.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          tipo = decla.hijos[1].texto;
          /////lo de aca lo desconozco
          valor = undefined;
          rol = "undefined";
          dimensiones = 0;

          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }

          if (
            !window.tablaSimbolos.meterVariable(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              2
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAVAR4":
          nombre = decla.hijos[0].texto;
          if (cambio == "const") {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" +
                  nombre +
                  ">> ya que es const y no se definio.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          valor = undefined;
          /////lo de aca lo desconozco
          tipo = "undefined";
          rol = "undefined";
          dimensiones = 0;

          if (
            !window.tablaSimbolos.meterVariable(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              3
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
      }
    });
  }

  ejecutarChafa() {
    let cambio = this.hijos[0].texto;
    let nombre = "";
    let tipo = "";
    let valor;
    let rol = "";
    let dimensiones = 0;
    this.hijos[1].hijos.forEach((decla) => {
      switch (decla.token) {
        case "DECLAARR1":
          nombre = decla.hijos[0].texto;
          tipo = decla.hijos[1].texto;
          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          valor = decla.hijos[3].ejecutar();
          dimensiones = decla.hijos[2].hijos;
          if (
            valor.length > 0 &&
            !this.comprobarCoincidenciaTipos(tipo, valor)
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero se le esta asignando un tipo (" +
                  typeof valor +
                  "). No se declaro.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          rol = "array";
          if (
            !window.tablaSimbolos.meterVariableChafa(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              1
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAARR2":
          nombre = decla.hijos[0].texto;
          if (cambio == "const") {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" +
                  nombre +
                  ">> ya que es const y no se definio.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          tipo = decla.hijos[1].texto;
          /////lo de aca lo desconozco
          valor = undefined;
          rol = "array";
          dimensiones = decla.hijos[2].hijos;

          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }

          if (
            !window.tablaSimbolos.meterVariableChafa(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              2
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAVAR1":
          nombre = decla.hijos[0].texto;
          tipo = decla.hijos[1].texto;
          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          valor = decla.hijos[2].ejecutar();
          dimensiones = this.getDimensiones(valor);
          if (!this.comprobarCoincidenciaTipos(tipo, valor)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero se le esta asignando un tipo (" +
                  typeof valor +
                  "). No se declaro.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          rol = this.getRol(valor);
          if (
            !window.tablaSimbolos.meterVariableChafa(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              1
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;

        case "DECLAVAR2":
          nombre = decla.hijos[0].texto;
          valor = decla.hijos[1].ejecutar();
          /////lo de aca lo desconozco
          tipo = this.getTipo(valor);
          rol = this.getRol(valor);
          dimensiones = this.getDimensiones(valor);

          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }

          if (
            !window.tablaSimbolos.meterVariableChafa(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              1
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAVAR3":
          nombre = decla.hijos[0].texto;
          if (cambio == "const") {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" +
                  nombre +
                  ">> ya que es const y no se definio.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          tipo = decla.hijos[1].texto;
          /////lo de aca lo desconozco
          valor = undefined;
          rol = "undefined";
          dimensiones = 0;

          if (!this.validarTipo(tipo)) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "La variable <<" +
                  nombre +
                  ">> se declara con tipo (" +
                  tipo +
                  ") pero ese tipo no existe.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }

          if (
            !window.tablaSimbolos.meterVariableChafa(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              2
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
        case "DECLAVAR4":
          nombre = decla.hijos[0].texto;
          if (cambio == "const") {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" +
                  nombre +
                  ">> ya que es const y no se definio.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          valor = undefined;
          /////lo de aca lo desconozco
          tipo = "undefined";
          rol = "undefined";
          dimensiones = 0;

          if (
            !window.tablaSimbolos.meterVariableChafa(
              cambio,
              nombre,
              valor,
              tipo,
              rol,
              dimensiones,
              3
            )
          ) {
            window.errores.push(
              new plantillaError(
                "Semantico",
                "No pudo declararse variable <<" + nombre + ">>.",
                decla.location["last_line"],
                decla.location["last_column"]
              )
            );
            return;
          }
          break;
      }
    });
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

  validarTipo(_tipo) {
    if (_tipo == "number") {
      return true;
    }
    if (_tipo == "string") {
      return true;
    }
    if (_tipo == "boolean") {
      return true;
    }
    if (_tipo == "undefined") {
      return true;
    }
    if (_tipo == "null") {
      return true;
    }
    let pruebasa = window.tablaObjetos.buscarObjeto(_tipo);
    if (pruebasa) {
      return true;
    }
    return false;
  }

  traducir() {
    if(window.primeraPasada){
      return "";
    }
    let str = "";
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      let decla = this.hijos[1].hijos[i];
      switch (decla.token) {
        case "DECLAARR1":
          let tipaso = ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto);
          str += tipaso; 
          for (let j = 0; j < decla.hijos[2].hijos; j++) {
            str += "[]";
          }
          str += " " + decla.hijos[0].texto ;  
          if(decla.hijos[3].token == "EXPARRAYNEW"){        
            str += " = " + decla.hijos[3].traducir(tipaso) + ";";
          }else{
            str += " = " + decla.hijos[3].traducir() + ";";
          }
          break;
        case "DECLAARR2":
          str += decla.hijos[0].texto + " : " + decla.hijos[1].texto;
          for (let j = 0; j < decla.hijos[2].hijos; j++) {
            str += "[]";
          }
          break;
        case "DECLAVAR1":
          str += ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto); 
          str += " " + decla.hijos[0].texto + " = " ;
          str += decla.hijos[2].traducir() + ";";
          break;
        case "DECLAVAR2":
          str +="var " + decla.hijos[0].texto;
          str += " := " + decla.hijos[1].traducir() + ";";
          break;
        case "DECLAVAR3":
          str += ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto);
          str += " ";
          str += decla.hijos[0].texto + ";";
          break;
        case "DECLAVAR4":
          str += "var " + decla.hijos[0].texto + ";";
          break;
        default:
      }
      if(i < this.hijos[1].hijos.length - 1){
        str += "\n";
      }
    }
    return str;
  }


  traducirFOR() {
    if(window.primeraPasada){
      return "";
    }
    let str = "";
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      let decla = this.hijos[1].hijos[i];
      switch (decla.token) {
        case "DECLAARR1":
          let tipo = ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto);
          str += tipo; 
          for (let j = 0; j < decla.hijos[2].hijos; j++) {
            str += "[]";
          }
          str += " " + decla.hijos[0].texto ;  
          if(decla.hijos[1].token == "EXPARRAYNEW"){        
            str += " = " + decla.hijos[3].traducir(tipo) + ";";
          }else{
            str += " = " + decla.hijos[3].traducir() + ";";
          }
          break;
        case "DECLAARR2":
          str += decla.hijos[0].texto + " : " + decla.hijos[1].texto;
          for (let j = 0; j < decla.hijos[2].hijos; j++) {
            str += "[]";
          }
          break;
        case "DECLAVAR1":
          str += ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto); 
          str += " " + decla.hijos[0].texto + " = " ;
          str += decla.hijos[2].traducir() + ";";
          break;
        case "DECLAVAR2":
          str +="double " + decla.hijos[0].texto;
          str += " = " + decla.hijos[1].traducir() + ";";
          break;
        case "DECLAVAR3":
          str += ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto);
          str += " ";
          str += decla.hijos[0].texto + ";";
          break;
        case "DECLAVAR4":
          str += "double " + decla.hijos[0].texto + ";";
          break;
        default:
      }
      if(i < this.hijos[1].hijos.length - 1){
        str += "\n";
      }
    }
    return str;
  }

  declasGlobales() {
    let str = "";
    for (let i = 0; i < this.hijos[1].hijos.length; i++) {
      let decla = this.hijos[1].hijos[i];
      switch (decla.token) {
        case "DECLAARR1":
          let tipo = ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto);
          str += tipo; 
          for (let j = 0; j < decla.hijos[2].hijos; j++) {
            str += "[]";
          }
          str += " " + decla.hijos[0].texto ;  
          if(decla.hijos[1].token == "EXPARRAYNEW"){        
            str += " = " + decla.hijos[3].traducir(tipo) + ";";
          }else{
            str += " = " + decla.hijos[3].traducir() + ";";
          }
          break;
        case "DECLAARR2":
          str += decla.hijos[0].texto + " : " + decla.hijos[1].texto;
          for (let j = 0; j < decla.hijos[2].hijos; j++) {
            str += "[]";
          }
          break;
        case "DECLAVAR1":
          str += ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto); 
          str += " " + decla.hijos[0].texto + " = " ;
          str += decla.hijos[2].traducir() + ";";
          break;
        case "DECLAVAR2":
          str +="var " + decla.hijos[0].texto;
          str += " := " + decla.hijos[1].traducir() + ";";
          break;
        case "DECLAVAR3":
          str += ((decla.hijos[1].texto.toLowerCase() == "number") ? "double": decla.hijos[1].texto);
          str += " ";
          str += decla.hijos[0].texto + ";";
          break;
        case "DECLAVAR4":
          str += "var " + decla.hijos[0].texto + ";";
          break;
        default:
      }
      if(i < this.hijos[1].hijos.length - 1){
        str += "\n";
      }
    }
    return str;
  }
};
