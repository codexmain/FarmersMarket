import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { ModalController } from '@ionic/angular'; // Importa ModalController

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Crea un mock para ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') })),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterPage],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }, // Proporciona el mock de ModalController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
