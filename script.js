const input = document.querySelector('input');
const button = document.querySelector('button');
const errorMsg = document.querySelector('p.error_message');
const cityName = document.querySelector('h2.city_name');
const weatherImg = document.querySelector('img.weather_img');
const temp = document.querySelector('p.temp');
const description = document.querySelector('p.description');
const feelslike = document.querySelector('span.feels_like');
const pressure = document.querySelector('span.pressure');
const humidity = document.querySelector('span.humidity');
const windSpeed = document.querySelector('span.wind_speed');
const clouds = document.querySelector('span.clouds');
const visibility = document.querySelector('span.visibility');
const pollutionImg = document.querySelector('span.pollution_img');
const pollutionValue = document.querySelector('span.pollution_value');

const apiInfo = {
    link: 'https://api.openweathermap.org/data/2.5/weather?q=',
    key: '&appid=39bb0e715918af10cfe7933bc42e5796',
    units: '&units=metric',
    lang: '&lang=pl'
}

function getWeatherInfo (){
    const apiInfoCity = input.value;
    const URL = `${apiInfo.link}${apiInfoCity}${apiInfo.key}${apiInfo.units}${apiInfo.lang}`;
    console.log(URL);
    //console.log(URL);

    axios.get(URL).then((response) => {
        console.log(response.data);

        cityName.textContent = `${response.data.name}, ${response.data.sys.country}`;
        weatherImg.src = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        temp.textContent = `${Math.round(response.data.main.temp)} ℃`;
        description.textContent = `${response.data.weather[0].description}`;
        feelslike.textContent = `${Math.round(response.data.main.feels_like)} ℃`;
        pressure.textContent = `${response.data.main.pressure} hPa`;
        humidity.textContent = `${response.data.main.humidity} %`;
        visibility.textContent = `${response.data.visibility / 1000} km`;
        clouds.textContent = `${response.data.clouds.all} %`;
        windSpeed.textContent = `${Math.round(response.data.wind.speed * 3.6)} km/h`;
        errorMsg.textContent = "";

        const url_pollution = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${response.data.coord.lat}&
        lon=${response.data.coord.lon}${apiInfo.key}`;
        axios.get(url_pollution).then((res) => {
            console.log(res.data);
            pollutionValue.textContent =`${res.data.list[0].components.pm2_5}`;
        })

    }).catch((error) => {
        errorMsg.textContent = `${error.response.data.message}`;
        [cityName, temp, description, feelslike, pressure, humidity, visibility, clouds, windSpeed].forEach(el => {
            el.textContent = '';
        })
        weatherImg.src = '';

    }).finally(() => {
        input.value = '';
    })

}

function getWeatherInfoByEnter (e){
    if(e.key == 'Enter') {
        getWeatherInfo();
    }
}

button.addEventListener('click', getWeatherInfo);
input.addEventListener('keypress', getWeatherInfoByEnter);