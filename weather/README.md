# Weather App

This is a simple weather application built with JavaScript. It allows users to search for weather information by location name or latitude/longitude coordinates using the OpenWeatherMap API.

## Features

- Add locations by entering location name or latitude/longitude coordinates.
- Display current temperature, minimum temperature, and maximum temperature for each location.
- Delete locations from the list.

## Technologies Used

- JavaScript
- Hyperscript-helpers
- Virtual DOM
- OpenWeatherMap API

## Installation

Before running the application, you need to obtain an API key from OpenWeatherMap. Follow these steps:

1. Sign up or log in to OpenWeatherMap: [OpenWeatherMap Sign Up](https://home.openweathermap.org/users/sign_up).
2. After logging in, go to the API keys tab in your account settings.
3. Generate a new API key if you don't have one already.
4. Copy your API key.
5. Go to index.js and visit the update function.
6. Replace the "YOUR-API-KEY" with your previously created API-KEY

To run this application locally, follow these steps:

1. Clone the repository: gh repo clone Una909/323-weather

2. npm install

3. npm run dev

## Usage

You can either enter a location name (example: Basel) OR it's longitude and latitude (seperated with ",") (example: 47.559272477325166, 7.587701083636691)
