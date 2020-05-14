+++
categories = ["Data"]
tags = ["cloud"]
title = "Build Your Own bit.ly"
subtitle = "with Cloud Run & Firestore"
date = "2020-04-28"
coverImage = "/img/shortlink.jpg"
draft = true
+++

In this article we'll build a simple but powerful short link service
using two of my favorite Google Cloud technologies: Cloud Run and Firestore.

<!--more-->

## Introduction

I love building demos but sometimes they can feel a bit artificial, like you're building a program that no one would actually want to use, just to illustrate some capability or technique. But if you choose carefully, you can find demos that are both simple and useful, which for me is the best possible vehicle for learning.

<img src="/img/SweetSpot.png" width="400" height="400" style="display:block; margin:auto">

## What problem are we trying to solve?

I always like to start any work with a problem statement because, as Lewis Carroll said, "if you don't know where you're going, any road will get you there". Here's my problem statement:

I want to share my teaching artifacts but I hate long, hard to remember URLs. In the past I've used a short link service, like `bit.ly`, to share my goodies. But there are some problems with using a centralized short link service:

<br>
<img src="/img/namespace.png" width="400" height="400" style="display:block; margin:auto">
<br>

- globally shared namespace - Good luck getting your hands on `bit.ly/cloud`. Like the Internet Domain Name System, the gold rush is over and all the nice short names are gone.
- trust - Links you publicize can have a life of their own so you're trusting this service to remain available for the long term. Anyone remember
- privacy - Allowing another party to manage your links means they have complete visibility over all of your traffic.
- branding - You turn over your branding to the company serving your links. Wouldn't it be nice to have your own identity embedded in your short links?

## Requirements

What does it mean to me, to solve this problem?

- I own the whole namespace so I get first crack at the shortest short links possible.
- The service should use my domain name and branding.
- I don't want to spend much time maintaining this app so I'd like it to be simple and small (<500 lines of code please).
- It must be scalable, so that it doesn't crash under the intense weight of my wildly viral articles (ok, that's never happened but I can dream, can't I?).
- I'd like a clean landing page providing a directory of all available short links.
- I want basic analytics so that I can see the relative popularity of each link.

## Design

Thanks to benig 100% serverless and managed, this program so simple it hardly warrants a design diagram but old habits die hard, so here's mine:
<br>
<br>
<img src="/img/sldesign.png" width="400" height="400" style="display:block; margin:auto">

## Database - Cloud Firestore

I chose [Cloud Firestore](https://cloud.google.com/firestore) for my database because it's SIMPLE (Simple, Intuitive, Managed, Pay-as-you-go, Language-agnostic, and Economical).

My data model is also quite simple: one document field per short link, each containing a map of these values:

- field name - the short link part of the URL (e.g. this would be "foo" for `mco.fyi/foo`).
- count - keeps track of how many times a given short link was accessed
- desc - a human friendly description of where a given short link takes you
- private - a boolean value which hides the short link from the public list of links

Here's the data model in action as seen in the Google Cloud Console:

<img src="/img/firestore-console.png" width="400" height="400" style="display:block; margin:auto">

Of course, you can view your data via this console page but what I really like is you can use it to update your data as well. It essentially gives me a database admin UI for free. Less work for me!

## Web Front End

I'm using a styling package called [skeleton](http://getskeleton.com/), which I quite like because it's simple, small, and responsive. Here's the HTML for my home page:

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
                <td>{{.C}}</td>
                <td><a href="{{.K}}">mco.fyi/{{.K}}</a></td>
                <td>{{.D}}</td>
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

I wanted my home page to simply list all the available short links, dynamically, and that's exactly what the `div1 element starting at line 120 does. A bit later, we'll visit my server code, which populates the data incorporated into this template.

Finally, here's the HTML for my 404 page for the case when a non-existent short link is requested, which you can experience yourself by visiting [https://mco.fyi/foo](https://mco.fyi/foo) (You may have to have seen a certain film in order to appreciate the joke):

<br>
<details>
  <summary>Click here to expand code</summary>

```html
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
          <h1>404 - short link not found :(</h1>
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

For my web service, I chose [Cloud Run](https://cloud.google.com/run) because, like Firestore, it's also SIMPLE (Scalable, Intuitive, Managed, Pay-as-you-go, Language-agnostic, and Economical).

Of course, I want this service to live behind a nice short domain name so I snarfed up `mco.fyi` (the "fyi" top level domain feels just right for this kind of service). Cloud Run makes it super easy to assign your own domain name to a service via one button click.

I chose to write my server in Go, because it's my favorite system programming language. Because Cloud Run is language and environment agnostic, I could have just as easily used Python, Java, Ruby, or Fortran for that matter.

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

type kv struct {
        K string
        C int64
        U string
        D string
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
                        return kvs[i].C > kvs[j].C
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

The basic building block for a Cloud Run app is a container so I needed to write a Dockerfile, which can be thought of as the container blueprint for this app. As containers go, this is a pretty simple one:

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

Here's what the Cloud Run console looks like after deploying my service:

<img src="/img/cloud-run.png" width="400" height="200" style="display:block; margin:auto">

One thing I'm quite happy with is the size of this app:

<img src="/img/small-is-beautiful.png" width="400" height="400" style="display:block; margin:auto">

## Conclusion

Here's the final version of my site in all it's glory:

<img src="/img/mco.fyi.png" width="400" height="400" style="display:block; margin:auto">

In case you're wondering, that cute guy is Meiko. Whenever you visit a short link at `mco.fyi/something`, his job is to go fetch the long version and return it to your browser. Thanks to Google and Meiko, my short link service is SIMPLE _and_ useful. If you'd like to try this code for yourself, it's available on [Github](https://github.com/marcacohen/mco.fyi) and here's a [slide version](https://mco.fyi/links) of this story.
