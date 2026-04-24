---
title: Emissions
description: CO₂ emissions per capita and absolute, by country over time.
---

# Emissions

CO₂ emissions from fossil fuels and industry, shown two ways: per person and in
absolute terms. Per-capita shows lifestyle and economic intensity; absolute
shows contribution to the global total.

<Dropdown
  name=countries
  data={country_list}
  value=iso3
  label=entity
  multiple=true
  defaultValue={['USA','CHN','IND','DEU','BRA']}
  title="Countries"
/>

```sql country_list
select distinct iso3, entity
from owid.co2_per_capita
where iso3 is not null and iso3 != 'OWID_WRL'
order by entity
```

## Per capita (tonnes / person)

```sql per_capita_series
select
  entity,
  year,
  "CO₂ emissions per capita" as co2_per_capita
from owid.co2_per_capita
where iso3 in ${inputs.countries.value}
  and year >= 1950
order by year, entity
```

<LineChart
  data={per_capita_series}
  x=year
  y=co2_per_capita
  series=entity
  yAxisTitle="tonnes per person"
/>

## Absolute (tonnes / year)

```sql absolute_series
select
  entity,
  year,
  "Annual CO₂ emissions" as co2_annual
from owid.annual_co2
where iso3 in ${inputs.countries.value}
  and year >= 1950
order by year, entity
```

<LineChart
  data={absolute_series}
  x=year
  y=co2_annual
  series=entity
  yAxisTitle="tonnes CO₂"
/>

## The most recent year at a glance

```sql latest_year
select max(year) as yr from owid.annual_co2
```

```sql latest_per_capita
select entity, "CO₂ emissions per capita" as co2_per_capita
from owid.co2_per_capita
where year = (select yr from latest_year)
  and iso3 in ${inputs.countries.value}
order by co2_per_capita desc
```

<BarChart
  data={latest_per_capita}
  x=entity
  y=co2_per_capita
  yAxisTitle="tonnes per person"
  title="Latest available year — per capita"
/>
