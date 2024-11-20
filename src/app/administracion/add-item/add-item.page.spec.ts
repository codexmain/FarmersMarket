import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemPage } from './add-item.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController, NavParams } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

// Mocks para dependencias
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

class MockNativeStorage {
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData');
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve();
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

// Mock actualizado para NavParams
class MockNavParams {
  data: { [key: string]: any } = {
    itemId: 1, // Datos simulados
  };
  get(param: string): any {
    return this.data[param];
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
        provideHttpClient(withInterceptorsFromDi()), // HttpClient con interceptores
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
        { provide: NavParams, useClass: MockNavParams }, // Mock actualizado para NavParams
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load item details from NavParams', () => {
    expect(component).toBeTruthy();
    // Simula un comportamiento para verificar que NavParams funciona
    const itemId = component['navParams'].get('itemId');
    expect(itemId).toBe(1);
  });
});
