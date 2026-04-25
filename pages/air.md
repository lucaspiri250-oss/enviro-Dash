---
title: Air Quality
description: Mean annual PM2.5 exposure by country over time. See how air quality compares across the world and which countries are improving fastest.
---

PM2.5 — fine particulate matter smaller than 2.5 micrometres — is the air pollutant most consistently linked to serious health effects. It penetrates deep into the lungs and enters the bloodstream, contributing to heart disease, stroke, lung cancer, and respiratory illness. The WHO estimates it causes around 7 million premature deaths per year, making it the world's largest environmental health risk.

The WHO annual guideline is **5 µg/m³** (tightened from 10 µg/m³ in 2021). The vast majority of the world's population lives in areas that exceed this threshold — most of South Asia and Sub-Saharan Africa by a factor of 10 or more.

The default selection shows the full range: Bangladesh, India, and Pakistan consistently rank among the world's most polluted; China has made significant improvements since 2015 following strict enforcement of its Air Pollution Action Plan; Germany and the USA show the lower exposure levels typical of wealthy nations with strong clean air regulation.

<Dropdown
  name=countries
  data={country_list}
  value=iso3
  label=entity
  multiple=true
  defaultValue={['BGD','IND','PAK','CHN','DEU','USA']}
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
from owid.pm25
where iso3 is not null and iso3 != 'OWID_WRL'
order by entity
```

## Mean annual PM2.5 exposure over time

Values above 5 µg/m³ exceed the WHO annual guideline. The divergence between high-income and lower-income countries has widened since 1990 — improvements in Europe and North America contrast sharply with rising exposure across South Asia driven by urbanisation, traffic, and industrial growth.

```sql pm25_series
select
  entity,
  year,
  "PM2.5 air pollution, mean annual exposure (micrograms per cubic meter)" as pm25_exposure
from owid.pm25
where iso3 in ${inputs.countries.value}
  and year >= ${inputs.minYear}
  and year <= ${inputs.maxYear}
order by year, entity
```

<LineChart
  data={pm25_series}
  x=year
  y=pm25_exposure
  series=entity
  yAxisTitle="µg/m³ (annual mean)"
  title="PM2.5 exposure over time"
/>

## All countries — most recent year

Countries ranked by current exposure. Run `/owid-check` if this table shows an error — the PM2.5 column name changes between OWID dataset versions.

```sql all_countries_pm25
with latest_year as (select max(year) as yr from owid.pm25)
select
  entity,
  "PM2.5 air pollution, mean annual exposure (micrograms per cubic meter)" as pm25_exposure
from owid.pm25
where year = (select yr from latest_year)
  and iso3 is not null and iso3 != 'OWID_WRL'
order by pm25_exposure desc
```

<DataTable
  data={all_countries_pm25}
  rows=15
  search=true
/>

---

Source: Global Burden of Disease Study (IHME) via Our World in Data. PM2.5 estimates
are modelled — methodology and coverage vary by country and year.

> **Column note:** If this page shows a query error, the OWID PM2.5 column name has
> changed. Run `/owid-check pm25` to detect and fix the mismatch automatically.
