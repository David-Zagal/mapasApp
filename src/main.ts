import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// import { enableProdMode } from '@angular/core';

import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F0b2xvcCIsImEiOiJjbHRwdjl0a3AwcjM4MmlvNnY0eTBpcTMwIn0.oFTSZCM__4QU7zhizBKOnA';

if (!navigator.geolocation) {
	alert ('Navegador no soporta la Geolocation');
	throw new Error ('Navegador no soporta la Geolocation');
}

/*if (EnvironmentInjector.production) {
	enableProdMode ();
}*/

platformBrowserDynamic ().bootstrapModule (AppModule)
	.catch (err => console.error (err));