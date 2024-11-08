import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AmonestacionService {
  private apiUrl = 'https://api.emailjs.com/api/v1.0/email/send'; // URL de la API de envío de correos
  private publicKey = 'APICHULA'; // Public Key de EmailJS
  private servicesKey = 'APICHULA'; // Service ID de EmailJS
  private templateId = 'APICHULA'; // ID de la plantilla de correo en EmailJS

  constructor(private http: HttpClient) { }

  // Método para enviar una amonestación al usuario
  enviarAmonestacion(correo: string, descripcion: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      service_id: this.servicesKey,
      template_id: this.templateId,
      user_id: this.publicKey,
      template_params: {
        email: correo,
        mensaje: descripcion
      }
    };

    return this.http.post(this.apiUrl, body, { headers, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error al enviar el correo de amonestación:', error);
        return throwError('Error en el envío del correo de amonestación: ' + (error.error || error.message || 'Error desconocido'));
      })
    );
  }
}
