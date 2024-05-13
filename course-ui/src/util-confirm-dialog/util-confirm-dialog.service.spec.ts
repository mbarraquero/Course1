import { TestBed } from '@angular/core/testing';

import { UtilConfirmDialogService } from './util-confirm-dialog.service';

describe('UtilConfirmDialogService', () => {
  let service: UtilConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
