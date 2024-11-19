import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAmonestacionesPage } from './view-amonestaciones.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Nueva API de HttpClient
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';
import { OlvideContraService } from 'src/app/services/olvide-contra.service'; // Servicio relacionado

class MockSQLite {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => null } }),
    });
  }
}

describe('ViewAmonestacionesPage', () => {
  let component: ViewAmonestacionesPage;
  let fixture: ComponentFixture<ViewAmonestacionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAmonestacionesPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Nueva API recomendada para HttpClient
        { provide: SQLite, useClass: MockSQLite }, // Mock de SQLite
        DataBaseService, // Servicio relacionado
        OlvideContraService, // Servicio relacionado
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAmonestacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
