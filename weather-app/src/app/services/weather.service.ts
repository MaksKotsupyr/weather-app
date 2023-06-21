import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CityInfo } from '../interfaces/city.interface';
import { WeatherCacheService } from './cached-weather-data.service';
import { DisplayedWeatherData } from '../interfaces/displayed-weather-data.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
    private apiKey = '5212b76faf974bc9b5705f0423e12c18';
    cachedCity: any;

    constructor(
        private http: HttpClient,
        private cachedService: WeatherCacheService
    ) { }

    getSelectedWeather(city: CityInfo) : Observable<any> {
        this.cachedCity = {
            data: [this.cachedService.getWeatherData(city)]
        };
        if (this.cachedCity.data[0] == '') {
            return this.http.get(`https://api.weatherbit.io/v2.0/current?lat=${city.lat}&lon=${city.lon}&key=${this.apiKey}`)
        } else {
            return of(this.cachedCity);
        } 
    }
}