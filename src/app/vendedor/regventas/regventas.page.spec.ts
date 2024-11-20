import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegventasPage } from './regventas.page';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegventasPage', () => {
  let component: RegventasPage;
  let fixture: ComponentFixture<RegventasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegventasPage],
      imports: [
        BrowserModule,
        IonicModule.forRoot(),
        HttpClientTestingModule, // Mock para HttpClient
      ],
      providers: [
        SQLite, // Proveedor de SQLite
        NativeStorage, // Proveedor de NativeStorage
        provideHttpClient(withInterceptorsFromDi()), // Configuración del cliente HTTP
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Para componentes personalizados
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
