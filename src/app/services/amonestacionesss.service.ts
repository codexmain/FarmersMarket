import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataBaseService } from '../services/data-base.service'; // Importa tu servicio de base de datos
import { OlvideContraService } from './olvide-contra.service'; // Servicio de envío de correo para amonestación

@Injectable({
  providedIn: 'root'
})
export class AmonestacionesssService {
  private apiUrl = 'https://api.emailjs.com/api/v1.0/email/send'; // URL de la API de envío de correos
  private publicKey = 'APICHULA'; // Public Key de EmailJS
  private servicesKey = 'APICHULA'; // Service ID de EmailJS
  private templateId = 'APICHULA'; // ID de la plantilla de correo en EmailJS

  listadoCmbProdAmnstones = new BehaviorSubject([]);
  listadoAmonestaciones = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    private databaseService: DataBaseService, // Inyecta el servicio de base de datos
    private olvideContraService: OlvideContraService // Inyecta el servicio para el envío de correo
  ) { }

  // Método para enviar una amonestación al usuario
  async enviarAmonestacion(correo: string, descripcion: string, idProducto: number | null = null): Promise<void> {
    try {
      await this.databaseService.enviarAmonestacion(correo, descripcion, idProducto); // Llama al método en el servicio de base de datos
      this.sendAmonestacionEmail(correo, descripcion);
      console.log('Amonestación enviada y registrada para el usuario:', correo);
    } catch (error) {
      console.error('Error al enviar la amonestación desde el servicio de gestión:', error);
      throw error;
    }
  }

  private sendAmonestacionEmail(correo: string, descripcion: string) {
    this.olvideContraService.enviarCorreo(correo, descripcion).subscribe({
      next: () => console.log('Correo de amonestación enviado al usuario:', correo),
      error: (err) => console.error('Error en el envío de correo de amonestación:', err)
    });
  }

  // Construcción del combobox para mostrar los productos del usuario en las amonestaciones
  fetchCmbProdAmnstones(): Observable<any[]> {
    return this.listadoCmbProdAmnstones.asObservable();
  }

  seleccionarCmbProdaAmonestar(idProveedor: number) {
    return this.databaseService.seleccionarCmbProdaAmonestar(idProveedor) // Llama a la función en el servicio de base de datos
      .then((items) => {
        this.listadoCmbProdAmnstones.next(items as any);
      });
  }

  // Método para obtener el listado de amonestaciones
  fetchAmonestaciones(): Observable<any[]> {
    return this.listadoAmonestaciones.asObservable();
  }

  // Método para insertar una amonestación
  insertarAmonestacion(usuario_id: number, id_producto: number, descripcion: string) {
    this.databaseService.insertarAmonestacion(usuario_id, id_producto, descripcion) // Llama a la función en el servicio de base de datos
      .then(() => this.seleccionarAmonestaciones())
      .catch(error => console.error('Error al insertar amonestación:', error));
  }

  // Método para seleccionar todas las amonestaciones
  seleccionarAmonestaciones() {
    this.databaseService.seleccionarAmonestaciones() // Llama a la función en el servicio de base de datos
      .then((items) => {
        this.listadoAmonestaciones.next(items as any);
      });
  }
}
