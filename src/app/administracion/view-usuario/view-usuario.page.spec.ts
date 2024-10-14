import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewUsuarioPage } from './view-usuario.page';

describe('ViewUsuarioPage', () => {
  let component: ViewUsuarioPage;
  let fixture: ComponentFixture<ViewUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
