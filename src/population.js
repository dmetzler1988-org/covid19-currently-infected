export function populations() {
  /* function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "population.json", true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === "200") {
        // .open will NOT return a value but simply returns undefined in async mode so use a callback
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  loadJSON(function (response) {
    let jsonresponse = JSON.parse(response);
    console.log(jsonresponse);
  }); */

  function buildOwnMap() {
    const jsonData = [
      {
        Rank: "1",
        "Country (or dependent territory)": "China[b]",
        Population: "1,404,658,280",
        "% of world": "18.0%",
        Date: "30 Sep 2020",
        "Source (official or UN)": "National population clock[3]"
      },
      {
        Rank: "2",
        "Country (or dependent territory)": "India[c]",
        Population: "1,367,823,887",
        "% of world": "17.5%",
        Date: "30 Sep 2020",
        "Source (official or UN)": "National population clock[4]"
      }
    ];

    let populationMap = new Map();
    for (let i = 0; i < jsonData.length; i++) {
      const obj = jsonData[i];
      populationMap.set(
          obj["Country (or dependent territory)"],
          obj.Population
      );
    }

    return populationMap;
  }

  function init() {
    const populationMap = buildOwnMap();

    for (const [key, value] of populationMap.entries()) {
      if (key.includes("China")) {
        const currentlyInfected = 366;
        const deaths = 4739;
        const population = value.replace(/,/g, "");
        const infectedPercentage =
            (currentlyInfected / population).toFixed(12) + "%";
        const deathPercentage = (deaths / population).toFixed(12) + "%";

        console.log("infectedPercentage: " + infectedPercentage);
        console.log("deathPercentage: " + deathPercentage);
      }
    }
  }

  init();
}
