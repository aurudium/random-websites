//The parts of the URL needed to get the information from the API
const strBaseURL = 'https://api.open-meteo.com/v1/forecast?'
const strWeatherOptions = '&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,precipitation,cloud_cover&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch'
//object to hold the weather. Will either be loaded from local memory or initialized through the open-meteo api
let objWeather = {}

//A function to display the weather information.
//Does not handle the vissibility of other DIVs. Only opens the one to display the weather infromation.
function DisplayWeather (){
    document.querySelector('#divHomeWeather').classList.remove('d-none')
    document.querySelector('#divDisplayWeather').innerHTML = 
        `<div class="card">
            <div class="card-body row">
                <div class="col-4">
                    <p class="text-center"><i class="bi bi-geo-alt"></i></p>
                    <p class="text-center">Latitude: ${objWeather.latitude}</p>
                    <p class="text-center">Longitude: ${objWeather.longitude}</p>
                </div>
                <div class="col-4 mt-2">
                    <p><i class="bi bi-cloud-fill"></i>${objWeather.current.cloud_cover}% Cloud Cover
                    <p><i class="bi bi-thermometer"></i>${objWeather.current.temperature_2m}°F</p>
                    <p><i class="bi bi-moisture"></i>Humidity: ${objWeather.current.relative_humidity_2m}</p>
                </div>
                <div class="col-4">
                    <p><i class="bi bi-cloud-rain"></i> ${objWeather.current.precipitation}% chance for precipitation</p>
                </div>
            </div>
        </div>`
    document.querySelector('#btnSetLocation').classList.remove('d-none')
}

//Check on load to see if there is already a weather location in local storage
if(localStorage.getItem("strWeather")){

    //get the current hour to see if the weather data needs to be updated to the current time.
    const dateNow = new Date()
    let dateHour = dateNow.getHours()
    console.log(dateHour)

    //check to see if the current weather in storage is up to date by the hour
    //prints information to the log for debugging.
    if(dateHour == localStorage.getItem("strLastUpdate")){
        console.log('Loading weather from storage')
        document.querySelector('#divLoad').classList.add('d-none')
        const strWeather = localStorage.getItem("strWeather")
        objWeather = JSON.parse(strWeather)
        DisplayWeather()
    } else {
        console.log('weather needs to be updated. Sending to geo location')
        getGeo()
    }

    
   // let strLastUpdate = objWeather.current.time.substr(0,14)+"00"
    
}
//If weather isn't stored then try to get location date
else{
    getGeo()
}

function getGeo(){
    if(navigator.geolocation){
        console.log('location information granted. Getting possition')
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        //if device location can't be collected. Call for manual input
        console.log('location cannot be collected automatically. Sending to collect information manually')
        error()
    }
}

//If device location is collected, call the API to get the object that will be parsed
function success(objPosition) {
    const strLatitude = 'latitude=' + objPosition.coords.latitude.toFixed(2)
    const strLongitude = 'longitude=' + objPosition.coords.longitude.toFixed(2)

    let blnError = false
    let strError = ''

    if(blnError == false){
        fetch(strBaseURL + strLatitude + '&' + strLongitude + strWeatherOptions)
        .then(response => {
            return response.json()
        })
        .then(data => {
            objWeather = data
            if(objWeather.error == true){
                blnError = true
                strError += 'Error fetching weather data'
            } else {
                document.querySelector('#divLoad').classList.add('d-none')
                DisplayWeather()
            }
            //get the time stamp from the current time. This will be to check if the weather needs to be updated
            let strStorageWeatherTimeStamp = objWeather.current.time.substr(11,2)
            localStorage.setItem("strWeather",JSON.stringify(objWeather))
            localStorage.setItem("strLastUpdate",strStorageWeatherTimeStamp)
        })
    } else {
        strError += 'Error initializing fetch for data'
    }
    
}

//change the website for manual location input
function error(){
    console.log(`Location data was unable to be collected. Opening up manual location selection`)
    document.querySelector('#divLoad').classList.add('d-none')
    document.querySelector('#divLocationSelect').classList.remove('d-none')
}

