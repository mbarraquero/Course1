import { TestBed } from '@angular/core/testing';

import { UtilFileUploadService } from './util-file-upload.service';

describe('UtilFileUploadService', () => {
  let service: UtilFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
