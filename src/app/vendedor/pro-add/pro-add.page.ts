import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Camera, CameraResultType } from '@capacitor/camera'; // Importamos la cámara
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importamos NativeStorage
import { ActivatedRoute } from '@angular/router'; // Importamos ActivatedRoute para obtener los parámetros de la ruta

@Component({
  selector: 'app-pro-add',
  templateUrl: './pro-add.page.html',
  styleUrls: ['./pro-add.page.scss'],
}) 
export class ProAddPage implements OnInit {
  productForm!: FormGroup;
  categorias: any[] = [];
  subcategorias: any[] = [];
  categoriaSeleccionada: number | null = null;
  imagen: string | null = null;
  proveedor_id: number | null = null; // Será obtenido dinámicamente

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private databaseService: DataBaseService,
    private nativeStorage: NativeStorage, // Añadimos NativeStorage para obtener el email
    private route: ActivatedRoute // Añadimos ActivatedRoute para obtener parámetros de la ruta
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarCategorias();

    // Obtener el proveedor_id desde los parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.proveedor_id = params['proveedor_id'] ? Number(params['proveedor_id']) : null;
      console.log('Proveedor ID obtenido:', this.proveedor_id);
    });
  }

  // Inicializa el formulario con validaciones
  inicializarFormulario() {
    this.productForm = this.formBuilder.group({
      titulo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      valor: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(500),
        ],
      ],
      stock: [
        '',
        [
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
          Validators.max(99),
        ],
      ],
      organico: [0, Validators.required],
      subcategoria_id: ['', Validators.required],
      foto_producto: [''],
    });
  }

  // Método para capturar la foto del producto
  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      if (image && image.webPath) {
        this.imagen = image.webPath;
        this.productForm.patchValue({ foto_producto: image.webPath }); // Guardar la imagen en el formulario
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      await this.presentAlert('Error', 'No se pudo tomar la foto.');
    }
  }

  // Cargar categorías
  async cargarCategorias() {
    try {
      this.categorias = await this.databaseService.obtenerCategorias();
      console.log('Categorías cargadas:', this.categorias);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  // Cargar subcategorías basadas en la categoría seleccionada
  async cargarSubcategorias(event: any) {
    this.categoriaSeleccionada = event.detail.value;
    if (this.categoriaSeleccionada) {
      try {
        this.subcategorias = await this.databaseService.obtenerSubcategorias(
          this.categoriaSeleccionada
        );
        console.log('Subcategorías cargadas:', this.subcategorias);
      } catch (error) {
        console.error('Error al cargar subcategorías:', error);
      }
    } else {
      this.subcategorias = [];
    }
  }

  // Validar los campos del formulario
  async validateFields() {
    const formValues = this.productForm.value;

    if (
      !formValues.titulo ||
      formValues.titulo.length < 3 ||
      formValues.titulo.length > 50
    ) {
      await this.presentAlert(
        'Error',
        'El Título del producto debe tener entre 3 y 50 caracteres.'
      );
      return false;
    }

    if (!formValues.valor || formValues.valor <= 0) {
      await this.presentAlert(
        'Error',
        'El Valor del producto debe ser un número mayor a 0.'
      );
      return false;
    }

    if (
      !formValues.descripcion ||
      formValues.descripcion.length < 15 ||
      formValues.descripcion.length > 500
    ) {
      await this.presentAlert(
        'Error',
        'La Descripción del producto debe tener entre 15 y 500 caracteres.'
      );
      return false;
    }

    if (!formValues.stock || formValues.stock <= 0 || formValues.stock > 99) {
      await this.presentAlert(
        'Error',
        'El Stock debe ser un número entero entre 1 y 99.'
      );
      return false;
    }

    if (formValues.organico === undefined) {
      await this.presentAlert(
        'Error',
        'La procedencia del producto (Orgánico/No Orgánico) es un campo obligatorio.'
      );
      return false;
    }

    if (!formValues.subcategoria_id) {
      await this.presentAlert(
        'Error',
        'La Subcategoría es un campo obligatorio.'
      );
      return false;
    }

    return true;
  }

  // Función para agregar el producto con el proveedor_id asociado
  async onSubmit() {
    const isValid = await this.validateFields();
    if (!isValid) {
      return;
    }

    if (!this.proveedor_id) {
      await this.presentAlert('Error', 'No se pudo encontrar el proveedor.');
      return;
    }

    try {
      const productData = this.productForm.value;

      // Insertar el producto usando el proveedor_id
      await this.databaseService.insertarProducto(
        this.proveedor_id, // Ahora usamos el proveedor_id obtenido de los parámetros de la ruta
        productData.titulo,
        productData.descripcion,
        productData.valor,
        productData.stock,
        productData.organico,
        productData.foto_producto, // Asegúrate de que esta propiedad se está guardando correctamente
        productData.subcategoria_id
      );

      await this.presentAlert('Éxito', 'Producto registrado correctamente.');
      
      // Resetear el formulario y limpiar la imagen después de enviar el formulario
      this.productForm.reset();
      this.imagen = null; 
      
    } catch (error) {
      console.error('Error al registrar producto:', error);
      await this.presentAlert('Error', 'No se pudo registrar el producto.');
    }
    
  }

  // Método para mostrar una alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    
   await alert.present();
   }
}