import { TestBed } from '@angular/core/testing';
import { GeocodingService } from './geocoding.service';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs'; // Importa 'of'

describe('GeocodingService', () => {
  let service: GeocodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeocodingService,
        provideHttpClient(withInterceptorsFromDi()), // Proveedor de HttpClient
      ],
    });
    service = TestBed.inject(GeocodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a reverse geocode request', () => {
    const mockHttp = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    spyOn(mockHttp, 'get').and.returnValue(of({ results: [] })); // Simula la respuesta de 'get'

    service.reverseGeocode(40.73061, -73.935242).subscribe((response) => {
      expect(response.results).toBeDefined();
      expect(mockHttp.get).toHaveBeenCalledWith(
        'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.73061,-73.935242&key=AIzaSyCh2hJLX2_-wDdUCk7BJ_ZWkYhLLo36nyY'
      );
    });
  });
});
