import { TestBed } from '@angular/core/testing';

import { InstPubService } from './inst-pub.service';

describe('InstPubService', () => {
  let service: InstPubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstPubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
