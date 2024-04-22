import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-util-gallery',
  standalone: true,
  imports: [
    CommonModule,
    GalleryModule,
  ],
  templateUrl: './util-gallery.component.html',
  styleUrls: ['./util-gallery.component.scss']
})
export class UtilGalleryComponent implements OnInit {
  @Input() imageUrls: string[] | null = [];

  readonly images: GalleryItem[] = [];

  ngOnInit() {
    this.imageUrls?.forEach((imageUrl) =>
      this.images.push(new ImageItem({ src: imageUrl, thumb: imageUrl }))
    );
  }
}
