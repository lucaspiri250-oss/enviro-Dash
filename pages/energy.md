---
title: Energy
description: Renewable share of electricity generation, by country over time.
---

# Energy

Renewable share of electricity includes hydro, wind, solar, biomass, and
geothermal. A rising line means a country is decarbonizing its power sector,
either by adding clean generation or retiring fossil plants.

<Dropdown
  name=countries
  data={country_list}
  value=iso3
  label=entity
  multiple=true
  defaultValue={['USA','DEU','BRA','CHN','NOR']}
  title="Countries"
/>

```sql country_list
select distinct iso3, entity
from owid.renewables_share
where iso3 is not null and iso3 != 'OWID_WRL'
order by entity
```

## Renewable share of electricity (%)

```sql renewables_series
select
  entity,
  year,
  "Renewables" as renewables_share
from owid.renewables_share
where iso3 in ${inputs.countries.value}
order by year, entity
```

<LineChart
  data={renewables_series}
  x=year
  y=renewables_share
  series=entity
  yAxisTitle="% of electricity"
/>

## Latest year

```sql latest_year
select max(year) as yr from owid.renewables_share
```

```sql latest_renewables
select entity, "Renewables" as renewables_share
from owid.renewables_share
where year = (select yr from latest_year)
  and iso3 in ${inputs.countries.value}
order by renewables_share desc
```

<BarChart
  data={latest_renewables}
  x=entity
  y=renewables_share
  yAxisTitle="% of electricity"
  title="Renewable share, most recent year"
/>
