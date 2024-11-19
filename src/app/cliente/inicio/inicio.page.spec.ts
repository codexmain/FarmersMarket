import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service'; // Asegúrate de que esta ruta sea correcta

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

class MockNativeStorage {
  getItem() {
    return Promise.resolve({});
  }
  setItem() {
    return Promise.resolve({});
  }
}

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InicioPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveedor para HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Mock de SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock de NativeStorage
        DataBaseService, // Proveedor de DataBaseService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
