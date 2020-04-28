+++
categories = ["Data"]
tags = ["cloud", "dataviz"]
title = "Build Your Own bit.ly"
date = "2020-04-28"
coverImage = "/img/shortlink.jpg"
draft = true
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

## Server - Cloud Run

## User Interface - Svelte

## All together now

## Conclusion

## Resources and Acknowledgements
