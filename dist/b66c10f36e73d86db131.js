(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./src/components/views/my-view404.js":
/*!********************************************!*\
  !*** ./src/components/views/my-view404.js ***!
  \********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");
/* harmony import */ var _page_view_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./page-view-element */ "./src/components/views/page-view-element.js");



class MyView404 extends _page_view_element__WEBPACK_IMPORTED_MODULE_1__["PageViewElement"] {
  static get styles () {
    return [
      SharedStyles
    ]
  }

  render () {
    return _base_element__WEBPACK_IMPORTED_MODULE_0__["html"]`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>
          The page you're looking for doesn't seem to exist. Head back
          <a href="/">home</a> and try again?
        </p>
      </section>
    `
  }
}

window.customElements.define('my-view404', MyView404)


/***/ }),

/***/ "./src/components/views/page-view-element.js":
/*!***************************************************!*\
  !*** ./src/components/views/page-view-element.js ***!
  \***************************************************/
/*! exports provided: PageViewElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageViewElement", function() { return PageViewElement; });
/* harmony import */ var _base_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base-element */ "./src/components/base-element.js");


class PageViewElement extends _base_element__WEBPACK_IMPORTED_MODULE_0__["BaseLit"] {
  // Only render this page if it's actually visible.
  shouldUpdate() {
    return this.active;
  }
  
  static get styles(){
    return [
      _base_element__WEBPACK_IMPORTED_MODULE_0__["css"]`
        :host {
          height: fit-content;
          display: block;
          padding: 25px;
          background: var(--light-secondary-color);
        }
      `
    ];
  }

  static get properties() {
    return {
      active: { type: Boolean }
    }
  }
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy92aWV3cy9teS12aWV3NDA0LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3ZpZXdzL3BhZ2Utdmlldy1lbGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBc0M7QUFDZTs7QUFFckQsd0JBQXdCLGtFQUFlO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxXQUFXLGtEQUFJO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUN2QkE7QUFBQTtBQUFBO0FBQXFEOztBQUU5Qyw4QkFBOEIscURBQU87QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU0saURBQUc7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0EiLCJmaWxlIjoiYjY2YzEwZjM2ZTczZDg2ZGIxMzEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodG1sIH0gZnJvbSAnLi4vYmFzZS1lbGVtZW50J1xuaW1wb3J0IHsgUGFnZVZpZXdFbGVtZW50IH0gZnJvbSAnLi9wYWdlLXZpZXctZWxlbWVudCdcblxuY2xhc3MgTXlWaWV3NDA0IGV4dGVuZHMgUGFnZVZpZXdFbGVtZW50IHtcbiAgc3RhdGljIGdldCBzdHlsZXMgKCkge1xuICAgIHJldHVybiBbXG4gICAgICBTaGFyZWRTdHlsZXNcbiAgICBdXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiBodG1sYFxuICAgICAgPHNlY3Rpb24+XG4gICAgICAgIDxoMj5Pb3BzISBZb3UgaGl0IGEgNDA0PC9oMj5cbiAgICAgICAgPHA+XG4gICAgICAgICAgVGhlIHBhZ2UgeW91J3JlIGxvb2tpbmcgZm9yIGRvZXNuJ3Qgc2VlbSB0byBleGlzdC4gSGVhZCBiYWNrXG4gICAgICAgICAgPGEgaHJlZj1cIi9cIj5ob21lPC9hPiBhbmQgdHJ5IGFnYWluP1xuICAgICAgICA8L3A+XG4gICAgICA8L3NlY3Rpb24+XG4gICAgYFxuICB9XG59XG5cbndpbmRvdy5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ215LXZpZXc0MDQnLCBNeVZpZXc0MDQpXG4iLCJpbXBvcnQgeyBodG1sLCBjc3MsIEJhc2VMaXQgfSBmcm9tICcuLi9iYXNlLWVsZW1lbnQnO1xuXG5leHBvcnQgY2xhc3MgUGFnZVZpZXdFbGVtZW50IGV4dGVuZHMgQmFzZUxpdCB7XG4gIC8vIE9ubHkgcmVuZGVyIHRoaXMgcGFnZSBpZiBpdCdzIGFjdHVhbGx5IHZpc2libGUuXG4gIHNob3VsZFVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmU7XG4gIH1cbiAgXG4gIHN0YXRpYyBnZXQgc3R5bGVzKCl7XG4gICAgcmV0dXJuIFtcbiAgICAgIGNzc2BcbiAgICAgICAgOmhvc3Qge1xuICAgICAgICAgIGhlaWdodDogZml0LWNvbnRlbnQ7XG4gICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgcGFkZGluZzogMjVweDtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1saWdodC1zZWNvbmRhcnktY29sb3IpO1xuICAgICAgICB9XG4gICAgICBgXG4gICAgXTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgcHJvcGVydGllcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aXZlOiB7IHR5cGU6IEJvb2xlYW4gfVxuICAgIH1cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==