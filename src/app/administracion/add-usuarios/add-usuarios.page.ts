import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { GoogleMap } from '@capacitor/google-maps';

declare var google: any; // Declare Google Maps variable


@Component({
  selector: 'app-add-usuarios',
  templateUrl: './add-usuarios.page.html',
  styleUrls: ['./add-usuarios.page.scss'],
})


export class AddUsuariosPage implements OnInit {
  arrayCmbRegiones: any = [
    {
      id: '',
      nombre: ''
    }
  ]

  arrayCmbComunas: any = [
    {
      id: '',
      nombre: '',
    }
  ]

  arrayCmbTipoUsuario: any = [
    {
      id: '',
      descripcion: '',
    }
  ]


  pNombre: string = '';
  sNombre: string = '';
  aPaterno: string = '';
  aMaterno: string = '';
  email: string = '';
  password: string = '';
  empresa: string = '';
  descEmpresa: string = '';

  estadoUsuario: string ='activo'; //estado del usuario por defecto
  tipoUsuario: number = 1 ; //tipo de usuario por defecto
  region!: number;
  comuna: number | undefined; 
  direccion: string = '';
  empresaObligatoria: boolean = false;
  descEmpresaObligatoria: boolean = false;

  //declarado parte de google maps
  map: any; // Variable pa mantener la instancia del mapa
  markerId: string | undefined; // Variable pa mantener la instancia del marcador(la cosita roja como globo)


