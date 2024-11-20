import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProventasPage } from './proventas.page';
import { IonicModule } from '@ionic/angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // SQLite

// Mock para SQLite
class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

describe('ProventasPage', () => {
  let component: ProventasPage;
  let fixture: ComponentFixture<ProventasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProventasPage],
      imports: [
        IonicModule.forRoot(), // Soporte para componentes de Ionic
        FormsModule, // Para formularios con [(ngModel)]
        ReactiveFormsModule, // Para formularios reactivos
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Configuración de HttpClient
        provideRouter([]), // Configuración moderna de rutas vacías para pruebas
        { provide: SQLite, useClass: MockSQLite }, // Mock para SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
