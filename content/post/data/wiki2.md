+++
categories = ["Data"]
tags = ["cloud", "dataviz"]
title = "Processing 10TB of Wikipedia Page Views - Part 2"
subtitle = "Data Visualization"
date = "2020-03-21"
coverImage = "img/wiki2.jpg"
+++

This is the second of a two part series in which we focus on interesting queries and visualizations using the data pipeline we created in part one.
<!--more-->
In [part one](/processing-10tb-of-wikipedia-page-views-part-1/), we covered the problem statement and the data engineering solution, including all the code needed to build a reliable, robust big data processing pipeline. In this part two, we'll cover some of the fun things we can do once we have our data pipeline running: interesting queries and data visualizations and a Data Studio dashboard you can try yourself.

## What can we do with this data?

For starters, let's find out the most popular Wikipedia article so far this year:

<br>
<details>
  <summary>Click here to expand code</summary>

```sql
SELECT title, SUM(views) total_views
FROM `bigquery-public-data.wikipedia.pageviews_2020` 
WHERE wiki IN ('en', 'en.m') 
AND title NOT IN ('Main_Page','-','Wikipedia')
AND title NOT LIKE 'File%'
AND title NOT LIKE 'Special:%'
AND title NOT LIKE 'Portal:%'
AND datehour>='2020-01-01'
AND views>10000
GROUP BY title
ORDER BY 2 DESC
LIMIT 10
```
</details>

![Design](/img/allviews.png)

## It's only rock & roll, but I like it

That last query was interesting but it doesn't take advantage of the entity data we worked so hard to process in part 1. Let's construct an example leveraging our wikidata table to find the most viewed pages for rock bands in 2020. Of course, this begs the question, what is a rock band? Wikidata to the rescue!

You can search the wikidata interactively via the [wikidata site](https://www.wikidata.org/wiki/Wikidata:Main_Page), like this:

![Rock Band entity search](/img/rockband.png)

This shows us that "rock band" matches multiple entities, including the video game of the same name. The entity we're after is the first one: 5741069. One way to confirm this finding is to search for a known entity that should be in this category:

![Beatles entity search](/img/beatles.png)

Here we see that the preeminent rock band, The Beatles, is indeed classified as an instance of "Rock Band". But this doesn't catch every page I'm interested. For example, Radiohead is considered an instance of "Musical Group" (215380).

Armed with those two entity ids, we can now do some queries about popular bands. But I want to do one more thing before we start querying. Since our scope is limited to just those two entities, it's wasteful to search the full 10TB dataset on every query. Wouldn't it be nice if there was a way to limit our search to include only the pages we care about? Well, there is - we'll create what BigQuery calls a view, which will limit our query scope to only the view counts for pages about bands.

Here's the SQL code to create my view, which I've made public so you can try it too:

<br>
<details>
  <summary>Click here to expand code</summary>

```SQL
CREATE OR REPLACE TABLE `mco-bigquery.wikipedia.bands`
(datehour TIMESTAMP, title STRING, views INT64)
PARTITION BY DATE(datehour)
CLUSTER BY title
AS
  SELECT datehour, title, SUM(views) views
  FROM `bigquery-public-data.wikipedia.pageviews_*` a
  JOIN (
    SELECT DISTINCT en_wiki
    FROM `bigquery-public-data.wikipedia.wikidata`
    WHERE EXISTS (SELECT * FROM UNNEST(instance_of) WHERE numeric_id=5741069 or numeric_id=215380)
    AND en_wiki IS NOT null
  ) b
ON a.title=b.en_wiki
AND a.wiki='en'
AND DATE(a.datehour) BETWEEN '2015-01-01' AND '2020-12-31'
GROUP BY datehour, title
```
</details>

This view gives us a dataset we can query much more quickly and economically, because we're only scanning information associated with bands, which is a small subset of the overall dataset.

Let's find the most wiki-popular band so far in 2020 with this query:

<br>
<details>
  <summary>Click here to expand code</summary>

```SQL
SELECT title, SUM(views) views
FROM `mco-bigquery.wikipedia.bands`
WHERE DATE(datehour) BETWEEN "2020-01-01" AND "2020-12-31"
GROUP BY title
ORDER BY views DESC
LIMIT 10
```
</details>

And the results as of this writing... 

![Most popular bands of 2020](/img/bands2020.png)

## Let's make a dashboard!

This is fun but:

1. It's a snapshot of a single moment -- it doesn't give us any sense of how this data varies over time.
1. SQL queries can be a bit complicated, especially for beginners. 
1. This query is interactive for me but I'd like to somehow share that interactivity with others.

Wouldn't it be nice if I could easily, without writing a single line of code, allow everyone to query this data, with mouse clicks rather than SQL queries, and to see the results in a nice color coded time series graph?

Using [Google Data Studio](https://datastudio.google.com/overview), I made just such a dashboard, which I've embeded below. Give it a try -- you can play with the selected bands and the time frame you'd like to analyse.
<br />
<br />

<iframe width="100%" height="500" src="https://datastudio.google.com/embed/reporting/ca35a15e-868b-4529-9c6c-0a5610e23a3e/page/Viq6" frameborder="0" style="border:0" allowfullscreen></iframe>

For example, I wonder which band, during the last five years, was more popular: the Beatles or the Stones? We can use this dashboard to find out in just a few seconds:

![Beatles vs. Stones](/img/beatles-stones.png)

Despite having ended their career fifty years ago, the Beatles continue to gather a pretty impressive level of attention in Wikipedia page views.

## Now it's your turn
I've made this data available to everyone in the BigQuery Public Dataset collection. The pageviews are coming in roughly every hour and the entity data gets refreshed every 3-4 days. The data can be found in the ```bigquery-public-data``` collection, under ```Wikipedia```, as shown below:

![Public wikipedia dataset](/img/public.png)

These tables are partitioned so you can save time and cost by time limiting your queries, like this:

<br>
<details>
  <summary>Click here to expand code</summary>

```SQL
SELECT title, SUM(views) views
FROM `bigquery-public-data.wikipedia.pageviews_2019`
WHERE DATE(datehour) BETWEEN "2019-01-01" AND "2019-12-31" AND wiki = 'en'
GROUP BY title
ORDER BY views DESC
LIMIT 20
```
</details>

The "Battle of the Bands" dashboard is also available for your use at [mco.fyi/bands](https://mco.fyi/bands).

## Resources and Acknowledgements
* [Part 1](/processing-10tb-of-wikipedia-page-views-part-1/) of this series
* All of the code described in this article can be found here:
[github.com/marcacohen/wikidata](https://github.com/marcacohen/wikidata).
* Many thanks to [Felipe Hoffa](https://medium.com/@hoffa). Several of the queries and data management techniques in this article were derived from Felipe's excellent articles on
[partitioning and lazy loading](https://medium.com/google-cloud/bigquery-lazy-data-loading-ddl-dml-partitions-and-half-a-trillion-wikipedia-pageviews-cd3eacd657b6), 
and [clustering](https://medium.com/google-cloud/bigquery-optimized-cluster-your-tables-65e2f684594b).
* [Shane Glass](https://twitter.com/shanecglass) provided invaluable support helping me add this data to the wonderful [Google Cloud Public Datasets](https://cloud.google.com/public-datasets) collection.
