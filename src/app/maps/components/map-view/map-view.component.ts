import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';

import { Map, Popup, Marker } from 'mapbox-gl';

import { MapService, PlacesService } from '../../services';

@Component({
	selector: 'maps-map-view',
	templateUrl: './map-view.component.html',
	styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {

	@ViewChild('mapDiv') mapDivElement!: ElementRef;

	private placesService = inject (PlacesService) ;
	private mapService = inject (MapService);
	// constructor (private placesService: PlacesService, private mapService: MapService) {}

	ngAfterViewInit (): void {
		if (!this.placesService.userLocation) throw Error ('No hay placesServices.userLocation');

		const map = new Map ({
			container: this.mapDivElement.nativeElement,
			style: 'mapbox://styles/mapbox/streets-v12', // light-v10
			center: this.placesService.userLocation,
			zoom: 14,
		});

		const popup = new Popup ()
		.setHTML (`
			<h6>Aquí estoy</h6>
			<span>Estoy en este lugar del mundo</span>
		`);

		new Marker ({ color: 'red' })
		.setLngLat (this.placesService.userLocation)
		.setPopup (popup)
		.addTo (map);

		this.mapService.setMap (map);
	}
}