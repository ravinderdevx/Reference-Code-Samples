import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '@app/core/services/modal.service';

@Component({
  selector: 'sa-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  @ViewChild('AssistanceModal') assistanceModal;
  footer_copyright_text: string;
  footer_assistent_text: string;
  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {
    let currentYear = new Date().getFullYear();
    this.footer_copyright_text = `Clarity CXM - CX Dashboard &copy; ${currentYear}`;
    this.footer_assistent_text = "Need assistance? We're here to help!";

  }


  showAssistancePopup() {
    this.modalService.openModal(this.assistanceModal);
  }

  closeModal() {
    this.modalService.closeModal();
  }

}
