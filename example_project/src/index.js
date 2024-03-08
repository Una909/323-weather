import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, input, table, tr, th, td } = hh(h);

// Messages which can be used to update the model
const MSGS = {
  UPDATE_MEAL: "UPDATE_MEAL",
  UPDATE_CALORIES: "UPDATE_CALORIES",
  SAVE: "SAVE",
  DELETE: "DELETE",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  const { meals, calories, entries, totalCalories } = model;

  const entryRows = entries.map(entry =>
    tr({ key: entry.id, className: "border-b border-gray-200" }, [
      td({ className: "py-2 px-4" }, entry.meals),
      td({ className: "py-2 px-4" }, entry.calories),
      td({ className: "py-2 px-4" }, button({ className: "text-red-500", onclick: () => dispatch({ type: MSGS.DELETE, id: entry.id }) }, "Delete"))
    ])
  );

  return div({ className: "max-w-lg mx-auto mt-10" }, [
    h1({ className: "text-3xl mb-4 text-center text-gray-800" }, `Calories Counter`),
    div({ className: "flex flex-col gap-4 items-center" }, [
      input({
        type: "text",
        placeholder: "Enter meal name",
        value: meals,
        className: "px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500",
        oninput: (e) => dispatch({ type: MSGS.UPDATE_MEAL, value: e.target.value }),
      }),
      input({
        type: "number",
        placeholder: "Enter calories number",
        value: calories,
        className: "px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:border-blue-500",
        oninput: (e) => dispatch({ type: MSGS.UPDATE_CALORIES, value: parseInt(e.target.value) }),
      }),
      button({ className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", onclick: () => dispatch({ type: MSGS.SAVE }) }, "Save"),
    ]),
    div({ className: "mt-6" }, [
      table({ className: "w-full" }, [
        tr({ className: "bg-gray-100" }, [
          th({ className: "py-4 px-4 text-left text-sm text-gray-600 uppercase font-semibold" }, "Meal Name"),
          th({ className: "py-4 px-4 text-left text-sm text-gray-600 uppercase font-semibold" }, "Calories"),
          th({ className: "py-4 px-4 text-left text-sm text-gray-600 uppercase font-semibold" }, "")
        ]),
        ...entryRows
      ]),
      p({ className: "mt-4 text-lg font-semibold" }, `Total Calories: ${totalCalories}`)
    ])
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg.type) {
    case MSGS.UPDATE_MEAL:
      return { ...model, meals: msg.value };

    case MSGS.UPDATE_CALORIES:
      return { ...model, calories: msg.value };

    case MSGS.SAVE:
      const newEntry = {
        id: Date.now(),
        meals: model.meals,
        calories: model.calories
      };
      return {
        ...model,
        entries: [...model.entries, newEntry],
        totalCalories: model.totalCalories + model.calories,
        meals: "",
        calories: ""
      };

    case MSGS.DELETE:
      const updatedEntries = model.entries.filter(entry => entry.id !== msg.id);
      const deletedEntry = model.entries.find(entry => entry.id === msg.id);
      return {
        ...model,
        entries: updatedEntries,
        totalCalories: model.totalCalories - deletedEntry.calories
      };

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
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  meals: "",
  calories: "",
  entries: [],
  totalCalories: 0
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
