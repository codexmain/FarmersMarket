import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioPage } from './usuario.page';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';

describe('UsuarioPage', () => {
  let component: UsuarioPage;
  let fixture: ComponentFixture<UsuarioPage>;
  let dbServiceMock: any;
  let nativeStorageMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Crear mocks
    dbServiceMock = {
      getUsuarioByEmail: jasmine.createSpy('getUsuarioByEmail').and.returnValue(Promise.resolve({ id: 1, nombre: 'Usuario Test' })),
    };

    nativeStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('test@example.com')),
    };

    routerMock = {
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue(null),
      navigate: jasmine.createSpy('navigate'),
    };

    // Configurar el TestBed
    await TestBed.configureTestingModule({
      declarations: [UsuarioPage],
      providers: [
        { provide: DataBaseService, useValue: dbServiceMock },
        { provide: NativeStorage, useValue: nativeStorageMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // P
  });

  // Pruebas de cargarDatosUsuario
  describe('cargarDatosUsuario', () => {
    it('debería obtener el correo y cargar los datos del usuario correctamente', async () => {
      await component.cargarDatosUsuario();
      expect(nativeStorageMock.getItem).toHaveBeenCalledWith('userEmail');
      expect(dbServiceMock.getUsuarioByEmail).toHaveBeenCalledWith('test@example.com');
      expect(component.usuario).toEqual({ id: 1, nombre: 'Usuario Test' }); // P
    });

    it('debería manejar el caso cuando no hay correo electrónico', async () => {
      nativeStorageMock.getItem.and.returnValue(Promise.resolve(null));
      await component.cargarDatosUsuario();
      expect(component.usuario).toBeUndefined(); // P
    });

    it('debería manejar el error cuando el servicio arroja un error', async () => {
      spyOn(console, 'error');
      dbServiceMock.getUsuarioByEmail.and.returnValue(Promise.reject('Error en el servicio'));
      await component.cargarDatosUsuario();
      expect(component.usuario).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('Error al cargar los datos del usuario:', 'Error en el servicio'); // P
    });
  });

  // Pruebas de recibirDatosDesdeNavegacion
  describe('recibirDatosDesdeNavegacion', () => {
    it('debería actualizar el estado del usuario con datos de navegación', () => {
      const usuarioMock = { id: 2, nombre: 'Usuario Navegación' };
      routerMock.getCurrentNavigation.and.returnValue({ extras: { state: { usuario: usuarioMock } } });

      component.recibirDatosDesdeNavegacion();
      expect(component.usuario).toEqual(usuarioMock); // P
    });

    it('no debería actualizar el usuario si no hay datos de navegación', () => {
      routerMock.getCurrentNavigation.and.returnValue(null);

      component.recibirDatosDesdeNavegacion();
      expect(component.usuario).toBeUndefined(); // P
    });

    it('debería manejar el caso en que los datos de navegación son incompletos', () => {
      routerMock.getCurrentNavigation.and.returnValue({ extras: { state: {} } });

      component.recibirDatosDesdeNavegacion();
      expect(component.usuario).toBeUndefined(); // P
    });
  });

  // Pruebas de irAModUsuario
  describe('irAModUsuario', () => {
    it('debería navegar a la página de modificación del usuario', () => {
      component.irAModUsuario();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/mod-usuario']); // P
    });
  });

  // Pruebas de inicialización del componente
  describe('ngOnInit', () => {
    it('debería cargar los datos del usuario al inicializarse', async () => {
      spyOn(component, 'cargarDatosUsuario');
      await component.ngOnInit();
      expect(component.cargarDatosUsuario).toHaveBeenCalled(); // P
    });

    it('debería recibir datos de navegación al inicializarse', () => {
      spyOn(component, 'recibirDatosDesdeNavegacion');
      component.ngOnInit();
      expect(component.recibirDatosDesdeNavegacion).toHaveBeenCalled(); // P
    });
  });
});
