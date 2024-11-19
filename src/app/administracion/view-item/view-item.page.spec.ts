import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewItemPage } from './view-item.page';
import { ModalController, IonicModule, NavController } from '@ionic/angular'; // Importar IonicModule, ModalController y NavController
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importar HttpClient
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para soporte de formularios
import { RouterTestingModule } from '@angular/router/testing'; // Para simular rutas
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importar SQLite
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importar NativeStorage
import { of } from 'rxjs'; // RxJS para simulación de observables
// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para NativeStorage
class MockNativeStorage {
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData'); // Devuelve un dato simulado
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve(); // Simula una operación exitosa
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

describe('ViewItemPage', () => {
  let component: ViewItemPage;
  let fixture: ComponentFixture<ViewItemPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewItemPage],
      imports: [
        IonicModule.forRoot(), // Configuración de Ionic
        FormsModule, // Soporte para [(ngModel)]
        ReactiveFormsModule, // Soporte para formularios reactivos
        RouterTestingModule, // Simulación de rutas
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveer HttpClient con interceptores
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
