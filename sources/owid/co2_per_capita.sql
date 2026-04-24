-- CO₂ emissions per capita (tonnes per person, per year)
-- Source: Global Carbon Project via Our World in Data
-- Chart: https://ourworldindata.org/grapher/co-emissions-per-capita
--
-- Every OWID chart CSV has the same first three columns: Entity, Code, Year.
-- The 4th column is the indicator value, named to match the chart's metric.

SELECT
  "Entity"  AS entity,
  "Code"    AS iso3,
  "Year"    AS year,
  * EXCLUDE ("Entity", "Code", "Year")
FROM read_csv_auto(
  'https://ourworldindata.org/grapher/co-emissions-per-capita.csv'
)
WHERE "Code" IS NOT NULL
  AND "Code" != ''   -- exclude aggregate regions without ISO codes
