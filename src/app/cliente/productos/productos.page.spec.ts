import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductosPage } from './productos.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importa ambos
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute

describe('ProductosPage', () => {
  let component: ProductosPage;
  let fixture: ComponentFixture<ProductosPage>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Crea un mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula la obtención de parámetros de la ruta
    };

    await TestBed.configureTestingModule({
      declarations: [ProductosPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Proporciona el mock de ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
