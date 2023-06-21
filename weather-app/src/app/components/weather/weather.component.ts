import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { WeatherService } from 'src/app/services/weather.service';
import { WeatherCacheService } from 'src/app/services/cached-weather-data.service';
import { CityInfo } from '../weather/../../interfaces/city.interface'
import { WeatherData } from 'src/app/interfaces/weather-all-data.interface';
import { DisplayedWeatherData } from 'src/app/interfaces/displayed-weather-data.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit{
  cities: any = [
    {city: 'Lviv', lat: 49.8397, lon: 24.0297},
    {city: 'Kiev', lat: 50.4501, lon: 30.5234},
    {city: 'Kharkiv', lat: 49.9935, lon: 36.2304},
    {city: 'Odessa', lat: 46.4825, lon: 30.7233},
    {city: 'Dnipro', lat: 48.4647, lon: 35.0462},
    {city: 'Donetsk', lat: 48.0159, lon: 37.8029},
    {city: 'Zaporizhia', lat: 47.8388, lon: 35.1396},
    {city: 'Kryvyi Rih', lat: 47.9108, lon: 33.3915},
    {city: 'Mykolaiv', lat: 46.9750, lon: 31.9946},
    {city: 'Vinnytsia', lat: 49.2328, lon: 28.4748}
  ]
  selectedCity: CityInfo = this.cities[0];
  currentDate!: string;
  selectedUnit: string = 'celsius';
  errorMessage: string = '';
  weatherData!: WeatherData;
  displayedWeatherData: DisplayedWeatherData = {
    app_temp: 0,            
    temp: 0,                  
    clouds: 0,                
    wind_spd: 0,            
    pod: '',                     
    pres: 0,                     
    rh: 0,                        
    sunrise: '',                
    sunset: '',                 
    wind_cdir_full: '',  
    wind_dir: 0,
    weather: '',
    city_name: ''
  }

  constructor (
    private service: WeatherService,
    private cachedService: WeatherCacheService
  ) {
    //оновлюємо час
    setInterval(() => {
      this.currentDate = moment().format('DD MMMM YYYY HH:mm:s');
    }, 1000);
  }

  ngOnInit(): void {
    this.cachedService.clearCache();
    this.onCitySelectionChange();
  }

  //отримуємо погоду для конкретного міста
  getCityWeather (city: CityInfo): void {
    this.service.getSelectedWeather(city).subscribe(res => {
      this.weatherData = res.data[0];
      this.cachedService.setWeatherData(this.weatherData);
      this.displayedWeatherData = {
        app_temp: this.selectedUnit === 'celsius' ? this.weatherData.app_temp : (+((this.displayedWeatherData.app_temp * 9/5) + 32).toFixed(1)),  //температура яка відчувається
        temp: this.selectedUnit === 'celsius' ? this.weatherData.temp : (+((this.displayedWeatherData.temp * 9/5) + 32).toFixed(1)),              //Температура (в цельсіях):
        clouds: this.weatherData.clouds,                  //Хмарність (%)
        wind_spd: this.weatherData.wind_spd,              //Швидкість вітру (в м/с)
        pod: this.weatherData.pod,                        //Період доби (d/n)
        pres: this.weatherData.pres,                      //Атмосферний тиск (в мбар)
        rh: this.weatherData.rh,                          //Відносна вологість (%)
        sunrise: this.weatherData.sunrise,                //Час сходу сонця:
        sunset: this.weatherData.sunset,                  //Час заходу сонця:
        wind_cdir_full: this.weatherData.wind_cdir_full,  //Повний напрямок вітру
        wind_dir: this.weatherData.wind_dir,              //Напрямок вітру у градусах
        weather: this.weatherData.weather.description,    //Опис погоди
        city_name: this.weatherData.city_name                  //Назва міста
      }
    }
    // ,
    // (error: any) => {
    //   this.errorMessage = `${error}`;
    // }
    )
  }
  
  //змінюємо місто 
  onCitySelectionChange(): void {
    this.getCityWeather(this.selectedCity);
  }

  //зміна С і F
  onUnitToggleChange(event: MatButtonToggleChange): void {
    this.selectedUnit = event.value;
    this.getCityWeather(this.selectedCity);
  }

  //отримуємо іклнку погоди
  getWeatherImage(): string {
    const isDay = this.displayedWeatherData.pod === 'd'; // перевірка, чи день
    const weatherDescription = this.displayedWeatherData.weather;
  
    let imagePath: string;
    if (isDay) {
      imagePath = '../../../assets/img/day/'; // шлях до папки day
    } else {
      imagePath = '../../../assets/img/night/'; // шлях до папки night
    }
  
    //вибір іконки відповідно до опису
    if (weatherDescription === 'Clear sky') {
      imagePath += '113.png';
    } else if (weatherDescription === 'Light rain' || weatherDescription === 'Heavy rain' || weatherDescription === 'Rain') {
      imagePath += '263.png';
    } else if (weatherDescription === 'Broken clouds' || weatherDescription === 'Cloudy' || weatherDescription === 'Partly cloudy' || weatherDescription === 'Drizzle' || weatherDescription === 'Scattered clouds') {
      imagePath += '119.png';
    } else if (weatherDescription === 'Thunderstorm') {
      imagePath += '389.png';
    } else {
      imagePath += '299.png';
    }
  
    return imagePath;
  }
}
