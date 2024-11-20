import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProDetallePage } from './pro-detalle.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Cliente HTTP con interceptores
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Simulación de servicios HTTP
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite
import { IonicModule, NavController, ModalController } from '@ionic/angular'; // Ionic imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formularios
import { RouterTestingModule } from '@angular/router/testing'; // Mock de ruteo
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Soporte para elementos personalizados
import { BrowserModule } from '@angular/platform-browser'; // Soporte básico de Angular
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

describe('ProDetallePage', () => {
  let component: ProDetallePage;
  let fixture: ComponentFixture<ProDetallePage>;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Mock para ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') })),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      declarations: [ProDetallePage],
      imports: [
        BrowserModule, // Soporte básico de Angular
        IonicModule.forRoot(), // Configuración de Ionic
        FormsModule, // Soporte para formularios template-driven
        ReactiveFormsModule, // Soporte para formularios reactivos
        HttpClientTestingModule, // Simulación de servicios HTTP
        RouterTestingModule, // Mock de rutas
      ],
      providers: [
        NavController, // Servicio de navegación
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        provideHttpClient(withInterceptorsFromDi()), // Configuración de HttpClient
        { provide: ModalController, useValue: modalControllerMock }, // Mock para ModalController
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Soporte para componentes personalizados
    }).compileComponents();

    fixture = TestBed.createComponent(ProDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
