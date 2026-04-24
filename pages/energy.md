---
title: Energy Transition
description: How much of each country's electricity comes from renewable sources? Track the clean energy transition by country since 1990.
---

# Energy Transition

The share of electricity generated from renewable sources — hydro, wind, solar, biomass, and geothermal — is the clearest single metric for how fast a country is decarbonising its power sector. It doesn't capture heating, transport, or industrial heat, but electricity is where most of the transition is happening fastest.

The default selection puts Norway alongside Germany, China, Brazil, and the US to show the range: Norway has been near-100% (mostly hydro) for decades, while Germany's visible "Energiewende" rise is recent and policy-driven. Brazil's high baseline comes from its vast hydroelectric capacity; China's steep rise from 2010 onward reflects the world's largest solar and wind build-out.

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

## Renewable share of electricity over time

The global average has been rising sharply since around 2010 — almost entirely driven by solar and wind, whose costs fell by 90% in a decade. Countries without strong hydro resources show the steepest recent gradients.

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
  yAxisTitle="% of electricity from renewables"
  title="Renewable electricity share over time"
/>

## Snapshot — most recent year

Current standing. A country at 20% today would need to roughly quintuple its clean generation to fully decarbonise — the bar shows how far each one still has to travel.

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
  title="Renewable share, latest available year"
/>

---

Source: Ember and other sources via Our World in Data. "Renewables" includes hydro, wind, solar, biomass, and geothermal — it does not include nuclear.
