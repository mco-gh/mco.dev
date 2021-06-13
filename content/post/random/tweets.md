+++
categories = ["Random"]
tags = ["random"]
title = "Are we running out of tweets?"
date = "2021-06-13"
coverImage = "/img/tweets.png"
+++

Twitter’s 280 character limit raises an interesting question: **how many tweets are possible before nothing new can be said**?

<!--more-->

With 26 English letters, ten digits, and 33 special symbols, we have on the order of 70 unique characters to tweet with. The total number of possible tweets can thus be calculated by raising 70 to the 280th power. This is a *really* big number. How big? For the non-exponentially inclined, that’s basically 4.24 followed by 516 zeros (give or take a few quarillion).

But this estimate drastically overstates the number of tweets because the vast majority of those random combinations of letters would never be typed by any human being, with the possible exception of Donald Trump. So how do we limit our count to only tweets involving legitimate English words?

There are roughly 170,000 commonly used words in the English language. Let’s exclude the words that only Ken Jennings knows and reduce that to 20,000, which is thought to be, roughly, the size of the average English speaker’s working vocabulary. 

The average length of an English word is about five letters and let's ignore the fact that young people like to use short words that people like me have to look up on Urban Dictionary ("u r my BFF, LOL"). Next, let's divide the available 280 characters by six (five letters plus one space character after each word), which gives us ~47. Thus, we could generate all possible tweets using only legitimate English words by choosing up to 47 words from a pool of roughly 20,000. This gives us an estimate of the number of syntactically acceptable, though semantically nonsense tweets: 20,000 to the 47th power.

That’s a 1 followed by about 200 zeroes. But we still have a problem – the vast majority of those tweets would be entirely meaningless, with no semblance of the rules of English grammar. In other words, they would look like a typical teenager’s text messages.

Even if only one out of every million of those random strings of words makes a coherent sentence, the result is one followed by 196 zeroes, which is still ridiculously big.

To get a sense of how big that is, let’s compare it to some other large quantities:

* The number of stars in the observable universe is 10 to the 21st power, which is a one followed by a mere zeroesThis is not even a close match for the observable universe of tweets ([source](http://scienceline.ucsb.edu/getkey.php?key=3775)).
* The number of possible chess games is 10 to the 120th power ([the Shannon number](https://en.wikipedia.org/wiki/Shannon_number)), but the number of plausible games is only 10 to the 40th power. Compared to our twitter limit, that’s a minor league number.
* Even the number of atoms in the universe (one followed by 81 zeroes), is dwarfed by the Tweetspace.

It's useful to adopt a unit befitting a number this big. A googol, which inspired the differently spelled and far more profitable search engine, is defined as a one followed by 100 zeroes. Thus, the number of meaningful tweets, give or take a few quadrillion, is approximately 2 googols.

So rest easy, tweeters, the Sun will burn out long before we run out of original tweets. But that's only true if Trump remains banned, because he was on pace to use up the available tweetspace by next October.
