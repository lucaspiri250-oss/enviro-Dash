---
title: Land & Forests
description: Forest cover as a share of land area, by country since 1990. See which countries are gaining tree cover and which are still losing it.
---

Forest area as a percentage of total land. The trend here is more mixed than emissions or energy — some countries have reversed deforestation while others continue to lose cover at pace.

A word on the data: the FAO definition of "forest" has well-known limitations. It counts monoculture timber plantations, includes land temporarily cleared after fire or logging, and doesn't distinguish primary rainforest from managed tree farms. Treat this as a directional indicator of land use pressure, not a measure of ecosystem health or biodiversity.

The default selection highlights the tension: Brazil and Indonesia are among the world's largest tropical forest holders and have historically shown steep declines; the Democratic Republic of Congo holds the second-largest rainforest and is watching it diminish; Canada shows the relative stability of boreal forests under different land-use pressures.

<Dropdown
  name=countries
  data={country_list}
  value=iso3
  label=entity
  multiple=true
  defaultValue={['BRA','IDN','COD','CAN','USA']}
  title="Countries"
/>

<Slider
  name=minYear
  title="From year"
  min=1990
  max=2023
  defaultValue=1990
  step=1
/>

<Slider
  name=maxYear
  title="To year"
  min=1990
  max=2023
  defaultValue=2023
  step=1
/>

```sql country_list
select distinct iso3, entity
from owid.forest_area
where iso3 is not null and iso3 != 'OWID_WRL'
order by entity
```

## Forest cover over time

Countries in the tropics typically show declining lines as agricultural frontiers expand. Temperate and boreal regions show more stability — and some European countries have actually increased cover through afforestation programmes.

```sql forest_series
select
  entity,
  year,
  "Share of land covered by forest" as forest_share
from owid.forest_area
where iso3 in ${inputs.countries.value}
  and year >= ${inputs.minYear}
  and year <= ${inputs.maxYear}
order by year, entity
```

<LineChart
  data={forest_series}
  x=year
  y=forest_share
  series=entity
  yAxisTitle="% of land area"
  title="Forest cover over time"
/>

## Net change since 1990

Percentage-point gain or loss since 1990, the baseline year for most international forest-related commitments (including the UN's Sustainable Development Goals). Bars below zero represent countries that have lost forest cover; bars above zero have gained it.

```sql forest_change
with first_year as (
  select iso3, "Share of land covered by forest" as start_pct
  from owid.forest_area
  where year = 1990
),
last_year as (
  select iso3, entity, "Share of land covered by forest" as end_pct, year
  from owid.forest_area
  where year = (select max(year) from owid.forest_area)
)
select
  l.entity,
  l.end_pct - f.start_pct as pct_point_change
from last_year l
join first_year f using (iso3)
where l.iso3 in ${inputs.countries.value}
order by pct_point_change
```

<BarChart
  data={forest_change}
  x=entity
  y=pct_point_change
  yAxisTitle="percentage-point change since 1990"
  title="Change in forest cover since 1990"
/>

## All countries ranked — current forest cover

```sql all_countries_forest
with latest_year as (select max(year) as yr from owid.forest_area)
select entity, "Share of land covered by forest" as forest_share
from owid.forest_area
where year = (select yr from latest_year)
  and iso3 is not null and iso3 != 'OWID_WRL'
order by forest_share desc
```

<DataTable
  data={all_countries_forest}
  rows=15
  search=true
/>

---

Source: UN Food and Agriculture Organisation (FAO) via Our World in Data. Data coverage begins 1990 for most countries.
