+++
images = []
banner = ""
menu = ""
description = ""
categories = ["Puzzles"]
image = ""
tags = ["puzzles"]
date = "2010-11-13"
title = "Burning Strings"
subtitle = "Using fire to measure time"
+++

I first heard today’s puzzle several years ago from a co-worker who had recently returned from a job interview at Microsoft, where he’d been asked to solve this one in real time. I’m not a big believer in those sorts of puzzle interview questions – they’re good for spotting people who think quickly on their feet (or who already know the answer :), but I don’t think they necessarily help you find great programmers. Nevertheless, it’s a cute puzzle…

Imagine you have two lengths of string, each of which is known to have the following characteristics:

When lit at one end, each string takes exactly one hour to burn completely.
The strings burn at a non-uniform rate, i.e. there’s no way of predicting what proportion of a string will burn in any given time period (apart from the fact that 100% of the string will burn in exactly one hour, per the previous item).
Here’s the challenge: given these two strings and two matches, how can you measure a 45 minute time interval? As always, the first correct responder gets a shout out in this post.

For an interesting discussion of Microsoft’s famous interview puzzles, see How Would You Move Mount Fuji?.



UPDATE: We have a winner…actually two winners: Kimberly Cohen and Al Pessot. You can read their answers in the comments to this post but here’s the key insight: if you light both ends of a string, it’s guaranteed to burn in exactly half the time it would take for the entire string to burn when lit from one end. To see why this must be true, imagine that when the string is lit from both ends it takes something other than than 30 minutes to burn, let’s say 25 minutes. That would imply that if we lit the string from one end, it would take 2 x 25 = 50 minutes to burn, which contradicts one of our basic assumptions. Using this fact, and some adroit match work, you can measure two successive intervals of 30 and 15 minutes for a total of 45 minutes.

