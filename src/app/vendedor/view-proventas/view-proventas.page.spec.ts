import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProventasPage } from './view-proventas.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { DataBaseService } from '../../services/data-base.service';

// Mock para DataBaseService
class MockDataBaseService {
  getProductoselect(productoId: number) {
    return productoId === 1
      ? Promise.resolve({ id: 1, nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 100 })
      : Promise.resolve(null);
  }
}

// Mock para Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ViewProventasPage', () => {
  let component: ViewProventasPage;
  let fixture: ComponentFixture<ViewProventasPage>;
  let toastController: jasmine.SpyObj<ToastController>;
  let alertController: jasmine.SpyObj<AlertController>;
  let router: MockRouter;

  beforeEach(async () => {
    toastController = jasmine.createSpyObj('ToastController', ['create']);
    alertController = jasmine.createSpyObj('AlertController', ['create']);
    router = new MockRouter();

    toastController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
      } as any)
    );

    alertController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
      } as any)
    );

    await TestBed.configureTestingModule({
      declarations: [ViewProventasPage],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: (key: string) => (key === 'productoId' ? '1' : null) } } } },
        { provide: DataBaseService, useClass: MockDataBaseService },
        { provide: ToastController, useValue: toastController },
        { provide: AlertController, useValue: alertController },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product details on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.producto).toEqual({ id: 1, nombre: 'Producto de prueba', descripcion: 'Descripción de prueba', precio: 100 });
  });

  it('should show a toast and navigate if product not found', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.returnValue('999'); // Simula un producto inexistente

    await component.ngOnInit();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Producto no encontrado.',
      duration: 2000,
      color: 'danger',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show an alert if loadProductDetails fails', async () => {
    const dbService = TestBed.inject(DataBaseService);
    spyOn(dbService, 'getProductoselect').and.throwError('Error de base de datos');

    await component.loadProductoDetails();

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Hubo un problema al cargar el producto. Inténtalo de nuevo.',
      buttons: ['OK'],
    });
  });

  it('should handle null producto gracefully', async () => {
    const dbService = TestBed.inject(DataBaseService);
    spyOn(dbService, 'getProductoselect').and.returnValue(Promise.resolve(null));

    await component.ngOnInit();

    expect(toastController.create).toHaveBeenCalledWith({
      message: 'Producto no encontrado.',
      duration: 2000,
      color: 'danger',
    });
  });
});
