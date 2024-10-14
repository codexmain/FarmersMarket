import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarItemPage } from './modificar-item.page';

describe('ModificarItemPage', () => {
  let component: ModificarItemPage;
  let fixture: ComponentFixture<ModificarItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
