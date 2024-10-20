import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModProventasPage } from './mod-proventas.page';

describe('ModProventasPage', () => {
  let component: ModProventasPage;
  let fixture: ComponentFixture<ModProventasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
