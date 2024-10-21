import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service'; // Asegúrate de importar tu servicio de base de datos
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-proventas',
  templateUrl: './add-proventas.page.html',
  styleUrls: ['./add-proventas.page.scss'],
})
export class AddProventasPage implements OnInit {
  proveedorId: number = 0;
  categorias: any[] = [];
  subcategorias: any[] = [];
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  stock: number = 0;
  organico: number = 0; // 0 para no orgánico, 1 para orgánico
  subcategoriaId: number = 0;
  categoriaId: number = 0; // Definir la propiedad categoriaId
  foto_producto: string = '';
  imagen: any;

  constructor(private route: ActivatedRoute, private db: DataBaseService,
    public alertController: AlertController,
    private navCtrl: NavController) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.proveedorId = params['proveedorId']; // Recibir el proveedorId desde los parámetros de la ruta
    });

    // Obtener categorías al inicializar la página
    this.categorias = await this.obtenerCategorias();
  }

  async obtenerCategorias(): Promise<any[]> {
    const query = `SELECT * FROM categoria`;

    return new Promise((resolve, reject) => {
      this.db.database
        .executeSql(query, [])
        .then((data) => {
          let categorias: any[] = [];
          for (let i = 0; i < data.rows.length; i++) {
            categorias.push(data.rows.item(i));
          }
          resolve(categorias);
        })
        .catch((error) => {
          console.error('Error al obtener categorías', error);
          reject(error);
        });
    });
  }

  async obtenerSubcategoriasPorCategoria(categoriaId: number): Promise<any[]> {
    const query = `SELECT * FROM subcategoria WHERE categoria_id = ?`;

    return new Promise((resolve, reject) => {
      this.db.database
        .executeSql(query, [categoriaId])
        .then((data) => {
          let subcategorias: any[] = [];
          for (let i = 0; i < data.rows.length; i++) {
            subcategorias.push(data.rows.item(i));
          }
          resolve(subcategorias);
        })
        .catch((error) => {
          console.error('Error al obtener subcategorías', error);
          reject(error);
        });
    });
  }

  async agregarProducto() {
    try {
      await this.db.agregarProducto(
        this.proveedorId,
        this.nombre,
        this.descripcion,
        this.precio,
        this.stock,
        this.organico,
        this.subcategoriaId,
        this.foto_producto,
      );
      // Aquí puedes agregar un mensaje de éxito o redirigir a otra página
      console.log('Producto agregado con éxito');
      await this.presentAlert('Éxito', 'Usuario actualizado exitosamente.');
        this.irHaciaAtras();
    } catch (error) {
      console.error('Error al agregar producto', error);
      // Aquí puedes agregar un mensaje de error en la UI
    }
  }

  // Este método se puede usar en el HTML para cambiar las subcategorías cuando se seleccione una categoría
  async onCategoriaChange(categoriaId: number) {
    this.categoriaId = categoriaId; // Asignar la categoría seleccionada a categoriaId
    this.subcategorias = await this.obtenerSubcategoriasPorCategoria(categoriaId);
  }


  irHaciaAtras() {
    this.navCtrl.pop(); // Regresa a la página anterior
  }


  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    if (image && image.webPath) {
      this.foto_producto = image.webPath;
      this.imagen = image.webPath;
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
