import { Component, inject } from '@angular/core';

import { MapService, PlacesService } from '../../services';

@Component({
	selector: 'maps-btn-my-location',
	templateUrl: './btn-my-location.component.html',
	styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

	private placesService = inject (PlacesService) ;
	private mapService = inject (MapService);
	// constructor (private placesService: PlacesService, private mapService: MapService) {}

	goToMyLocation () {
		if (!this.placesService.isUserLocationReady) throw Error ('No hay ubicación del usuario');
		if (!this.mapService.isMapReady) throw Error ('No hay mapa disponible');

		// console.log ('Ir a mi ubi');
		this.mapService.flyTo (this.placesService.userLocation!);
	}
}