import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegventasPage } from 'src/app/vendedor/regventas/regventas.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importamos según la instrucción
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegventasPage', () => {
  let component: RegventasPage;
  let fixture: ComponentFixture<RegventasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegventasPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración de HttpClient con interceptores
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Para manejar los componentes personalizados de Ionic
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
