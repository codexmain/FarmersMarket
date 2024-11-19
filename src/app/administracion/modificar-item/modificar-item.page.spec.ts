import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarItemPage } from './modificar-item.page';
import { ModalController } from '@ionic/angular';

describe('ModificarItemPage', () => {
  let component: ModificarItemPage;
  let fixture: ComponentFixture<ModificarItemPage>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Crear un mock para el ModalController
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss', 'present']);

    await TestBed.configureTestingModule({
      declarations: [ModificarItemPage],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy } // Proveer el mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModificarItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});