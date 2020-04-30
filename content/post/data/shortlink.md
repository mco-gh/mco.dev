+++
categories = ["Data"]
tags = ["cloud", "dataviz"]
title = "Build Your Own bit.ly"
subtitle = "with Cloud Run, Firestore, and Svelte"
date = "2020-04-28"
coverImage = "/img/shortlink.jpg"
#draft = true
+++

In this article we'll build a simple but powerful short link service
using three of my favorite technologies: Cloud Run, Firestore, and Svelte.

<!--more-->

## Introduction

I love building demos but sometimes they can feel a bit artificial, like you're building a program that no one would actually want, just to illustrate capability or technique. I think this comes from the fact that you want a demonstration program to be quite simple, so as not to overload the reader with too much detail. But if you choose carefully, you can find demos that are both simple and useful, which for me is the best possible vehicle for teaching.

<img src="/img/SweetSpot.png" ;width="400" height="400" style="display:block; margin:auto">

## What problem are we trying to solve?

Whenever I give a talk or write an article, I like to share my slides, code, notebooks, and other artifacts with my audience so that can try to reproduce my results. But I hate long, tedious, error prone URLs, so in the past I've used a short link service, like bit.ly, to share my goodies. But there are a few problems with using a centralized short link service:

<img src="/img/namespace.png" width="400" height="400" style="display:block; margin:auto">

- globally shared namespace - Good luck getting your hands on bit.ly/cloud. Like the DNS system, the gold rush has long ago snatched all the nice short names on popular short link services.
- trust - Links you publicize can have a life of their own so you're trusting this service to stay up, solvent, and ongoing for the long term.
- privacy - Allowing another party to manage your links means they have complete visibility over all of your traffic.
- branding - You turn over your branding to the company serving your links. Wouldn't it be nice to have your identity embedded in the short link?

## Design

This is so simple it hardly warrants a design diagram but old habits die hard, so here ya go:

<img src="/img/sldesign.png" width="400" height="400" style="display:block; margin:auto">

## Database - Firestore

I chose Cloud Firestore for my database because it's SIMPLE:

- Scalable
- Intuitive
- Managed
- Portable
- Lego-like
- Economical

Here's my simple data model: one document field per short link, each containing:

- field name - the short link part of the URL (e.g. this would be "foo" for mco.fyi/foo).
- count - keeps track of how many times a given short link was accessed
- desc - a human friendly description of where a given short link takes you
- private - a boolean value which hides the short link from the public list of links

Here's the data in action as seen in the Google Cloud Console:

<img src="/img/firestore-console.png" width="400" height="400" style="display:block; margin:auto">

Of course, you can use this page to view your data but what I really like is you can use it to update your data as well. It's so easy that I use this page to administer my links. I essentially get a database admin UI for free. Less work for me!

## User Interface - Svelte

<img src="/img/svelte.png" width="400" height="400" style="display:block; margin:auto">

For my web programming, there are so many choices...Of course, React is the 600 pound gorilla, and Vue is the choice of hipsters everywhere, and of course my own company's Angular JS is always a strong contender. But I chose none of those frontrunners - I went with Svelte. Why? Because I'm in love and there's not enough love in this world. To be slightly more technical, Svelte is a compiler so it generate small, tight code that accomplishes much of the logic those other frameworks implement in large bundles you need to ship with your app. But even more than that, I find I just get Svelte, or maybe it gets me. I feel like the way to do everything I want is natural and simple, which makes it fun to use. At the end of the day, that's probably the best reason of all: it make me happy. :) Anyway, if you'd like to see why I'm so smitten, I highly recommend the Svelte getting started tutorial, which is nicely done.

Now you might be wondering, why is Marc going on about a web user interface? Doesn't this app, just redirect short links to long links? Last time I checked, that's a server side app. But I'd like to have a small UI so that you anyone can stop by and see my catalog of links, along with some rudimentary analytics. Here's what I want that page to look like:

Here's the HTML for my site:

<img src="/img/slHome.png" width="400" height="400" style="display:block; margin:auto">

Here's the HTML for my 404 page (for the case when a non-existent short link is requested):

<img src="/img/sl404.png" width="400" height="400" style="display:block; margin:auto">

Here are my Svelte class files:

## Server - Cloud Run

For my web service, I chose Cloud Run because it's also SIMPLE:

- Scalable
- Intuitive
- Managed
- Portable
- Lego-like
- Economical

Hmmmm...where have I seen that list before? :)

Of course, I want this service to live behind a nice short domain name. After all, cloudrundfghdkfghds/foo doesn't seem particularly short, does it? So I snarfed up mco.fyi (the "fyi" top level domain feels just right for this kind of service), which nowadays is about as short a name as you're going to find. Cloud Run makes it super easy to assign your own domain name to a service via this easy dialog:

I chose to write my server in Go, because it's my favorite system programming language. Because Cloud Run is language and environment agnostic, I could have just as easily used Python, Java, Ruby, or Fortran for that matter. Here's my server code in Go:

Here's my Dockerfile:

<img src="/img/slDockerfile.png" width="400" height="400" style="display:block; margin:auto">

Here's what the Cloud Run console looks like after deploying my service:

<img src="/img/cloud-run.png" width="400" height="200" style="display:block; margin:auto">

I'm going to further

## All together now

Now let's tie everything together. Here's my deployment script:

<img src="/img/slDeploy.png" width="400" height="400" style="display:block; margin:auto">

One thing I'm quite happy with is the size of this app:

<img src="/img/small-is-beautiful.png" width="400" height="400" style="display:block; margin:auto">

## Conclusion

Here's the final version of my site in all it's glory:

<img src="/img/mco.fyi.png" width="400" height="400" style="display:block; margin:auto">

In case you're wondering, that cute guy is Meiko. Whenever you visit a short link at mco.fyi/something, his job is to go fetch the long version and return it to your browser. Thanks to Google and Meiko, my short link service is SIMPLE _and_ useful. If you'd like to try this code for yourself, it's all available in on [Github](https://github.com/marcacohen/mco.fyi). Also, here's the [slide version](https://mco.fyi/links) of this story.
