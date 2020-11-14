export const TablaObjetos = class {
  constructor() {
    this.listaObjetos = [];
  }

  getLista() {
    return this.listaObjetos;
  }

  buscarObjeto(_nombre) {
    for (let i = 0; i < this.listaObjetos.length; i++) {
      if (this.listaObjetos[i].nombre == _nombre) {
        return this.listaObjetos[i];
      }
    }
    return null;
  }

  meterObjeto(_obj) {
    let aux = this.buscarObjeto(_obj.nombre);
    if (aux == null) {
      this.listaObjetos.push(_obj);
      return true;
    }
    return false;
  }
};
