import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModUsuarioPage } from './mod-usuario.page';

describe('ModUsuarioPage', () => {
  let component: ModUsuarioPage;
  let fixture: ComponentFixture<ModUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
