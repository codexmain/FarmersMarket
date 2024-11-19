import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriasPage } from './categorias.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa soporte para formularios
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importa NativeStorage

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
  getItem(key: string): Promise<any> {
    return Promise.resolve('mockData'); // Devuelve un dato simulado
  }
  setItem(key: string, value: any): Promise<any> {
    return Promise.resolve(); // Simula una operación exitosa
  }
}

describe('CategoriasPage', () => {
  let component: CategoriasPage;
  let fixture: ComponentFixture<CategoriasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriasPage],
      imports: [
        IonicModule.forRoot(), // Configuración de Ionic
        FormsModule, // Soporte para [(ngModel)]
        ReactiveFormsModule, // Soporte para formularios reactivos
        RouterTestingModule, // Simulación de rutas
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveer HttpClient con interceptores
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
        { provide: NativeStorage, useClass: MockNativeStorage }, // Mock para NativeStorage
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
