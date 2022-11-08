import React, {useEffect, useState} from "react";
import {List, ListItem, ListItemText} from "@mui/material";

const WEATHER_CODE = new Map([
    [[0], "Clear sky"],
    [[1, 2, 3], "Mainly clear, partly cloudy, and overcast"],
    [[45, 48], "Fog and depositing rime fog"],
    [[51, 53, 55], "Drizzle: Light, moderate, and dense intensity"],
    [[56, 57], "Freezing Drizzle: Light and dense intensity"],
    [[61, 63, 65], "Rain: Slight, moderate and heavy intensity"],
    [[66, 67], "Freezing Rain: Light and heavy intensity"],
    [[71, 73, 75], "Snow fall: Slight, moderate, and heavy intensity"],
    [[77], "Snow grains"],
    [[80, 81, 82], "Rain showers: Slight, moderate, and violent"],
    [[85, 86], "Snow showers slight and heavy"],
    [[95], "Thunderstorm: Slight or moderate"],
    [[96, 99], "Thunderstorm with slight and heavy hail"]
]);

const WeatherData = ({ weather }) => {
    const dateTime = weather.current_weather.time.split("T");
    const [weatherDescription, setWeatherDescription] = useState("");

    useEffect(() => {
        for (let [key, val] of WEATHER_CODE) {
            if (key.includes(weather.current_weather.weathercode)) {
                setWeatherDescription(val);
            }
        }
    }, [weather]);

    return (
        <List>
            <ListItem>
                <ListItemText>
                    Your location is: Latitude = {weather.latitude}, Longitude ={" "}
                    {weather.longitude}
                </ListItemText>
            </ListItem>

            <ListItem>
                <ListItemText>
                    Local time: {dateTime[0]}, {dateTime[1]} ({weather.timezone})
                </ListItemText>
            </ListItem>

            <ListItem>
                <ListItemText>
                    Current temperature: {weather.current_weather.temperature}&#8451;
                </ListItemText>
            </ListItem>

            <ListItem>
                <ListItemText>{weatherDescription}</ListItemText>
            </ListItem>
        </List>
    );
};

export default WeatherData;