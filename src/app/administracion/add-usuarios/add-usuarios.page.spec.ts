import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUsuariosPage } from './add-usuarios.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Para manejar elementos personalizados

// Mock de SQLite
import { FormsModule } from '@angular/forms'; // Importa FormsModule

import { ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DataBaseService } from 'src/app/services/data-base.service';

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

class MockModalController {
  create() {
    return Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(),
    });
  }
}

class MockNavParams {
  get(param: string): any {
    const mockParams: { [key: string]: any } = { id: '123', name: 'John Doe' };
    return mockParams[param];
  }
}

describe('AddUsuariosPage', () => {
  let component: AddUsuariosPage;
  let fixture: ComponentFixture<AddUsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUsuariosPage],
      imports: [FormsModule], // Importa FormsModule
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Proporciona el mock de SQLite
        provideHttpClient(withInterceptorsFromDi()), // Configuración para HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } }, // Mock para ActivatedRoute
        { provide: NavParams, useClass: MockNavParams }, // Mock para NavParams
        DataBaseService, // Proveedor para DataBaseService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite manejar elementos personalizados en pruebas
    }).compileComponents();

    fixture = TestBed.createComponent(AddUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Puedes agregar más pruebas relacionadas con las funcionalidades del componente aquí
});
