-- Annual CO₂ emissions by country (tonnes per year, absolute)
-- Source: Global Carbon Project via Our World in Data
-- Chart: https://ourworldindata.org/grapher/annual-co2-emissions-per-country

SELECT
  "Entity"  AS entity,
  "Code"    AS iso3,
  "Year"    AS year,
  * EXCLUDE ("Entity", "Code", "Year")
FROM read_csv_auto(
  'https://ourworldindata.org/grapher/annual-co2-emissions-per-country.csv'
)
WHERE "Code" IS NOT NULL
  AND "Code" != ''
