/**
 *  I used the starter code provided by udacity in the course content
 */

/* Global Variables */

// there is a note in the rupric: The following line of code should be at the top of the app.js file:
// Personal API Key for OpenWeatherMap API
// const apiKey = '<your_api_key>&units=imperial';
// this a little bit different from the guide about the api call in the website openweathermap.org
// which is http://api.openweathermap.org/data/2.5/forecast?id=524901&appid={API key}
// the id was 6 digits in this example
// the zip code that works in this project is 5 digits long
// some examples i tested was provided in https://en.wikipedia.org/wiki/ZIP_Code like
/**
 * 02115 (Boston),
 * 10001 (New York City),
 * 19103 (Philadelphia),
 * 21201 (Baltimore),
 * 20008 (Washington, D.C.),
 * 30303 (Atlanta),
 * 33130 (Miami)
 * 40202 (Louisville),
 * 50309 (Des Moines),
 * 60601 (Chicago),
 * 63101 (St. Louis),
 * 77036 (Houston),
 * 80202 (Denver),
 * 94111 (San Francisco),
 * 98101 (Seattle),
 * and 99950 (Ketchikan, Alaska) (the highest ZIP Code).
 *all these values in the US works in the app
 */

const apiKey = "fc613da10931af54bccdc98e5aa60654&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();

// I added +1 in the next line because without that the month value is earlier by 1
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

let relativeURL = "http://api.openweathermap.org/data/2.5/forecast?zip=";

/**
 * functions
 */
// this is an asynchronous function to fetch the data from the app endpoint
async function getWeatherFromWebsite(relativeURL, zip, key) {
  let response = await fetch(relativeURL + zip + "&appid=" + key);
  try {
    return await response.json();
  } catch (error) {
    console.log("error", error);
  }
}

// this an async function add an entry to the project endpoint
async function postData(url = "", data = {}) {
  console.log(data);
  let response = await fetch("http://localhost:3000" + url, {
    method: "POST",
    //This option controls whether to include cookies in the request cookies will be sent only if the request
    // is made to the same origin (domain) as the calling script.
    credentials: "same-origin",
    headers: {
      //This specifies that the request body will contain JSON data,
      // ensuring the server knows to interpret the data as JSON.
      "Content-Type": "application/json",
    },
    // The data object is converted into a JSON string
    //so that it can be sent in the body of the POST request.
    body: JSON.stringify(data),
  });
}

// this function is given in the rupric
// to Dynamically Update UI
// i changed some things in it to handle some cases of what gets shown in the UI
async function retrieveData() {
  const request = await fetch("/routeToGetData");
  try {
    // Transform into JSON
    const allData = await request.json();
    // Write updated data to DOM elements
    document.getElementById(
      "temp"
    ).innerHTML = `temperature in fahrenheit: ${Math.round(allData.temp)}`;
    if (
      document.getElementById("temp").innerHTML ===
      "temperature in fahrenheit: NaN"
    ) {
      document.getElementById("temp").innerHTML =
        "temperature in fahrenheit: couldn't be determined";
    }
    document.getElementById(
      "content"
    ).innerHTML = `I am feeling: ${allData.content}`;
    if (document.getElementById("content").innerHTML === "I am feeling: ") {
      // this part to handle if the feeling area is empty
      document.getElementById("content").innerHTML = "write about your feeling";
    }
    document.getElementById("date").innerHTML = `Date: ${allData.date}`;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
}
/**
 * Event listener
 */
// Adding an event listener to an existing HTML button from DOM using Vanilla JS
let feelings;
document
  .getElementById("generate")
  .addEventListener("click", async function () {
    // I added .trim() to handle white spaces before and after the value the user gives
    let newZip = document.getElementById("zip").value.trim();
    feelings = document.getElementById("feelings").value.trim();
    try {
      let data = await getWeatherFromWebsite(relativeURL, newZip, apiKey);
      console.log(data);
      if (data.cod !== "404" && data.cod !== "400") {
        await postData("/routeToPostData", {
          date: newDate,
          temp: data.list[1].main.temp,
          content: feelings,
        });
      } else {
        // this part to handle if the zip code is empty or not right
        await postData("/routeToPostData", {
          date: newDate,
          temp: "can't be determined not a proper value to geocode",
          content: feelings,
        });
      }
      retrieveData();
    } catch (error) {
      console.log("error", error);
    }
  });
