+++
images = []
banner = ""
menu = ""
description = ""
categories = []
tags = ["tools"]
title = "Building a Better Blog - Work Flow"
series = ["blog"]
date = "2017-04-05"
draft = true
+++

In the last article in this series, I explained how I decided to write
my articles in simple markdown text format, generate my site
using [Hugo](http://gohugo.io), and store and manage my content
in a Github repository. But that's like a bunch of potential energy -
it doesn't actually product a website. In this chapter, I'm going
to show you my entire work flow.

Here's a summary of the process by which I publish a new article:

* Copy template article
* Compose new article (in Markdown)
* Preview new article (using hugo server -w)
* When satisfied, push new article to Github
* CircleCI re-builds site and publishes to Firebase Hosting service

Here's a screencast, which gives a better sense of what goes on:


