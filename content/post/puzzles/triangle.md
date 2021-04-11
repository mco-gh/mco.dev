+++
categories = ["Puzzles"]
tags = []
date = "2021-04-11"
title = "Something doesn't add up here"
coverImage = "/img/triangle.jpg"
+++

My friend [Gus](https://twitter.com/gusthema) shared this ingenious demo of an old puzzle on twitter. Check out the short video below and see if you can tell what's happening.

<!--more-->

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The missing square 🤔🤷🏼‍♂️ <a href="https://t.co/n2x0EWxtVe">pic.twitter.com/n2x0EWxtVe</a></p>&mdash; Patrick (@ChangeOrDie9) <a href="https://twitter.com/ChangeOrDie9/status/1380976626876436483?ref_src=twsrc%5Etfw">April 10, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The answer is hidden below but see if you can figure out what's going on before revealing it.

<br>

<details>
  <summary>Click here to reveal solution</summary>

Notice how in both configurations, the two triangles are lined up such that their long edges (a.k.a. their hypotenuses) seem to be perfectly aligned. But do they form a straight line? One way to check is to compute the slope of the two hypotenuses. If they really form a straight line, they must have the same slope.

You may recall from high school math that we calculate the slope of a line by choosing any two points on the line and calculating the change in the y axis divided by the change in the x axis (in the old days, we called this rise over run). Let's do that for each of these two triangles.

The larger one, let's call it triangle A, is 8 units tall by 3 units wide which gives a slope of <sup>8</sup>&frasl;<sub>3</sub>, or 2<sup>2</sup>&frasl;<sub>3</sub>. The smaller one, which we'll call triangle B, is 5 units tall by 2 units wide, which gives a slope of 2<sup>1</sup>&frasl;<sub>2</sub>. So they have different slopes, which gives us a clue as to what's happening here.

Because they don't form a straight line, in the starting configuration, the aggregate hypotenuse bends slightly inward, and in the second configuration the line bends slightly outward. How much area in the aggregate triangle does that bending account for? You guessed it, exactly one unit, which is why the second configuration seems to be missing an interior square.

Ok, that's a lot of words but can we use math to verify this claim? In the words of famous mathematician, [Bob the Builder](https://www.youtube.com/watch?v=qtgA9w5vHp8), "Yes, we can!"

Let's start by calculating the area of the rectangles (simply count the squares):

- area(rect A) = 8
- area(rect B) = 7
- area(both) = 8 + 7 = 15 square units

Now let's calculate the area of the triangles (formula: one-half base times height):

- area(triangle A) = .5 (8 * 3) = .5 * 24 = 12 
- area(triangle B) = .5 (5 * 2) = .5 * 10 = 5
- area(both) = 12 + 5 = 17 square units

So, no matter how you arrange these four shapes, the total area they cover is 15 + 17 = 32 square units.

Now let's calculate the area of the triangle we're trying to cover (you have to watch the video carefully to see this, but the red shaded triangle is 13 by 5, so...

- area(covered triangle) = .5 (13 * 5) = .5 * 65 = 32.5

This tells us something important: the total area of the shapes we're using to cover the background triangle is exactly one-half of a square unit smaller than the red triangle we're trying to cover! This difference of one-half of a unit must be the area lost or gained by the bend in the hypotenuse. When we go from bending inward to bending outward, we gain two of these one-half units, which is one full unit. That one extra unit added into the outer "bulge" of the hypotenuse is perfectly compensated for by the inteior "missing" square.
</details>
