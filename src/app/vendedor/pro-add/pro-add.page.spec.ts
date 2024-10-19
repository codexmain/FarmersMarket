import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProAddPage } from './pro-add.page';

describe('ProAddPage', () => {
  let component: ProAddPage;
  let fixture: ComponentFixture<ProAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
