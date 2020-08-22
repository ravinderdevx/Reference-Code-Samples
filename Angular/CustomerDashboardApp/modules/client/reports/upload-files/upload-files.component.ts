import { Component, OnInit, TemplateRef, Output, EventEmitter, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";

import { errorMessages, successMessages } from "@app/config/messages.config";
import {
  AuthService,
  ResponseService,
  MessageService,
  AWSService
} from "@app/core/services";


@Component({
  selector: "app-upload-files",
  templateUrl: "./upload-files.component.html",
  styleUrls: ["./upload-files.component.css"]
})
export class UploadFilesComponent implements OnInit {
  @Input() folder: string;

  @Output() close = new EventEmitter();
  
  loading: boolean = false;
  
  allowedFileFormats: string = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain'
  ].join(',');
  
  files: any = [];

  messageObject: any;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
    private awsService: AWSService,
  ) { }

  ngOnInit() {
    this.files = [];
  }

  uploadAll() {
    
    if(this.files.filter(x => !x.isCompleted) == 0) { 
      this.messageObject = this.messageService.errorMessageObject(errorMessages.NO_FILES_IN_QUEUE);
      return; 
    }

    this.files.forEach(file => {
      if(!file.isCompleted) 
        this.loading = true;
        file.isProgress = true;
        this.awsService.uploadFile(this.folder, file).then(response => {
          file.isCompleted = true;
          file.isProgress = false;
          this.loading = false;
        }, error => {
          console.log(error);
          file.isError = true;
          file.isProgress = false;
          this.loading = true;
        });
    });
  }

  removeFile(index) {
    this.files.splice(index, 1);
  }

  removeAll() {
    this.files = [];
  }

  onFilesAdded(files: File[]) {
    this.files = this.files.concat(files);
  }
}
