import { BaseLit } from "../base-element";


export const BaseModal = class extends BaseLit{
    
    async _openModal(){
        await this.updateComplete;
        this.show = true;
        const modal = this._('modal');
        modal.classList.add('md-show');
    }

    _closeModal(){
        const modal = this._('modal');
        modal.classList.remove('md-show');
        this.show = false;
    }

    _reject(){
        this.onResolve(false);
        this._closeModal();
    }

    _accept(){
        this.fire("modal-clicked");
        this._closeModal();
    }

    resolvePromise(val){
        this.onResolve(val);
        this._closeModal();
    }
}