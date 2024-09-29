import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUsuariosPage } from './add-usuarios.page';

describe('AddUsuariosPage', () => {
  let component: AddUsuariosPage;
  let fixture: ComponentFixture<AddUsuariosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
