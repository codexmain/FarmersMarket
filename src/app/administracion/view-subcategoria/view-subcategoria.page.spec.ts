import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSubcategoriaPage } from './view-subcategoria.page';
import { ModalController } from '@ionic/angular'; // Importa ModalController

describe('ViewSubcategoriaPage', () => {
  let component: ViewSubcategoriaPage;
  let fixture: ComponentFixture<ViewSubcategoriaPage>;
  let modalControllerMock: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerMock = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    await TestBed.configureTestingModule({
      declarations: [ViewSubcategoriaPage],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }, // Proveer el mock de ModalController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSubcategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
