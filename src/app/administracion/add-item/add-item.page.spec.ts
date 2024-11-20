import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComprasPage } from 'src/app/cliente/compras/compras.page';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ComprasPage', () => {
  let component: ComprasPage;
  let fixture: ComponentFixture<ComprasPage>;

  // Mock DataBaseService
  const mockDbService = {
    getCarrosPorUsuario: jasmine.createSpy('getCarrosPorUsuario').and.returnValue(Promise.resolve([])),
    getProductosCompradosPorCarroId: jasmine.createSpy('getProductosCompradosPorCarroId').and.returnValue(Promise.resolve([])),
  };

  // Mock NativeStorage
  const mockNativeStorage = {
    getItem: jasmine.createSpy('getItem').and.returnValue(Promise.resolve('mockUserEmail@example.com')),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasPage],
      providers: [
        { provide: DataBaseService, useValue: mockDbService },
        { provide: NativeStorage, useValue: mockNativeStorage },
        provideHttpClient(withInterceptorsFromDi()), // Configuración moderna de HttpClient
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Para manejar Web Components
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user email and carros data on init', async () => {
    await component.ngOnInit();
    expect(mockNativeStorage.getItem).toHaveBeenCalledWith('userEmail');
    expect(mockDbService.getCarrosPorUsuario).toHaveBeenCalledWith('mockUserEmail@example.com');
  });

  it('should group carros by date', async () => {
    const carrosMock = [
      { id: 1, fecha_creacion: '2024-11-19 10:00:00' },
      { id: 2, fecha_creacion: '2024-11-19 12:00:00' },
      { id: 3, fecha_creacion: '2024-11-18 09:00:00' },
    ];
    mockDbService.getCarrosPorUsuario.and.returnValue(Promise.resolve(carrosMock));
    await component.ngOnInit();

    expect(component.carrosComprados['2024-11-19'].length).toBe(2);
    expect(component.carrosComprados['2024-11-18'].length).toBe(1);
  });
});
