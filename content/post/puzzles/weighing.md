+++
images = []
banner = ""
menu = ""
description = ""
categories = ["Puzzles"]
image = ""
tags = ["puzzles"]
date = "2011-03-18"
title = "Weighing Your Options"
subtitle = "Imagine you have nine uniformly sized white balls, eight of which weigh precisely the same amount, and one is decidedly heavier or lighter than the rest..."
+++

Imagine you have nine uniformly sized white balls, eight of which weigh precisely the same amount, and one is decidedly heavier or lighter than the rest. You also have an accurately calibrated balance scale, which you can use to compare the weight of any two sets of objects.

Here’s today’s challenge: with only three weighings, tell me how you can discover which ball is different and whether it’s heavier or lighter than the other eight.

Bonus challenge for the hard core puzzlers: same problem with twelve balls instead of nine. Again, in only three weighings, tell me how you can find the odd ball (so to speak) and whether it’s heavier or lighter than the other eleven.

Leave me a comment below with your answer. I’ll post the solution on Tuesday. Happy puzzling!

Solution: Let’s partition the nine balls into three groups of three. Mark the first group A1/A2/A3, the second group B1/B2/B3 and the third group C1/C2/C3. Now weigh the three A balls against the three B balls. There are two possible outcomes:

The scale balances. In that case, the odd ball is in group C so weigh C1 against C2.
If the scale balances, then C3 is the odd ball. Weigh C3 against any other ball to see if it’s heavier or lighter than the others.
If the scale doesn’t balance, let’s assume C1 is on top and C2 is on the bottom end of the scale (analysis of the reverse case is similar). So either C1 is light or C2 is heavy. Weigh C1 against any ball (other than C2) – if C1 ends up on the high end then C1 is light. If the scale balances then you know C2 is heavy.
The scale doesn’t balance. Let’s assume group A is on top and group B is on the bottom end of the scale (analysis of the reverse case is similar). We therefore know that there is either a light ball in group A or a heavy ball in group B. Next weigh group A against group C. If the scale shows an imbalance, we know that group A contains a light ball. If the scale balances, we know group B contains a heavy ball.
In either case, we’ve narrowed down the odd ball to one of three possibilities and we also know whether it’s light or heavy. With our last weighing, we take any two balls from the suspect group and weigh them against each other. If the scale balances, we know the odd ball is the remaining ball from that group (and we know whether it’s light or heavy). If the scale does not balance, we know which ball is odd by whether that group is known to contains a heavy or a light ball.
Now for the harder, twelve-ball problem…start in a similar fashion by partitioning the balls into three groups of four (marking them A1-4/B1-4/C1-4) and weigh group A against group B. Regardless of whether the scale balances or not, rotate three balls, i.e. shift A1-3 to the B side, B1-3 off the scale and three C1-3 onto the A side and weigh again, noting the outcome. There are five possible changes in the result between weighings one and two:

The scale changes from balanced to unbalanced. Because the first weighing (between groups A and B) balanced, the odd ball must be in group C. The only new balls introduced to the scale in weighing two are C1-3 so one of them must be the odd one. We can also tell whether the odd ball from group C is light or heavy by whether the group C balls are on the top or bottom side of the scale after weighing two. And from the analysis of the nine ball problem, we know that when we have the odd ball narrowed down to one of three *and* we know whether it’s light or heavy, we can solve the problem with one additional weighing.
The scale changes from unbalanced to balanced. If, after the first weighing, the scale was unbalanced, let’s assume group A was on top and group B was on the bottom end of the scale (analysis of the reverse case is similar). Therefore, we know we have either a light ball in group A or a heavy ball in group B. After the second weighing the scale becomes balanced. The only way that can happen is if the odd ball was one of the three from group B we removed from the lower end of the scale. Thus, we know one of B1-3 is heavy and we can find it in one additional weighing.
The scale changes from unbalanced one way to unbalanced the other way (i.e. it reverses polarity). If, after the first weighing, the scale was unbalanced, let’s assume group A was on top and group B was on the bottom end of the scale (analysis of the reverse case is similar). Therefore, we know we have either a light ball in group A or a heavy ball in group B. After the second weighing the scale becomes unbalanced in the opposite way. The only way that can happen is if we shifted a light ball from group A (i.e. one of A2-4) to the other side of the scale. We therefore have a group of three balls containing one that is known to be light and we can find the odd ball in one additional weighing.
Scale remains balanced. This implies that after the first two weighings, the odd ball has not yet appeared on the scale. But there’s only one ball that has never been on the scale: C4. So in our third weighing, we compare C4 with any other ball to see if it’s light or heavy.
Scale remains unbalanced (in the same way). For both weighings, let’s assume group A was on top and group B was on the bottom end of the scale (analysis of the reverse case is similar). If the scale remains unbalanced in the same way for both weighings, then the odd ball is one that remained in the same position for both weighings. There are only two balls in that category: A4 and B4. So either A4 is light or B4 is heavy. In our third weighing, compare A4 to any ball (other than B4). If it doesn’t balance then A4 is light. If it does balance then B4 is heavy.
