import { inject, Injectable } from '@angular/core';

import { PlacesApiClient } from '../api';
import { MapService } from './map.service';
import { PlacesResponse, Feature } from '../interfaces/placesv1.interface';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {

	private placesApi = inject (PlacesApiClient);
	private mapService = inject (MapService);

	public userLocation?: [number, number];
	public isLoadingPlaces: boolean = false;
	public places: Feature[] = [];

	get isUserLocationReady (): boolean {
		return !!this.userLocation;
	}

	constructor () {
		this.getUserLocation ();
	}

	public async getUserLocation (): Promise<[number, number]> {
		return new Promise ((resolve, reject) => {
			navigator.geolocation.getCurrentPosition (
				({ coords }) => {
					this.userLocation = [ coords.longitude, coords.latitude ];
					resolve (this.userLocation);
				},
				(err) => {
					alert ('No se pudo obtener la geolocalización');
					console.log (err);
					reject ();
				}
			);
		});
	}

	public getPlaceByQuery (query: string = '') {
		if (query.length === 0) {
			this.places = [];
			this.isLoadingPlaces = false;
			return;
		}

		if (!this.userLocation) throw Error ('No hay userLocation');

		this.isLoadingPlaces = true;
		// this.http.get (`https://api.mapbox.com/search/searchbox/v1/suggest?q=${ query }&language=es&proximity=-3.632064730729695,40.40263085801686&session_token=09bd8b96-88f9-41a1-890d-f29de8f006d3&access_token=pk.eyJ1IjoiZ2F0b2xvcCIsImEiOiJjbHRwdjl0a3AwcjM4MmlvNnY0eTBpcTMwIn0.oFTSZCM__4QU7zhizBKOnA`);
		// this.http.get (`https://api.mapbox.com/search/geocode/v6/forward?q=${ query }&proximity=-3.6320805156121594%2C40.40266733549953&language=es&access_token=pk.eyJ1IjoiZ2F0b2xvcCIsImEiOiJjbHRwdjl0a3AwcjM4MmlvNnY0eTBpcTMwIn0.oFTSZCM__4QU7zhizBKOnA`);
		this.placesApi.get<PlacesResponse> (`/reverse?q=${ query }`, {
			params: {
				// proximity: this.userLocation.join (','),
				longitude: this.userLocation[0],
				latitude: this.userLocation[1],
			},
		})
		.subscribe (resp => {
			console.log (resp.features);
			this.isLoadingPlaces = false;
			this.places = resp.features;
			this.mapService.createMarkersFromPlaces (this.places, this.userLocation!);
		});
	}

	public deletePlaces () {
		this.places = [];
	}
}