  constructor(private bd: DataBaseService, private toastController: ToastController, private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 

  }



  
  ngOnInit() {

    
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchCmbRegiones().subscribe(res=>{
          this.arrayCmbRegiones = res;
        })

        this.bd.fetchCmbTipUsuario().subscribe(res=>{
          this.arrayCmbTipoUsuario = res;
        })     
      }
    })
    this.loadMap(); // Load map on initialization
    
  }
  async loadMap() {
    const mapRef = document.getElementById('map') as HTMLElement;

    if (!mapRef) {
        console.error("Map reference not found.");
        return; // Handle case where map element is not found
    }

    const selectedComunaCoordinates = this.getCoordinatesForComuna(this.comuna as number);

    if (!selectedComunaCoordinates) {
        console.error("No coordinates found for the selected comuna.");
        return; // Handle case where no comuna is selected
    }

    const newMap = await GoogleMap.create({
        id: 'my-map', // Unique identifier for this map instance
        element: mapRef, // Reference to the capacitor-google-map element
        apiKey: 'APIDEGMAPS', // Your Google Maps API Key
        config: {
            center: selectedComunaCoordinates, // Use comuna coordinates
            zoom: 12, // Initial zoom level
        },
    });

    this.map = newMap; // Store reference to the map instance

    // Add a marker at the selected comuna's coordinates
    const markerId = await newMap.addMarker({
        coordinate: selectedComunaCoordinates,
        title: 'Selected Location',
        draggable: true, // Make marker draggable
    });

    // Use markerId if needed later, e.g., for removing or updating
    console.log("Marker ID:", markerId); // Example usage

    // Listen for marker drag end event to update direccion
    await newMap.setOnMarkerDragEndListener((event) => {
        const latLng = {
            lat: event.latitude,
            lng: event.longitude,
        };
        this.direccion = `${latLng.lat}, ${latLng.lng}`; // Update direccion with new coordinates
    });
}
  getCoordinatesForComuna(comunaId: number) {
    const coordinatesLookup: { [key: string]: { lat: number; lng: number } } = {
      '1': { lat: -18.4783, lng: -70.3080 }, // Arica
        '2': { lat: -18.2000, lng: -70.3000 }, // Parinacota
        '3': { lat: -18.2000, lng: -69.2500 }, // Putre
        '4': { lat: -18.5000, lng: -69.2500 }, // Camino a Putre
        '5': { lat: -18.5000, lng: -69.5000 }, // General Lagos
        '6': { lat: -20.2144, lng: -70.1349 }, // Iquique
        '7': { lat: -20.3000, lng: -70.2000 }, // Alto Hospicio
        '8': { lat: -20.3000, lng: -69.0000 }, // Pica
        '9': { lat: -20.5000, lng: -69.2500 }, // Pozo Almonte
        '10': { lat: -20.4000, lng: -69.5000 }, // Camiña
        '11': { lat: -23.0333, lng: -68.1997 }, // Antofagasta
        '12': { lat: -22.5705, lng: -68.1193 }, // Calama
        '13': { lat: -22.2500, lng: -68.0000 }, // Tocopilla
        '14': { lat: -22.9000, lng: -68.0000 }, // San Pedro de Atacama
        '15': { lat: -23.0785, lng: -69.2098 }, // Mejillones
        '16': { lat: -24.1161, lng: -70.1678 }, // Copiapó
        '17': { lat: -24.1660, lng: -69.9119 }, // Caldera
        '18': { lat: -28.4081, lng: -70.7400 }, // Tierra Amarilla
        '19': { lat: -28.1600, lng: -70.5882 }, // Freirina
        '20': { lat: -29.9038, lng: -71.2519 }, // Huasco
        '21': { lat: -29.9060, lng: -71.2603 }, // La Serena
        '22': { lat: -30.6008, lng: -71.2046 }, // Coquimbo
        '23': { lat: -30.0302, lng: -71.1956 }, // Ovalle
        '24': { lat: -30.0328, lng: -70.6334 }, // Andacollo
        '25': { lat: -30.0328, lng: -70.6334 }, // Vicuña
        '26': { lat: -33.0465, lng: -71.6177 }, // Valparaíso
        '27': { lat: -33.0159, lng: -71.5375 }, // Viña del Mar
        '28': { lat: -33.0382, lng: -71.5000 }, // Quilpué
        '29': { lat: -33.5907, lng: -71.6038 }, // San Antonio
        '30': { lat: -33.0256, lng: -70.6000 }, // Los Andes
        '31': { lat: -33.2033, lng: -70.6766 }, // Colina
        '32': { lat: -33.2982, lng: -70.8912 }, // Lampa
        '33': { lat: -33.0858, lng: -70.8997 }, // Til Til
        '34': { lat: -33.6910, lng: -70.5823 }, // Pirque
        '35': { lat: -33.6135, lng: -70.5758 }, // Puente Alto
        '36': { lat: -33.7138, lng: -70.3538 }, // San José de Maipo
        '37': { lat: -33.7326, lng: -70.7478 }, // Buin
        '38': { lat: -33.6207, lng: -70.7779 }, // Calera de Tango
        '39': { lat: -33.8075, lng: -70.7395 }, // Paine
        '40': { lat: -33.5942, lng: -70.6996 }, // San Bernardo
        '41': { lat: -33.8581, lng: -71.1391 }, // Alhué
        '42': { lat: -33.4025, lng: -70.8121 }, // Curacaví
        '43': { lat: -33.4735, lng: -70.8503 }, // María Pinto
        '44': { lat: -33.6880, lng: -71.2151 }, // Melipilla
        '45': { lat: -33.8207, lng: -71.4624 }, // San Pedro
        '46': { lat: -33.4951, lng: -70.7188 }, // Cerrillos
        '47': { lat: -33.4329, lng: -70.7197 }, // Cerro Navia
        '48': { lat: -33.3928, lng: -70.6736 }, // Conchalí
        '49': { lat: -33.5437, lng: -70.6688 }, // El Bosque
        '50': { lat: -33.4569, lng: -70.7044 }, // Estación Central
        '51': { lat: -33.3750, lng: -70.6407 }, // Huechuraba
        '52': { lat: -33.4211, lng: -70.6514 }, // Independencia
        '53': { lat: -33.5184, lng: -70.6624 }, // La Cisterna
        '54': { lat: -33.5350, lng: -70.6353 }, // La Granja
        '55': { lat: -33.5278, lng: -70.5980 }, // La Florida
        '56': { lat: -33.5682, lng: -70.6228 }, // La Pintana
        '57': { lat: -33.4539, lng: -70.5685 }, // La Reina
        '58': { lat: -33.4018, lng: -70.5787 }, // Las Condes
        '59': { lat: -33.3510, lng: -70.5156 }, // Lo Barnechea
        '60': { lat: -33.4964, lng: -70.6743 }, // Lo Espejo
        '61': { lat: -33.4355, lng: -70.7195 }, // Lo Prado
        '62': { lat: -33.4762, lng: -70.5942 }, // Macul
        '63': { lat: -33.4912, lng: -70.7614 }, // Maipú
        '64': { lat: -33.4566, lng: -70.6137 }, // Ñuñoa
        '65': { lat: -33.4840, lng: -70.6518 }, // Pedro Aguirre Cerda
        '66': { lat: -33.4718, lng: -70.5822 }, // Peñalolén
        '67': { lat: -33.4254, lng: -70.6205 }, // Providencia
        '68': { lat: -33.4219, lng: -70.7816 }, // Pudahuel
        '69': { lat: -33.3650, lng: -70.7331 }, // Quilicura
        '70': { lat: -33.4337, lng: -70.6893 }, // Quinta Normal
        '71': { lat: -33.4266, lng: -70.6429 }, // Recoleta
        '72': { lat: -33.4013, lng: -70.6938 }, // Renca
        '73': { lat: -33.5005, lng: -70.6374 }, // San Miguel
        '74': { lat: -33.4981, lng: -70.6118 }, // San Joaquín
        '75': { lat: -33.5356, lng: -70.6472 }, // San Ramón
        '76': { lat: -33.4489, lng: -70.6693 }, // Santiago
        '77': { lat: -33.3881, lng: -70.5708 }, // Vitacura
        '78': { lat: -33.6826, lng: -70.9314 }, // El Monte
        '79': { lat: -33.7534, lng: -70.9046 }, // Isla de Maipo
        '80': { lat: -33.5783, lng: -70.7618 }, // Padre Hurtado
        '81': { lat: -33.6102, lng: -70.8797 }, // Peñaflor
        '82': { lat: -33.6652, lng: -70.9274 }, // Talagante
        '83': { lat: -34.1708, lng: -70.7393 }, // Rancagua
        '84': { lat: -34.5846, lng: -70.9909 }, // San Fernando
        '85': { lat: -34.1871, lng: -70.6745 }, // Machalí
        '86': { lat: -34.3864, lng: -72.0099 }, // Pichilemu
        '87': { lat: -34.6359, lng: -71.3662 }, // Santa Cruz
        '88': { lat: -35.4333, lng: -71.6656 }, // Talca
        '89': { lat: -34.9831, lng: -71.2369 }, // Curicó
        '90': { lat: -35.8500, lng: -71.5936 }, // Linares
        '91': { lat: -35.1247, lng: -71.2859 }, // Molina
        '92': { lat: -35.9583, lng: -72.3224 }, // Cauquenes
        '93': { lat: -36.6062, lng: -72.1034 }, // Chillán
        '94': { lat: -36.6062, lng: -72.1034 }, // Chillán Viejo
        '95': { lat: -36.9744, lng: -72.1053 }, // Pemuco
        '96': { lat: -36.4152, lng: -71.9573 }, // San Carlos
        '97': { lat: -37.0547, lng: -71.9365 }, // Yungay
        '98': { lat: -36.8270, lng: -73.0503 }, // Concepción
        '99': { lat: -36.7242, lng: -73.1162 }, // Talcahuano
        '100': { lat: -37.4697, lng: -72.3530 }, // Los Ángeles
        '101': { lat: -36.6062, lng: -72.1034 }, // Chillán
        '102': { lat: -37.0294, lng: -73.1360 }, // Coronel
        '103': { lat: -38.7359, lng: -72.5904 }, // Temuco
        '104': { lat: -38.7665, lng: -72.6051 }, // Padre Las Casas
        '105': { lat: -39.2800, lng: -71.9800 }, // Villarrica
        '106': { lat: -39.2760, lng: -71.9766 }, // Pucón
        '107': { lat: -38.9333, lng: -72.5500 }, // Freire
        '108': { lat: -39.8142, lng: -73.2459 }, // Valdivia
        '109': { lat: -40.2931, lng: -73.0843 }, // La Unión
        '110': { lat: -40.3336, lng: -72.9541 }, // Río Bueno
        '111': { lat: -40.3137, lng: -72.9914 }, // Lago Ranco
        '112': { lat: -40.1265, lng: -72.3948 }, // Futrono
        '113': { lat: -41.4717, lng: -72.9407 }, // Puerto Montt
        '114': { lat: -40.5720, lng: -73.1353 }, // Osorno
        '115': { lat: -41.3266, lng: -72.9842 }, // Puerto Varas
        '116': { lat: -42.4800, lng: -73.7623 }, // Castro
        '117': { lat: -41.8707, lng: -73.8208 }, // Ancud
        '118': { lat: -45.5752, lng: -72.0662 }, // Coyhaique
        '119': { lat: -45.4057, lng: -72.6918 }, // Puerto Aysén
        '120': { lat: -46.5406, lng: -71.7262 }, // Chile Chico
        '121': { lat: -44.7407, lng: -72.6077 }, // Cisnes
        '122': { lat: -44.6538, lng: -71.7962 }, // Lago Verde
        '123': { lat: -53.1638, lng: -70.9171 }, // Punta Arenas
        '124': { lat: -51.7263, lng: -72.5109 }, // Puerto Natales
        '125': { lat: -53.2971, lng: -70.3669 }, // Porvenir
        '126': { lat: -50.9951, lng: -72.8282 }, // Cerro Castillo
        '127': { lat: -54.8973, lng: -68.5664 }  // Timaukel

      // Add more communes here...
      // Ensure all necessary communes are included with their coordinates.
    };

    return coordinatesLookup[comunaId.toString()];
  }


  onRegionChange(event: any) {
    this.region = event.detail.value;
    
    if (this.region) {
      this.bd.seleccionarCmbComunas(this.region).then(() => {
        this.bd.fetchCmbComuna().subscribe(res => {
          this.arrayCmbComunas = res; // Assign obtained communes

          if (this.arrayCmbComunas.length > 0) {
            this.comuna = this.arrayCmbComunas[0].id; // Select first comuna by default
            this.loadMap(); // Load map with first comuna's coordinates
          }
        });
      });
    } else {
      this.arrayCmbComunas = [{ id: '', nombre: '' }];
      this.comuna = undefined; // Reset selected comuna
    }
  }





  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }


  onFieldsChange() {
    if (this.empresa.length > 0 || this.descEmpresa.length > 0) {
      this.empresaObligatoria = true;
      this.descEmpresaObligatoria = true;
      this.presentToast('Los campos "Empresa" y "Descripción Empresa" son ahora obligatorios y la cuenta será Proveedor/Vendedor.');
    } else {
      this.empresaObligatoria = false;
      this.descEmpresaObligatoria = false;
    }
  
    // Actualizar el tipo de usuario basado en la obligación de los campos
    this.tipoUsuario = (this.empresaObligatoria && this.descEmpresaObligatoria) ? 2 : 1;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async agregarUsuario() {

  // Validar pNombre

  if (!this.pNombre || this.pNombre.length < 2) {
    this.presentAlert('Error', 'El primer nombre es obligatorio y debe tener al menos 2 caracteres.');
    return;
  }

  // Validar aPaterno
  if (!this.aPaterno || this.aPaterno.length < 2) {
    this.presentAlert('Error', 'El apellido paterno es obligatorio y debe tener al menos 2 caracteres.');
    return;
  }
  
  // Validar empresa y descEmpresa si se han marcado como obligatorios
  if ((this.empresaObligatoria && !this.empresa) || (this.descEmpresaObligatoria && !this.descEmpresa)) {
    this.presentAlert('Error', 'Los campos "Empresa" y "Descripción Empresa" son obligatorios.');
    return;
  }

  //validacion tipo usuario
  if (!this.tipoUsuario) {
    this.presentAlert('Error', 'El tipo de usuario es obligatorio.');
    return;
  }

  //validacion tipo usuario
  if (!this.estadoUsuario) {
    this.presentAlert('Error', 'El Estado del usuario es obligatorio.');
    return;
  }


  // Validar email
  if (!this.email) {
    this.presentAlert('Error', 'El email es obligatorio.');
    return;
  }

  // Validar región
  if (!this.region) {
    this.presentAlert('Error', 'La región es obligatoria.');
    return;
  }

    // Validar comuna
  if (!this.comuna) {
    this.presentAlert('Error', 'La comuna es obligatoria.');
    return;
  }

    // Validar pNombre, sNombre, aPaterno, aMaterno
    const namePattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,}$/;
    if (!namePattern.test(this.pNombre) || !namePattern.test(this.aPaterno) ||
        (this.sNombre && !namePattern.test(this.sNombre)) ||
        (this.aMaterno && !namePattern.test(this.aMaterno))) {
      this.presentAlert('Error', 'Los nombres y apellidos deben tener al menos 2 caracteres y no contener números.');
      return;
    }
 


    // Validar empresa
    const empresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s&]{3,}$/;
    if (this.empresa && !empresaPattern.test(this.empresa)) {
      this.presentAlert('Error', 'El nombre de la empresa debe tener al menos 3 caracteres y solo puede contener letras, números y espacios.');
      return;
    }

    const descEmpresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,&%]{10,90}$/;
    if (this.descEmpresa && !descEmpresaPattern.test(this.descEmpresa)) {
      this.presentAlert('Error', 'La descripcion de la empresa debe estar en un rango de 10 a 90 caracteres y solo puede contener letras, números y espacios.');
      return;
    }


    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.presentAlert('Error', 'El formato del email no es válido.');
      return;
    }
    // Validar si el correo ya existe
    const correoExistente = await this.bd.verificarCorreoExistente(this.email);
    if (correoExistente) {
      this.presentAlert('Error', 'El correo ingresado ya está asociado a otra cuenta.');
      return;
    }


    // Validar dirección
    const direccionPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,]+$/;
    if (!direccionPattern.test(this.direccion)) {
      this.presentAlert('Error', 'La dirección solo puede contener letras, números y espacios.');
      return;
    }

      // Validar contraseña
  if (this.password.length < 10 || this.password.length > 30) {
    this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
    return;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
    this.presentAlert('Error', 'La contraseña debe contener al menos un carácter especial.');
    return;
  }

  if (/(\d)\1/.test(this.password) || /([a-zA-Z])\1/.test(this.password)) {
    this.presentAlert('Error', 'La contraseña no debe contener caracteres o números consecutivos repetidos.');
    return;
  }

  if (!/(?=.*[A-Z].*[A-Z])/.test(this.password)) {
    this.presentAlert('Error', 'La contraseña debe contener al menos dos letras mayúsculas.');
    return; 
  }

    // Si todas las validaciones pasan
    await this.bd.insertarUsuario(
      this.pNombre, this.sNombre, this.aPaterno, this.aMaterno, this.email, 
      this.password, this.empresa, this.descEmpresa, '', this.estadoUsuario, 
      this.tipoUsuario, this.comuna, this.direccion
    );
    this.presentAlert('Éxito', 'Se ha agregado el cliente exitosamente.');
    console.log('Formulario válido, proceder con el registro.');
    this.modalController.dismiss();
  }


 
}

