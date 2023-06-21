import { Injectable } from '@angular/core';
import { WeatherData } from '../interfaces/weather-all-data.interface';
import { CityInfo } from '../interfaces/city.interface';

@Injectable({
    providedIn: 'root'
})
export class WeatherCacheService {
    private cachedWeatherData: WeatherData[] = [];
    cachedCity?: any;

    constructor() { }

    getWeatherData(city: CityInfo): WeatherData | [] {
        this.cachedCity = ''
        this.cachedWeatherData.forEach((elem) => {
            if (elem.city_name === city.city) {
                this.cachedCity = elem;
            }
        })
        return this.cachedCity || [];
    }

    setWeatherData(weatherData: WeatherData): void {
        const isCityExist = this.cachedWeatherData.some((elem) => elem.city_name === weatherData.city_name);
        if (!isCityExist) {
            this.cachedWeatherData.push(weatherData);
        }
    }

    clearCache(): void {
        this.cachedWeatherData = [];
    }
}