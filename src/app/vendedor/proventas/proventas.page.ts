import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-proventas',
  templateUrl: './proventas.page.html',
  styleUrls: ['./proventas.page.scss'],
})
export class ProventasPage implements OnInit {
  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController
  ) { }


  ngOnInit() {
    this.productForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      valor: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      stock: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    });
  }

  async onSubmit() {
    if (this.productForm.valid) {
      // Lógica para publicar los productos
      console.log('Formulario válido:', this.productForm.value);
      await this.presentAlert('Éxito', 'Los productos han sido publicados correctamente.');
    } else {
      // Mensaje de error
      console.log('Formulario no válido');
      await this.presentAlert('Error', 'Por favor, complete todos los campos correctamente.');
    }
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
