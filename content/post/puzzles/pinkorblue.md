+++
categories = ["Puzzles"]
tags = []
date = "2021-12-05"
title = "Pink or Blue?"
subtitle = "Predicting the gender distribution of your offspring"
coverImage = "/img/pinkorblue.png"
+++

Try this simple puzzle about the likelihood of gender distribution among four children.

<!--more-->

**Note: I'm aware there are a multitude of genders. I'm deliberately using two genders in order to construct this simple puzzle.**

Assuming the odds of a given child being born a boy or a girl are precisely 50%, imagine you have four children and consider these three possible outcomes:

<br>

- all four children have the same gender (four boys or four girls)
- three have the same gender and one has the opposite gender (three girls and a boy or three boys and a girl)
- an even split (two boys and two girls)

Here’s today’s challenge: **which of the three scenarios above is the most likely one?** Extra credit for finding the probability of each case.

You'll have more fun if you DON'T click below to reveal the solution.

<br>

<details>
  <summary>
Solution
  </summary>

The first step is to understand how many possible permutations we’re dealing with. We have four kids and each one has two possible states (male or female) so that gives us 2 to the 4th, which is 2*2*2*2 = 16 permutations. 

Another way of seeing that is to list the possible gender configurations. We can do this by starting with four girls, which can happen in only one way (GGGG), then listing the configurations with three girls (GGGB, GGBG, GBGG, BGGG), then those with two girls and so on (I’ve noted in parentheses which category each element in the list belongs to):

<br>

* GGGG (case 1)
* GGGB (case 2)
* GGBG (case 2)
* GBGG (case 2)
* BGGG (case 2)
* GGBB (case 3)
* GBGB (case 3)
* GBBG (case 3)
* BGGB (case 3)
* BGBG (case 3)
* BBGG (case 3)
* GBBB (case 2)
* BGBB (case 2)
* BBGB (case 2)
* BBBG (case 2)
* BBBB (case 1)

Next, we divide those 16 gender configurations into the three categories mentioned in the problem:

<br>

* Case 1 (4/0): GGGG, BBBB
* Case 2 (3/1): GGGB, GGBG, GBGG, BGGG, GBBB, BGBB, BBGB, BBBG
* Case 3 (2/2): GGBB, GBGB, GBBG, BGGB, BGBG, BBGG

Finally, we sum the number of permutations in each group and divide by the the total number of possibilities (16) to get the probability of each case:

<br>

* case 1: 2/16 = 1/8 = 12.5%
* case 2: 8/16 = 4/8 = 50.0%
* case 3: 6/16 = 3/8 = 37.5%

This result is a bit surprising – because things generally tend to even out over time, most people assume the correct answer is 2/2 but, as you can see, 3/1 is the most likely split. The photo at the top was a subtle hint because it depicts the 3/1 (BBBG) split in my own family.
