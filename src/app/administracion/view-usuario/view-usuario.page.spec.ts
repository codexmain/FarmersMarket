import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewUsuarioPage } from './view-usuario.page';
import { ModalController, NavParams } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock para ModalController
class MockModalController {
  dismiss = jasmine.createSpy('dismiss');
}

// Mock para NavParams
class MockNavParams {
  get(param: string): any {
    if (param === 'usuario') {
      return {
        nombre: 'John',
        apellido_paterno: 'Doe',
        segundo_nombre: 'Michael',
        apellido_materno: 'Smith',
        email: 'john.doe@example.com',
        contrasena: 'password',
        nombre_empresa: 'Example Corp',
        descripcion_corta: 'Short description',
        estado_cuenta: 'active',
        tipo_usuario_id: 1,
        foto_perfil: 'path/to/photo.jpg',
      };
    }
    return null;
  }
}

// Mock para DataBaseService
class MockDataBaseService {
  dbState() {
    return of(true); // Simula que la base de datos está lista
  }

  fetchCmbTipUsuario() {
    return of([
      { id: 1, descripcion: 'Admin' },
      { id: 2, descripcion: 'User' },
    ]); // Simula una lista de tipos de usuario
  }
}

describe('ViewUsuarioPage', () => {
  let component: ViewUsuarioPage;
  let fixture: ComponentFixture<ViewUsuarioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewUsuarioPage],
      imports: [
        IonicModule.forRoot(), // Asegúrate de incluir IonicModule
        FormsModule, // Importar FormsModule para [(ngModel)]
        ReactiveFormsModule, // Soporte adicional para formularios reactivos
      ],
      providers: [
        { provide: ModalController, useClass: MockModalController },
        { provide: NavParams, useClass: MockNavParams },
        { provide: DataBaseService, useClass: MockDataBaseService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permitir componentes personalizados de Ionic
    }).compileComponents();

    fixture = TestBed.createComponent(ViewUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user data correctly', () => {
    expect(component.nombre).toBe('John');
    expect(component.apellido_paterno).toBe('Doe');
    expect(component.tipo_usuario_id).toBe(1);
  });

  it('should fetch user types from database', () => {
    expect(component.arrayCmbTipoUsuario).toEqual([
      { id: 1, descripcion: 'Admin' },
      { id: 2, descripcion: 'User' },
    ]);
  });

  it('should dismiss the modal', async () => {
    const modalController = TestBed.inject(ModalController);
    await component.dismiss();
    expect(modalController.dismiss).toHaveBeenCalled();
  });
});
