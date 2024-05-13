import { Component, EventEmitter, OnInit } from '@angular/core';
import { defaultConfig } from './util-confirm-dialog.models';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-util-confirm-dialog',
  templateUrl: './util-confirm-dialog.component.html',
  styleUrls: ['./util-confirm-dialog.component.scss']
})
export class UtilConfirmDialogComponent implements OnInit {
  result = false;
  config = defaultConfig;

  constructor(
    private readonly modalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.config = {
      ...this.config,
      ...defaultConfig,
    };
  }

  confirm() {
    this.result = true;
    this.close();
  }

  close() {
    this.modalRef.hide();
  }
}
