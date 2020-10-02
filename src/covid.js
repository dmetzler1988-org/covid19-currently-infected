export function covid() {
    async function fetchAsync(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    function calcAndOutput(country, confirmedCases, deathCases, recoveredCases) {
        const currentlyInfected = confirmedCases - (deathCases + recoveredCases);

        const population = document.getElementById("hidden-population-map").value;
        const splittedPopulation = population.split(/\n/);
        let populationMap = new Map();
        for (let i = 0; i < splittedPopulation.length; i++) {
            const obj = splittedPopulation[i];
            const splittedObj = obj.split(/:/);
            populationMap.set(splittedObj[0], splittedObj[1]);
        }

        let populationCountry = country === "Global" ? "World" : country;
        let countryPopulation = 0;
        let confirmedPercentage = "";
        let deathPercentage = "";
        let recoveredPercentage = "";
        let currentlyInfectedPercentage = "";
        for (const [key, value] of populationMap.entries()) {
            if (key.toLowerCase().startsWith(populationCountry.toLowerCase())) {
                countryPopulation = value.replace(/,/g, "");
                confirmedPercentage = (confirmedCases / countryPopulation).toFixed(12) + "%";
                deathPercentage = (deathCases / countryPopulation).toFixed(12) + "%";
                recoveredPercentage = (recoveredCases / countryPopulation).toFixed(12) + "%";
                currentlyInfectedPercentage = (currentlyInfected / countryPopulation).toFixed(12) + "%";
            }
        }

        document.getElementById("output").innerHTML = `
          <strong>${country}:</strong></br>
          Total population: ${formatNumber(countryPopulation)}</br>
          Confirmed Cases: ${formatNumber(confirmedCases)} <c>(${confirmedPercentage} of population)</c></br>
          Deaths Cases: ${formatNumber(deathCases)} <c>(${deathPercentage} of population)</c></br>
          Recovered Cases: ${formatNumber(recoveredCases)} <c>(${recoveredPercentage} of population)</c></br>
          </br>
          Currently infected: ${formatNumber(currentlyInfected)} <c>(${currentlyInfectedPercentage} of population)</c>`;
    }

    function getGlobal() {
        const totalUrl = "https://api.covid19api.com/world/total";
        const datas = fetchAsync(totalUrl);

        Promise.all([datas]).then((results) => {
            const result = results[0];

            calcAndOutput("Global", result.TotalConfirmed, result.TotalDeaths, result.TotalRecovered);
        });
    }

    function getCases(result) {
        const data = result[result.length - 1];
        let cases;
        if (typeof data !== "undefined") {
            cases = data.Cases;
        }

        return cases;
    }

    function getByCountry(country) {
        const confirmedUrl = `https://api.covid19api.com/total/country/${country}/status/confirmed?from=2020-01-01T00:00:00Z&to=2020-12-31T23:59:59Z`;
        const deathsUrl = `https://api.covid19api.com/total/country/${country}/status/deaths?from=2020-01-01T00:00:00Z&to=2020-12-31T23:59:59Z`;
        const recoveredUrl = `https://api.covid19api.com/total/country/${country}/status/recovered?from=2020-01-01T00:00:00Z&to=2020-12-31T23:59:59Z`;

        const confirmedDatas = fetchAsync(confirmedUrl);
        const deathsDatas = fetchAsync(deathsUrl);
        const recoveredDatas = fetchAsync(recoveredUrl);

        Promise.all([confirmedDatas, deathsDatas, recoveredDatas]).then(
            (results) => {
                if (
                    (results[0] && results[0].message !== "Not Found")
                    || (typeof results[0] !== "undefined" && results[0].length > 0)
                ) {
                    const firstResult = results[0];
                    const data = firstResult[firstResult.length - 1];
                    let country;
                    if (typeof data !== "undefined") {
                        country = data.Country;
                    }

                    const confirmedCases = getCases(results[0]);
                    const deathCases = getCases(results[1]);
                    const recoveredCases = getCases(results[2]);

                    if (confirmedCases && deathCases && recoveredCases) {
                        calcAndOutput(country, confirmedCases, deathCases, recoveredCases);
                    } else {
                        document.getElementById("output").innerHTML = "Country is not valid";
                        return;
                    }
                } else {
                    document.getElementById("output").innerHTML = "Country is not valid";
                    return;
                }
            }
        );
    }

    function start() {
        let country = document.getElementById("inputCountrySel").value.toLowerCase();
        const countryInput = document.getElementById("inputCountry").value.toLowerCase();

        if (countryInput !== "") {
            country = countryInput;
        }

        if (country === "" || country === "global") {
            getGlobal();
        } else {
            getByCountry(country);
        }
    }

    document.getElementById("start").addEventListener("click", start);
}
