export const plantillaError = class {
  constructor(tipo, descripcion, fila, columna) {
    this.descripcion = descripcion;
    this.fila = fila;
    this.columna = columna;
    this.tipo = tipo;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getLinea() {
    return this.fila;
  }

  getColumna() {
    return this.columna;
  }

  getTipo() {
    return this.tipo;
  }
};
