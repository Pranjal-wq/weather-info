let weather = {
    appKey: "ea43417a3b01f55d2cd07012a3f54d65",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.appKey)
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => console.error("Error fetching weather data:", error));
    },
    displayWeather: function (data) {
        if (data.cod !== 200) {
            console.error("Error: " + data.message);
            return;
        }
        
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "http://openweathermap.org/img/w/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " kmph";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".weather").classList.remove("loading");
        
        this.fetchBackgroundImage(name);
    },
    fetchBackgroundImage: function(city) {
        const unsplashApiKey = "l6s_wOuHn_-nwcW0L6Wf70BY0gfaEFapkfUUzTenaHY"; // Replace with your Unsplash API key
        const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashApiKey}`;
        
        fetch(unsplashUrl)
            .then((response) => response.json())
            .then((data) => {
                const imageUrl = data.urls.full;
                document.body.style.backgroundImage = `url('${imageUrl}')`;
            })
            .catch((error) => console.error("Error fetching background image:", error));
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var api_key = '77630273a95846c8ad8583395eacd94b';
        var api_url = 'https://api.opencagedata.com/geocode/v1/json';
        var request_url = api_url
            + '?'
            + 'key=' + api_key
            + '&q=' + encodeURIComponent(latitude + ',' + longitude)
            + '&pretty=1'
            + '&no_annotations=1';

        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);

        request.onload = function () {
            if (request.status === 200) {
                var data = JSON.parse(request.responseText);
                weather.fetchWeather(data.results[0].components.city);
            } else if (request.status <= 500) {
                console.log("Unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
                console.log('Error msg: ' + data.status.message);
            } else {
                console.log("Server error");
            }
        };

        request.onerror = function () {
            console.log("Unable to connect to server");
        };

        request.send();
    },

    getLocation: function() {
        function success(data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
        } else {
            weather.fetchWeather("Bhopal");
        }
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

geocode.getLocation();
