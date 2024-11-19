import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegventasPage } from './regventas.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegventasPage', () => {
  let component: RegventasPage;
  let fixture: ComponentFixture<RegventasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegventasPage],
      imports: [HttpClientTestingModule], // Se agrega para mockear HttpClient
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Para evitar errores con componentes de Ionic
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
