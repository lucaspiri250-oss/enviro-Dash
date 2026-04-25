-- PM2.5 air pollution — mean annual exposure (micrograms per cubic metre)
-- Source: Global Burden of Disease Study / IHME via Our World in Data
-- Chart: https://ourworldindata.org/grapher/PM2-5-air-pollution
--
-- WHO guideline: 5 µg/m³ annual mean (tightened from 10 µg/m³ in 2021).
-- Values above 15 µg/m³ are associated with significant health impacts.

SELECT
  "Entity"  AS entity,
  "Code"    AS iso3,
  "Year"    AS year,
  * EXCLUDE ("Entity", "Code", "Year")
FROM read_csv_auto(
  'https://ourworldindata.org/grapher/average-exposure-pm25-pollution.csv'
)
WHERE "Code" IS NOT NULL
  AND "Code" != ''
