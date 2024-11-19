import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubcategoriasPage } from './subcategorias.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas con servicios HTTP
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite
import { IonicModule, NavController, ModalController } from '@ionic/angular'; // Ionic
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formularios
import { RouterTestingModule } from '@angular/router/testing'; // Mock de ruteo
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage
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

describe('SubcategoriasPage', () => {
  let component: SubcategoriasPage;
  let fixture: ComponentFixture<SubcategoriasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubcategoriasPage],
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
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
