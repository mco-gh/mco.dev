+++
images = []
banner = ""
menu = ""
description = ""
categories = []
tags = ["tools"]
title = "Building a Better Blog - Content Management"
series = ["blog"]
date = "2017-04-03"
+++

Part 2 in a series of articles on building a state of the art blog in 2017.<!--more-->

Programmers tend to see the world in terms of source code. From this perspective,
a blog can be thought
of simply as a collection of source files that generate readable, rather than runnable,
artifacts. Given this model, it makes a lot of sense to use Github to manage
your blog content. It's nice to be able to use the same tools and processes
you already know and love, and your blog benefits
from history tracking, change management, sharing/collaboration, and all the other
goodness that comes from the Github ecosystem.

When I set out to build a new blog, I briefly explored the current generation of
complete blogging solutions like Wordpress and Ghost. Though they are extremely
impressive tools, I opted for markdown files in Github with a
static content generator because, for me, that feels closer to the embodiment of the
[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy), which favors
composability, simplicity, and modularity over monolithic solutions.

A Github repo gives us a place to write and store our content but we need some
additional software to turn a repo into a live blog. Because blogs tend to be
read-mostly, with very little interactivity (apart from selecting pages and perhaps
providing comments in response to articles), the requirements on the web server
are minimal. For the most part, we simply need to serve pre-generated
(a.k.a. static) pages on demand, as fast and as efficiently as possible.

A static content generator takes a set of configuation files, layout templates,
images, style sheets, javascript files, and articles, typically written in a structured text format
(with [markdown](https://en.wikipedia.org/wiki/Markdown) being the most popular of these)
and generates a complete website with the desired user experience.

One major advantage of this approach is that there is no need for server side logic.
The site can be served as a simple hierarchy of pages from any storage repository, 
such as Github Pages, Google Cloud Storage, Amazon S3, and Firebase Hosting.
This approach is fast, efficient, inexpensive, and scales extremely well.

I wanted to use an open source static site generator because I want everything
I depend on to be freely available and I want to be able to customize the source
code, whenever needed. The most popular open source static site generator is probably
the Ruby based [Jekyll](https://jekyllrb.com/).

I opted for an alternative called [Hugo](https://gohugo.io) for the following reasons:

* Hugo reportedly [scales better](https://novelist.xyz/tech/hugo-vs-jekyll-static-site-generator/) than Jekyll.
* Hugo is written in Go, a language with which I'm more familiar than Ruby.
* I like the design of Hugo, with great thought given to generality and extensibililty.

I've found Hugo to be easy to work with, well documented, well designed, and very fast:
<blockquote class="embedly-card" data-card-controls="0"><h4><a href="https://www.youtube.com/watch?v=CdiDYZ51a2o">Hugo benchmark - 5,000 posts in seconds</a></h4><p>A benchmark of Hugo generating a site with 5,000 posts on an SSD and spindle drive. The Python script I used to generate the 5,000 posts: https://gist.github.com/jaden/1ce5a7192d8ee8e4c112 The console I'm using is http://cmder.net/ Hugo - http://gohugo.io Udemy course on Hugo - https://www.udemy.com/build-static-sites-in-seconds-with-hugo/</p></blockquote>
<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>

Getting started with Hugo is [really easy](http://gohugo.io/overview/quickstart/):
Just choose a [theme](http://themes.gohugo.io/), clone it, and customize to your
heart's content.

I had the following requirements for my blog:

* simple layout (navigation on left side panel with fluid main content)
* support for dynamic tags
* support for dynamic series of articles
* search function
* support for my favorite X pages (where X is music, books, etc.)
* offline support

I found an existing Hugo blog, created by [Samuel Debruyn](https://chipsncookies.com/),
which I liked very much. It's minimalist, has the sort of layout and navigation features I wanted,
dynamic tags and a built-in search function powered by Google.

It was missing a few pieces I wanted, so I added the following:

* The ability to group related posts into to a series of articles (like this one on blogging).
* Offline support with service worker, which I added using Jeff Posnick's 
awesome [sw-precache](https://github.com/GoogleChrome/sw-precache) library.
* Analytics for usage tracking.
* Content embedding.
* Seamless Navigation - The base site reloads the entire page whenever a navigation item is selected. My site
downloads the main page and all content once and uses CSS to selectively display/hide the desired content,
while hiding the rest, resulting in seamless navigation with no font flicker.
* Dynamic generation of content for "my favorite X" pages.
* Scalable hosting with HTTPS support.

I'll share more details on how I implemented each of the above items in subsequent articles in this series.
For those who don't want to wait, all of the code for my blog is freely available in the associated
[Github repo](https://github.com/marcacohen/mcohen.io).

The next article in this series will be about continuous integration. I'll show you how I automatically
build and deploy this blog whenever I check in new content to the master branch of my Github repo.