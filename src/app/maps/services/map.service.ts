import { inject, Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/placesv1.interface';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';
import { features } from 'process';

@Injectable({
	providedIn: 'root'
})
export class MapService {

	private map?: Map;
	private markers: Marker[] = [];

	private directionsApi = inject (DirectionsApiClient);

	get isMapReady () {
		return !!this.map;
	}

	public setMap (map: Map) {
		this.map = map;
	}

	public flyTo (coords: LngLatLike) {
		if (!this.isMapReady) throw Error ('El mapa no está inicializado');

		this.map?.flyTo ({
			zoom: 14,
			center: coords,
		});
	}

	public createMarkersFromPlaces (places: Feature[], userLocation: [number, number]) {
		if (!this.map) throw Error ('Mapa no inicializado');

		this.markers.forEach (marker => marker.remove ());
		const newMarkers = [];

		for (const place of places) {
			const [lng, lat] = place.geometry.coordinates;

			const popup = new Popup ()
			.setHTML (`
				<h6>${ place.properties.name }</h6>
				<span>${ place.properties.full_address }</span>
			`);

			const newMarker = new Marker ()
			.setLngLat ([lng, lat])
			.setPopup (popup)
			.addTo (this.map);

			newMarkers.push (newMarker);
		}

		this.markers = newMarkers;

		if (places.length === 0) return;

		// Límites del mapa
		const bounds = new LngLatBounds ();
		newMarkers.forEach (marker => bounds.extend (marker.getLngLat ()));
		bounds.extend (userLocation);

		this.map.fitBounds (bounds, {
			padding: { top: 200, bottom: 200, right: 200, left: 200 }
		});
	}

	public getRouteBetweenPoints (start: [number, number], end: [number, number]) {
		this.directionsApi.get <DirectionsResponse> (`/${ start.join (',') };${ end.join (',') }`)
		.subscribe (resp => this.drawPolyline (resp.routes[0]));
	}

	private drawPolyline (route: Route) {
		console.log ({ kms: route.distance / 1000, duration: route.duration / 60 });
		if (!this.map) throw Error ('Mapa no inicializado');

		const coords = route.geometry.coordinates;
		const start = coords[0] as [number, number];

		const bounds = new LngLatBounds ();
		coords.forEach (([lng, lat]) => {
			// const newCoord: [number, number] = [lng, lat];
			bounds.extend ([lng, lat]);
		});

		this.map.fitBounds (bounds, {
			padding: { top: 200, bottom: 200, right: 200, left: 200 }
		});

		// Polyline
		const sourceDate: AnySourceData = {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						properties: {},
						geometry: {
							type: 'LineString',
							coordinates: coords,
						},
					},
				],
			},
		};

		this.cleanMap ();

		this.map.addSource ('RouteString', sourceDate);
		this.map.addLayer ({
			id: 'RouteString',
			type: 'line',
			source: 'RouteString',
			layout: {
				'line-cap': 'round',
				'line-join': 'round',
			},
			paint: {
				'line-color': 'black',
				'line-width': 3,
			},
		});
	}

	public cleanMap () {
		if (!this.map) throw Error ('Mapa no inicializado');

		if (this.map.getLayer ('RouteString')) {
			this.map.removeLayer ('RouteString');
			this.map.removeSource ( 'RouteString');
		}
	}
}