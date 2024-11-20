import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendedorPagePage } from './vendedor-page.page';
import { Router, ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';

describe('VendedorPagePage', () => {
  let component: VendedorPagePage;
  let fixture: ComponentFixture<VendedorPagePage>;
  let routerMock: any;
  let nativeStorageMock: any;
  let dbServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Mock del Router
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue({
        extras: { state: { id: 1, nombre: 'Usuario Test' } },
      }),
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

    // Mock del ActivatedRoute
    activatedRouteMock = {
      snapshot: { params: {} },
    };

    await TestBed.configureTestingModule({
      declarations: [VendedorPagePage],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: NativeStorage, useValue: nativeStorageMock },
        { provide: DataBaseService, useValue: dbServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendedorPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente.
  });

  describe('ngOnInit', () => {
    it('debería cargar datos de navegación si existen', () => {
      expect(routerMock.getCurrentNavigation).toHaveBeenCalled(); // Verifica que se llama a getCurrentNavigation.
      expect(component.userData).toEqual({ id: 1, nombre: 'Usuario Test' }); // Verifica que los datos del usuario se asignan.
    });

    it('debería manejar el caso en el que no haya datos de navegación', async () => {
      routerMock.getCurrentNavigation.and.returnValue(null); // Simula ausencia de datos de navegación.
      await component.cargarDatosUsuario();
      expect(nativeStorageMock.getItem).toHaveBeenCalledWith('userEmail');
      expect(dbServiceMock.getUsuarioByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
