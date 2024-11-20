import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProventasPage } from './view-proventas.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { DataBaseService } from '../../services/data-base.service';

class MockDataBaseService {
  getProductoselect(productoId: number) {
    if (productoId === 1) {
      return Promise.resolve({
        id: 1,
        nombre: 'Producto de prueba',
        descripcion: 'Descripción de prueba',
        precio: 100,
      });
    }
    return Promise.resolve(null); // Simula que no se encuentra el producto
  }
}

class MockRouter {
  navigate(path: string[]) {
    return Promise.resolve(true);
  }
}

describe('ViewProventasPage', () => {
  let component: ViewProventasPage;
  let fixture: ComponentFixture<ViewProventasPage>;
  let mockToastController: any;
  let mockAlertController: any;

  beforeEach(async () => {
    mockToastController = {
      create: jasmine.createSpy('create').and.returnValue(
        Promise.resolve({
          present: jasmine.createSpy('present'),
        })
      ),
    };

    mockAlertController = {
      create: jasmine.createSpy('create').and.returnValue(
        Promise.resolve({
          present: jasmine.createSpy('present'),
        })
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewProventasPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'productoId' ? '1' : null), // Mock sin 'and'
              },
            },
          },
        },
        { provide: DataBaseService, useClass: MockDataBaseService }, // Mock del servicio
        { provide: AlertController, useValue: mockAlertController }, // Mock de AlertController
        { provide: ToastController, useValue: mockToastController }, // Mock de ToastController
        { provide: Router, useClass: MockRouter }, // Mock del router
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
    expect(component.producto).toEqual({
      id: 1,
      nombre: 'Producto de prueba',
      descripcion: 'Descripción de prueba',
      precio: 100,
    });
  });

  it('should show a toast and navigate if product not found', async () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(activatedRoute.snapshot.paramMap, 'get').and.callFake((key: string) => (key === 'productoId' ? '999' : null)); // Ajuste aquí
    const router = TestBed.inject(Router);

    await component.ngOnInit();
    expect(mockToastController.create).toHaveBeenCalledWith({
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
    expect(mockAlertController.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Hubo un problema al cargar el producto. Inténtalo de nuevo.',
      buttons: ['OK'],
    });
  });
});
