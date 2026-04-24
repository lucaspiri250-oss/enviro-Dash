---
title: Environmental Indicators
description: A dashboard of key environmental indicators sourced from Our World in Data.
---

# Environmental Indicators

A small dashboard pulling climate, energy, and land-use data from
[Our World in Data](https://ourworldindata.org).

Pick a country from the dropdown to see its trajectory across the key
indicators. Use the sidebar to dig into individual themes.

<Dropdown
  name=country
  data={country_list}
  value=iso3
  label=entity
  defaultValue="USA"
  title="Country"
/>

```sql country_list
select distinct iso3, entity
from owid.co2_per_capita
where iso3 is not null and iso3 != 'OWID_WRL'
order by entity
```

## CO₂ emissions per capita

```sql country_co2
select year, "CO₂ emissions per capita" as co2_per_capita
from owid.co2_per_capita
where iso3 = '${inputs.country.value}'
  and year >= 1950
order by year
```

<LineChart
  data={country_co2}
  x=year
  y=co2_per_capita
  yAxisTitle="tonnes CO₂ per person"
  title="CO₂ per capita over time"
/>

## Renewable share of electricity

```sql country_renewables
select year, "Renewables" as renewables_share
from owid.renewables_share
where iso3 = '${inputs.country.value}'
order by year
```

<LineChart
  data={country_renewables}
  x=year
  y=renewables_share
  yAxisTitle="% of electricity"
  title="Renewable share of electricity"
/>

## Forest area

```sql country_forest
select year, "Share of land covered by forest" as forest_share
from owid.forest_area
where iso3 = '${inputs.country.value}'
order by year
```

<LineChart
  data={country_forest}
  x=year
  y=forest_share
  yAxisTitle="% of land"
  title="Forest area (% of land)"
/>

## Global temperature anomaly

The one global-level indicator — not country-specific. Shown here for context.

```sql global_temp
select year, "Average" as anomaly
from owid.temperature_anomaly
where entity = 'World'
  and year >= 1880
order by year
```

<LineChart
  data={global_temp}
  x=year
  y=anomaly
  yAxisTitle="°C anomaly"
  title="Global temperature anomaly (°C vs. 1961–1990)"
/>

---

Data: [Our World in Data](https://ourworldindata.org) (CC BY). Underlying sources
include the Global Carbon Project, NASA GISTEMP, FAO, and Ember.
If any chart fails to render, the OWID column name may have changed — visit
the corresponding `.csv` URL in your browser to see the exact column header
and update the page query accordingly.
