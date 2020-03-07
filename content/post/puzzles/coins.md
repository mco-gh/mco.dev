+++
categories = ["Puzzles"]
tags = []
date = "2010-12-04"
title = "Flipping Coins"
subtitle = "Which sequence is more likely: HTT or HTH? The answer will surprise you."
coverImage = "/img/coins.jpg"
+++

Imagine tossing a coin repeatedly until you get a certain pattern, let’s say HTT (head, tail, tail). For example, in this sequence of outcomes:

HHTHHTHHTTHHTTTHTH

the desired pattern was reached after the 10th toss (highlighted in red).
<!--more-->

Now let’s imagine you repeat that same experiment and each time you record the number of tosses needed to see the desired pattern. The first time you might see HTT after 10 tosses (as in the example above), the second time you might see HTT after 7 tosses, the third time after 15 tosses, etc. After many such experiments, you calculate the average number of tosses needed to see the HTT pattern.

At the same time, imagine your friend does the same number of experiments but she’s looking for a different pattern:  HTH (head, tail, head).

Here’s the question:  on average, will it take more flips to see HTT than HTH, or vice versa, or about the same number of flips to see both patterns? The answer may surprise you. Submit your guess in a comment below and I’ll post the solution tomorrow.

If you can’t wait till then, try the software simulation below (which I’ve personally written for today’s puzzle) and the answer will reveal itself. This puzzle comes from a fascinating TED talk on how statistics fool juries.


START SIMULATION	STOP SIMULATION	RESET SIMULATION
PATTERN	EXPERIMENT	AVERAGE FLIPS	LAST SEQUENCE
HTT			
HTH			
Solution: If you didn’t figure this one out, you’re in good company because distinguished mathematicians routinely get it wrong. Most people think it should take the same number of tosses to see both patterns but, as the software simulation above shows, on average, it takes more tosses to see HTH (10) than HTT (8). Here’s why…

Imagine you’re waiting for HTH and you see a head followed by a tail. You’re two thirds of the way there! On the next toss one of two things will happen: either it’s a head, in which case you’re done, or it’s a tail, in which case you have to start all over again. Now imagine the same scenario when you’re looking for HTT. You see a head followed by a tail, at which point you are, again, one toss away from success. If the next toss is a tail, you’re done, but if the next toss is a head, you don’t have to go all the way back to the beginning – you’re immediately one-third of the way toward another potential HTT sequence. A failed HTT sequence overlaps with the next potentially valid sequence. This fact gives HTT a small built-in advantage over HTH. If that’s not sufficiently satisfying, this page gives a more formal explanation.
