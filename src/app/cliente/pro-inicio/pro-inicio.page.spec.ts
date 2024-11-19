import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular parámetros de ruta
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Para ignorar errores en componentes personalizados como ion-header
import { ProInicioPage } from './pro-inicio.page';

describe('ProInicioPage', () => {
  let component: ProInicioPage;
  let fixture: ComponentFixture<ProInicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProInicioPage],
      imports: [RouterTestingModule], // Módulo de prueba para rutas
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => 'mockValue', // Simulación de parámetros de ruta
            }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignora errores en elementos personalizados de Ionic
    }).compileComponents();

    fixture = TestBed.createComponent(ProInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

