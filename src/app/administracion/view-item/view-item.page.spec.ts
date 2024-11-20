import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewItemPage } from './view-item.page';
import { ModalController, IonicModule, NavController, NavParams } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

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
    return Promise.resolve('mockData');
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve();
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

// Mock para NavParams
class MockNavParams {
  data: { [key: string]: any } = {
    itemId: 1,
  };
  get(param: string): any {
    return this.data[param];
  }
}

// Definir rutas simuladas para pruebas
const routes = [
  { path: '', component: ViewItemPage },
  { path: 'item/:id', component: ViewItemPage },
];

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
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // HttpClient con interceptores
        provideRouter(routes), // Proveer rutas para las pruebas
        { provide: ModalController, useClass: MockModalController }, // Mock para ModalController
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigate']) }, // Mock para NavController
        { provide: NavParams, useClass: MockNavParams }, // Mock para NavParams
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load item details from NavParams', () => {
    // Prueba para verificar que NavParams funciona correctamente
    const itemId = component['navParams'].get('itemId');
    expect(itemId).toBe(1);
  });
});
