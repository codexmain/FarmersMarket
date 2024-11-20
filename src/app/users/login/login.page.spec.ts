import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, NavController, ModalController } from '@ionic/angular'; // Ionic imports
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas con servicios HTTP
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // HTTP client con interceptores
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite plugin
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage plugin
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formularios
import { RouterTestingModule } from '@angular/router/testing'; // Mock de rutas
import { of } from 'rxjs'; // Para simulación de observables

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Crea un mock para ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') })),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(), // Configuración base de Ionic
        HttpClientTestingModule, // Para servicios HTTP
        RouterTestingModule, // Mock de ruteo
        FormsModule, // Soporte para formularios template-driven
        ReactiveFormsModule, // Soporte para formularios reactivos
      ],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }, // Mock de ModalController
        NavController, // Proveedor necesario para navegación
        SQLite, // Plugin SQLite para tests
        NativeStorage, // Plugin NativeStorage para tests
        provideHttpClient(withInterceptorsFromDi()), // Configuración de HttpClient con interceptores
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
