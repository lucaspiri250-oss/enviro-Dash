---
title: Emissions
description: CO₂ emissions per capita and in absolute terms, by country since 1950. Compare the world's biggest emitters and track who's cutting fastest.
---

# Emissions

CO₂ from fossil fuels and industry, shown two ways. **Per capita** reveals the carbon intensity of a country's economy and lifestyle — it's the fairness lens. **Absolute** shows a country's total contribution to the atmosphere — it's the physical impact lens. A country can look responsible on one and not the other; both matter.

The default selection (USA, China, India, Germany, Brazil) illustrates the tension: the US and Germany lead on per-capita cuts, while China and India show rapidly rising absolute totals despite low per-person numbers.

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

## Per capita emissions — tonnes CO₂ per person

Most wealthy nations peaked in the 1970s–80s as energy efficiency improved and heavy industry declined. The steepest falls since 2000 are largely from coal-to-gas switching and the growth of renewables, not economic contraction.

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
  yAxisTitle="tonnes CO₂ per person"
  title="CO₂ per capita since 1950"
/>

## Absolute emissions — total tonnes CO₂ per year

The scale here is unforgiving. Global CO₂ from fossil fuels has roughly quadrupled since 1950. China's rise from near-zero to the world's largest emitter happened almost entirely between 1990 and 2010 — one of the fastest industrialisations in history.

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
  yAxisTitle="tonnes CO₂ per year"
  title="Total CO₂ emissions since 1950"
/>

## Snapshot — most recent year

Where each selected country stands today, ranked by per-capita emissions. Useful for cutting through the noise of historical trends and seeing the current state plainly.

```sql latest_per_capita
with latest_year as (select max(year) as yr from owid.annual_co2)
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
  yAxisTitle="tonnes CO₂ per person"
  title="Per-capita emissions, latest available year"
/>

---

Source: Global Carbon Project via Our World in Data. Covers CO₂ from fossil fuels and industry only — land-use change emissions are excluded.
