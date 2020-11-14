import { FuncionStructura } from "./funcion-structura";
import { VariableStructura } from "./variable-structura";
export const AmbitoEstructura = class {
  constructor(_nombre) {
    this.listaFunciones = [];
    this.listaVariables = [];
    this.listaVariables.push([]);
    this.nombre = _nombre;
    this.esAnidada = false;
  }

  ///////////////////////////////////////////////////////// FUNCIONES ///////////////////////////////////

  setAnidada(_anidado) {
    this.esAnidada = _anidado;
  }

  buscarFuncionDecla(_nombre, _params, _tipo, _dims) {
    for (let i = 0; i < this.listaFunciones.length; i++) {
      if (
        this.listaFunciones[i].igualdadDecla(_nombre, _params, _tipo, _dims)
      ) {
        return this.listaFunciones[i];
      }
    }
    return null;
  }

  buscarFuncionLlamada(_nombre, _params, _dims) {
    for (let i = 0; i < this.listaFunciones.length; i++) {
      if (this.listaFunciones[i].igualdadLlamada(_nombre, _params, _dims)) {
        return this.listaFunciones[i];
      }
    }
    return null;
  }

  meterFuncion(_nombre, _params, _tipo, _sentencias, _dims) {
    this.listaFunciones.push(
      new FuncionStructura(_nombre, _params, _tipo, _sentencias, _dims)
    );
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  getVarLength() {
    let currentVar = 0;
    for (let i = this.listaVariables.length - 1; i >= 0; i--) {
      currentVar = currentVar + this.listaVariables[i].length;
    }
    return currentVar;
  }

  buscarVariable(_nombre, _tipo, _rol, _dimensiones) {
    let currentVar;
    for (let i = this.listaVariables.length - 1; i >= 0; i--) {
      for (let j = this.listaVariables[i].length - 1; j >= 0; j--) {
        currentVar = this.listaVariables[i][j].buscarVariable(
          _nombre,
          _tipo,
          _rol,
          _dimensiones
        );
        if (currentVar != null) {
          return currentVar;
        }
      }
    }
    return null;
  }

  buscarVariableSoloNombre(_nombre) {
    let currentVar;
    for (let i = this.listaVariables.length - 1; i >= 0; i--) {
      for (let j = this.listaVariables[i].length - 1; j >= 0; j--) {
        currentVar = this.listaVariables[i][j].buscarVariableSoloNombre(
          _nombre
        );
        if (currentVar != null) {
          return currentVar;
        }
      }
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
    this.listaVariables[this.listaVariables.length - 1].push(
      new VariableStructura(
        _cambio,
        _nombre,
        _valor,
        _tipo,
        _rol,
        _dimensiones,
        _asigIndice
      )
    );
  }

  meterAmbitoSuave() {
    this.listaVariables.push([]);
  }

  sacarAmbitoSuave() {
    this.listaVariables.pop();
  }

  graficarTabla() {
    let str = "";
    for (let i = 0; i <= this.listaVariables.length - 1; i++) {
      for (let j = 0; j <= this.listaVariables[i].length - 1; j++) {
        str +=
          "|  " +
          this.anadirEspacios(this.listaVariables[i][j].cambio) +
          "  |  " +
          this.anadirEspacios(this.listaVariables[i][j].nombre) +
          "  |  " +
          this.anadirEspacios(this.nombre) +
          "  |  " +
          this.anadirEspacios(this.listaVariables[i][j].tipo) +
          "  |  " +
          this.anadirEspacios(this.listaVariables[i][j].dimensiones + "") +
          "  |  " +
          this.anadirEspacios(this.listaVariables[i][j].rol) +
          "  |\n";
      }
    }
    return str;
  }

  anadirEspacios(_str) {
    if (_str.length > 11) {
      return _str.substring(0, 8) + "...";
    }
    let aux = _str.substring(0, 11);
    let aux2 = 11 - aux.length;
    for (let i = 0; i < aux2; i++) {
      aux += " ";
    }
    return aux;
  }

  graficarTabla2() {
    let str = [];
    for (let i = 0; i <= this.listaVariables.length - 1; i++) {
      for (let j = 0; j <= this.listaVariables[i].length - 1; j++) {
        str.push({
          cambio: this.anadirEspacios(this.listaVariables[i][j].cambio),
          nombre: this.anadirEspacios(this.listaVariables[i][j].nombre),
          ambito: this.anadirEspacios(this.nombre),
          tipo: this.anadirEspacios(this.listaVariables[i][j].tipo),
          dimensiones: this.anadirEspacios(
            this.listaVariables[i][j].dimensiones + ""
          ),
          rol: this.anadirEspacios(this.listaVariables[i][j].rol),
        });
      }
    }
    return str;
  }
};
