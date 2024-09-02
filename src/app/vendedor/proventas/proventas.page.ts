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
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9\\s]+$')]],
      valor: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$'), Validators.min(1), Validators.max(999999)]],
      descripcion: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(500), Validators.pattern('^[a-zA-Z0-9\\s.,!?]+$')]],
      stock: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$'), Validators.min(1), Validators.max(99)]],
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

  async agregarProducto() {
    if (this.productForm.valid) {
      // Aquí puedes agregar la lógica para agregar el producto a la lista
      console.log('Producto agregado:', this.productForm.value);
      await this.presentAlert('Producto Agregado', 'El producto ha sido agregado a la lista.');
    } else {
      await this.presentAlert('Error', 'Por favor, complete todos los campos correctamente antes de agregar.');
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
