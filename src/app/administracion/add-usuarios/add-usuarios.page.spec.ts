import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUsuariosPage } from './add-usuarios.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Para manejar elementos personalizados

// Mock de SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

describe('AddUsuariosPage', () => {
  let component: AddUsuariosPage;
  let fixture: ComponentFixture<AddUsuariosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddUsuariosPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Proporciona el mock de SQLite
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
