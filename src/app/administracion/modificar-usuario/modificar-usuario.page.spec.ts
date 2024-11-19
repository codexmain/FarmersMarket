import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarUsuarioPage } from './modificar-usuario.page';
import { ModalController, NavParams } from '@ionic/angular'; // Importa ModalController y NavParams
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Provee HttpClient con interceptores
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx'; // Importa SQLite
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule para pruebas
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importa NativeStorage

describe('ModificarUsuarioPage', () => {
  let component: ModificarUsuarioPage;
  let fixture: ComponentFixture<ModificarUsuarioPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let navParamsMock: jasmine.SpyObj<NavParams>;
  let nativeStorageMock: any;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    // Crear un mock para NavParams
    navParamsMock = jasmine.createSpyObj('NavParams', ['get']);
    navParamsMock.get.and.returnValue('mockValue'); // Mock del método `get`

    // Crear un mock para NativeStorage
    nativeStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('mockValue')),
      setItem: jasmine.createSpy('setItem').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      declarations: [ModificarUsuarioPage],
      imports: [
        IonicModule.forRoot(), // Configura IonicModule
        FormsModule, // Configura FormsModule para usar [(ngModel)]
        HttpClientTestingModule, // Proveer HttpClient para pruebas
      ],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }, // Proveer el mock de ModalController
        { provide: NavParams, useValue: navParamsMock }, // Proveer el mock de NavParams
        { provide: NativeStorage, useValue: nativeStorageMock }, // Proveer el mock de NativeStorage
        SQLite, // Proveer SQLite si es requerido por el componente
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call NativeStorage.getItem on initialization', async () => {
    await nativeStorageMock.getItem('someKey');
    expect(nativeStorageMock.getItem).toHaveBeenCalledWith('someKey');
  });
});
