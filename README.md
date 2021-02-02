# COVID-19 Currently Infected

Displays the current status of COVID-19 from given country or worldwide.
It also displays the population and the percentage value to the covid stats in relation to population.

### Information to update `population.json`

Manually do following steps:

1. Copy table (source-code) from [wiki](https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population)
2. Convert with own [html-css-splitter](https://converter.dmetzler1988.io/html-css-splitter.html)
3. Convert to JSON with [converter](https://www.convertjson.com/html-table-to-json.htm)
4. Refactor json with [html remover](https://www.browserling.com/tools/html-strip)
5. save json to project
6. Remove \n breaks (with search and replace)

#### ToDo

- Make an own script which will do these converter steps automatically.
- Optimize code
