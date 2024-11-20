import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { OlvideContraService } from 'src/app/services/olvide-contra.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';


// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para DataBaseService
class MockDataBaseService {
  async registrarUsuario() {
    return true;
  }

  async Regiones() {
    return [{ id: 1, name: 'Región Mock' }];
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
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveedor de HttpClient
        provideRouter([]), // Configuración de rutas vacías para pruebas
        { provide: SQLite, useClass: MockSQLite }, // Mock de SQLite
        { provide: DataBaseService, useClass: MockDataBaseService }, // Mock de DataBaseService
        OlvideContraService, // Servicio relacionado
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form correctly', () => {
    component.pNombre = 'Juan'; // Nombre válido
    component.aPaterno = 'Pérez'; // Apellido válido
    component.email = 'juan.perez@example.com'; // Email válido
    component.password = 'Pass123!@'; // Contraseña válida (mínimo 10 caracteres, con mayúsculas, números y caracteres especiales)
    component.confirmPassword = 'Pass123!@'; // Confirmación coincide con contraseña
    component.selectedRegion = 1; // Región válida
    component.selectedComuna = 1; // Comuna válida
    component.direccion = 'Calle Falsa 123'; // Dirección válida
  
    // Valida que el formulario sea correcto
    const isValid = component.validarFormulario();
    console.log('Form Validation:', isValid); // Debugging
    expect(isValid).toBeTrue();
  });
  
  it('should fail validation when email is invalid', () => {
    component.email = 'invalid-email';
    expect(component.validarFormulario()).toBeFalse();
  });
});
