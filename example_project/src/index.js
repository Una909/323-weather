import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, input, ul, li } = hh(h);

// Messages which can be used to update the model
const MSGS = {
  ADD_LOCATION: "ADD_LOCATION",
  DELETE_LOCATION: "DELETE_LOCATION",
  UPDATE_LOCATION: "UPDATE_LOCATION",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  const { locations, locationInput } = model;

  const locationData = locations.map(location => {
    return li({ key: location.id, className: "py-2 px-4" }, [
      p({}, `Location: ${location.name}`),
      p({}, `Current Temperature: ${location.currentTemp}°C`),
      p({}, `Low Temperature: ${location.minTemp}°C`),
      p({}, `High Temperature: ${location.maxTemp}°C`),
      button(
        {
          className: "text-red-500",
          onclick: () => dispatch({ type: MSGS.DELETE_LOCATION, id: location.id }),
        },
        "Delete"
      ),
    ]);
  });

  return div({ className: "max-w-lg mx-auto mt-10" }, [
    h1({ className: "text-3xl mb-4 text-center text-gray-800" }, `Sommer's Weather Forecast`),
    div({ className: "flex flex-col gap-4 items-center" }, [
      input({
        type: "text",
        placeholder: "Enter location",
        value: locationInput,
        oninput: (e) => dispatch({ type: MSGS.UPDATE_LOCATION, value: e.target.value }),
        className: "px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500",
      }),
      button(
        {
          onclick: () => dispatch({ type: MSGS.ADD_LOCATION }),
          className: "px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500",
        },
        "Add"
      ),
    ]),
    div({ className: "mt-6" }, [ul({}, locationData)]),
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
// Async function to fetch data from an API
async function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_LOCATION:
      try {
        let latitude, longitude, name;
        const inputLoc = model.locationInput.split(',').map(part => part.trim());
        if (inputLoc.length === 2 && !isNaN(parseFloat(inputLoc[0])) && !isNaN(parseFloat(inputLoc[1]))) {
          latitude = parseFloat(inputLoc[0]);
          longitude = parseFloat(inputLoc[1]);
        } else {
          name = model.locationInput;
        }

        // Use your own API-Key at the URL part: '&appid="YOUR-API-KEY"&units=metric'
        let url;
        if (latitude !== undefined && longitude !== undefined) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid="YOUR-API-KEY"&units=metric`;
        } else {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid="YOUR-API-KEY"&units=metric`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const { main, name: cityName } = data;
        const newLocation = {
          id: Date.now(),
          name: cityName,
          currentTemp: main.temp,
          minTemp: main.temp_min,
          maxTemp: main.temp_max,
        };
        return { ...model, locations: [...model.locations, newLocation], locationInput: '' };
      } catch (error) {
        console.error("Error:", error);
        return model; 
      }

    case MSGS.DELETE_LOCATION:
      const updatedLocations = model.locations.filter(location => location.id !== msg.id);
      return { ...model, locations: updatedLocations };

    case MSGS.UPDATE_LOCATION:
      return { ...model, locationInput: msg.value };

    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    update(msg, model).then(updatedModel => {
      const updatedView = view(dispatch, updatedModel);
      const patches = diff(currentView, updatedView);
      rootNode = patch(rootNode, patches);
      currentView = updatedView;
      model = updatedModel;
    });
  }
}

// Initial model at the start
const initModel = {
  locations: [],
  locationInput: '',
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
