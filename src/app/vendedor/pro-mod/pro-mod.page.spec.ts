import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProModPage } from './pro-mod.page';

describe('ProModPage', () => {
  let component: ProModPage;
  let fixture: ComponentFixture<ProModPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProModPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
