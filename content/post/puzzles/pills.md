+++
categories = ["Puzzles"]
tags = []
date = "2021-12-12"
title = "Perilous Pills"
subtitle = "A matter of life or death"
coverImage = "/img/pills.jpg"
+++

You’re a pharmacist and you’ve just taken delivery of ten bottles of 1,000 pills each. But before you have a chance to put them away, your supplier calls to inform you that, due to a glitch at the factory, one of the ten bottles is tainted. 

<!--more-->

Every pill is supposed to contain 10 milligrams of medication, but all of the pills in the bad bottle contain one extra milligram. Obviously, you can’t allow your customers to buy the overdosed pills, but this medication is very expensive so you can’t afford to throw away the whole lot.

Fortunately, you have a smart assistant, who suggests weighing the pills. "Brilliant!", you exclaim, "All we have to do is weigh each bottle – nine bottles will weigh the expected 10,000 mg and one bottle will weigh an extra 1,000 mg due to the overdosed pills".

"You could do it that way", adds your assistant with a sly grin, “but that could take up to ten weighings to find the bad bottle. I can think of a plan that’s guaranteed to find the bad bottle in only one weighing”.

**What was your assistant’s plan? Hint: you may open the bottles and weigh any number of pills you like from any bottles.**

You'll have more fun if you DON'T click below to reveal the solution.

<br>

<details>
  <summary>
Solution
  </summary>

The key insight comes from the observation that if you weigh a different number of pills from each bottle then the excess weight can be used to identify the bad bottle. For example...

<br>

- Mark each bottle with a unique number from 1 to 10.
- Take one randomly selected pill from bottle one, two pills from bottle two, etc. Weigh the resulting 55 pills (1+2+3+4+5+6+7+8+9+10 = 55) and note the result.
- If all 55 pills were legitimate, the expected result would be 550 mg (10 mg per pill times 55 pills) but the actual result is going to exceed the expected weight because you’ve included some number of overdosed pills in your sample. Subtract the actual weight from 550 mg to find the number of extra milligrams and, hence, the number of bad pills in your sample.
- Because you included a different number of pills from each bottle, you can trace the number of bad pills directly to the bad bottle. One bad pill implicates bottle one, two bad pills implicate bottle two, etc.
</details>

Today’s puzzle is adapted from the book **Aha! Insight** by the late, great puzzlemaster Martin Gardner.
