+++
categories = ["Random"]
tags = ["random"]
title = "How Many Tweets are Possible?"
date = "2011-03-08"
coverImage = "/img/tweets.jpg"
+++
Twitter’s 140 character limit raises an interesting question: how many tweets are possible before nothing new can be said?
<!--more-->
Most of the information in tweets is conveyed via alphabetic characters and the digits 0-9. We should also include the ubiquitous hash mark and “at sign” (twitter tags and references, respectively) and several other punctuation marks, including the all-important space character. Given 26 letters (we’ll ignore upper and lower case), 10 digits and roughly a dozen special symbols gets us to about 50 unique characters. The total number of possible tweets can thus be calculated by raising 50 to the 140th power. What’s that look like? Here’s a cute google trick: enter any mathematical expression in the search bar and you get the calculated answer, as illustrated below.


This is a *really* big number. How big? For the non-exponentially inclined, that’s basically a 1 followed by 238 zeros. So that “twitter is running out of tweets” rumor (not a real rumor, I just made that up) is hereby debunked. To get a sense of the size of that number, let’s compare it to some other large quantities:

According to this wikipedia article, the number of stars in the observable universe is a mere 1 followed by 22 zeroes, which is not even a close match for the observable universe of tweets.
Per Wolfram Mathworld (by the way, is there a nerdier site on the planet?), the number of possible chess games is 1 followed by 40 zeroes. Compared to our twitter limit, that’s a minor league number.
Hey, number of atoms in the universe (1 followed by 81 zeroes), twitter laughs at you!
OK, you get the point. But actually this drastically overstates the number of tweets. Why? Because any random combination of letters, while perhaps legal, would not be considered meaningful tweeting. Scintillating tweets like this one: “ertyus hbd fnio dfghjk bnm” would never be written by a human being, unless we’re talking about Sarah Palin. So how do we count only “meaningful” tweets? Let’s start with the assumption that meaningful tweets are composed of a number of english words and proper nouns (sorry rest of the world, this is the point in the article where I go all ugly American on you).

According to this article, there are roughly 170,000 commonly used words in the English language. Let’s exclude the words that only Ken Jennings knows and reduce that to 10,000, which, per this source, is thought to be the size of the average person’s vocabulary. Per this source, the average length of an English word is 5.1 letters. Let’s lower that average to 4 letters to account for popular abbreviations (“u r my BFF, LOL”). Next, we divide the available 140 characters by 5 (four letters plus one space for each word) and we get 28. Essentially, tweets are constructed by making up to 28 choices from a pool of roughly 10,000 words. This gives us an estimate of the number of meaningful tweets:


That’s a 1 followed by 112 zeroes. But we still have a problem – the vast majority of those would be entirely meaningless tweets, with no semblance of the rules of English grammar. In other words, they would look like a typical teenager’s text messages.

Even if we remove 99.99% of those tweets, the result is still a whopping number: 1 followed 108 zeroes, which happens to be close to a very famous number. A googol, the name of which inspired the differently spelled and far more profitable search engine, is defined as a 1 followed by 100 zeroes. Finally, we have our answer: The number of meaningful tweets, give or take a few trillion, is given by…a googol.

Of course, it really doesn’t matter how many tweets are possible. The whole point of this article was to show that, in the age of the internet, almost any quantitative question can be answered with a combination of googling, calculating and some good old fashioned thinking. I like pondering crazy questions like this one because I think it’s fun and a good way to build analytical skills. Now, go figure out something really important, like how many licks it takes to get to the center of a tootsie pop!


