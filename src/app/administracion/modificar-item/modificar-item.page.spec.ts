import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarItemPage } from './modificar-item.page';
import { ModalController, NavParams } from '@ionic/angular'; // Importa NavParams
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Provee HttpClient con interceptores
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { FormsModule } from '@angular/forms'; // Importa FormsModule

describe('ModificarItemPage', () => {
  let component: ModificarItemPage;
  let fixture: ComponentFixture<ModificarItemPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let navParamsMock: any;
  let sqliteMock: jasmine.SpyObj<SQLite>;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    // Crear un mock para NavParams
    navParamsMock = {
      get: jasmine.createSpy('get').and.returnValue('mockValue'), // Mock del método get
    };

    // Crear un mock para SQLite
    sqliteMock = jasmine.createSpyObj('SQLite', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ModificarItemPage],
      imports: [
        IonicModule.forRoot(), // Agrega IonicModule para los componentes de Ionic
        FormsModule, // Agrega FormsModule para soportar [(ngModel)]
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // Proveer HttpClient con soporte para interceptores
        { provide: ModalController, useValue: modalControllerSpy }, // Proveer el mock de ModalController
        { provide: NavParams, useValue: navParamsMock }, // Proveer el mock de NavParams
        { provide: SQLite, useValue: sqliteMock }, // Proveer el mock de SQLite
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
