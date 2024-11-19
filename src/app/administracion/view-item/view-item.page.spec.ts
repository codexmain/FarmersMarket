import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewItemPage } from './view-item.page';
import { ModalController, NavParams } from '@ionic/angular'; // Importa ModalController y NavParams
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Provee HttpClient con interceptores
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { FormsModule } from '@angular/forms'; // Importa FormsModule

describe('ViewItemPage', () => {
  let component: ViewItemPage;
  let fixture: ComponentFixture<ViewItemPage>;
  let modalControllerMock: jasmine.SpyObj<ModalController>;
  let navParamsMock: jasmine.SpyObj<NavParams>;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerMock = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    // Crear un mock para NavParams
    navParamsMock = jasmine.createSpyObj('NavParams', ['get']);
    navParamsMock.get.and.returnValue('mockValue'); // Mock del método `get`

    // Crear un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ViewItemPage],
      imports: [
        IonicModule.forRoot(), // Proveer IonicModule para componentes de Ionic
        FormsModule, // Proveer FormsModule para manejar [(ngModel)]
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveer HttpClient con soporte para interceptores
        { provide: ModalController, useValue: modalControllerMock }, // Proveer el mock de ModalController
        { provide: NavParams, useValue: navParamsMock }, // Proveer el mock de NavParams
        { provide: SQLite, useValue: sqliteMock }, // Proveer el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
