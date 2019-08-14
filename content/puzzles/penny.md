+++
images = []
banner = ""
menu = ""
description = ""
categories = []
image = "birthday.jpg"
tags = ["puzzles"]
date = "2011-03-13"
title = "Penny For Your Thoughts"
+++
Imagine a very wealthy and eccentric friend (which is the best kind of friend to have) offers you the following choice:

One penny on the first day of January, two cents on the second day, four cents on the third day, and so on, doubling the amount you receive each day up to the 31st day of January.
One million dollars
Which option would you choose?

Solution: Today’s problem illustrates the power of a geometric series. It starts out very slowly, 1 cent, 2 cents, 4 cents…it seems like child’s play but by the end of the month, watch out! The number of pennies you receive on day N is given by 2 raised to the power N-1, which we can write mathematically like this: f(x) = 2**(x-1). The following graph of this function illustrates the sudden, rapid growth of a geometric series:



On the last day of January you would receive 2**(N-1) = 2**30 or 1,073,741,824 (over one billion) pennies, which is more than 10 million dollars! But it gets even better because we have to sum the pennies received throughout the entire month of January. The sum of all pennies received through day N is given by (2**N) – 1, which, in our case, would be (2**31)-1. That comes to 2,147,483,647 cents or, roughly, 21.5 million dollars.
