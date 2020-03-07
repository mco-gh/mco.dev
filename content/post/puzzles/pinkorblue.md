+++
categories = ["Puzzles"]
tags = []
date = "2011-03-04"
title = "Pink or Blue?"
subtitle = "Predicting the gender distribution of your offspring"
coverImage = "/img/pinkorblue.png"
+++

For the past 63 years in a row, babies born in the US have been slightly more likely to be a boy than a girl, at a rate of roughly 51% to 49% (source).<!--more--> For today’s puzzle, let’s ignore that complication and assume the odds of being born a boy or a girl are precisely 50%. Now, imagine you have four children and consider these three possible outcomes:

all four children have the same gender (four boys or four girls)
three have the same gender and one has the opposite gender (three girls and a boy or three boys and a girl)
an even split (two boys and two girls)
Here’s today’s challenge: tell me which of the three scenarios above is the most likely one. If you’re not sure, just take a guess. Leave me a comment with your answer. Extra credit will be awarded if you can tell me the probability of the most likely outcome.

I myself come from a family of four children – my three siblings and I are pictured above.

Solution: The first step is to understand how many possible permutations we’re dealing with. We have four kids and each one has two possible states (male or female) so that gives us 2 to the 4th, which is 2*2*2*2 = 16 permutations. Another way of seeing that is to list the possible gender configurations. We can do this by starting with four girls, which can happen in only one way (GGGG), then listing the configurations with three girls (GGGB, GGBG, GBGG, BGGG), then those with two girls and so on (I’ve noted in parentheses which category each element in the list belongs to):

GGGG (case 1)
GGGB (case 2)
GGBG (case 2)
GBGG (case 2)
BGGG (case 2)
GGBB (case 3)
GBGB (case 3)
GBBG (case 3)
BGGB (case 3)
BGBG (case 3)
BBGG (case 3)
GBBB (case 2)
BGBB (case 2)
BBGB (case 2)
BBBG (case 2)
BBBB (case 1)
Next, we divide those 16 gender configurations into the three categories mentioned in the problem:

Case 1 (4/0): GGGG, BBBB

Case 2 (3/1): GGGB, GGBG, GBGG, BGGG, GBBB, BGBB, BBGB, BBBG

Case 3 (2/2): GGBB, GBGB, GBBG, BGGB, BGBG, BBGG

Finally, we sum the number of permutations in each group and divide by the the total number of possibilities (16) to get the probability of each case:

case 1: 2/16 = 1/8 = 12.5%
case 2: 8/16 = 4/8 = 50.0%
case 3: 6/16 = 3/8 = 37.5%

This result is a bit surprising – because things generally tend to even out over time, most people assume the correct answer is 2/2 but, as you can see, 3/1 is the most likely split. The photo was my way of giving a tiny hint because it depicted the 3/1 (BBBG) split in my own family.

I got several great responses to this one – congrats to my many brilliant readers and my apologies for a little bit of ambiguity in my formulation, which, I think, threw off a few responders. See you next Saturday!
