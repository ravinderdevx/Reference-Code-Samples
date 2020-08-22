import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private modalService: BsModalService) { }

  modalRef: BsModalRef;
  styling = {
    ignoreBackdropClick: true
  };


  ngOnInit(): void {
  }
  closeModal() {
    this.modalRef.hide();
  }
  openModal(template: any) {
    debugger;
    if (this.modalRef)
      this.closeModal();

    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-md' }, this.styling)
    );
  }

}
