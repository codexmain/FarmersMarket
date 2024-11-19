import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendedorPagePage } from './vendedor-page.page';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';

describe('VendedorPagePage', () => {
  let component: VendedorPagePage;
  let fixture: ComponentFixture<VendedorPagePage>;
  let routerMock: any;
  let nativeStorageMock: any;
  let dbServiceMock: any;

  beforeEach(async () => {
    // Mock del Router
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    // Mock del NativeStorage
    nativeStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('test@example.com')),
    };

    // Mock del DataBaseService
    dbServiceMock = {
      getUsuarioByEmail: jasmine.createSpy('getUsuarioByEmail').and.returnValue(
        Promise.resolve({ id: 1, nombre: 'Usuario Test' })
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [VendedorPagePage],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: NativeStorage, useValue: nativeStorageMock },
        { provide: DataBaseService, useValue: dbServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendedorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente.
  });

  // Prueba de cargarDatosUsuario
  describe('cargarDatosUsuario', () => {
    it('debería obtener el correo y cargar los datos del usuario correctamente', async () => {
      await component.cargarDatosUsuario();
      expect(nativeStorageMock.getItem).toHaveBeenCalledWith('userEmail'); // Verifica que se llama a NativeStorage con "userEmail".
      expect(dbServiceMock.getUsuarioByEmail).toHaveBeenCalledWith('test@example.com'); // Verifica que se consulta el usuario por email.
      expect(component.userData).toEqual({ id: 1, nombre: 'Usuario Test' }); // Verifica que los datos del usuario se asignan correctamente.
    });

    it('debería manejar el error si ocurre un fallo al cargar los datos del usuario', async () => {
      spyOn(console, 'error'); // Espía en `console.error` para capturar errores.
      dbServiceMock.getUsuarioByEmail.and.returnValue(Promise.reject('Error en el servicio'));
      await component.cargarDatosUsuario();
      expect(console.error).toHaveBeenCalledWith(
        'Error al cargar los datos del usuario:',
        'Error en el servicio'
      ); // Verifica que el error se maneja correctamente.
    });
  });

  // Prueba de navigateToUsuario
  describe('navigateToUsuario', () => {
    it('debería navegar a la página de usuario con los datos correctos', () => {
      component.userData = { id: 1, nombre: 'Usuario Test' };
      component.navigateToUsuario();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/usuario'], {
        state: { id: 1, nombre: 'Usuario Test' }, // Verifica que se navega con los datos correctos.
      });
    });
  });

  // Prueba de navigateToRegventas
  describe('navigateToRegventas', () => {
    it('debería navegar a la página de regventas con los datos correctos', () => {
      component.userData = { id: 1, nombre: 'Usuario Test' };
      component.navigateToRegventas();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/regventas'], {
        state: { id: 1, nombre: 'Usuario Test' }, // Verifica que se navega con los datos correctos.
      });
    });
  });

  // Prueba de error en navigateToUsuario si no hay datos
  describe('navigateToUsuario without userData', () => {
    it('should handle missing userData gracefully', () => {
      component.userData = null; // Simula la ausencia de datos del usuario.
      component.navigateToUsuario();
      expect(routerMock.navigate).not.toHaveBeenCalled(); // Verifica que no se intenta navegar.
    });
  });

  // Prueba de error en navigateToRegventas si no hay datos
  describe('navigateToRegventas without userData', () => {
    it('should handle missing userData gracefully', () => {
      component.userData = null; // Simula la ausencia de datos del usuario.
      component.navigateToRegventas();
      expect(routerMock.navigate).not.toHaveBeenCalled(); // Verifica que no se intenta navegar.
    });
  });
});
