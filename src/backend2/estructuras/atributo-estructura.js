export const AtributoEstructura = class {
  constructor(_nombre, _tipo, _dims) {
    this.nombre = _nombre;
    this.tipo = _tipo;
    this.dimensiones = _dims;
  }

  esIgual(_nombre, _tipo) {
    return this.nombre == _nombre && this.tipo == _tipo;
  }
};
