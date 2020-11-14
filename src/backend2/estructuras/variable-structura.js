export const VariableStructura = class {
  constructor(
    _cambio,
    _nombre,
    _valor,
    _tipo,
    _rol,
    _dimensiones,
    _asigIndice
  ) {
    this.cambio = _cambio;
    this.nombre = _nombre;
    this.valor = _valor;
    this.tipo = _tipo;
    this.rol = _rol;
    this.dimensiones = _dimensiones;
    this.asigIndice = _asigIndice;
  }

  buscarVariable(_nombre, _valor, _tipo, _rol, _dimensiones) {
    if (
      this.nombre == _nombre &&
      this.tipo == _tipo &&
      this.dimensiones == _dimensiones &&
      this.rol == _rol
    ) {
      return this;
    }
    return null;
  }

  buscarVariableSoloNombre(_nombre) {
    if (this.nombre == _nombre) {
      return this;
    }
    return null;
  }
};
