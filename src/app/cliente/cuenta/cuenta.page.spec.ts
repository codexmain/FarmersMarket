import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaPage } from './cuenta.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite

describe('CuentaPage', () => {
  let component: CuentaPage;
  let fixture: ComponentFixture<CuentaPage>;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crear un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [CuentaPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con interceptores
        { provide: SQLite, useValue: sqliteMock }, // Proveer el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
