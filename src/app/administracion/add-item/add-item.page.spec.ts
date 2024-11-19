import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddItemPage } from './add-item.page';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite

describe('AddItemPage', () => {
  let component: AddItemPage;
  let fixture: ComponentFixture<AddItemPage>;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crear un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [AddItemPage],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proporciona HttpClient con soporte para interceptores
        { provide: SQLite, useValue: sqliteMock }, // Proveer el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
