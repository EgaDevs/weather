'use strict';

//для определения погоды в текущей локации
function getLocation() {
    return navigator.geolocation.getCurrentPosition(location => {
            const lat =  location.coords.latitude;
            const lon =  location.coords.longitude;
            fetchWeather(lat, lon);
            getToday(lat, lon);
            getFiveDays(lat, lon);
            chooseDay(lat, lon); 
        })
}
document.addEventListener('readystatechange', () =>{
    getLocation();
});

//Tab
function tabs(tabs, tabsHeader, tabsContent, activeClass) {
    const tabsElem = document.querySelector(tabs);
    const tabsHeaderElems = document.querySelectorAll(tabsHeader);
    const tabsContentElems = document.querySelectorAll(tabsContent);

    const removeTabs = () => {
        tabsHeaderElems.forEach(elem => {
            elem.classList.remove(activeClass);
        });
        tabsContentElems.forEach(elem => {
            elem.classList.remove(activeClass);
        });
    }

    const addTabs = (index = 0) => {
        tabsHeaderElems[index].classList.add(activeClass);
        tabsContentElems[index].classList.add(activeClass);
    }

    removeTabs();
    addTabs();

    tabsElem.addEventListener('click', e => {
        const {target} = e;
        tabsHeaderElems.forEach((elem, index) => {
            if(elem === target) {
                removeTabs();
                addTabs(index);
            }
        })
    })
}

tabs('#tabs', '.tabs__header-btn', '.tabs__content-item', 'active');


//выводим дату
const date = document.querySelector('#date');
const newDate = new Date();

function getDate() {
    const currDate = `${newDate.getDate() < 10  ? '0' + newDate.getDate() : newDate.getDate()}.${newDate.getMonth() + 1 < 10 ? '0' + newDate.getMonth() + 1 : newDate.getMonth() + 1}.${newDate.getFullYear()}`
    date.textContent = currDate;
}
getDate();

//выдаем ошибку
const errorPage = document.querySelector('.error__page');
const content = document.querySelector('.content');
function getError() {
    content.style.display = 'none';
    errorPage.style.display = 'block';
}
function getRight() {
    content.style.display = 'block';
    errorPage.style.display = 'none';
}

//Меняем current
function currentInfo() {
    const nowImg = document.querySelector('#nowImg');
    const nowText = document.querySelector('#nowText');
    const curDeg = document.querySelector('#currentDegree');
    const felDeg = document.querySelector('#feelDegree');
    const rise = document.querySelector('#rise');
    const sett = document.querySelector('#sett');
    const dur = document.querySelector('#dur');
    
    nowImg.src = `assets/img/mist.png`;
    nowText.textContent = `Mist`;
    curDeg.textContent = `--°C`;
    felDeg.textContent = `Real Degree --°`;
    rise.textContent = `Sunrise: -- AM`;
    sett.textContent = `Sunset: -- PM`;
    dur.textContent = `Duration: -- hr`;
}
currentInfo();

//для определения дня недели
const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const daysWeek = document.querySelectorAll('#dayWeek');
function getDayOfWeek() {
    let day = ''
    let weekDay = []
    switch(newDate.getDay()){
        case 0: day = 6;break;
        case 1: day = 0;break;
        case 2: day = 1;break;
        case 3: day = 2;break;
        case 4: day = 3;break;
        case 5: day = 4;break;
        case 6: day = 5;break;
    }

    for(let i = day; i < day + 5; i++){
        if(i < 7){
            weekDay.push(i)
        }else if(i === 7){
            weekDay.push(0)
        }else if(i === 8){
            weekDay.push(1)
        }else if(i === 9){
            weekDay.push(2)
        }
    }
    for(let i = 0; i < daysWeek.length; i++){
        if(i === 0){
            daysWeek[0].textContent = 'Today';
        }
        if(i > 0){
            daysWeek[i].textContent = dayOfWeek[weekDay[i]];
        }  
    }
}
getDayOfWeek();

