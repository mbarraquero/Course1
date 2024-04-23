import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-util-loader',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
  ],
  templateUrl: './util-loader.component.html',
  styleUrls: ['./util-loader.component.scss']
})
export class UtilLoaderComponent implements OnInit {
  @Input() text?: string;

  constructor(
    private readonly ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.ngxSpinnerService.show()
  }
}
