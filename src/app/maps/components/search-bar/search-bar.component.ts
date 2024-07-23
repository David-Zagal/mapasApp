import { Component, inject } from '@angular/core';

import { MapService, PlacesService } from '../../services';

@Component({
	selector: 'maps-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

	private debounceTimer?: NodeJS.Timeout;
	private placesService = inject (PlacesService);
	private mapService = inject (MapService);

	constructor () {}

	onQueryChanged (query: string = '') {
		// console.log (query);
		if (query === '') {
			this.mapService.cleanMap ();
		}

		if (this.debounceTimer) clearTimeout (this.debounceTimer);

		this.debounceTimer = setTimeout (() => {
			// console.log ('Mandar query: ', query);
			this.placesService.getPlaceByQuery (query);
		}, 350);
	}
}