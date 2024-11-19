import { TestBed } from '@angular/core/testing';
import { AmonestacionesssService } from './amonestacionesss.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AmonestacionesssService', () => {
  let service: AmonestacionesssService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración para HttpClient
      ],
    });
    service = TestBed.inject(AmonestacionesssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
