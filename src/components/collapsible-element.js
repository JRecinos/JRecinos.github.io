import { BaseLit } from "./base-element";


export const CollapsibleElement = class extends BaseLit {

    _animation(event, el = null){
        
        if(this.disabled) return;
       
        let current = (event != null && event.currentTarget.parentNode.parentNode) || el;
        current.classList.toggle("active");
        this.classList.toggle("active");
        let panel = current.nextElementSibling;
        if(panel !== null) {
            
            if(panel.classList.contains("hide"))
                panel.classList.toggle('hide');
            else
                setTimeout(() => panel.classList.toggle('hide'),500);
            
            panel.classList.toggle("chosen");
        }
    }

    close(event = null){
        let current = (event !== null) ? event.currentTarget: this.$$('.accordion');
        this._animation(null,current)
    }

    open(){
        let current = this.disabled;
        this.disabled = false;
        this.close();
        this.disabled = current;
    }
}
