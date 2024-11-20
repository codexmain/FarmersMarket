import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OlvideContraService {
  private apiUrl = 'https://api.emailjs.com/api/v1.0/email/send'; // URL de la API para enviar correos
  private publicKey = 'pMgYuxH-AjMbTJdXF'; // API key de SendGrid
  private services_key = 'service_88b994g';
  private template_id = 'template_sh3syat'; // Reemplaza con el ID de tu plantilla de correo

  constructor(private http: HttpClient) { }

  enviarCorreo(correo: string, codigo: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      service_id: this.services_key,
      template_id: this.template_id,
      user_id: this.publicKey,
      template_params: {
        email: correo,
        mensaje: codigo
      }
    };

    return this.http.post(this.apiUrl, body, { headers, responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error al enviar el correo:', error);
        return throwError('Error en el envío del correo: ' + (error.error || error.message || 'Error desconocido'));
      })
    );
  }
}