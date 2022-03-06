+++
categories = ["Puzzles"]
tags = []
date = "2022-03-06"
title = "Weighing Your Options"
coverImage = "/img/weighing.jpg"
+++

Imagine you have nine uniformly sized white balls, eight of which weigh precisely the same amount, and one is heavier or lighter than the others.

<!--more-->

You also have an accurately calibrated balance scale, which you can use to compare the weight of any two sets of objects.

**Here’s your challenge**: with only three weighings, discover which ball is different and whether it’s heavier or lighter than the other eight.

Happy puzzling!

<br>

<details>
  <summary>Click here to reveal solution</summary>

Let’s partition the nine balls into three groups of three. Mark the first group A1/A2/A3, the second group B1/B2/B3 and the third group C1/C2/C3. Now weigh the three A balls against the three B balls. There are two possible outcomes:

<br>

* The scale balances. In that case, the odd ball is in group C so weigh C1 against C2.
  * If the scale balances, then C3 is the odd ball. Weigh C3 against any other ball to see if it’s heavier or lighter than the rest.

  * If the scale doesn’t balance, let’s assume C1 is on top and C2 is on the bottom end of the scale (analysis of the reverse case is identical). So either C1 is light or C2 is heavy. Weigh C1 against any ball (other than C2) – if C1 ends up on the high end then C1 is light. If the scale balances then you know C2 is heavy.
* The scale doesn’t balance. Let’s assume group A is on top and group B is on the bottom end of the scale (analysis of the reverse case is identical). We therefore know that there is either a light ball in group A or a heavy ball in group B. Next weigh group A against group C. If the scale shows an imbalance, we know that group A contains a light ball. If the scale balances, we know group B contains a heavy ball.

  In either case, we’ve narrowed down the odd ball to one of three possibilities and we also know whether it’s light or heavy. With our last weighing, we take any two balls from the suspect group and weigh them against each other. If the scale balances, we know the odd ball is the remaining ball from that group (and we know whether it’s light or heavy). If the scale does not balance, we know which ball is odd by whether that group is known to contains a heavy or a light ball.

</details>
