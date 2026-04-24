-- Global mean surface temperature anomaly (°C, relative to 1951–1980 baseline)
-- Source: NASA GISTEMP via Our World in Data
-- Chart: https://ourworldindata.org/grapher/temperature-anomaly

SELECT
  "Entity"  AS entity,
  "Code"    AS iso3,
  "Year"    AS year,
  * EXCLUDE ("Entity", "Code", "Year")
FROM read_csv_auto(
  'https://ourworldindata.org/grapher/temperature-anomaly.csv'
)
-- This dataset has global/hemispheric series rather than country rows;
-- keep everything. Filter on entity in page queries if needed.
