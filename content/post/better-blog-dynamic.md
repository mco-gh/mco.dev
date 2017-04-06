+++
images = []
banner = ""
menu = ""
description = ""
categories = []
tags = ["tools"]
title = "Building a Better Blog - Dynamic Content"
series = ["blog"]
date = "2017-04-07"
draft = true
+++

Part 4 in a series of articles on building a state of the art blog in 2017.<!--more-->

The previous article in this series covered writing
in markdown format, use of a static site generator
([Hugo](http://gohugo.io) in my case), and managing content
in a Github repo, but that's like a bunch of potential energy -
it doesn't actually produce a working website.
In this section, I'm going to show you how I turn that collection
of stuff into a real live website.

The magic comes from using a continuous integration system. This is a
service that automatically detects changes in your source code,
rebuilds/retests everything, and, if all goes well, publishes your
latest content online.

There are lots of good CI systems. I initially started
using [TravisCI](https://travis-ci.org/) but I quickly grew disappointed with
its responsiveness. A friend recommended [CircleCI](https://circleci.com/dashboard),
which I've found to be much more responsive. 

But even on CirlceCI, I wasn't happy with my build times. The main problem
was not the CI system but how I built my site. Every build was starting with
a vanilla base Docker image and then installing a bunch of dependencies, which
was slow and very inefficient. I solved this by building a docker image
containing everything I need already preinstalled. The details are available
in my [hugo-image repo](https://github.com/marcacohen/hugo-image), which contains
everything you need to build a Hugo blog and deploy it to Firebase Hosting.


With this Docker image added to the mix, the publication latency
went from several minutes, with high variability, on TravisCI
to a much more predictable ~40 seconds on CircleCI.

Here's my `.circleci/config.yml` file:

```yaml
version: 2
jobs:
  build:
    working_directory: ~/build
    docker:
      - image: docker.io/marcacohen/hugo-image
    steps:
      - checkout
      - run: hugo
      - run: cd public && sw-precache --static-file-globs='**/!(*404*)'
      - run: firebase deploy --token=${FIREBASE_TOKEN}
```

I love how short and self-explanatory this is. It pulls my hugo-image Docker image, 
checks out my latest source code from Github, runs Hugo to generate the static site,
runs the sw-precache tool (for easy offline caching of static assets,
more on this in an upcoming article), and publishes the results to Firebase Hosting
(about which I'll also have more to say in a later installment).

In the next episode, I'll cover how I've added dynamic content, like my favorite books and
music, such that I only have ever update one source of truth (goodreads and youtube, in those
cases) and automatically inherit the latest recommendations on my live blog.