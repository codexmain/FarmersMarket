import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPagePage } from './admin-page.page';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DataBaseService } from 'src/app/services/data-base.service';
import { of } from 'rxjs';

class MockRouter {
  getCurrentNavigation() {
    return {
      extras: {
        state: {
          nombre: 'Usuario de prueba', // Simulación de datos pasados a través de NavigationExtras
        },
      },
    };
  }

  navigate() {
    return Promise.resolve(true);
  }
}

class MockActivatedRoute {
  params = of({ id: '123' }); // Simula parámetros de ruta
}

class MockNativeStorage {
  getItem(key: string) {
    if (key === 'userEmail') {
      return Promise.resolve('test@example.com'); // Simula un email almacenado
    }
    return Promise.resolve(null);
  }
}

class MockDataBaseService {
  getUsuarioByEmail(email: string) {
    return Promise.resolve({
      nombre: 'Usuario de prueba', // Simulación de datos de usuario desde la base de datos
      email,
    });
  }
}

describe('AdminPagePage', () => {
  let component: AdminPagePage;
  let fixture: ComponentFixture<AdminPagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPagePage],
      providers: [
        { provide: Router, useClass: MockRouter }, // Mock para Router
        { provide: ActivatedRoute, useClass: MockActivatedRoute }, // Mock para ActivatedRoute
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
        { provide: DataBaseService, useClass: MockDataBaseService }, // Mock para DataBaseService
        provideHttpClient(withInterceptorsFromDi()), // Configuración moderna para HttpClient
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data correctly', async () => {
    await component.cargarDatosUsuario();
    expect(component.userData).toEqual({
      nombre: 'Usuario de prueba',
      email: 'test@example.com',
    });
  });
});
