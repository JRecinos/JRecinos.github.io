export const FuncionStructura = class {
  constructor(_nombre, _params, _tipo, _sentencias, _dims) {
    this.nombre = _nombre;
    this.params = _params;
    this.tipo = _tipo;
    this.sentencias = _sentencias;
    this.dims = _dims;
    this.esAnidada = window.esAnidada;
  }

  igualdadDecla(_nombre, _params, _tipo, _dims) {
    if (this.nombre != _nombre) {
      return false;
    }
    if (this.tipo != _tipo) {
      return false;
    }
    if (this.dims != _dims) {
      return false;
    }
    if (this.params.length != _params.length) {
      return false;
    }
    for (let i = 0; i < this.params.length; i++) {
      if (
        this.params[i].nombre != _params[i].nombre ||
        this.params[i].tipo != _params[i].tipo ||
        this.params[i].dimensiones != _params[i].dims
      ) {
        return false;
      }
    }
  }

  igualdadLlamada(_nombre, _params, _dims) {
    if (this.nombre != _nombre) {
      return false;
    }
    if (this.params.length != _params.length) {
      return false;
    }

    return true;
  }

  igualdadLlamadaSeria(_nombre, _params, _dims) {
    if (this.nombre != _nombre) {
      return false;
    }
    if (this.params.length != _params.length) {
      return false;
    }
    for (let i = 0; i < this.params.length; i++) {
      if (
        this.params[i].tipo != _params[i] ||
        this.params[i].dimensiones != _dims[i]
      ) {
        return false;
      }
    }

    return true;
  }
};
