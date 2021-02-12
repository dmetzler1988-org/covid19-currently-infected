export function covid() {
    const influenzaInfectedGlobalYearlyPercentage = 20;
    const influenzaDeathsGlobalYearly = 650000;

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
                confirmedPercentage = (confirmedCases / countryPopulation * 100).toFixed(12) + "%";
                deathPercentage = (deathCases / countryPopulation * 100).toFixed(12) + "%";
                recoveredPercentage = (recoveredCases / countryPopulation * 100).toFixed(12) + "%";
                currentlyInfectedPercentage = (currentlyInfected / countryPopulation * 100).toFixed(12) + "%";
            }
        }

        let $outputHtml = `
            <div><div class="inner">
                <div><strong class="country">${country}:</strong></div>
                <div class="flex-container">
                    <span class="flex-item">Total population: ${formatNumber(countryPopulation)}</span>
                </div>
                <div class="flex-container">
                    <span class="flex-item">Confirmed Cases: ${formatNumber(confirmedCases)}</span>
                    <c class="flex-item">(${confirmedPercentage} of population)</c>
                </div>
                <div class="flex-container">
                    <span class="flex-item">Death Cases: ${formatNumber(deathCases)}</span>
                    <c class="flex-item">(${deathPercentage} of population)</c>
                </div>
                <div class="flex-container">
                    <span class="flex-item">Recovered Cases: ${formatNumber(recoveredCases)}</span>
                    <c class="flex-item">(${recoveredPercentage} of population)</c>
                </div>
                </br>
                <div class="flex-container">
                    <span class="flex-item">Currently infected: ${formatNumber(currentlyInfected)}</span>
                    <c class="flex-item">(${currentlyInfectedPercentage} of population)</c>
                </div>`;

        if (country === "Global") {
            const fluInfected = (countryPopulation / 100) * influenzaInfectedGlobalYearlyPercentage;
            const fluDeathsPercentage = ((influenzaDeathsGlobalYearly / countryPopulation) * 100).toFixed(12) + "%";

            $outputHtml += `
                </br></br>
                <div><strong>${country} Influenza Yearly:</strong></div>
                <div class="flex-container">
                    <span class="flex-item">Infected Cases: ~ ${formatNumber(fluInfected)}</span>
                    <c class="flex-item">(~ 20% of population)</c>
                </div>
                <div class="flex-container">
                    <span class="flex-item">Death Cases: ~ ${formatNumber(influenzaDeathsGlobalYearly)}</span>
                    <c class="flex-item"(~ ${fluDeathsPercentage} of population)</c>
                </div>`;

            const fluCovidDiffInfected = confirmedCases - fluInfected;
            const fluCovidDiffDeaths = deathCases - influenzaDeathsGlobalYearly;
            $outputHtml += `
                </br></br>
                <div><strong>Diff COVID-19 vs. Influenza:</strong></div>
                <div class="flex-container">
                    <span class="flex-item">Infected Cases: ~ ${formatNumber(fluCovidDiffInfected)}</span>
                </div>
                <div class="flex-container">
                    <span class="flex-item">Death Cases: ~ ${formatNumber(fluCovidDiffDeaths)}</span>
                </div>`;
        }

        $outputHtml += `</div></div>`;
        document.getElementById("output").innerHTML += $outputHtml;
    }

    function getGlobal() {
        const totalUrl = "https://api.covid19api.com/world/total";
        const datas = fetchAsync(totalUrl);

        Promise.all([datas]).then((results) => {
            const result = results[0];

            calcAndOutput(
                "Global",
                result.TotalConfirmed,
                result.TotalDeaths,
                result.TotalRecovered
            );
        });
    }

    /**
     * Recursive function: If no cases in last element are available, check previous element.
     *
     * @param {array} result
     * @param {int} counter
     *
     * @returns {*|number}
     */
    function getCases(result, counter) {
        if (typeof counter === "undefined") {
            counter = 1;
        }

        let data = result[result.length - counter];
        let cases = -1;
        if (typeof data !== "undefined") {
            cases = data.Cases;
        }

        // Currently deactivated - because what if, when really no cases exist for this country?
        /*if (cases === 0) {
            return getCases(result, counter+1);
        }*/

        return cases;
    }

    function getByCountry(country) {
        const currentYear = new Date().getFullYear();
        const confirmedUrl = `https://api.covid19api.com/total/country/${country}/status/confirmed?from=2020-01-01T00:00:00Z&to=${currentYear}-12-31T23:59:59Z`;
        const deathsUrl = `https://api.covid19api.com/total/country/${country}/status/deaths?from=2020-01-01T00:00:00Z&to=${currentYear}-12-31T23:59:59Z`;
        const recoveredUrl = `https://api.covid19api.com/total/country/${country}/status/recovered?from=2020-01-01T00:00:00Z&to=${currentYear}-12-31T23:59:59Z`;

        const confirmedDatas = fetchAsync(confirmedUrl);
        const deathsDatas = fetchAsync(deathsUrl);
        const recoveredDatas = fetchAsync(recoveredUrl);

        Promise.all([confirmedDatas, deathsDatas, recoveredDatas]).then(
            (results) => {
                if ((results[0] && results[0].message !== "Not Found") || (typeof results[0] !== "undefined" && results[0].length > 0)) {
                    const firstResult = results[0];
                    const data = firstResult[firstResult.length - 1];
                    let country;
                    if (typeof data !== "undefined") {
                        country = data.Country;
                    }

                    const confirmedCases = getCases(results[0]);
                    const deathCases = getCases(results[1]);
                    const recoveredCases = getCases(results[2]);

                    if (confirmedCases !== -1 && deathCases !== -1 && recoveredCases !== -1) {
                        calcAndOutput(country, confirmedCases, deathCases, recoveredCases);
                    } else {
                        document.getElementById("output").innerHTML = "Some values are not given.";
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
