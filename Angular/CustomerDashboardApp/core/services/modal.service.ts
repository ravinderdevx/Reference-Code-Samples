import { constants } from './../../config/constants';
import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Injectable({
  providedIn: 'root'
})

export class ModalService {
    modalRef: BsModalRef;
    styling = {    
        ignoreBackdropClick: true
    };
    constructor(private modalService: BsModalService,) {}

    openModal(template: any, data = {}, classes = 'modal-md') {
        if(this.modalRef)
            this.closeModal();
            
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { initialState: data }, { class: classes }, this.styling)
        );
    }

    closeModal() {    
        this.modalRef.hide();
    } 

}