//для определения числа в пятидневной вкладке
function getDate() {
    const currDate = `${newDate.getDate() < 10  ? '0' + newDate.getDate() : newDate.getDate()}.${newDate.getMonth() + 1 < 10 ? '0' + newDate.getMonth() + 1 : newDate.getMonth() + 1}.${newDate.getFullYear()}`
    date.textContent = currDate;
}

const daysDate = document.querySelectorAll('#daysDate');
const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthDay() {
    const currMonth = newDate.getMonth()
    const monthNum = month[currMonth]
    let data = [];
        for(let i = newDate.getDate() ; i < newDate.getDate() + 5; i++){
            data.push(i)
        }
        for(let i = 0; i < daysDate.length; i++){
            daysDate[i].textContent = `${monthNum} ${data[i]}`;
        }
}
getMonthDay();

//AM и PM
const timeEl = document.querySelectorAll('.hourly__header-time'); 

function timeSetter(hour) {
    let hours = hour;
    let halfDay = 13;
    let longDay = 25;
    let curTime = '';
    for(let i = 0; i < timeEl.length; i++) {
        hours++;
        if(hours === halfDay){
            timeEl[i].textContent = `12pm`
        }else if((hours - halfDay) === 12){
            timeEl[i].textContent = `12am`
        }else if(hours > halfDay && hours < longDay){
            curTime = `${hours - halfDay}`
            timeEl[i].textContent = `${curTime}pm`
        }else if(hours > longDay){
            curTime = `${hours - longDay}`
            timeEl[i].textContent = `${curTime}am`
        }else if(hours < halfDay){
            timeEl[i].textContent = `${hours}pm`
        }
    }
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////

const apiKey = '3367582fb9105c69f4881fb473582dd6';

async function request(city) {
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    
    if(!(data.ok && data.status === 200)) {
        getError();
    }else{
        const json = await data.json();
        const lat = json.coord.lat;
        const lon = json.coord.lon;
        getRight();
        fetchWeather(lat, lon);
        getToday(lat, lon);
        getFiveDays(lat, lon);
        chooseDay(lat, lon)
    }
}

const search = document.querySelector('#search');
search.addEventListener('change', e => {
    e.preventDefault();
    request(search.value);
})

//для определения текущей погоды
async function fetchWeather(lat, lon){
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`);
    const jsno = await data.json(); 

    const sunrise = jsno.current.sunrise;
    const currSunrise = (new Date(sunrise*1000).toLocaleTimeString()).substring(1,5);
    const rise = document.querySelector('#rise');
    rise.textContent = `Sunrise: ${currSunrise} AM`;

    const sunset = jsno.current.sunset;
    const currSunset = (new Date(sunset*1000).toLocaleTimeString()).substring(0,5);
    const sett = document.querySelector('#sett');
    sett.textContent = `Sunset: ${currSunset} PM`;


    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);
    const duraction = `${sunsetTime.getHours() - sunriseTime.getHours()}:${sunsetTime.getMinutes() - sunriseTime.getMinutes()}`;
    const dur = document.querySelector('#dur');
    dur.textContent = `Duration: ${duraction} hr`;

    const weatherTemp = Math.round(jsno.current.temp);
    const curDeg = document.querySelector('#currentDegree');
    curDeg.textContent = `${weatherTemp - 273}°C`;
    
   const feelsLike = Math.round(jsno.current.feels_like);
   const felDeg = document.querySelector('#feelDegree');
   felDeg.textContent = `Real Degree ${feelsLike - 273}°C`;

   const weatherImg = jsno.current.weather[0].main;
   const nowImg = document.querySelector('#nowImg');
   nowImg.src = `assets/img/${weatherImg}.png`;

   const nowText = document.querySelector('#nowText');
   nowText.textContent = `${weatherImg}`;

   const date = jsno.current.dt;
   const hour = new Date(date * 1000).getHours();
   timeSetter(hour);
}


//для определения развернутой погоды на сегодня
const hourDescr = document.querySelectorAll('#hourDescr');
const celcium = document.querySelectorAll('#celcium');
const feels = document.querySelectorAll('#feel');
const speeds = document.querySelectorAll('#speed');
const hourImg = document.querySelectorAll('#hourImg');

async function getToday(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`);
    const jsno = await data.json();
    let wthrDescr = '';
    let temp = '';
    let feel = '';
    let speed = '';
    let img = '';

    for(let i = 0; i < hourDescr.length; i++) {
        wthrDescr = jsno.hourly[i].weather[0].main;
        hourDescr[i].textContent = wthrDescr;
        temp = Math.round(jsno.hourly[i].temp) - 273;
        celcium[i].textContent = `${temp}°C`;
        feel = Math.round(jsno.hourly[i].feels_like) - 273;
        feels[i].textContent = `${feel}°C`;
        speed = jsno.hourly[i].wind_speed;
        speeds[i].textContent = `${speed}km/h`;
        img = (jsno.hourly[i].weather[0].main).toLowerCase();
        hourImg[i].src = `./assets/img/${img}.png`;
    }
}

