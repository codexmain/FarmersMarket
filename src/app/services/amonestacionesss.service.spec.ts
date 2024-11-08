import { TestBed } from '@angular/core/testing';

import { AmonestacionesssService } from './amonestacionesss.service';

describe('AmonestacionesssService', () => {
  let service: AmonestacionesssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmonestacionesssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
