+++
images = []
banner = ""
menu = ""
description = ""
categories = ["Puzzles"]
image = ""
tags = ["puzzles"]
date = "2011-03-12"
title = "Putting Your Cards on the Table"
subtitle = "In front of you are four cards on a table. Each card has a letter on one side and a number on the other side."
+++

In front of you are four cards on a table, which look like this:

Each card has a letter on one side and a number on the other side. Obviously, you can only see one side of each card. Here’s the challenge: tell me which card(s) you need to turn over in order to test the following theory: “If a card has a vowel on one side then it must have an even number on the other side”. Take your time and think about it, then leave me a comment with your answer.

This puzzle has been around for at least forty years. I found it in the book How Would You Move Mt. Fuji? by William Poundstone, which is a fun read and full of interesting “interview puzzles” famously used by Microsoft and other high tech companies in the 90s. Nowadays, most tech companies, including Microsoft, rely more on interactive coding challenges and less on brain teasers, which is probably a good thing – these sorts of puzzles are fun but I don’t think they’re a good way to find talented programmers.

Solution: The key concept to understand here is the very specific nature of this statement:

If a card has a vowel on one side then it must have an even number on the other side.

In the study of formal logic, this statement is called an implication because, given one thing is true, it implies something else is true. We can write implications symbolically like this: A=>B, where, in our current problem A is “a vowel on one side” and B is “an even number on the other side”.

Now let’s look at each card, one at a time:

The first card shows a vowel (A) so we can test our theory by checking its other side. If the reverse side shows anything other than an even number, our theory is disproven. If the reverse side shows an even number, it supports our theory but it doesn’t prove it outright – we may still have other cards to check.
The second card shows a consonant (F). Our theory says nothing at all about consonants so examining the other side of this card is a waste of time – it will neither support nor disprove our theory.
The third card shows an even number (2). Our theory says that if we see a vowel, we should expect to see an even number on the other side but it says nothing about the opposite implication. It does NOT imply that if we see an even number, we should expect to see a vowel on the other wide. In formal logic, A=>B does not imply B=>A. So there is nothing to be gained by turning this card over.
Finally, the fourth card shows an odd number (7). It might seem, at first glance, that this card also has nothing to offer (because our theory talks about even numbers and this card shows an odd number) but think about this: what if the other side of this card has a vowel – wouldn’t that disprove our theory? For our theory to be supported, this card must have a consonant on the other wide – otherwise we’d be looking at an odd number on the other side of a vowel which would disprove our theory so we need to examine the back of this card as well.
So there you have it – in order to test our theory as completely as possible, we would want to turn over cards 1 and 4. Hats off to Ricardo and Denis for correct solutions to this week’s puzzle!
