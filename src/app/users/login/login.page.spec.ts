import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ModalController } from '@ionic/angular'; // Importa ModalController

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let modalControllerMock: any;

  beforeEach(async () => {
    // Crea un mock para ModalController
    modalControllerMock = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({ present: jasmine.createSpy('present') })),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: ModalController, useValue: modalControllerMock }, // Proporciona el mock de ModalController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
