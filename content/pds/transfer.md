+++
image = "door.jpg"
banner = ""
menu = ""
categories = []
tags = ["data"]
title = "Getting Your Foot in the Door - Part 1"
subtitle = "Moving Big (and not so big) Data to the Google Cloud"
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
Just pulling ithe data for this year to date (writing this article on September 16, which is day 259) would entail  259*24*250MB=1.5TB. 
But we're going bigger than that - we're going to load all the historical
data from as many year as we can find.
So this is a nice test case for importing a sizable
and continually growing dataset into the cloud.

## The Naive Approach (and why it's not the best plan)

What's the simplest and most obvious way to do this? Download the data to your laptop
using curl or wget, and upload the file(s) from your local hard drive to Google Cloud 
Storage, using gsutil or the Cloud Console. 

What could possibly go wrong? Well, a lot...

- Space: You may not have enough free space available to store the downloaded file(s).
- Time: This is going to be slow because it's using spare CPU cycles on a busy laptop.
- Efficiency: You're transferring every byte twice - once from the source to your laptop and
once from your laptop to the cloud.
- Comfort: Your personal device is now dedicated to a background task. Hope you don't mind that whirring fan for the next eight hours.
- Resilience: What happens when you're laptop goes to sleep or reboots or crashes in the middle of a multi-hour transfer?
- Automation: This is fundamentally a manual task. We want it be 100% automated to minimize errors and ensure it always runs, now and into the future.

Let's assume the data source is continually growing
as, in fact, is the case for the Wikipedia access logs.
With a lot of babysitting, you can make this work once but how are you going to feel about
running this process every day?

In short, this is not what we'd call a well engineered process. 
So let's fix that now...

## Introducing Cloud Storage Transfer Service

If you haven't heard of this, it's a simple service for automatically moving
data into the Google Cloud. Here's where you'll find this service in the
Cloud Console:

<img width="60%" src="/img/transfer1.png">

Let's create a new transfer job:

<img width="60%" src="/img/transfer2.png">

Next, we're prompted to enter three sets of specifications:

### Select Source

This can be a GCS Bucket, an S3 bucket, or the web. Since our problem is importing data served on the web, we'll go with the latter option.
Note that when specifying the web as your source, there's an extra level of indirection - you need to supply a Cloud Storage object enumerating the URLs you want to fetch.
I created a test file called xfer.tsv with the following contents:

<pre>
TsvHttpData-1.0
https://dumps.wikimedia.org/other/pageviews/2019/2019-01/pageviews-20190101-000000.gz
https://dumps.wikimedia.org/other/pageviews/2019/2019-01/pageviews-20190101-010000.gz
https://dumps.wikimedia.org/other/pageviews/2019/2019-01/pageviews-20190101-020000.gz
</pre>

Using gsutil, I uploaded a copy of this file to Cloud Storage object (gs://mco-wiki/xfer.tsv) and 
entered the full URL of this object (https://storage.googleapis.com/mco-wiki/xfer.tsv) into the Select Source dialog.
<img width="60%" src="/img/transfer3.png">

Note the following rules regarding how the tab separated value file must be formatted:
<img width="60%" src="/img/transfer7.png">

### Select Destination
Next we selected a destination. I'm having the data stored in a folder under my project bucket: gs://mco-wiki/compressed.
<img width="60%" src="/img/transfer4.png">

### Configure Transfer
Finally, we select some configuration settings, the most important one being whether this is a
one-off request or a recurring request. For the former you can start the transfer running immediately.
For the latter, you can schedule it to recur daily at a specific time of day.
<img width="60%" src="/img/transfer5.png">

Now we've finished giving our input so we can click on 

<img width="60%" src="/img/transfer6.png">
