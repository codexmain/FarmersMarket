import { TestBed } from '@angular/core/testing';

import { LocationValidationService } from './location-validation.service';

describe('LocationValidationService', () => {
  let service: LocationValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
