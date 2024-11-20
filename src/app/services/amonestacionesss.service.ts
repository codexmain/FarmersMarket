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
  private publicKey = 'BryLkJ9yYeK-f6VcY'; // API key de SendGrid
  private services_key = 'service_gw4eupb';
  private template_id = 'template_u7rklhb'; // Reemplaza con el ID de tu plantilladecorreo

  listadoCmbProdAmnstones = new BehaviorSubject([]);
  listadoAmonestaciones = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  enviarAmonestacion(correo: string, descripcion: string, idProducto: number | null = null): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      service_id: this.services_key,
      template_id: this.template_id,
      user_id: this.publicKey,
      template_params: {
        email: correo,
        message: `Alerta, tienes un poblema con tu cuenta:
        ID Producto: ${idProducto}
        Detalles: ${descripcion}`
      }
    };

    return this.http.post(this.apiUrl, body, { headers, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error al enviar el correo:', error);
        return throwError('Error en el envío del correo: ' + (error.error || error.message || 'Error desconocido'));
      })
    );
  }


  /*
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
    this.databaseService.envia(correo, descripcion).subscribe({
      next: () => console.log('Correo de amonestación enviado al usuario:', correo),
      error: (err) => console.error('Error en el envío de correo de amonestación:', err)
    });
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


  // Método para seleccionar todas las amonestaciones
  seleccionarAmonestaciones() {
    this.databaseService.seleccionarAmonestaciones() // Llama a la función en el servicio de base de datos
      .then((items) => {
        this.listadoAmonestaciones.next(items as any);
      });
  }
      */
}