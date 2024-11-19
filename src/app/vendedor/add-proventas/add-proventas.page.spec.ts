import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProventasPage } from './add-proventas.page';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute

describe('AddProventasPage', () => {
  let component: AddProventasPage;
  let fixture: ComponentFixture<AddProventasPage>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Crea un mock para ActivatedRoute
    activatedRouteMock = {
      snapshot: { paramMap: { get: (key: string) => 'mockValue' } }, // Simula la obtención de parámetros de la ruta
    };

    await TestBed.configureTestingModule({
      declarations: [AddProventasPage],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Proveer el mock de ActivatedRoute
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
