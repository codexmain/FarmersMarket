import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModCuentaPage } from './mod-cuenta.page';

describe('ModCuentaPage', () => {
  let component: ModCuentaPage;
  let fixture: ComponentFixture<ModCuentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
