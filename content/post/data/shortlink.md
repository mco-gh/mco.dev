+++
categories = ["Data"]
tags = ["cloud"]
title = "Build Your Own bit.ly"
subtitle = "with Cloud Run & Firestore"
date = "2020-05-19"
coverImage = "/img/shortlink.jpg"
draft = false
+++

In this article we'll build a simple yet powerful short link service using two of my favorite Google Cloud technologies: Cloud Run and Firestore. The code can be found on [Github](https://github.com/marcacohen/mco.fyi) and here's a [slide version](https://mco.fyi/links) of this story.

<!--more-->

## Introduction

I love building demos but sometimes they can feel a bit artificial, like you're building a program that no one would actually want to use, just to illustrate some capability or technique. But if you choose carefully, you can find demos that are both simple and useful, which for me is the best possible vehicle for learning.

<img src="/img/SweetSpot.png" width="400" height="400" style="display:block; margin:auto">

## What problem are we trying to solve?

I always like to start any work with a problem statement because, as Lewis Carroll said, "if you don't know where you're going, any road will get you there". Here's my problem statement:

I want to share my teaching artifacts but I hate long, hard to remember URLs. In the past I've used a short link service, like `bit.ly`, but there are some problems with that approach:

<br>
<img src="/img/namespace.png" width="400" height="400" style="display:block; margin:auto">

- **globally shared namespace** - Good luck getting your hands on `bit.ly/cloud`. Like the Internet Domain Name System, the gold rush is over and all the nice short names are gone.
- **trust** - Links you publicize can have a life of their own so you're trusting this service to be a responsible, reliable, and secure custodian of your data.
- **privacy** - Allowing another party to manage your links means they have complete visibility over all of your traffic.
- **branding** - You turn over your branding to the company serving your links. Wouldn't it be nice to have your own identity embedded in your short links?

## Requirements

What does it mean, to me, to solve this problem?

<br>

- I own the whole namespace so I get first crack at the shortest short links possible.
- The service should use my domain name and branding.
- I don't want to spend much time maintaining this app so I'd like it to be simple and small (<500 lines of code, please).
- It must be scalable, so that it doesn't crash under the intense weight of my wildly popular articles (ok, that's never happened but I can dream, can't I?).
- I'd like a clean landing page providing a directory of all available short links.
- I want some basic analytics so that I can see the relative popularity of each link.
- I want to use 100% managed services. I don't want to directly think about, or even be aware of, any servers.

## Design

Thanks to my last requirement, this program is so simple it hardly warrants a design diagram but old habits die hard, so here's mine:

<br>

<img src="/img/sldesign.png" width="400" height="400" style="display:block; margin:auto">

## Database - Cloud Firestore

I chose [Cloud Firestore](https://cloud.google.com/firestore) for my database because it's SIMPLE (Scalable, Intuitive, Managed, Pay-as-you-go, Language-agnostic, and Economical).

My data model is also quite simple: one document field per short link, each containing a map of these values:

- **key** - a short link part of the URL (e.g. "foo" for `mco.fyi/foo`), naming the map
- **url** - the long link, i.e. where to redirect requests for a given short link
- **count** - keeps track of how many times a given short link was accessed
- **desc** - a human friendly description of where a given short link takes you
- **private** - a boolean value which hides the short link from the public list

Here's the data model in action as seen in the Google Cloud Console:

<br>

<img src="/img/firestore-console.png" width="400" height="400" style="display:block; margin:auto">

<br>

One thing I really like about Firestore is you can use the console to update your data as well as view it. It essentially gives me a database administration user interface for free. Less work for me!

## Web Front End - Skeleton

I'm using a styling package called [skeleton](http://getskeleton.com/), which I quite like because it's simple, small, and responsive. Here's an abbreviated copy of the HTML for my home page:

<br>
<details>
  <summary>Click here to expand code</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>mco.fyi</title>
    <meta name="Marc's Short Link Service" content="" />
    <meta name="Marc Cohen" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="//fonts.googleapis.com/css?family=Raleway:400,300,600"
      rel="stylesheet"
      type="text/css"
    />
    <link rel="stylesheet" href="css/normalize.css" />
    <link rel="stylesheet" href="css/skeleton.css" />
    <link rel="icon" type="image/png" href="img/favicon.png" />
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="twelve columns" style="margin-top: 5%">
          <h1>
            <font face="courier">mco.fyi</font> - Marc's short link service
          </h1>
        </div>
      </div>
      <div class="row">
        <div class="four columns">
          <img height="300" width="250" src="/img/meiko.jpg" />
          <br />
          This is Meiko. Whenever you visit one of my short links, his job is to
          fetch the long version and return it to your browser. Thanks to Meiko
          (and Google Cloud Run), mco.fyi is fast and reliable. If you'd like to
          try this code for yourself, it's available on
          <a target="_blank" href="https://github.com/marcacohen/mco.fyi"
            >Github</a
          >. Also, here's a
          <a target="_blank" href="https://mco.fyi/links">slide deck</a> and a
          <a target="_blank" href="https://mco.fyi/links">blog article</a> about
          this service.
        </div>
        <div class="eight columns">
          <table width="100%">
            <thead>
              <tr>
                <th>Count</th>
                <th>Link</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {{ range . }}
              <tr>
                <td>{{.Count}}</td>
                <td><a href="{{.Url}}">mco.fyi/{{.Key}}</a></td>
                <td>{{.Desc}}</td>
              </tr>
              {{ end }}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>
```

</details>

I wanted my home page to simply list all the available short links, dynamically, and that's exactly what the `div` element starting at line 42 does. A bit later, we'll visit my server code, which populates the data incorporated into this template.

Here's an abbreviated copy of the HTML for my 404 page, which is needed for the case when a non-existent short link is requested. You can experience this page yourself by visiting <a target="_blank" href="https://mco.fyi/foo">mco.fyi/foo</a> (you may need to have seen a certain film in order to appreciate the joke):

<br>
<details>
  <summary>Click here to expand code</summary>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>mco.fyi</title>
    <meta name="Marc's Short Link Service" content="" />
    <meta name="Marc Cohen" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="//fonts.googleapis.com/css?family=Raleway:400,300,600"
      rel="stylesheet"
      type="text/css"
    />
    <link rel="stylesheet" href="css/normalize.css" />
    <link rel="stylesheet" href="css/skeleton.css" />
    <link rel="icon" type="image/png" href="img/favicon.png" />
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="ten columns" style="margin-top: 5%">
          <h1>404 - short link not found</h1>
          <br />
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/OEu4Iq5KL-Q"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </body>
</html>
```

</details>

## Server - Cloud Run

For my web server, I chose [Cloud Run](https://cloud.google.com/run) because, like Firestore, it's SIMPLE (Scalable, Intuitive, Managed, Pay-as-you-go, Language-agnostic, and Economical). It doesn't make me think about servers, or scaling, or any of the annoying system administration details I don't want to deal with.

Of course, I want this service to live behind a nice short domain name so I snarfed up `mco.fyi` (the "fyi" top level domain feels just right for this kind of service). Cloud Run makes it super easy to assign your own domain name to a service and you get secure serving via SSL/TLS/https automatically and painlessly.

I chose to write my server in Go, because it's my favorite system programming language. Because Cloud Run is language and environment agnostic, I could have just as easily used Python, Java, Ruby, or FORTRAN for that matter (ok, FORTRAN might be a challenge but wouldn't that be fun?).

Here's my server code, which is small enough to fit into one main.go source file:

<br>
<details>
  <summary>Click here to expand code</summary>

```go
package main

import (
        "cloud.google.com/go/firestore"
        "context"
        "html/template"
        "log"
        "net/http"
        "sort"
        "strings"
)

var linkdata map[string]interface{}
var doc *firestore.DocumentRef

// key/value structure for short link data
type kv struct {
        Key string  // short name
        Count int64 // count
        Url string  // URL
        Desc string // description
}

func redirect(w http.ResponseWriter, r *http.Request) {
        ctx := context.Background()
        path := strings.TrimLeft(r.URL.Path, "/")
        if path == "" || path == "/" {
                t, err := template.ParseFiles("home.html")
                if err != nil {
                        log.Println(err.Error())
                        http.Error(w, http.StatusText(500), 500)
                }
                var kvs []kv
                for k, v := range linkdata {
                        tmp := v.(map[string]interface{})
                        count := tmp["count"].(int64)
                        desturl := tmp["url"].(string)
                        desc := tmp["desc"].(string)
                        private := tmp["private"]
                        if private != nil && private.(bool) == true {
                                continue
                        }
                        kvs = append(kvs, kv{k, count, desturl, desc})
                }
                sort.Slice(kvs, func(i, j int) bool {
                        return kvs[i].Count > kvs[j].Count
                })
                err = t.Execute(w, kvs)
                if err != nil {
                        log.Println(err.Error())
                        http.Error(w, http.StatusText(500), 500)
                }
        } else if strings.HasPrefix(path, "css/") ||
                strings.HasPrefix(path, "img/") {
                http.ServeFile(w, r, path)
        } else if m, ok := linkdata[path]; ok {
                v := m.(map[string]interface{})
                if u, ok := v["url"]; ok {
                        log.Println("before: %d", v["count"])
                        v["count"] = v["count"].(int64) + 1
                        log.Println("after: %d", v["count"])
                        doc.Set(ctx, linkdata)
                        http.Redirect(w, r, u.(string), 301)
                } else {
                        log.Println(w, "no URL found for event: %v", path)
                        return
                }
        } else {
                http.ServeFile(w, r, "404.html")
        }
}

func main() {
        proj := "mco-fyi"
        ctx := context.Background()
        client, err := firestore.NewClient(ctx, proj)
        if err != nil {
                log.Fatalln(err)
        }
        defer client.Close()
        doc = client.Doc("Redirects/Shortlinks")
        docsnap, err := doc.Get(ctx)
        if err != nil {
                log.Fatalln(err)
        }
        linkdata = docsnap.Data()
        go func() {
                iter := doc.Snapshots(ctx)
                defer iter.Stop()
                for {
                        docsnap, err := iter.Next()
                        if err != nil {
                                log.Fatalln(err)
                        }
                        linkdata = docsnap.Data()
                }
        }()
        http.HandleFunc("/", redirect)
        err = http.ListenAndServe(":8080", nil)
        if err != nil {
                log.Fatal("ListenAndServe: ", err)
        }
}
```

</details>

Highlights:

<br>

- The `main` function (line 73) grabs a snapshot of the database on line 86.
- On line 98 `main` arranges to dispatch the `redirect` function on every incoming request on port 8080.
- The redirect function (line 24) is the real workhorse here. It looks for the requested short link and...
  - if it sees no short link in the request URL, it serves up the home page on line 48.
  - if it finds a known short link, it redirects the requesting browser on line 63.
  - if it finds an unknown short link, it returns the 404 page on line 69.
- It also serves artifacts (image and css files) for the home page on line 53.
- The function defined on line 87 runs in the background indefinitely. It gets notified anytime the dataset changes, and reloads the local copy in response to those notifications so that the running instance always has the latest version of the data handy. That way whenever I update the list of short links, I don't need to redeploy the Cloud Run app.

The basic building block for a Cloud Run app is a container so I needed to write a Dockerfile, which can be thought of as the container blueprint for this app. As containers go, this is a pretty simple one:

<br>

```docker
FROM golang:latest
RUN mkdir /app
RUN go get cloud.google.com/go/firestore
ADD . /app/
WORKDIR /app
RUN go build -o mco.fyi .
CMD ["/app/mco.fyi"]
```

## All together now

Now let's tie everything together. Here's my deployment script:

<br>

```bash
export PROJ=mco-fyi
export APP=$PROJ
export TAG="gcr.io/$PROJ/$APP"

docker build --tag "$TAG" .
docker push "$TAG"
gcloud beta run deploy "$APP" \
  --image "$TAG"              \
  --platform "managed"        \
  --region "us-central1"      \
  --project "$PROJ"           \
  --concurrency 5             \
  --memory=1Gi                \
  --allow-unauthenticated
```

<br>

Here's what the Cloud Run console looks like after deploying my service:

<br>

<img src="/img/cloud-run.png" width="400" height="200" style="display:block; margin:auto">

One thing I'm quite happy with is the size of this app:

<br>

<img src="/img/small-is-beautiful.png" width="400" height="400" style="display:block; margin:auto">

## Conclusion

Here's the final version of my site in all it's glory:

<br>

<img src="/img/mco.fyi.png" width="400" height="400" style="display:block; margin:auto">

That cute guy you see on the home page is Meiko. Whenever you visit a short link at `mco.fyi/something`, his job is to go fetch the long version and return it to your browser. Thanks to Meiko (and Google), my short link service is SIMPLE (Scalable, Intuitive, Managed, Pay-as-you-go, Language-agnostic, and Economical) _and_ useful. If you'd like to try this code for yourself, it's available on [Github](https://github.com/marcacohen/mco.fyi) and here's a [slide version](https://mco.fyi/links) of this story.
