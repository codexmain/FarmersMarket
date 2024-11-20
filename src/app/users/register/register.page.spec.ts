import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: (query: string) => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para DataBaseService
class MockDataBaseService {
  async registrarUsuario() {
    return true; // Simula registro exitoso
  }

  async Regiones() {
    return [{ id: 1, name: 'Región Mock' }]; // Simula una región
  }

  async Comunas(regionId: number) {
    return regionId === 1 ? [{ id: 1, name: 'Comuna Mock' }] : [];
  }
}

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      imports: [IonicModule.forRoot(), FormsModule, ReactiveFormsModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
        { provide: SQLite, useClass: MockSQLite },
        { provide: DataBaseService, useClass: MockDataBaseService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Soluciona errores de Angular como NG0303
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form correctly with valid data', () => {
    component.pNombre = 'Juan';
    component.aPaterno = 'Pérez';
    component.email = 'juan.perez@example.com';
    component.password = 'Password123!';
    component.confirmPassword = 'Password123!';
    component.selectedRegion = 1;
    component.selectedComuna = 1;
    component.direccion = 'Calle Falsa 123';

    const isValid = component.validarFormulario();
    expect(isValid).toBeTrue();
  });

  it('should fail validation for invalid email', () => {
    component.pNombre = 'Juan';
    component.aPaterno = 'Pérez';
    component.email = 'invalid-email';
    component.password = 'Password123!';
    component.confirmPassword = 'Password123!';
    component.selectedRegion = 1;
    component.selectedComuna = 1;
    component.direccion = 'Calle Falsa 123';

    const isValid = component.validarFormulario();
    expect(isValid).toBeFalse();
  });

  it('should fail validation for mismatched passwords', () => {
    component.pNombre = 'Juan';
    component.aPaterno = 'Pérez';
    component.email = 'juan.perez@example.com';
    component.password = 'Password123!';
    component.confirmPassword = 'DifferentPassword';
    component.selectedRegion = 1;
    component.selectedComuna = 1;
    component.direccion = 'Calle Falsa 123';

    const isValid = component.validarFormulario();
    expect(isValid).toBeFalse();
  });

  it('should fail validation when region or comuna is not selected', () => {
    component.pNombre = 'Juan';
    component.aPaterno = 'Pérez';
    component.email = 'juan.perez@example.com';
    component.password = 'Password123!';
    component.confirmPassword = 'Password123!';
    component.selectedRegion = null; // Región no seleccionada
    component.selectedComuna = null; // Comuna no seleccionada
    component.direccion = 'Calle Falsa 123';

    const isValid = component.validarFormulario();
    expect(isValid).toBeFalse();
  });

  it('should fail validation for empty fields', () => {
    component.pNombre = '';
    component.aPaterno = '';
    component.email = '';
    component.password = '';
    component.confirmPassword = '';
    component.selectedRegion = null;
    component.selectedComuna = null;
    component.direccion = '';

    const isValid = component.validarFormulario();
    expect(isValid).toBeFalse();
  });
});
