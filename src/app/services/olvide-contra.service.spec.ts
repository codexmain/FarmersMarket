import { TestBed } from '@angular/core/testing';
import { OlvideContraService } from './olvide-contra.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('OlvideContraService', () => {
  let service: OlvideContraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
      ],
    });
    service = TestBed.inject(OlvideContraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
