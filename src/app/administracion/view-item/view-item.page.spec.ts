import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewItemPage } from './view-item.page';
import { ModalController } from '@ionic/angular'; // Importar ModalController

describe('ViewItemPage', () => {
  let component: ViewItemPage;
  let fixture: ComponentFixture<ViewItemPage>;
  let modalControllerMock: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear un mock para ModalController
    modalControllerMock = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    await TestBed.configureTestingModule({
      declarations: [ViewItemPage],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }, // Proveer el mock de ModalController
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
