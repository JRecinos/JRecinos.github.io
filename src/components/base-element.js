import { LitElement, html, css } from 'lit-element'

export { html, css }

export const BaseLit = class extends LitElement {

    constructor() {
        super()
        this.$ = {}
    }

    _(name) {
        return this.shadowRoot.getElementById(name);
    }

    $$(name) {
        return this.shadowRoot.querySelector(name);
    }

    $$$(name) {
        return this.shadowRoot.querySelectorAll(name)
    }

    mapIDs() {
        let nodeList = this.shadowRoot.querySelectorAll('[id]');
        for (let i = 0; i < nodeList.length; i++) {
            this.$[nodeList[i].id] = nodeList[i];
        }
    }

    set(name, value) {
        this[name] = value;
        this.dispatchEvent(new CustomEvent(name, {detail: value}));
    }

    fire(name, value, bubbles = false ) {
        if(!bubbles)
            this.dispatchEvent(new CustomEvent(name, {detail: value}));
        else
            this.dispatchEvent(new CustomEvent(name, {detail: value, bubbles : true, composed: true }))

    }

    push(name, value) {
        this[name].push(value);
        this.requestUpdate();
    }

    isObject(val) {
        if (val === null) { return false; }
        return ( (typeof val === 'function') || (typeof val === 'object') );
    }

    isFunction(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }

    isObjectEmpty(val){
        return this.isObject(val) && Object.keys(val).length === 0;
    }

    bind(property, eventVal) {
        return (e) => {
            try {
                let schema = this;  // a moving reference to internal objects within obj
                let pList = property.split('.');
                let len = pList.length;
                for (let i = 0; i < len - 1; i++) {
                    let elem = pList[i];
                    if (!schema[elem]) schema[elem] = {};
                    schema = schema[elem];
                }
                if (schema)
                    schema[pList[len - 1]] = eventVal == null ? e.detail : e.detail[eventVal];
                else
                    console.log("no hay schema para", property);
            } catch (e) {
                console.error("Error in 2-way DataBinding", e);
            }
        }
    }
    //TODO: fix to show element
    scrollTo() {
        this.scrollToY();
    }

    /**
     *
     * @param scrollTargetY pixels to scroll. Ej:
        const ticketsBlockPositionY = this.$.contact.getBoundingClientRect().top + OpticApp.ScrollTarget.scrollTop;
     * @param time Time to scroll
     * @param easing
     * @param target scrollTarget Element
     */
    //'easeOutSine' | 'easeOutSine' | 'easeInOutQuint'
    scrollToY(scrollTargetY = 0, time = 600, easing = 'easeOutSine', target = OpticApp.ScrollTarget) {

        let currentTime = 0;
        const animationTime = time / 1000;


        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        const easingEquations = {
            easeOutSine: (pos) => Math.sin(pos * (Math.PI / 2)),
            easeInOutSine: (pos) => (-0.5 * (Math.cos(Math.PI * pos) - 1)),
            easeInOutQuint: (pos) => {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            },
        };

        // add animation loop
        function tick() {
            currentTime += 1 / 60;

            const p = currentTime / animationTime;
            const t = easingEquations[easing](p);

            const scrollTop = (target).pageYOffset || target.scrollTop || 0;

            const newPosition = (scrollTop + ((scrollTargetY - scrollTop) * t));

            if (p < 1) {
                window.requestAnimationFrame(tick);
                target.scrollTop = newPosition;
            }
        }
        tick();
    }

    /**
     *
     * @param {*} element : The HTMLElement to add,remove or toggle the classes to
     * @param {*} classesList : Either a String or an Array
     * @param {*} option : The option to select the operation 0 to toggle, 1 to add, 2 to remove
     */
    toggleAddRemoveClasses(element, classesList, option = 0) {
        let selector = element || '';
        let classes = classesList || '';
        if (
          (typeof classes == 'string' || Array.isArray(classes))
          &&
          classes.length
        ) {
          let classList = selector.classList;
          if (!Array.isArray(classes)) {
            classes = classes.replace(/(,\s*|\s+)/g, ' ').split(' ');
          }

          for (let className of classes) {
            switch(option){
                case 0:
                    classList.toggle(className);
                    break;
                case 1:
                    classList.add(className);
                    break;
                case 2:
                    classList.remove(className);
                    break;
            }
          }
          return true;
        }
      }
}