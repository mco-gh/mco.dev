+++
image = "Wikipedia.jpg"
banner = ""
menu = ""
categories = ["data"]
tags = ["data"]
title = "Processing 10TB of Wikipedia Page Views"
subtitle = ""
date = "2020-02-18"
draft = false
+++

## What's bigger than Wikipedia? (Spoiler: Wikipedia page views)

I often give talks to students and I like to ask them if anyone knows what this is:

![Encyclopedia](/img/WorldBook.jpg)

I find it humorous than many aren't sure what they're looking at, so I inform them that when I was their age, this was my Google. Perhaps a more accurate statement would be to say this was my Wikipedia.

Because Wikipedia is a centralized web resource, it has a very interesting property that the encyclopedias of my childhood could never match: Wikipedia see and records every access to every article. The Wikimedia Foundation, which operates and maintains Wikipedia, provides [detailed access logs](http://dumps.wikimedia.your.org/) on an hourly basis. This information contains an entry for every article that is viewed, anywhere in the world, in any language.

The popularity of Wikipedia page views provides an interesting glimpse into what we, collectively, find interesting. This data is fun to work with for another reason: it's Big - there's more data in one year's access logs than in all the articles combined in every supported language! Wikipedia logs on the order of 250MB of access data every hour. That's roughly 30\*24\*250 = 180,000MB = 180GB per month, or 2.16TB per year.

The Wikimedia foundation has been publishing this data since 2015 and I want it all, so I'm ultimately looking to snarf up over 10TB of data.

## Page views aren't enough

The kind of queries I'm interested in asking are of this form: what was the most popular wikipedia page in category X over timeframe Y (and how did that popularity change over time)? For example, it would be interesting to see whether the major Democratic presidential candidates' Wikipedia page popularity correlates with the success in polls and primaries.

But think about it -- how would you go about constructing a query of all democratic presidential candidates? The simplest approach would be to explicitly enumerate the known candidates. But that immediately ties our query to the world as it exists now. Ideally, our queries should automatically adjust their scope to incorporate the current set of pages of interest. Otherwise, every time we run the query, we'll need to ask ourselves whether our set of candidates is accurate and complete.

To automatically find such pages of interest, we need metadata, which is information about wikipedia entities.

## Wikidata to the rescue

It turns out, the Wikimedia foundation provides just such a collection of metadata. It's called the [Wikimedia Entity Database](https://www.wikidata.org/wiki/Wikidata:Main_Page) (wikidata for short). You can think of Wikidata as information about the entities in Wikipedia. It could be a song, a country, a TV show, a politician, a University, or anything else you might like to classify. Here's a screenshot of the Wikidata entry for "Barack Obama":

![Barack Obama](/img/BarackObama.png)

Armed with the page views and the wikidata, we can run the sort of queries we'd like to run. But there's one catch: the Wikidata is huge: 400GB compressed and nearly 1TB uncompressed. So we're going to have handle it with care.

## Requirements

Now this is starting to look like something bigger than an afternoon job. Whenever a project starts to feel a big complicated, to the point where it looks like I'm going to have invest some serious time, I like to make a list of requirements to make sure I understand the problem I'm trying to solve. Here's a diagram summarizing the data I've just discussed:

![Data Plan](/img/WikiData.png)

- Page views are released hourly. We'll gather them within an hour of release.
- Hourly page view files are typically on the order of 1.5 GB uncompressed. That's small enough that we can process them using a serverless method like Cloud Run, which will save us a lot of administrative hassle.
- Wikidata is released every three days. We'll gather the latest copy within 24 hours of its release.
- Wikidata is nearly a terabyte and needs to be uncompressed. It's too big a job for a serverless mechanism and decompression will require some advanced resources so we'll allocated a dynamic virtual machine for this task.
- We should store records of all the data we've downloaded (file names and sizes) so that we can determine what we're missing at any given moment.
- We should load all gathered data, both page views and wikidata, into BigQuery, to facilitate fast, dynamic queries via standard SQL, and to share all this goodness with everyone!
- All of the above must be automated so that the latest data is always available and we never have to rely on manual processes or humans with poor memories (like mine).

## The Naive Approach (and why it's not the best plan)

What's the simplest and most obvious way to do this? Download the data to your laptop using curl or wget, and upload the files from your local hard drive to the Cloud so you use modern cloud computing tools to extract meaningful insights and data visualizations.

What could possibly go wrong? Well, a lot...

- Space: You may not have enough free space available to store the downloaded files.
- Time: This is probably going to take a while because it's using spare CPU cycles on a single laptop.
- Efficiency: You're transferring every byte twice - once from the source to your laptop and once from your laptop to the cloud.
- Comfort: Your personal device is now dedicated to an onerous background task - hope you don't mind that whirring fan for the next eight hours!
- Resilience: What happens when your laptop goes to sleep or loses connectivity or reboots in the middle of a multi-hour transfer?
- Automation: This is fundamentally a manual task. We really want it be 100% automated to minimize errors and ensure it always runs, regularly and reliably, with audit logs.

In short, this is not what we'd call a well engineered process, so let's fix that now...

## Starting Out Small

Sometimes low tech is the best choice for getting started. This job is mostly about moving files around, comparing what we've already acquired with what's available on the web, and taking appropriate actions. Most of those operations already exist in Linux commands, like wget, gsutil, awk, comp, etc. Consider the following shell script (pageviews.sh), which takes care of gathering all the latest pageview data:

```bash
USAGE="$0 [-d] [all|year|month|day|yesterday]"
DEBUG=0
PROJECT=bigquery-public-data-staging
BUCKET=wiki-staging
DOMAIN=dumps.wikimedia.org
SRC_BASE=https://$DOMAIN
DST_BASE=gs://$BUCKET
SRC_VIEW_PATH=other/pageviews
DST_VIEW_PATH=$DOMAIN/$SRC_VIEW_PATH
SRC_VIEW_URL=$SRC_BASE/$SRC_VIEW_PATH
DST_VIEW_URL=$DST_BASE/$DST_VIEW_PATH

WINDOW="${1:-day}"
HOUR=$(date +%H)
TODAY=$(date '+%s')
YYYY="${YYYY:-$(date --date=@$TODAY +%Y)}"
MM="${MM:-$(date --date=@$TODAY +%m)}"
DD="${DD:-$(date --date=@$TODAY +%d)}"
if [ "$WINDOW" = "day" ] && [ "$HOUR" = "00" ]
then
  WINDOW=yesterday
fi

# Set some scope variables based on the desired time window.
case "$WINDOW" in
  all)
    S1=/; S2=*/*/ S3=pageviews-*.gz;;
  year)
    S1=/$YYYY/; S2=*/; S3=pageviews-$YYYY*.gz;;
  month)
    S1=/$YYYY/$YYYY-$MM/; S2=; S3=pageviews-$YYYY$MM*.gz;;
  day)
    S1=/$YYYY/$YYYY-$MM/; S2=; S3=pageviews-$YYYY$MM$DD-*.gz;;
  yesterday)
    YESTERDAY=$(($TODAY-86400))
    YYYY="$(date --date=@$YESTERDAY +%Y)"
    MM="$(date --date=@$YESTERDAY +%m)"
    DD="$(date --date=@$YESTERDAY +%d)"
    S1=/$YYYY/$YYYY-$MM/; S2=; S3=pageviews-$YYYY$MM$DD-*.gz;;
  *)
    echo $USAGE
    exit 1;;
esac

# Assemble list of every pageview log file and size on website.
wget --no-parent -nv --spider -S -r -A "$S3" $SRC_VIEW_URL$S1 2>&1 |
awk 'function base(file, a, n) {n = split(file,a,"/"); return a[n]} \
     $1 == "Content-Length:" {len=$2} $3 == "URL:" {print base($4), len}' |
sort >src-files.txt

# Assemble list of every pageview log file and size in cloud storage.
>dst-files.txt
if gsutil stat $DST_VIEW_URL$S1$S2$S3 >/dev/null 2>&1
then
  gsutil ls -l -r $DST_VIEW_URL$S1$S2$S3 2>/dev/null | grep -v ":$" |
  awk 'function base(file, a, n) {n = split(file,a,"/"); return a[n]} \
       $1 != "TOTAL:" {print base($3), $1}' |
  sort >dst-files.txt
fi

# One-sided diff - find every web file that doesn't exist or match size in cloud storage.
WORK_TO_DO=0
comm -23 src-files.txt dst-files.txt >diffs.txt
while read FILE SIZE
do
  DIR=`echo $FILE | awk '{y=substr($1,11,4);m=substr($1,15,2); printf("%s/%s-%s",y,y,m)}'`
  echo -en "$SRC_VIEW_URL/$DIR/$FILE$EOL"

  wget -q $SRC_VIEW_URL/$DIR/$FILE
  gsutil cp $FILE $DST_VIEW_URL/$DIR/$FILE
  rm -f $FILE
  WORK_TO_DO=1
done <diffs.txt

# If we found any missing or updsatrd files, update our collection.
if [ "$WORK_TO_DO" = "1" ]
then
  ./update.sh $YYYY $MM $DD
fi
```

This script can be called with any of the following time window arguments: day, yesterday, month, year, or all. It audits our existing data over the requested time window and ingests any missing files. This script is idempotent by design -- you can call it repeatedly and it will always try to make our copy of the data match the publicly available data.

The last step in the script calls a sub-script (update.sh) which parses the newly acquired data and loads it into the appropriate BigQuery table. It looks like this:

```bash
if [ "$1" = "" -o "$2" = "" -o "$3" = "" ]
then
 echo "usage: $0 year month day"
 exit 1
fi

YEAR=$1
MONTH=$2
DAY=$3

QUERY=$(cat <<EOF
  CREATE TABLE IF NOT EXISTS \`bigquery-public-data.wikipedia.pageviews_$YEAR\`
    (datehour TIMESTAMP, wiki STRING, title STRING, views INT64)
    PARTITION BY DATE(datehour)
    CLUSTER BY wiki, title
    OPTIONS(
      description = 'Wikipedia pageviews from http://dumps.wikimedia.your.org/other/pageviews/, partitioned by date, clustered by (wiki, title)',
      require_partition_filter = true
    )
EOF
)
echo "creating BigQuery table (if necessary) for $YEAR..."
bq query -q --use_legacy_sql=false "$QUERY"

QUERY=$(cat <<EOF
  INSERT INTO \`bigquery-public-data.wikipedia.pageviews_$YEAR\`
  WITH already_loaded as (
    SELECT DISTINCT datehour FROM \`bigquery-public-data.wikipedia.pageviews_$YEAR\`
    WHERE datehour >= '$YEAR-$MONTH-$DAY')
  SELECT datehour, wiki, SUBSTR(title, 0, 300) title, views
  FROM \`bigquery-public-data-staging.wikipedia_pipeline.view_parsed\` t1
  WHERE BYTE_LENGTH(wiki)+ BYTE_LENGTH(title) < 1024
  AND BYTE_LENGTH(title) < 300
  AND EXTRACT(YEAR FROM datehour)=$YEAR
  AND EXTRACT(MONTH FROM datehour)=$MONTH
  AND EXTRACT(DAY FROM datehour)=$DAY
  AND NOT EXISTS (SELECT * FROM already_loaded t2 WHERE t2.datehour = t1.datehour)
EOF
)
echo "transferring data from GCS to BQ table for $YEAR-$MONTH-$DAY..."
bq query -q --use_legacy_sql=false "$QUERY"
```

The queries above were derived from Felipe Hoffa's excellent article on
[partitioning](https://medium.com/google-cloud/bigquery-lazy-data-loading-ddl-dml-partitions-and-half-a-trillion-wikipedia-pageviews-cd3eacd657b6), 
and [clustering](https://medium.com/google-cloud/bigquery-optimized-cluster-your-tables-65e2f684594b).

## Wikidata decompression - We're gonna need a bigger boat

That takes care of the pageviews, but what about the wikidata? Here's a script called entities.sh, which takes care of the entity data. Structurally, it's quite similar to the pageviews.sh script, except that instead of acquiring the data, it simply prints the file name it would like to acquire. The reason we do this is because we're not going to actually gather the entity data in this script -- it's too big a job, involving a large download, a massive decompression, and a huge upload. In the next section, this strategy will become more clear.

```bash
BUCKET=wiki-staging
DOMAIN=dumps.wikimedia.org
SRC_BASE=https://$DOMAIN
DST_BASE=gs://$BUCKET
SRC_DATA_PATH=wikidatawiki/entities/latest-all.json.bz2
DST_DATA_PATH=$DOMAIN/$SRC_DATA_PATH
SRC_DATA_URL=$SRC_BASE/$SRC_DATA_PATH
DST_DATA_URL=$DST_BASE/$DST_DATA_PATH

read SFILE SSIZE \
  <<<$(wget -nv --spider -S -r -A ".gz" -I $SRC_DATA_PATH $SRC_DATA_URL 2>&1 |
       awk 'function base(file, a, n) {n = split(file,a,"/"); return a[n]} \
            $1 == "Content-Length:" {len=$2} $3 == "URL:" {print base($4), len}')

read DFILE DSIZE \
  <<<$(gsutil ls -l -r $DST_DATA_URL |
       awk 'function base(file, a, n) {n = split(file,a,"/"); return a[n]} \
            $1 != "TOTAL:" {print base($3), $1}')

echo -en "TsvHttpData-1.0$EOL"
if [ "$SFILE" != "$DFILE" -o "$SSIZE" != "$DSIZE" ]
then
  echo -en "$SRC_DATA_URL$EOL"
fi
```

## Let's productionize this script

So far, we have a bunch of shell scripts but we need to run those scripts automatically, in the cloud, at the right times. Cloud Run gives us that capability.

![Design](/img/design.png)

## Ok, it's all there now, what can we do with it?

For starters, let's find out the most popular Wikipedia article over the five years these access logs have been recorded:

**Warning -- don't actually run this query yourself, it's quite expensive!**

```sql
SELECT title, SUM(views) views
FROM `bigquery-public-data.wikipedia.pageviews_*`
WHERE DATE(datehour) BETWEEN "2015-01-01" AND "2020-12-31"
AND wiki = "en"
GROUP BY title
ORDER BY views DESC
LIMIT 20
```

![Design](/img/allviews.png)

Of course, the top view page is the main Wikipedia page. But the most view non-administrative page is, oddly, Darth Vader! I leave you to decide what that says about humanity.

## It's only rock & roll, but I like it

That last query was interesting but  
Now let's construct a more practical example.


## Lessons

### Is it robust?
### Does it Scale?
### How much does this cost?