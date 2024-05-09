import { TestBed } from '@angular/core/testing';

import { PresenceHubService } from './presence-hub.service';

describe('PresenceHubService', () => {
  let service: PresenceHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresenceHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
