+++
image = "door.jpg"
banner = ""
menu = ""
categories = []
tags = ["data"]
title = "Getting Your Foot in the Door - Part 1"
subtitle = "Moving Data to the Google Cloud"
date = "2019-09-13"
image_credit = "https://unsplash.com/@craft_ear?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
+++

One of the best reasons to move your data to the cloud is the wealth of powerful
tools and services available for all phases of the Data Science lifecycle.
But many of those tools expect to read your data from internal sources,
like Google Cloud Storage, BigQuery, or a streaming service like Cloud PubSub.
<strong>So how do you get your data into the Google Cloud to
begin with?</strong> I'm glad you asked, because that's the question I'm going
to answer in this article.

To motivate my solution, here's a real dataset I'd like to analyze:
the [Wikipedia access logs](http://dumps.wikimedia.your.org/).
I find this dataset fascinating because the frequency of page views
for Wikipedia articles serves as a kind of proxy view into
the worldwide cultural zeitgeist.

This is a good choice for another reason: it's Big - Wikipedia
logs on the order of 250MB of access data every hour.
Just the data for this year (as of September 16, which is day 259) would entail 259*24*250MB=1.5TB.
But we're going bigger than that - we're going to load all the historical
data from as many years as we can find.

## The Naive Approach (and why it's not the best plan)

What's the simplest and most obvious way to do this? Download the data to your laptop
using curl or wget, and upload the file(s) from your local hard drive to Google Cloud
Storage, using gsutil or the Cloud Console.

What could possibly go wrong? Well, a lot...

- Space: You may not have enough free space available to store the downloaded file(s).
- Time: This is going to be slow because it's using spare CPU cycles on a busy laptop.
- Efficiency: You're transferring every byte twice - once from the source to your laptop and
  once from your laptop to the cloud.
- Comfort: Your personal device is now dedicated to an onerous background task - hope you don't mind that whirring fan for the next eight hours!
- Resilience: What happens when your laptop goes to sleep or reboots or crashes in the middle of a multi-hour transfer?
- Automation: This is fundamentally a manual task. We want it be 100% automated to minimize errors and ensure it always runs, reliably and reproducibly, with logs to audit, when needed.

In short, this is not what we'd call a well engineered process, so let's fix that now...

## Introducing Cloud Storage Transfer Service

If you haven't heard of this, it's a simple service for automatically moving
data into the Google Cloud. You can read more about it in the [product documentation](https://cloud.google.com/storage-transfer/docs/overview). Here's where you'll find this service in the
Cloud Console:

<img width="30%" src="/img/transfer1.png">

Let's create a new transfer job:

<img width="50%" src="/img/transfer2.png">

Next, we're prompted to enter three sets of specifications:

### Select Source

This can be a GCS Bucket, an S3 bucket, or the web. Since our problem is importing data served on the web, we'll go with the latter option.
Note that when specifying the web as your source, there's an extra level of indirection - you need to supply a URL pointing to a file enumerating the URLs you want to fetch.

Note the following rules regarding how the tab separated value file must be formatted:

<img width="50%" src="/img/transfer7.png">

In practice, I've found the file size and checksums are not strictly required (though the header line is). Accordingly, I created a test file called `xfer.tsv` with the following contents:

```
TsvHttpData-1.0
https://dumps.wikimedia.org/other/pageviews/2019/2019-01/pageviews-20190101-000000.gz
https://dumps.wikimedia.org/other/pageviews/2019/2019-01/pageviews-20190101-010000.gz
https://dumps.wikimedia.org/other/pageviews/2019/2019-01/pageviews-20190101-020000.gz
```

Using gsutil, I uploaded a copy of this file to a Cloud Storage object (`gs://mco-wiki/xfer.tsv`) and
entered the full URL of this object (`https://storage.googleapis.com/mco-wiki/xfer.tsvi`) into the Select Source dialog.

<img width="50%" src="/img/transfer3.png">

### Select Destination

Next we select a destination. I'm having the data stored in a bucket named after my project: `gs://mco-wiki`.

<img width="50%" src="/img/transfer4.png">

### Configure Transfer

Finally, we specify whether this is a
one-off request or a recurring request. For the former you can start the transfer running immediately.
For the latter, you can schedule it to recur daily at a specific time of day.

<img width="50%" src="/img/transfer5.png">

Now we've finished giving our input so we can click the Create button to create our transfer request. If all goes well, we'll then see our new job, it's current status, and related attributes.

<img width="50%" src="/img/transfer6.png">

We can come back to this page to check on our job status. When it finished, we'll either see error message(s) or a successful completion indication, in which case the imported data will be waiting for us in the destination bucket.


## Next Time

In this article we saw how to import large files, once or repeatedly, into Google Cloud Storage. But if the file is a big one, we'll most likely be importing a compressed version.
Also, the interface is a bit limiting in the sense that we get to choose between one time only or a statically defined daily request.
In the next articles in this series, we'll talk about how best to decompress large files in the Cloud, and how to
get finer grain control over the set of objects we download.
