import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendedorPagePage } from './vendedor-page.page';
import { DataBaseService } from 'src/app/services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Router } from '@angular/router';

fdescribe('VendedorPagePage', () => {
  let component: VendedorPagePage;
  let fixture: ComponentFixture<VendedorPagePage>;
  let nativeStorageMock: any;
  let dbServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    // Mock de NativeStorage
    nativeStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('test@example.com')),
    };

    // Mock de DataBaseService
    dbServiceMock = {
      getUsuarioByEmail: jasmine.createSpy('getUsuarioByEmail').and.returnValue(Promise.resolve({
        id: 1,
        nombre: 'Test User',
        apellido_paterno: 'Apellido',
      })),
    };

    await TestBed.configureTestingModule({
      declarations: [VendedorPagePage],
      imports: [IonicModule.forRoot(), RouterTestingModule],
      providers: [
        { provide: NativeStorage, useValue: nativeStorageMock },
        { provide: DataBaseService, useValue: dbServiceMock },
        SQLite,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendedorPagePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Forzar inicialización de datos en el componente
    spyOn(component, 'cargarDatosUsuario').and.callFake(async () => {
      component.userData = await dbServiceMock.getUsuarioByEmail('test@example.com');
    });
    await component.cargarDatosUsuario();
    fixture.detectChanges(); // Aplicar los cambios iniciales
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar y mostrar los datos del usuario', async () => {
    const nombreElement = fixture.debugElement.nativeElement.querySelector('ion-card-subtitle');
    expect(nombreElement.textContent).toContain('Test User');
  });

  it('debería navegar a la página de usuario cuando se haga clic en el botón "Cuenta"', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#btn-usuario');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/usuario'], { state: component.userData });
  });

  it('debería navegar a la página de productos cuando se haga clic en el botón "Mis productos"', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#btn-proventas');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/proventas'], { state: component.userData });
  });

  it('debería navegar a la página de registro de ventas cuando se haga clic en el botón "Registro ventas"', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#btn-regventas');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/regventas'], { state: component.userData });
  });

  it('debería navegar a la página de login cuando se haga clic en el botón "Cerrar Sesión"', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#btn-cerrar-sesion'); // Selecciona el botón por el ID
    button.click(); // Simula el clic
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Verifica que la navegación ocurrió
  });
  
  
});
