import { AmbitoEstructura } from "./ambito-estructura";

export const TablaSimbolos = class {
  constructor(_sentencias) {
    this.listaAmbitos = [];
    this.listaAmbitos.push(new AmbitoEstructura("Global"));
    this.listaAmbitosChafa = [];
    this.listaAmbitosChafa.push(new AmbitoEstructura("Chafa"));
    this.listaAmbitosChafa[0].meterAmbitoSuave();
  }

  declararFunciones(_sentencias) {
    _sentencias.hijos.forEach((sentencia) => {
      if (sentencia.token == "DECLAFUNCION") {
        sentencia.ejecutar();
      }
    });
  }

  buscarFuncionDecla(_nombre, _params, _tipo, _dims) {
    let current;
    for (let i = this.listaAmbitos.length - 1; i >= 0; i--) {
      current = this.listaAmbitos[i].buscarFuncionDecla(
        _nombre,
        _params,
        _tipo,
        _dims
      );
      if (current != null) {
        return current;
      }
    }
    return null;
  }

  buscarFuncionLlamada(_nombre, _params, _dims) {
    let current;
    for (let i = this.listaAmbitos.length - 1; i >= 0; i--) {
      current = this.listaAmbitos[i].buscarFuncionLlamada(
        _nombre,
        _params,
        _dims
      );
      if (current != null) {
        return current;
      }
    }
    return null;
  }

  meterFuncion(_nombre, _params, _tipo, _sentencias, _dims) {
    if (this.buscarFuncionDecla(_nombre, _params, _tipo, _dims) == null) {
      this.listaAmbitos[this.listaAmbitos.length - 1].meterFuncion(
        _nombre,
        _params,
        _tipo,
        _sentencias,
        _dims
      );
      return true;
    }
    return false;
  }

  vaciadoEstructura() {
    let ultimoAmbito = this.listaAmbitos[this.listaAmbitos.length - 1];
    let ambitoOrigen = this.listaAmbitosChafa[this.listaAmbitosChafa.length - 1];
    ultimoAmbito.listaVariables.push(ambitoOrigen.listaVariables.pop());
    this.listaAmbitosChafa[0].meterAmbitoSuave();
  }

  buscarVariableSoloNombre(_nombre) {
    let ultimoAmbito = this.listaAmbitos[this.listaAmbitos.length - 1];
    let ambitoGlobal = this.listaAmbitos[0];
    if (ultimoAmbito.esAnidada) {
      let retorno;
      if (this.listaAmbitos.length < 1) {
        return null;
      } else if (this.listaAmbitos.length == 1) {
        return ultimoAmbito.buscarVariableSoloNombre(_nombre);
      } else if (this.listaAmbitos.length == 2) {
        retorno = ultimoAmbito.buscarVariableSoloNombre(_nombre);
        if (retorno != null) {
          return retorno;
        }
        return ambitoGlobal.buscarVariableSoloNombre(_nombre);
      } else {
        retorno = ultimoAmbito.buscarVariableSoloNombre(_nombre);
        if (retorno != null) {
          return retorno;
        }
        retorno = this.listaAmbitos[
          this.listaAmbitos.length - 2
        ].buscarVariableSoloNombre(_nombre);
        if (retorno != null) {
          return retorno;
        }
        return ambitoGlobal.buscarVariableSoloNombre(_nombre);
      }
    } else {
      let retorno;
      if (this.listaAmbitos.length < 1) {
        return null;
      } else if (this.listaAmbitos.length == 1) {
        return ultimoAmbito.buscarVariableSoloNombre(_nombre);
      }
      retorno = ultimoAmbito.buscarVariableSoloNombre(_nombre);
      if (retorno != null) {
        return retorno;
      }
      return ambitoGlobal.buscarVariableSoloNombre(_nombre);
    }
    return null;
  }

  buscarVariableSoloNombreLocal(_nombre) {
    return this.listaAmbitos[
      this.listaAmbitos.length - 1
    ].buscarVariableSoloNombre(_nombre);
  }


  buscarVariableSoloNombreLocalChafa(_nombre) {
    return this.listaAmbitosChafa[
      this.listaAmbitosChafa.length - 1
    ].buscarVariableSoloNombre(_nombre);
  }


  buscarVariable(_nombre, _tipo, _dimensiones, _rol) {
    let res = null;
    if (this.listaAmbitos.length == 1) {
      res = this.listaAmbitos[0].buscarVariable(
        _nombre,
        _tipo,
        _rol,
        _dimensiones
      );
      return res;
    }
    if (this.listaAmbitos.length == 2) {
      res = this.listaAmbitos[1].buscarVariable(
        _nombre,
        _tipo,
        _rol,
        _dimensiones
      );
      if (res != null) {
        return res;
      }
      res = this.listaAmbitos[0].buscarVariable(
        _nombre,
        _tipo,
        _rol,
        _dimensiones
      );
      return res;
    }
    if (this.listaAmbitos.length > 2) {
      res = this.listaAmbitos[this.listaAmbitos.length - 1].buscarVariable(
        _nombre,
        _tipo,
        _rol,
        _dimensiones
      );
      if (res != null) {
        return res;
      }
      res = this.listaAmbitos[0].buscarVariable(
        _nombre,
        _tipo,
        _rol,
        _dimensiones
      );
      return res;
    }
    return null;
  }

  meterVariable(
    _cambio,
    _nombre,
    _valor,
    _tipo,
    _rol,
    _dimensiones,
    _asigIndice
  ) {
    let res = this.buscarVariableSoloNombreLocal(_nombre);
    if (res != null) {
      return false;
    }
    this.listaAmbitos[this.listaAmbitos.length - 1].meterVariable(
      _cambio,
      _nombre,
      _valor,
      _tipo,
      _rol,
      _dimensiones,
      _asigIndice
    );
    return true;
  }

  meterVariableChafa(
    _cambio,
    _nombre,
    _valor,
    _tipo,
    _rol,
    _dimensiones,
    _asigIndice
  ) {
    let res = this.buscarVariableSoloNombreLocalChafa(_nombre);
    if (res != null) {
      return false;
    }
    this.listaAmbitosChafa[this.listaAmbitosChafa.length - 1].meterVariable(
      _cambio,
      _nombre,
      _valor,
      _tipo,
      _rol,
      _dimensiones,
      _asigIndice
    );
    return true;
  }

  meterAmbitoFuerte(_nombre) {
    this.listaAmbitos.push(new AmbitoEstructura(_nombre));
  }

  meterAmbitoFuerte(_nombre, _anidado) {
    let nuevoAmbito = new AmbitoEstructura(_nombre);
    nuevoAmbito.setAnidada(_anidado);
    this.listaAmbitos.push(nuevoAmbito);
  }

  sacarAmbitoFuerte() {
    this.listaAmbitos.pop();
  }

  meterAmbitoDebil() {
    this.listaAmbitos[this.listaAmbitos.length - 1].meterAmbitoSuave();
  }

  sacarAmbitoDebil() {
    this.listaAmbitos[this.listaAmbitos.length - 1].sacarAmbitoSuave();
  }

  graficarTabla() {
    let str = "";
    str +=
      " _______________________________________________________________________________________________\n";
    str +=
      "|____CAMBIO_____|______ID_______|____AMBITO_____|______TIPO_____|______DIMS_____|_______ROL_____|\n";
    this.listaAmbitos.forEach((element) => {
      str += element.graficarTabla();
    });
    str +=
      "|_______________|_______________|_______________|_______________|_______________|_______________|\n";
    return str;
  }

  graficarTabla2() {
    let str = [];
    this.listaAmbitos.forEach((element) => {
      str = str.concat(element.graficarTabla2());
    });
    window.dispatchEvent(new CustomEvent("graficar-tabla", { detail: str }));
  }
};
