export function populations() {
  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "./src/population.json", true);
    xobj.onreadystatechange = function () {
      if (xobj.readyState === 4 && xobj.status === 200) {
        // .open will NOT return a value but simply returns undefined in async mode so use a callback
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  function buildOwnMap($textArea) {
    loadJSON(function (response) {
      const jsonData = JSON.parse(response);

      let dataString = "";
      for (let i = 0; i < jsonData.length; i++) {
        const obj = jsonData[i];
        dataString +=
            obj["Country (or dependent territory)"] +
            ":" +
            obj.Population.replace(/,/g, "") +
            "\n";
      }

      $textArea.value = dataString;
      document.getElementById("start").disabled = false;
    });
  }

  const $textArea = document.getElementById("hidden-population-map");
  buildOwnMap($textArea);
}
