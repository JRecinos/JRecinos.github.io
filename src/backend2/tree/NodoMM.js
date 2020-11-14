export const NodoMM = class {
  constructor(_token, _texto, _location, _hijos) {
    this.token = _token;
    this.texto = _texto;
    this.location = _location;
    this.hijos = _hijos;
    this.indice = 0;
  }

  generarIndices(n) {
    window.indices = window.indices + 1;
    if (n instanceof NodoMM) n.indice = window.indices;
    for (let i = 0; i < n.hijos.length; i++) {
      if (n.hijos[i] instanceof NodoMM) this.generarIndices(n.hijos[i]);
    }
  }

  graficarArbol2() {
    window.indices = 0;
    this.generarIndices(this);
    window.strArbol = "";
    window.strArbol += "Digraph G{\n";
    window.strArbol +=
      "graph [ranksep=2]\n node[shape=record,height=.1,style=filled];\n";
    if (this != null) {
      this.grafNodos2();
    }
    window.strArbol += "}";
  }

  traducir() {
    return "";
  }

  graficarArbol() {
    window.indices = 0;
    this.generarIndices(this);
    window.strArbol = "";
    window.strArbol += "Digraph G{\n";
    window.strArbol +=
      "graph [ranksep=2]\n node[shape=record,height=.1,style=filled];\n";
    if (this != null) {
      this.grafNodos();
    }
    window.strArbol += "}";
  }

  traducir() {
    return "";
  }

  declasGlobales(){
    return "";
  }
  
  grafNodos2() {
    if (this instanceof NodoMM) {
      window.strArbol +=
        "node" +
        this.indice +
        '[label = "' +
        this.texto.replaceAll(">", "\\>").replaceAll("<", "\\<") +
        '",fillcolor="lightcyan2"];\n';
      for (let i = 0; i < this.hijos.length; i++) {
        if (this.hijos[i] instanceof NodoMM) {
          this.hijos[i].grafNodos2();
          window.strArbol +=
            "node" + this.indice + "->node" + this.hijos[i].indice + ";\n";
        }
      }
    }
  }

  grafNodos() {
    if (this instanceof NodoMM) {
      window.strArbol +=
        "node" +
        this.indice +
        '[label = "' +
        this.texto.replaceAll(">", "\\>").replaceAll("<", "\\<") +
        '",fillcolor="green"];\n';
      for (let i = 0; i < this.hijos.length; i++) {
        if (this.hijos[i] instanceof NodoMM) {
          this.hijos[i].grafNodos();
          window.strArbol +=
            "node" + this.indice + "->node" + this.hijos[i].indice + ";\n";
        }
      }
    }
  }

  getToken() {
    return this.token;
  }

  ejecutar() {}
  ejecutar2() {}
  ejecutar3() {}
};
