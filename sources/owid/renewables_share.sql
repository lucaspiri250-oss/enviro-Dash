-- Share of electricity produced from renewables (%)
-- Source: Ember / Energy Institute via Our World in Data
-- Chart: https://ourworldindata.org/grapher/share-electricity-renewables

SELECT
  "Entity"  AS entity,
  "Code"    AS iso3,
  "Year"    AS year,
  * EXCLUDE ("Entity", "Code", "Year")
FROM read_csv_auto(
  'https://ourworldindata.org/grapher/share-electricity-renewables.csv'
)
WHERE "Code" IS NOT NULL
  AND "Code" != ''
