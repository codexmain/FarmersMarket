import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProventasPage } from './proventas.page';

describe('ProventasPage', () => {
  let component: ProventasPage;
  let fixture: ComponentFixture<ProventasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