//для определения краткой погоды на 5 дней
const daysTemp = document.querySelectorAll('#daysTemp');
const daysDescr = document.querySelectorAll('#daysDescr');
const daysImg = document.querySelectorAll('#daysImg');

async function getFiveDays(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`);
    const jsno = await data.json();
    let temp = '';
    let descr = '';
    let img = '';
    
    for(let i = 0; i < daysTemp.length; i++) {
        temp = Math.round(jsno.daily[i].temp.max) - 273;
        daysTemp[i].textContent = `${temp}°C`;
        descr = jsno.daily[i].weather[0].main;
        daysDescr[i].textContent = descr;
        img = (jsno.daily[i].weather[0].main).toLowerCase();
        daysImg[i].src = `./assets/img/${img}.png`;
    }
}


//для определения развернутой погоды на 5 дней
const fiveDescr = document.querySelectorAll('#fiveDescr');
const fiveImg = document.querySelectorAll('#fiveImg');
const fiveTemp = document.querySelectorAll('#fiveTemp');
const fiveFeel = document.querySelectorAll('#fiveFeel');
const fiveSpeed = document.querySelectorAll('#fiveSpeed');

async function getFiveTimes(lat, lon, index) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`);
    const jsno = await data.json();
    
    const fives = ['morn', 'day', 'eve', 'night'];
    let descr = '';
    let img = '';
    let temp = '';
    let feel = '';
    let speed = '';
    let day;
    
    for(let i = 0; i < fiveSpeed.length; i++) {
        day = fives[i];
        descr = jsno.daily[index].weather[0].main;
        fiveDescr[i].textContent = descr;
        img = (jsno.daily[index].weather[0].main).toLowerCase();
        fiveImg[i].src = `./assets/img/${img}.png`;
        temp = Math.round(jsno.daily[index].temp.day) - 273;
        fiveTemp[i].textContent = `${temp}°C`;
        feel = Math.round(jsno.daily[index].feels_like.day) - 273;
        fiveFeel[i].textContent = `${feel}°C`
        speed = jsno.daily[index].wind_speed;
        fiveSpeed[i].textContent = `${speed}km/h`;
    }
}
//для переключения карточек в пятидневной вкладке
const changer = document.querySelectorAll('#changer');

function removeClass() {
    changer.forEach(item => {
        item.classList.remove('active')
    })
}
function chooseDay(lat, lon){
    changer.forEach((item, index) => {
        if(!index) {
            getFiveTimes(lat, lon, 0);
            item.classList.add('active');
        }
        if(index > -1){
            item.addEventListener('click', e => {
                removeClass();
                item.classList.add('active');
                getFiveTimes(lat, lon, index);
            })
        }
    })
}