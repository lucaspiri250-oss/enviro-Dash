-- Forest area as share of land area (%)
-- Source: FAO via World Bank via Our World in Data
-- Chart: https://ourworldindata.org/grapher/forest-area-as-share-of-land-area

SELECT
  "Entity"  AS entity,
  "Code"    AS iso3,
  "Year"    AS year,
  * EXCLUDE ("Entity", "Code", "Year")
FROM read_csv_auto(
  'https://ourworldindata.org/grapher/forest-area-as-share-of-land-area.csv'
)
WHERE "Code" IS NOT NULL
  AND "Code" != ''
