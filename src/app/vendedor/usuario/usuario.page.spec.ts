import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioPage } from './usuario.page';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../app-routing.module'; // Import your routes

describe('UsuarioPage', () => {
  let component: UsuarioPage;
  let fixture: ComponentFixture<UsuarioPage>;
  let dbServiceMock: any;
  let nativeStorageMock: any;
  let activatedRouteMock: any;
  let navControllerMock: any;

  beforeEach(async () => {
    dbServiceMock = {
      getUsuarioByEmail: jasmine.createSpy('getUsuarioByEmail').and.returnValue(Promise.resolve({ id: 1, nombre: 'Usuario Test' })),
    };

    nativeStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('test@example.com')),
    };

    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } },
    };

    navControllerMock = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    await TestBed.configureTestingModule({
      declarations: [UsuarioPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock },
        { provide: DataBaseService, useValue: dbServiceMock },
        { provide: NativeStorage, useValue: nativeStorageMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se cree correctamente
  });

  it('should load user data', async () => {
    await component.cargarDatosUsuario();
    expect(component.usuario).toBeDefined();
    expect(component.usuario.nombre).toBe('Usuario Test');
  });

  it('should navigate to mod-usuario page on button click', () => {
    // Espejamos solo en la función específica para este test
    spyOn(navControllerMock, 'navigateForward').and.callThrough();
    const button = fixture.debugElement.nativeElement.querySelector('ion-button');
    button.click();
    expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/mod-usuario');
  });

  // Si necesitas otra prueba similar, haz que no use 'navigateForward' directamente:
  it('should navigate to another page without using navigateForward', () => {
    const navigateSpy = spyOn(navControllerMock, 'navigateBack').and.callThrough(); // Esto es una forma diferente de probar
    const backButton = fixture.debugElement.nativeElement.querySelector('ion-button'); // Usa otro botón si es necesario
    backButton.click();
    expect(navigateSpy).toHaveBeenCalledWith(); // Esto verificará si la navegación se hace correctamente
  });
});
