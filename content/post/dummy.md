+++
images = []
banner = ""
menu = ""
description = "this is an article"
categories = ["cloud"]
tags = ["cloud"]
date = "2017-01-05T21:24:58Z"
title = "Test Post"
+++

# gcslock

**gcslock** is a scalable, distributed mutex that can be used to serialize
computations anywhere on the global internet. (Disclaimer: The author works
for Google but this is not an official Google product.)

## What is this?

Once upon a time, in CS grad school, I was given an interesting homework
assignment: using only native Unix shell commands (this was the pre-Linux era),
develop a mutual exclusion mechanism (aka, a
[mutex](https://en.wikipedia.org/wiki/Mutual_exclusion)) to serialize blocks
of commands in a shell script. Before I reveal the solution, I'd suggest 
spending some time thinking about how you might solve this problem.
