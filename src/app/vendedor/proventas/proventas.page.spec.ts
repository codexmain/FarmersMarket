import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProventasPage } from './proventas.page';
import { IonicModule, NavController, ModalController } from '@ionic/angular'; // Ionic imports
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Cliente HTTP con interceptores
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formularios
import { RouterTestingModule } from '@angular/router/testing'; // Mock de ruteo
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Simulación de servicios HTTP
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Soporte para elementos personalizados
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage
import { BrowserModule } from '@angular/platform-browser'; // Soporte básico de Angular
import { provideRouter } from '@angular/router'; // Configuración moderna de rutas
import { of } from 'rxjs'; // Simulación de observables

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: (query: string, params: any[]) =>
        Promise.resolve({ rows: { length: 0, item: (index: number) => null } }),
    });
  }
}

// Mock para NativeStorage
class MockNativeStorage {
  getItem(key: string) {
    return Promise.resolve('test@example.com'); // Simulación de un correo electrónico almacenado
  }
}

describe('ProventasPage', () => {
  let component: ProventasPage;
  let fixture: ComponentFixture<ProventasPage>;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Mock para ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') })),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      declarations: [ProventasPage],
      imports: [
        BrowserModule, // Soporte básico de Angular
        IonicModule.forRoot(), // Configuración de Ionic
        FormsModule, // Formularios con [(ngModel)]
        ReactiveFormsModule, // Formularios reactivos
        HttpClientTestingModule, // Simulación de servicios HTTP
        RouterTestingModule, // Mock de ruteo
      ],
      providers: [
        NavController, // Proveedor de navegación
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        provideHttpClient(withInterceptorsFromDi()), // Configuración de HttpClient
        provideRouter([]), // Configuración de rutas vacías
        { provide: ModalController, useValue: modalControllerMock }, // Mock para ModalController
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permitir componentes personalizados
    }).compileComponents();

    fixture = TestBed.createComponent(ProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
