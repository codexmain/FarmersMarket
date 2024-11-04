import { TestBed } from '@angular/core/testing';

import { OlvideContraService } from './olvide-contra.service';

describe('OlvideContraService', () => {
  let service: OlvideContraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlvideContraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
