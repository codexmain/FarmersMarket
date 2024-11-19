import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategoriaPage } from './add-categoria.page';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para servicios HTTP
import { IonicModule, ModalController, NavController } from '@ionic/angular'; // Ionic y sus servicios
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para formularios y [(ngModel)]
import { RouterTestingModule } from '@angular/router/testing'; // Mock de rutas
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite
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

describe('AddCategoriaPage', () => {
  let component: AddCategoriaPage;
  let fixture: ComponentFixture<AddCategoriaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCategoriaPage],
      imports: [
        HttpClientTestingModule, // Para servicios HTTP
        FormsModule, // Para [(ngModel)]
        ReactiveFormsModule, // Para formularios reactivos
        IonicModule.forRoot(), // Configuración básica de Ionic
        RouterTestingModule, // Mock de ruteo
      ],
      providers: [
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
