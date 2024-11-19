import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuarioPage } from './modificar-usuario.page';
import { ModalController, NavParams } from '@ionic/angular'; // Importar NavParams
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importar SQLite
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importar NativeStorage
import { FormsModule } from '@angular/forms'; // Importar FormsModule para ngModel

class MockNavParams {
  get(param: string): any {
    const mockParams: { [key: string]: any } = {
      id: '123',
      usuario: { nombre: 'Usuario Mock', email: 'mock@example.com' }, // Agregar usuario simulado
    };
    return mockParams[param];
  }
}

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

class MockNativeStorage {
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData'); // Devuelve un dato simulado
  }

  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve(); // Simula una operación exitosa
  }
}

describe('ModificarUsuarioPage', () => {
  let component: ModificarUsuarioPage;
  let fixture: ComponentFixture<ModificarUsuarioPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    await TestBed.configureTestingModule({
      declarations: [ModificarUsuarioPage],
      imports: [FormsModule], // Importar FormsModule
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración para HttpClient
        { provide: ModalController, useValue: modalControllerSpy }, // Proveer el mock de ModalController
        { provide: NavParams, useClass: MockNavParams }, // Proveer el mock de NavParams con usuario simulado
        { provide: SQLite, useClass: MockSQLite }, // Proveer el mock de SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Proveer el mock de NativeStorage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarUsuarioPage);
    component = fixture.componentInstance;

    // Simular el usuario en el componente para evitar errores en las pruebas
    component.usuario = { nombre: 'Usuario Mock', email: 'mock@example.com' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