//Function for getting the weather of a location.
//Arguments needed are the latitude and longitude of a loction.
//Calls to display weather and sets the weather to local memory
function GetWeather(strLatitude, strLongitude) {

    strLatitude = 'latitude=' + strLatitude
    strLongitude = 'longitude=' + strLongitude

    let blnError = false
    let strError = ''

    console.log(strLatitude)
    console.log(strLongitude)
    
    if(blnError == false){
        fetch(strBaseURL + strLatitude + '&' + strLongitude + strWeatherOptions)
        .then(response => {
            console.log(response)
            if(response.ok){
                return response.json()
            } else {
                console.log(response.status)
                throw new Error(response.status)
            }
        })
        .then(data => {
            objWeather = data
            if(objWeather.error == true){
                blnError = true
                strError += 'Error fetching weather data'
            } else {
                DisplayWeather()
            }
            //get the time stamp from the current time. This will be to check if the weather needs to be updated
            let strStorageWeatherTimeStamp = objWeather.current.time.substr(0,14)+"00"
            localStorage.setItem("strWeather",JSON.stringify(objWeather))
            localStorage.setItem("strLastUpdate",strStorageWeatherTimeStamp)
        })
    } else {
        strError += 'Error initializing fetch for data'
    }
}

document.querySelector('#btnManualSetWeatherCordinates').addEventListener('click',() =>{
    const strLatitude = document.querySelector('#txtLatitude').value
    const strLongitude = document.querySelector('#txtLongitude').value

    //Variable to check and make sure that valid coordinates was passed
    const regCoordinate = /^[+-}{0,1}[0-9]{1,3}\.{0,1}[0-9]*$/

    console.log(regCoordinate.test(strLatitude))
    console.log(strLatitude <= 90)

    if(regCoordinate.test(strLatitude) && regCoordinate.test(strLongitude) && strLatitude <= 90 && strLatitude >= -90 && strLongitude <= 180 && strLongitude >= -180){
        document.querySelector('#divLocationSelect').classList.add('d-none')
        GetWeather(strLatitude, strLongitude)
    } else {
        //Impropper coordinates were given. This lets the user know to enter valid coordinates
        document.querySelector('#parWrongCoordinateEntery').innerHTML = `<div class='bg-secondary'><p class='text-info'>Please enter valid coordinates</p></div>`
    }

})


//Get the drop down selection. And send the coordinates based on the selection
document.querySelector('#btnManualSetWeatherDropDown').addEventListener('click',() =>{
    let arrLatitudes = [36.16,36.16,43.17]
    let arrLongitudes = [-85.49,-86.78,-85.25]

    const intLocation = document.querySelector('#cboLocation').value

    document.querySelector('#divLocationSelect').classList.add('d-none')
    GetWeather(arrLatitudes[intLocation - 1], arrLongitudes[intLocation - 1])
    
    
})

//Generic function to go to the home page with weather. 
function GoHome(){
    document.querySelector('#divLocationSelect').classList.add('d-none')
    document.querySelector('#divLocationEnter').classList.add('d-none')
    document.querySelector('#divHomeWeather').classList.remove('d-none')
}

//Open the menue to chose weather location
document.querySelector('#btnSetLocation').addEventListener('click',()=>{
    document.querySelector('#divHomeWeather').classList.add('d-none')
    document.querySelector('#divLocationSelect').classList.remove('d-none')
})

//switch to coordinate entry
document.querySelector('#btnGetManualEntry').addEventListener('click',()=>{
    document.querySelector('#divLocationSelect').classList.add('d-none')
    document.querySelector('#divLocationEnter').classList.remove('d-none')
})

//switch to drop down location selection
document.querySelector('#btnGetManualDropDown').addEventListener('click',()=>{
    document.querySelector('#divLocationEnter').classList.add('d-none')
    document.querySelector('#divLocationSelect').classList.remove('d-none')
})

document.querySelector('#btnFindLocation').addEventListener('click',()=>{
    document.querySelector('#divLocationSelect').classList.add('d-none')
    document.querySelector('#divLoad').classList.remove('d-none')
    getGeo()
})