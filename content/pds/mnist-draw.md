+++
images = []
banner = ""
menu = ""
description = ""
categories = []
image = ""
tags = []
date = "2019-08-30"
title = "Interactive Prediction"
subtitle = "Testing ML Models in the Browser"
+++
I'm a huge fan of rapid feedback as a way to really engage people
in the learning process. I think Bret Victor said it best:

> If there is any delay in that feedback loop, between thinking of something and seeing it, and building on it, then there is this whole world of ideas which will just never be. These are thoughts that we can't think.

The MNIST digit recognition dataset has a long and storied history. 
It was an early example of production use of visual image processing
when the US Postal Service adopted an early ML model for the problem
of recognizing hand-scrawled zip codes on envelopes and packages. 
Since then, it's become a kind of "Hello World" exemplar for image
processing neural networks.

Using the [Keras](keras.org) library, I've been using this dataset to
teach workshops on building neural networks to recognice hand written
digits, but what was missing was a level of interactivity that gives
the user a direct connection to their model.

So I build an interactive widget that uses tensorflow.js right in the
browser to use an ML model to predict digits.

Here's an inline version of it:

<iframe>
