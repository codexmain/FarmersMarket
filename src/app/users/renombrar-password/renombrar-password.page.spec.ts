import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenombrarPasswordPage } from './renombrar-password.page';

describe('RenombrarPasswordPage', () => {
  let component: RenombrarPasswordPage;
  let fixture: ComponentFixture<RenombrarPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenombrarPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
