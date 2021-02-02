export function cleanup() {
    function start() {
        document.querySelector('#inputCountrySel [value="switzerland"]').selected = true;
        document.getElementById("inputCountry").value = "";
        document.getElementById("output").innerHTML = "";
    }

    document.getElementById("reset").addEventListener("click", start);
}
