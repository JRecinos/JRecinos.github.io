window.indices = 0;
window.strArbol = "";
window.textoConsola = [];
window.indiceLoops = 0;
window.strFunciones = "";
window.strObjetos = "";
window.coorelativoFunciones = 0;
window.currentTabs = 0;
window.esAnidada = false;
window.primeraPasada = true;
window.forincorrelativo = 0;
/////////////////////////////////////////////ESTRUCTURAS///////////////////////////////////////////
window.tablaSimbolos = null;
window.errores = [];
window.tablaObjetos = null;
window.pilaRetornos = [];

window.limpiarTodo = function () {
  window.forincorrelativo = 0;
  window.primeraPasada = true;
  window.esAnidada = false;
  window.currentTabs = 0;
  window.strFunciones = "";
  window.strObjetos = "";
  window.coorelativoFunciones = 0;
  window.pilaRetornos = [];
  window.indiceLoops = 0;
  window.tablaSimbolos = null;
  window.tablaObjetos = null;
  window.indices = 0;
  window.strArbol = "";
  window.errores = [];
  window.textoConsola = [];
  window.dispatchEvent(new CustomEvent("console-changed", { detail: [] }));
  window.dispatchEvent(new CustomEvent("graficar-errores", { detail: [] }));
};
