import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarPasswordPage } from './recuperar-password.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importamos FormsModule
import { AlertController, ModalController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';

fdescribe('RecuperarPasswordPage - Validaciones de contraseña', () => {
  let component: RecuperarPasswordPage;
  let fixture: ComponentFixture<RecuperarPasswordPage>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    const alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
    const modalControllerMock = jasmine.createSpyObj('ModalController', ['dismiss']);
    const dataBaseServiceMock = jasmine.createSpyObj('DataBaseService', ['resetPassword']);

    await TestBed.configureTestingModule({
      declarations: [RecuperarPasswordPage],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot(),
        FormsModule, // Importamos FormsModule para habilitar ngModel
      ],
      providers: [
        { provide: AlertController, useValue: alertControllerMock },
        { provide: ModalController, useValue: modalControllerMock },
        { provide: DataBaseService, useValue: dataBaseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordPage);
    component = fixture.componentInstance;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Validaciones de contraseña', () => {
    it('debe fallar si la contraseña tiene menos de 10 caracteres', async () => {
      const result = await validarPassword('Abc!123');
      expect(result).toBe(false);
    });

    it('debe fallar si la contraseña tiene más de 30 caracteres', async () => {
      const result = await validarPassword('Abc!123456789012345678901234567890123');
      expect(result).toBe(false);
    });

    it('debe fallar si la contraseña no contiene un carácter especial', async () => {
      const result = await validarPassword('Abc12345678');
      expect(result).toBe(false);
    });

    it('debe fallar si la contraseña tiene caracteres consecutivos repetidos', async () => {
      const result = await validarPassword('Abc!!12345');
      expect(result).toBe(false);
    });

    it('debe fallar si la contraseña no tiene al menos dos letras mayúsculas', async () => {
      const result = await validarPassword('Abc!12345');
      expect(result).toBe(false);
    });

    it('debe pasar si la contraseña cumple todas las condiciones', async () => {
      const result = await validarPassword('AbC!12345X');
      expect(result).toBe(true);
    });

    it('debe fallar si las contraseñas no coinciden', async () => {
      const password = 'AbC!12345X';
      const confirmPassword = 'AbC!12345Y';
      const result = validarCoincidencia(password, confirmPassword);
      expect(result).toBe(false);
    });

    it('debe pasar si las contraseñas coinciden', async () => {
      const password = 'AbC!12345X';
      const confirmPassword = 'AbC!12345X';
      const result = validarCoincidencia(password, confirmPassword);
      expect(result).toBe(true);
    });
  });

  // Métodos para validar las contraseñas
  async function validarPassword(password: string): Promise<boolean> {
    let isValid = true;

    if (password.length < 10 || password.length > 30) {
      isValid = false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      isValid = false;
    }
    if (/(\d)\1/.test(password) || /([a-zA-Z])\1/.test(password)) {
      isValid = false;
    }
    if (!/(?=(.*[A-Z]){2})/.test(password)) {
      isValid = false;
    }

    return isValid;
  }

  function validarCoincidencia(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
});
