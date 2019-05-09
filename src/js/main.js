(function() {
    'use strict';
    /*global $, moment*/

    /*************************************************************************/
    /*****************************************************/
    /*********************************/
    // USER EDITABLE LINES - Change these to match your location and preferences!

    // Your Openweathermap city code
    // Find your id code at http://bulk.openweathermap.org/sample/
    let zip_code = '3441575';
    let api_key = 'ba4f4378863a0702b94a0917a51ffe8f';

    // Your temperature unit measurement
    // This bit is simple, 'metric' for Celcius, and 'imperial' for Fahrenheit
    let metric = 'metric';
    const icons = {
        '01d': '<i class="wi wi-day-sunny"></i>',			//sunny,
        '01n': '<i class="wi wi-night-clear"></i>',		//clear (night)
        '02d': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
        '02n': '<i class="wi wi-night-cloudy"></i>',		//partly cloudy (night)
        '03d': '<i class="wi wi-day-cloudy"></i>',			//mostly cloudy (day)
        '03n': '<i class="wi wi-night-cloudy"></i>',		//mostly cloudy (night)
        '04d': '<i class="wi wi-day-cloudy"></i>',
        '04n': '<i class="wi wi-day-cloudy"></i>',
        '09d': '<i class="wi wi-showers"></i>',			//scattered showers
        '09n': '<i class="wi wi-showers"></i>',			//scattered showers
        '10d': '<i class="wi wi-rain"></i>',				//showers
        '10n': '<i class="wi wi-rain"></i>',				//showers
        '11d': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '11n': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '13d': '<i class="wi wi-snow"></i>',				//snow
        '13n': '<i class="wi wi-snow"></i>',				//snow
        '50d': '<i class="wi wi-day-haze"></i>',			//haze
        '50n': '<i class="wi wi-day-haze"></i>',			//haze
        '200': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '201': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '202': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '210': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '211': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '212': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '221': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '230': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '231': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '232': '<i class="wi wi-thunderstorm"></i>',		//thunderstorms
        '300': '<i class="wi wi-rain"></i>',				//showers
        '301': '<i class="wi wi-rain"></i>',				//showers
        '302': '<i class="wi wi-rain"></i>',				//showers
        '310': '<i class="wi wi-rain"></i>',				//showers
        '311': '<i class="wi wi-rain"></i>',				//showers
        '312': '<i class="wi wi-rain"></i>',				//showers
        '313': '<i class="wi wi-rain"></i>',				//showers
        '314': '<i class="wi wi-rain"></i>',				//showers
        '321': '<i class="wi wi-rain"></i>',				//showers
        '500': '<i class="wi wi-rain"></i>',				//showers
        '501': '<i class="wi wi-rain"></i>',				//showers
        '502': '<i class="wi wi-rain-wind"></i>',			//tropical storm
        '503': '<i class="wi wi-rain-wind"></i>',			//tropical storm
        '504': '<i class="wi wi-rain-wind"></i>',			//tropical storm
        '511': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '520': '<i class="wi wi-rain"></i>',				//showers
        '521': '<i class="wi wi-rain"></i>',				//showers
        '522': '<i class="wi wi-rain"></i>',				//showers
        '531': '<i class="wi wi-rain"></i>',				//showers
        '600': '<i class="wi wi-snow"></i>',				//snow showers
        '601': '<i class="wi wi-snow"></i>',				//snow showers
        '602': '<i class="wi wi-snow"></i>',				//snow showers
        '611': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '612': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '615': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '616': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '620': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '621': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '622': '<i class="wi wi-rain-mix"></i>',			//mixed rain and snow
        '701': '<i class="wi wi-fog"></i>',				//foggy
        '711': '<i class="wi wi-smoke"></i>',				//smoky
        '721': '<i class="wi wi-fog"></i>',				//foggy
        '731': '<i class="wi wi-smoke"></i>',				//smoky
        '741': '<i class="wi wi-fog"></i>',				//foggy
        '751': '<i class="wi wi-dust"></i>',				//dust
        '761': '<i class="wi wi-dust"></i>',				//dust
        '762': '<i class="wi wi-dust"></i>',				//dust
        '771': '<i class="wi wi-snowflake-cold"></i>',		//cold
        '781': '<i class="wi wi-tornado"></i>',			//tornado
        '800': '<i class="wi wi-day-sunny"></i>',			//sunny,
        '801': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
        '802': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
        '803': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
        '804': '<i class="wi wi-day-cloudy"></i>',			//partly cloudy (day)
    };

    // Format for date and time
    let formatTime = 'h:mm:ss a';
    let formatDate = 'dddd, MMMM Do YYYY';

    // Yahoo! query interval (milliseconds)
    // Default is every 15 minutes. Be reasonable. Don't query Yahoo every 500ms.
    let waitBetweenWeatherQueriesMS = 900000;

    // You're done!
    /*********************************/
    /*****************************************************/
    /*************************************************************************/

    function setRandomBackGround() {

        $.getJSON('https://api.unsplash.com/photos/random?client_id=3f2741dd663e59d7d7c0e9290b7184cd257ef8adfe7742e66f3b9c0c335479a9&orientation=landscape', function(data){

            $('#wrapper').css('background-image', 'url("' + data.urls.full + '")')
        });

    }

    function resolveTemp(temp) {
        temp = Math.round(temp);
        temp += '&deg;';
        return temp;
    }

    function fillCurrently(currently) {
        let icon = $('#currently .icon');
        let desc = $('#currently .desc');
        let temp = $('#currently .temp');

        // Insert the current details. Icons may be changed by editing the icons array.
        if (icon.length) {
            icon.html(icons[currently.weather[0].id]);
        }
        if (desc.length) {
            desc.html(currently.weather[0].description);
        }
        if (temp.length) {
            temp.html(resolveTemp(currently.main.temp));
        }
    }

    function fillMetric(day, metric) {
        // Choose one of the five metric cells to fill
        let metricCell = '#metric' + day + ' ';
        let icon = $(metricCell + '.icon');
        let desc = $(metricCell + '.desc');

        // Insert the metric details. Icons may be changed by editing the icons array.
        if (icon.length) {
            icon.html(icons[metric.weather[0].id]);
        }
        if (desc.length) {
            desc.html(metric.weather[0].description);
        }
    }

    function queryOpenWeatherMap() {
        $.ajax({
            type: 'GET',
            url: 'https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&id=3441575&units=metric',
            dataType: 'json'
        }).done(function (result) {
            // Drill down into the returned data to find the relevant weather information
            fillCurrently(result);
            fillMetric(0, result);
        });

        $.ajax({
            type: 'GET',
            url: 'https://openweathermap.org/data/2.5/forecast/?appid=b6907d289e10d714a6e88b30761fae22&id=3441575&units=metric',
            dataType: 'json'
        }).done(function (result) {
            // Drill down into the returned data to find the relevant weather information
            result = result.list;
            let fill = 1;
            let count = 0;
            for( let res of result){
                // find tomorrow day
                if(res.dt_txt.indexOf('00:00:00') > 0){
                    let low = 200.0;
                    let high = -200.0;
                    for(let i=0; i<8; i++){
                        if(i+count >= result.length){
                            continue;
                        }
                        if(result[count+i].main.temp_max > high){
                            high = result[count+i].main.temp_max;
                        }
                        if(result[count+i].main.temp_min < low){
                            low = result[count+i].main.temp_min;
                        }
                    }
                    let res_copy = result[Math.min(count + 4, count)]; // 3pm or last possible
                    res_copy.main.temp_max = (high>-200?high:res_copy.main.temp_max);
                    res_copy.main.temp_min = (low<200?low:res_copy.main.temp_min);
                    fillMetric(fill, res);
                    fill++;

                    count++;
                }
            }
        });
    }

    // Fallback icons - Do not edit. Icons should be edited in your current skin.
    // Fallback icons are from the weather icons pack on github at https://github.com/erikflowers/weather-icons
    // Position in array corresponds to Yahoo! Weather's condition code, which are commented below in plain English
    if (!icons) {
        $(document).ready(function() {
            $('head').append('<link rel="stylesheet" type="text/css" href="../css/weather-icons.css" />');
        });
    }

    $(function () {
        // Fetch the weather data for right now
        queryOpenWeatherMap();
        setRandomBackGround();

        // Query Yahoo! at the requested interval for new weather data
        setInterval(function() {
            queryOpenWeatherMap();
            // setRandomBackGround();
        }, waitBetweenWeatherQueriesMS);

        // Set the current time and date on the clock
        if ($('#time').length) {
            $('#time').html(moment().format(formatTime));
        }
        if ($('#date').length) {
            $('#date').html(moment().format(formatDate));
        }

        // Refresh the time and date every second
        setInterval(function(){
            if ($('#time').length) {
                $('#time').html(moment().format(formatTime));
            }
            if ($('#date').length) {
                $('#date').html(moment().format(formatDate));
            }
        }, 1000);
    });

}());
