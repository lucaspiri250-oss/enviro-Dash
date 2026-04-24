---
title: Environmental Indicators
description: Track any country's CO₂ emissions, clean energy progress, forest cover, and global temperature in one view. Data from Our World in Data.
---

# Environmental Indicators

Four numbers that sketch a country's environmental footprint: carbon emitted per person, share of electricity from clean sources, forest cover, and where global temperatures are heading. Select a country to trace its trajectory across all four — then use the sidebar to compare multiple countries on any single theme.

Data is pulled at build time from [Our World in Data](https://ourworldindata.org)'s open datasets. Underlying sources include the Global Carbon Project, Ember, FAO, and NASA GISTEMP.

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

Tonnes of CO₂ emitted per person per year, from fossil fuels and industry. High numbers reflect energy-intensive economies and lifestyles — Gulf states and Australia typically lead; countries like India remain low despite large absolute totals. Most wealthy nations peaked in the 1970s–80s and have since declined.

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
  title="CO₂ per capita — {inputs.country.label}"
/>

## Renewable share of electricity

Share of electricity generated from hydro, wind, solar, biomass, and geothermal. A rising line means a country is decarbonising its power sector. The recent acceleration in most countries reflects falling costs for solar and wind — not just policy commitments.

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
  title="Renewable electricity share — {inputs.country.label}"
/>

## Forest cover

Forest area as a percentage of total land. Declining lines typically correspond to agricultural expansion and logging. Coverage ranges from near-zero in arid and heavily urbanised nations to above 60% in parts of the tropics and Nordic countries.

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
  title="Forest cover — {inputs.country.label}"
/>

## Global temperature anomaly

Deviation from the 1961–1990 average, measured by NASA GISTEMP. This is the one global indicator — country selection has no effect. Every decade since the 1980s has been warmer than the one before it.

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
  yAxisTitle="°C vs. 1961–1990 baseline"
  title="Global temperature anomaly"
/>

---

Data: [Our World in Data](https://ourworldindata.org) (CC BY). If any chart shows no data,
an OWID column name may have changed — see `spec/README.md` for how to fix it.
