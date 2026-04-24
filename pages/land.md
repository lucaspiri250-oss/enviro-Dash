---
title: Land
description: Forest cover as a share of land area, by country over time.
---

# Land

Forest area as a percentage of total land area. FAO's definition of "forest"
has limitations — it counts plantations and includes land that is temporarily
unstocked — so this is a directional indicator, not a measure of ecosystem
health.

<Dropdown
  name=countries
  data={country_list}
  value=iso3
  label=entity
  multiple=true
  defaultValue={['BRA','IDN','COD','CAN','USA']}
  title="Countries"
/>

```sql country_list
select distinct iso3, entity
from owid.forest_area
where iso3 is not null and iso3 != 'OWID_WRL'
order by entity
```

## Forest area (% of land)

```sql forest_series
select
  entity,
  year,
  "Share of land covered by forest" as forest_share
from owid.forest_area
where iso3 in ${inputs.countries.value}
order by year, entity
```

<LineChart
  data={forest_series}
  x=year
  y=forest_share
  series=entity
  yAxisTitle="% of land"
/>

## Net change since 1990

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
  yAxisTitle="percentage-point change"
  title="Change in forest cover since 1990"
/>
