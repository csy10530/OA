import React, {useCallback, useState} from "react";
import lodash from "lodash";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    createTheme,
    FormControl,
    Input,
    InputLabel,
    TextField
} from "@mui/material";

import "./index.css";
import axios from "axios";

import WeatherData from "./WeatherData";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const CITY_API = "https://geocoding-api.open-meteo.com/v1/search";

const DEBOUNCE_DELAY = 500;


export default function App() {
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [city, setCity] = useState("");
    const [cityList, setCityList] = useState([]);
    const [weather, setWeather] = useState(null);
    const [favouriteLocation, setFavouriteLocation] = useState([]);

    const theme = createTheme();

    const handleLongitudeChange = (e) => {
        setLongitude(e.target.value);
    };

    const handleLatitudeChange = (e) => {
        setLatitude(e.target.value);
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
        debounceFn(e.target.value);
    };

    const addFavourite = () => {
        let location = parseFloat(latitude) + ", " + parseFloat(longitude);
        if (city) {
            location += ", " + city;
        }

        if (!favouriteLocation.includes(location)) {
            setFavouriteLocation([...favouriteLocation, location]);
        }
    };

    const selectFavourite = (location) => {
        if (location) {
            const coordinates = location.split(",");
            setLatitude(parseFloat(coordinates[0]));
            setLongitude(parseFloat(coordinates[1]));
            if (coordinates[2]) {
                setCity(coordinates[2]);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .get(WEATHER_API, {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    timezone: "auto",
                    current_weather: "true"
                }
            })
            .then((res) => {
                setWeather(res.data);
            });
    };

    const searchCity = (query) => {
        if (query) {
            axios.get(CITY_API, {params: {name: query}}).then((res) => {
                if (res.data.results) {
                    setCityList(
                        res.data.results.map((data) => {
                            return {
                                id: data.id,
                                name: data.name,
                                admin: data.admin1,
                                country: data.country,
                                latitude: data.latitude,
                                longitude: data.longitude
                            };
                        })
                    );
                }
            });
        } else {
            setCityList([]);
        }
    };

    const debounceFn = useCallback(
        lodash.debounce(searchCity, DEBOUNCE_DELAY),
        []
    );

    const selectCity = (selectedCity) => {
        if (selectedCity) {
            setLatitude(selectedCity.latitude.toFixed(4));
            setLongitude(selectedCity.longitude.toFixed(4));
            setCity(selectedCity.name + ", " + selectedCity.country);
        }
    };

    return (
        <React.Fragment>
            <Box
                id="form"
                component="form"
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: 400,
                    margin: `${theme.spacing(0)} auto`
                }}
            >
                <Card
                    className="card"
                    sx={{
                        marginTop: theme.spacing(10)
                    }}
                >
                    <CardHeader
                        title="Weather Report"
                        sx={{
                            textAlign: "center",
                            background: "#212121",
                            color: "#fff"
                        }}
                    />
                    <CardContent>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="latitudeInput">Latitude</InputLabel>
                            <Input
                                id="latitudeInput"
                                type="number"
                                variant="standard"
                                value={latitude}
                                inputProps={{
                                    max: "90",
                                    min: "-90",
                                    step: "0.0001"
                                }}
                                onChange={handleLatitudeChange}
                            />
                        </FormControl>

                        <FormControl variant="standard">
                            <InputLabel htmlFor="longitudeInput">Longitude</InputLabel>
                            <Input
                                id="longitudeInput"
                                type="number"
                                variant="standard"
                                value={longitude}
                                inputProps={{
                                    max: "180",
                                    min: "-180",
                                    step: "0.0001"
                                }}
                                onChange={handleLongitudeChange}
                            />
                        </FormControl>

                        <FormControl variant="standard">
                            <Autocomplete
                                options={cityList ? cityList : []}
                                getOptionLabel={(option) => option.name + ""}
                                renderOption={(props, option) => {
                                    return (
                                        <li {...props} key={option.id}>
                                            {`${option.name}${
                                                option.admin ? ", " + option.admin : ""
                                            }${option.country ? ", " + option.country : ""}`}
                                        </li>
                                    );
                                }}
                                onInputChange={handleCityChange}
                                onChange={(e, v) => {
                                    selectCity(v);
                                }}
                                sx={{width: 350, marginTop: theme.spacing(2)}}
                                renderInput={(params) => <TextField {...params} label="City"/>}
                            />
                        </FormControl>

                        <FormControl>
                            <Autocomplete
                                options={favouriteLocation ? favouriteLocation : []}
                                onChange={(e, v) => {
                                    selectFavourite(v);
                                }}
                                sx={{width: 350, marginTop: theme.spacing(2)}}
                                renderInput={(params) => (
                                    <TextField {...params} label="Favourites"/>
                                )}
                            />
                        </FormControl>
                    </CardContent>

                    <CardActions>
                        <Button
                            variant="outlined"
                            onClick={addFavourite}
                            fullWidth
                            sx={{
                                marginTop: theme.spacing(2),
                                flexGrow: 1
                            }}
                        >
                            Add to Favourite
                        </Button>
                    </CardActions>

                    <CardActions>
                        <Button type="submit" variant="outlined" fullWidth>
                            Submit
                        </Button>
                    </CardActions>
                </Card>
            </Box>

            <Box>
                {weather ? (
                    <WeatherData weather={weather}/>
                ) : (
                    "Please enter the Latitude and Longitude of your location"
                )}
            </Box>
        </React.Fragment>
    );
}
