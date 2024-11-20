import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPasswordPage } from './recuperar-password.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // HttpClient con soporte para interceptores
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para pruebas de servicios HTTP
import { IonicModule, NavController, ModalController } from '@ionic/angular'; // Ionic imports
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Formularios
import { RouterTestingModule } from '@angular/router/testing'; // Mock de rutas
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite plugin
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // NativeStorage plugin
import { of } from 'rxjs'; // Simulación de observables para pruebas

describe('RecuperarPasswordPage', () => {
  let component: RecuperarPasswordPage;
  let fixture: ComponentFixture<RecuperarPasswordPage>;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Mock para ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') })),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      declarations: [RecuperarPasswordPage],
      imports: [
        IonicModule.forRoot(), // Configuración base de Ionic
        HttpClientTestingModule, // Simulación de HTTP
        RouterTestingModule, // Mock de ruteo
        FormsModule, // Formularios template-driven
        ReactiveFormsModule, // Formularios reactivos
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // HttpClient con soporte para interceptores
        NavController, // Servicio de navegación
        SQLite, // Plugin SQLite
        NativeStorage, // Plugin NativeStorage
        { provide: ModalController, useValue: modalControllerMock }, // Mock para ModalController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
