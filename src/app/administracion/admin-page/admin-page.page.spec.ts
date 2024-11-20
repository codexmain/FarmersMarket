import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPagePage } from './admin-page.page';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { OlvideContraService } from 'src/app/services/olvide-contra.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

// Mock para NativeStorage
class MockNativeStorage {
  getItem() {
    return Promise.resolve('test@example.com');
  }
  setItem() {
    return Promise.resolve({});
  }
}

describe('AdminPagePage', () => {
  let component: AdminPagePage;
  let fixture: ComponentFixture<AdminPagePage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPagePage],
      imports: [RouterTestingModule], // Utiliza RouterTestingModule para simular navegación
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } }, // Mock para ActivatedRoute
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        provideHttpClient(withInterceptorsFromDi()), // Proveedor de HttpClient con interceptores
        DataBaseService, // Proveedor para DataBaseService
        OlvideContraService, // Proveedor para OlvideContraService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPagePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente.
  });

  // Test para navegación a la página de usuarios
  it('should navigate to the users page when the "Usuarios" button is clicked', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#modal-users');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios'], { state: { emails: component.emails } });
  });

  // Test para navegación a la página de productos
  it('should navigate to the products page when the "Productos" button is clicked', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#modal-products');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/items']);
  });

  // Test para navegación a la página de categorías
  it('should navigate to the categories page when the "Categorías" button is clicked', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#modal-category');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/categorias']);
  });

  // Test para navegación a la página de subcategorías
  it('should navigate to the subcategories page when the "SubCategorías" button is clicked', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#modal-subcategory');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/subcategorias']);
  });

  // Test para navegación a la página de amonestaciones
  it('should navigate to the admonitions page when the "Amonestaciones" button is clicked', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('#modal-amonestaciones');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/view-amonestaciones']);
  });

  // Test para navegación a la página de login cuando se hace clic en el botón "Cerrar Sesión"
  it('should navigate to the login page when the "Cerrar Sesión" button is clicked', () => {
    spyOn(router, 'navigate');
    const button = fixture.debugElement.nativeElement.querySelector('ion-button[color="danger"]');
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
