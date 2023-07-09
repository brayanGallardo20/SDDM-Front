import { TestBed } from '@angular/core/testing';

import { SubEtapaService } from './sub-etapa.service';

describe('SubEtapaService', () => {
  let service: SubEtapaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubEtapaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
