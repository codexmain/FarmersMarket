import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModCuentaPage } from './mod-cuenta.page';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para servicios HTTP en pruebas
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formularios
import { IonicModule, ModalController, NavParams, NavController } from '@ionic/angular'; // Ionic
import { RouterTestingModule } from '@angular/router/testing'; // Mock de ruteo
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Configuración de HttpClient
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage
import { of } from 'rxjs'; // RxJS para mocks de observables

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para NavParams
class MockNavParams {
  get(param: string): any {
    const mockParams: { [key: string]: any } = {
      id: '123',
      usuario: { nombre: 'Usuario Mock', email: 'mock@example.com' } // Datos simulados
    };
    return mockParams[param];
  }
}

// Mock para NativeStorage
class MockNativeStorage {
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData'); // Dato simulado
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve(); // Operación simulada
  }
}

// Mock para ModalController
class MockModalController {
  create() {
    return Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(),
    });
  }
}

describe('ModCuentaPage', () => {
  let component: ModCuentaPage;
  let fixture: ComponentFixture<ModCuentaPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    await TestBed.configureTestingModule({
      declarations: [ModCuentaPage], // Declarar el componente
      imports: [
        HttpClientTestingModule, // Para servicios HTTP
        FormsModule, // Para [(ngModel)]
        ReactiveFormsModule, // Para formularios reactivos
        IonicModule.forRoot(), // Configuración básica de Ionic
        RouterTestingModule, // Mock de ruteo
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // HttpClient con interceptores
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: NavParams, useClass: MockNavParams }, // Mock para NavParams
        { provide: ModalController, useValue: modalControllerSpy }, // Mock para ModalController
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
