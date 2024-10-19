import { Injectable } from '@angular/core';

interface Boundary {
  north: number;
  south: number;
  east: number;
  west: number;
}


@Injectable({
  providedIn: 'root'
})
export class LocationValidationService  {

  private comunaBoundaries: Record<number, Boundary> ={
    '1': { // Arica
      north: -18.4583,
      south: -18.4783,
      east: -70.3080,
      west: -70.3280
    },
    '2': { // Parinacota
      north: -18.2000,
      south: -18.4000,
      east: -69.9000,
      west: -70.1000
    },
    '3': { // Putre
      north: -18.1000,
      south: -18.3000,
      east: -69.8000,
      west: -70.0000
    },
    '4': { // Camino a Putre
      north: -18.0500,
      south: -18.2500,
      east: -69.7500,
      west: -69.9500
    },
    '5': { // General Lagos
      north: -17.9000,
      south: -18.1000,
      east: -69.6000,
      west: -69.8000
    },
    '6': { // Iquique
      north: -20.2000,
      south: -20.4000,
      east: -70.1000,
      west: -70.3000
    },
    '7': { // Alto Hospicio
      north: -20.1500,
      south: -20.3500,
      east: -70.0500,
      west: -70.2500
    },
    '8': { // Pica
      north: -20.3000,
      south: -20.5000,
      east: -69.8000,
      west: -70.0000
    },
    '9': { // Pozo Almonte
      north: -20.2500,
      south: -20.4500,
      east: -69.7500,
      west: -69.9500
    },
    '10': { // Camiña
      north: -19.9000,
      south: -20.1000,
      east: -69.6000,
      west: -69.8000
    },
    '11': { // Antofagasta
      north: -23.5000,
      south: -23.7000,
      east: -70.3000,
      west: -70.5000
    },
    '12': { // Calama
      north: -22.4000,
      south: -22.6000,
      east: -68.9000,
      west: -69.1000
    },
    '13': { // Tocopilla
      north: -22.0000,
      south: -22.2000,
      east: -70.1000,
      west: -70.3000
    },
    '14': { // San Pedro de Atacama
      north: -22.9000,
      south: -23.1000,
      east: -68.2000,
      west: -68.4000
    },
    '15': { // Mejillones
      north: -23.0000,
      south: -23.2000,
      east: -70.4000,
      west: -70.6000
    },
    '16': { // Copiapó
      north: -27.3000,
      south: -27.5000,
      east: -70.3000,
      west: -70.5000
    },
    '17': { // Caldera
      north: -27.0000,
      south: -27.2000,
      east: -70.8000,
      west: -71.0000
    },
    '18': { // Tierra Amarilla
      north: -27.4000,
      south: -27.6000,
      east: -70.4000,
      west: -70.6000
    },
    '19': { // Freirina
      north: -28.5000,
      south: -28.7000,
      east: -71.2000,
      west: -71.4000
    },
    '20': { // Huasco
      north: -28.4000,
      south: -28.6000,
      east: -71.1000,
      west: -71.3000
    },
    '21': { // La Serena
      north: -29.9000,
      south: -30.1000,
      east: -71.2000,
      west: -71.4000
    },
    '22': { // Coquimbo
      north: -29.9500,
      south: -30.1500,
      east: -71.3000,
      west: -71.5000
    },
    '23': { // Ovalle
      north: -30.6000,
      south: -30.8000,
      east: -71.2000,
      west: -71.4000
    },
    '24': { // Andacollo
      north: -30.2000,
      south: -30.4000,
      east: -71.1000,
      west: -71.3000
    },
    '25': { // Vicuña
      north: -30.0000,
      south: -30.2000,
      east: -70.7000,
      west: -70.9000
    },
    '26': { // Valparaíso
      north: -33.0000,
      south: -33.2000,
      east: -71.6000,
      west: -71.8000
    },
    '27': { // Viña del Mar
      north: -33.0000,
      south: -33.2000,
      east: -71.5000,
      west: -71.7000
    },
    '28': { // Quilpué
      north: -33.0500,
      south: -33.2500,
      east: -71.4500,
      west: -71.6500
    },
    '29': { // San Antonio
      north: -33.6000,
      south: -33.8000,
      east: -71.6000,
      west: -71.8000
    },
    '30': { // Los Andes
      north: -32.8000,
      south: -33.0000,
      east: -70.6000,
      west: -70.8000
    },
    '31': { // Colina
      north: -33.1000,
      south: -33.3000,
      east: -70.6000,
      west: -70.8000
    },
    '32': { // Lampa
      north: -33.2000,
      south: -33.4000,
      east: -70.9000,
      west: -71.1000
    },
    '33': { // Til Til
      north: -33.3000,
      south: -33.5000,
      east: -70.8000,
      west: -71.0000
    },
    '34': { // Pirque
      north: -33.6000,
      south: -33.8000,
      east: -70.5000,
      west: -70.7000
    },
    '35': { // Puente Alto
      north: -33.5500,
      south: -33.7500,
      east: -70.5500,
      west: -70.7500
    },
    '36': { // San José de Maipo
      north: -33.7000,
      south: -33.9000,
      east: -70.4000,
      west: -70.6000
    },
    '37': { // Buin
      north: -33.7500,
      south: -33.9500,
      east: -70.7500,
      west: -70.9500
    },
    '38': { // Calera de Tango
      north: -33.6000,
      south: -33.8000,
      east: -70.8000,
      west: -71.0000
    },
    '39': { // Paine
      north: -33.8000,
      south: -34.0000,
      east: -70.7500,
      west: -70.9500
    },
    '40': { // San Bernardo
      north: -33.6000,
      south: -33.8000,
      east: -70.7000,
      west: -70.9000
    },
    '41': { // Alhué
      north: -34.0000,
      south: -34.2000,
      east: -71.0000,
      west: -71.2000
    },
    '42': { // Curacaví
      north: -33.4000,
      south: -33.6000,
      east: -71.1000,
      west: -71.3000
    },
    '43': { // María Pinto
      north: -33.5000,
      south: -33.7000,
      east: -71.2000,
      west: -71.4000
    },
    '44': { // Melipilla
      north: -33.7000,
      south: -33.9000,
      east: -71.2000,
      west: -71.4000
    },
    '45': { // San Pedro
      north: -33.9000,
      south: -34.1000,
      east: -71.3000,
      west: -71.5000
    },
    '46': { // Cerrillos
      north: -33.5000,
      south: -33.7000,
      east: -70.7000,
      west: -70.9000
    },
    '47': { // Cerro Navia
      north: -33.4000,
      south: -33.6000,
      east: -70.7000,
      west: -70.9000
    },
    '48': { // Conchalí
      north: -33.3500,
      south: -33.5500,
      east: -70.6500,
      west: -70.8500
    },
    '49': { // El Bosque
      north: -33.6000,
      south: -33.8000,
      east: -70.7000,
      west: -70.9000
    },
    '50': { // Estación Central
      north: -33.4500,
      south: -33.6500,
      east: -70.7000,
      west: -70.9000
    },
    '51': { // Huechuraba
      north: -33.3500,
      south: -33.5500,
      east: -70.6500,
      west: -70.8500
    },
    '52': { // Independencia
      north: -33.4000,
      south: -33.6000,
      east: -70.6500,
      west: -70.8500
    },
    '53': { // La Cisterna
      north: -33.5500,
      south: -33.7500,
      east: -70.7000,
      west: -70.9000
    },
    '54': { // La Granja
      north: -33.5000,
      south: -33.7000,
      east: -70.6500,
      west: -70.8500
    },
    '55': { // La Florida
      north: -33.4500,
      south: -33.6500,
      east: -70.6000,
      west: -70.8000
    },
    '56': { // La Pintana
      north: -33.6000,
      south: -33.8000,
      east: -70.6500,
      west: -70.8500
    },
    '57': { // La Reina
      north: -33.4000,
      south: -33.6000,
      east: -70.5500,
      west: -70.7500
    },
    '58': { // Las Condes
      north: -33.3500,
      south: -33.5500,
      east: -70.5000,
      west: -70.7000
    },
    '59': { // Lo Barnechea
      north: -33.3000,
      south: -33.5000,
      east: -70.4500,
      west: -70.6500
    },
    '60': { // Lo Espejo
      north: -33.5500,
      south: -33.7500,
      east: -70.7000,
      west: -70.9000
    },
    '61': { // Lo Prado
      north: -33.4500,
      south: -33.6500,
      east: -70.7500,
      west: -70.9500
    },
    '62': { // Macul
      north: -33.4500,
      south: -33.6500,
      east: -70.6000,
      west: -70.8000
    },
    '63': { // Maipú
      north: -33.5000,
      south: -33.7000,
      east: -70.7500,
      west: -70.9500
    },
    '64': { // Ñuñoa
      north: -33.4500,
      south: -33.6500,
      east: -70.6000,
      west: -70.8000
    },
    '65': { // Pedro Aguirre Cerda
      north: -33.5000,
      south: -33.7000,
      east: -70.6500,
      west: -70.8500
    },
    '66': { // Peñalolén
      north: -33.4500,
      south: -33.6500,
      east: -70.5500,
      west: -70.7500
    },
    '67': { // Providencia
      north: -33.4000,
      south: -33.6000,
      east: -70.6000,
      west: -70.8000
    },
    '68': { // Pudahuel
      north: -33.4500,
      south: -33.6500,
      east: -70.7500,
      west: -70.9500
    },
    '69': { // Quilicura
      north: -33.3500,
      south: -33.5500,
      east: -70.7000,
      west: -70.9000
    },
    '70': { // Quinta Normal
      north: -33.4500,
      south: -33.6500,
      east: -70.7000,
      west: -70.9000
    },
    '71': { // Recoleta
      north: -33.4000,
      south: -33.6000,
      east: -70.6500,
      west: -70.8500
    },
    '72': { // Renca
      north: -33.4000,
      south: -33.6000,
      east: -70.7500,
      west: -70.9500
    },
    '73': { // San Miguel
      north: -33.5000,
      south: -33.7000,
      east: -70.6500,
      west: -70.8500
    },
    '74': { // San Joaquín
      north: -33.5000,
      south: -33.7000,
      east: -70.6500,
      west: -70.8500
    },
    '75': { // San Ramón
      north: -33.5500,
      south: -33.7500,
      east: -70.6500,
      west: -70.8500
    },
    '76': { // Santiago
      north: -33.4500,
      south: -33.6500,
      east: -70.6500,
      west: -70.8500
    },
    '77': { // Vitacura
      north: -33.3500,
      south: -33.5500,
      east: -70.5500,
      west: -70.7500
    },
    '78': { // El Monte
      north: -33.7000,
      south: -33.9000,
      east: -71.0000,
      west: -71.2000
    },
    '79': { // Isla de Maipo
      north: -33.7500,
      south: -33.9500,
      east: -71.0000,
      west: -71.2000
    },
    '80': { // Padre Hurtado
      north: -33.6000,
      south: -33.8000,
      east: -70.9000,
      west: -71.1000
    },
    '81': { // Peñaflor
      north: -33.6000,
      south: -33.8000,
      east: -70.9000,
      west: -71.1000
    },
    '82': { // Talagante
      north: -33.6500,
      south: -33.8500,
      east: -70.9500,
      west: -71.1500
    },
    '83': { // Rancagua
      north: -34.1000,
      south: -34.3000,
      east: -70.7000,
      west: -70.9000
    },
    '84': { // San Fernando
      north: -34.5000,
      south: -34.7000,
      east: -70.9000,
      west: -71.1000
    },
    '85': { // Machalí
      north: -34.2000,
      south: -34.4000,
      east: -70.6000,
      west: -70.8000
    },
    '86': { // Pichilemu
      north: -34.4000,
      south: -34.6000,
      east: -72.0000,
      west: -72.2000
    },
    '87': { // Santa Cruz
      north: -34.6000,
      south: -34.8000,
      east: -71.3000,
      west: -71.5000
    },
    '88': { // Talca
      north: -35.4000,
      south: -35.6000,
      east: -71.6000,
      west: -71.8000
    },
    '89': { // Curicó
      north: -34.9000,
      south: -35.1000,
      east: -71.2000,
      west: -71.4000
    },
    '90': { // Linares
      north: -35.8000,
      south: -36.0000,
      east: -71.6000,
      west: -71.8000
    },
    '91': { // Molina
      north: -35.1000,
      south: -35.3000,
      east: -71.3000,
      west: -71.5000
    },
    '92': { // Cauquenes
      north: -35.9000,
      south: -36.1000,
      east: -72.3000,
      west: -72.5000
    },
    '93': { // Chillán
      north: -36.6000,
      south: -36.8000,
      east: -72.0000,
      west: -72.2000
    },
    '94': { // Chillán Viejo
      north: -36.6500,
      south: -36.8500,
      east: -72.0500,
      west: -72.2500
    },
    '95': { // Pemuco
      north: -36.9000,
      south: -37.1000,
      east: -72.4000,
      west: -72.6000
    },
    '96': { // San Carlos
      north: -36.4000,
      south: -36.6000,
      east: -71.9000,
      west: -72.1000
    },
    '97': { // Yungay
      north: -37.1000,
      south: -37.3000,
      east: -72.0000,
      west: -72.2000
    },
    '98': { // Concepción
      north: -36.8000,
      south: -37.0000,
      east: -73.0000,
      west: -73.2000
    },
    '99': { // Talcahuano
      north: -36.7000,
      south: -36.9000,
      east: -73.1000,
      west: -73.3000
    },
    '100': { // Los Ángeles
      north: -37.4000,
      south: -37.6000,
      east: -72.3000,
      west: -72.5000
    },
    '101': { // Chillán
      north: -36.6000,
      south: -36.8000,
      east: -72.0000,
      west: -72.2000
    },
    '102': { // Coronel
      north: -37.0000,
      south: -37.2000,
      east: -73.1000,
      west: -73.3000
    },
    '103': { // Temuco
      north: -38.7000,
      south: -38.9000,
      east: -72.6000,
      west: -72.8000
    },
    '104': { // Padre Las Casas
      north: -38.8000,
      south: -39.0000,
      east: -72.6000,
      west: -72.8000
    },
    '105': { // Villarrica
      north: -39.2000,
      south: -39.4000,
      east: -72.2000,
      west: -72.4000
    },
    '106': { // Pucón
      north: -39.3000,
      south: -39.5000,
      east: -71.9000,
      west: -72.1000
    },
    '107': { // Freire
      north: -38.9000,
      south: -39.1000,
      east: -72.5000,
      west: -72.7000
    },
    '108': { // Valdivia
      north: -39.8000,
      south: -40.0000,
      east: -73.2000,
      west: -73.4000
    },
    '109': { // La Unión
      north: -40.3000,
      south: -40.5000,
      east: -73.1000,
      west: -73.3000
    },
    '110': { // Río Bueno
      north: -40.3000,
      south: -40.5000,
      east: -72.9000,
      west: -73.1000
    },
    '111': { // Lago Ranco
      north: -40.2000,
      south: -40.4000,
      east: -72.8000,
      west: -73.0000
    },
    '112': { // Futrono
      north: -40.1000,
      south: -40.3000,
      east: -72.7000,
      west: -72.9000
    },
    '113': { // Puerto Montt
      north: -41.4000,
      south: -41.6000,
      east: -72.9000,
      west: -73.1000
    },
    '114': { // Osorno
      north: -40.6000,
      south: -40.8000,
      east: -73.1000,
      west: -73.3000
    },
    '115': { // Puerto Varas
      north: -41.3000,
      south: -41.5000,
      east: -72.9000,
      west: -73.1000
    },
    '116': { // Castro
      north: -42.5000,
      south: -42.7000,
      east: -73.8000,
      west: -74.0000
    },
    '117': { // Ancud
      north: -41.9000,
      south: -42.1000,
      east: -73.8000,
      west: -74.0000
    },
    '118': { // Coyhaique
      north: -45.5000,
      south: -45.7000,
      east: -72.0000,
      west: -72.2000
    },
    '119': { // Puerto Aysén
      north: -45.4000,
      south: -45.6000,
      east: -72.7000,
      west: -72.9000
    },
    '120': { // Chile Chico
      north: -46.5000,
      south: -46.7000,
      east: -71.7000,
      west: -71.9000
    },
    '121': { // Cisnes
      north: -44.8000,
      south: -45.0000,
      east: -72.7000,
      west: -72.9000
    },
    '122': { // Lago Verde
      north: -44.3000,
      south: -44.5000,
      east: -72.2000,
      west: -72.4000
    },
    '123': { // Punta Arenas
      north: -53.1000,
      south: -53.3000,
      east: -70.9000,
      west: -71.1000
    },
    '124': { // Puerto Natales
      north: -51.7000,
      south: -51.9000,
      east: -72.5000,
      west: -72.7000
    },
    '125': { // Porvenir
      north: -53.3000,
      south: -53.5000,
      east: -70.4000,
      west: -70.6000
    },
    '126': { // Cerro Castillo
      north: -51.3000,
      south: -51.5000,
      east: -72.3000,
      west: -72.5000
    },
    '127': { // Timaukel
      north: -54.0000,
      south: -54.2000,
      east: -69.5000,
      west: -69.7000
    }
    // Add more commune boundaries here
  };

  isWithinBoundary(comunaId: number, lat: number, lng: number): boolean {
    const boundary = this.comunaBoundaries[comunaId];
    return lat <= boundary.north && lat >= boundary.south && lng <= boundary.east && lng >= boundary.west;
  }
}