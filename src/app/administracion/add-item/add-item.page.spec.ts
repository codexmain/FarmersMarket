import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemPage } from './add-item.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importa NativeStorage
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa formularios
import { IonicModule, ModalController, NavController } from '@ionic/angular'; // Importa Ionic y servicios relacionados
import { RouterTestingModule } from '@angular/router/testing'; // Mock de rutas
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

describe('AddItemPage', () => {
  let component: AddItemPage;
  let fixture: ComponentFixture<AddItemPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddItemPage],
      imports: [
        IonicModule.forRoot(), // Configuración básica de Ionic
        FormsModule, // Para [(ngModel)]
        ReactiveFormsModule, // Para formularios reactivos
        RouterTestingModule, // Mock de rutas
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveer HttpClient con soporte para interceptores
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
