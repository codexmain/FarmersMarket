import { TestBed } from '@angular/core/testing';
import { DataBaseService } from './data-base.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos

describe('DataBaseService', () => {
  let service: DataBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
      ],
    });
    service = TestBed.inject(DataBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
