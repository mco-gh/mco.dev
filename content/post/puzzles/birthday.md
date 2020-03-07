+++
categories = ["Puzzles"]
image = "birthday.jpg"
tags = []
date = "2017-04-29"
title = "What a Coincidence!"
subtitle = "How surprised should we be to find a common birthday in a random group of people?"
coverImage = "/img/"
+++

How surprised should we be to find a common birthday in a random group of people?<!--more-->

When you meet a new acquaintance, the chances are only 1 in 365 that s/he will share your birthday.
But the odds of any two people having a common birthday in a large group of, say, 100 people, are
actually quite high. We’ll take this puzzle in two parts…

## Part 1
Imagine a random group of N people. What is the smallest value of N that will *guarantee* that 
two or more people in the room have the same birthday?

## Part 2
In any random gathering of N people, the likelihood of a common birthday increases with N.
When N=1, obviously there’s zero chance of having two people with the same birthday. When N=2, 
there’s a small chance (1/365) that those two people share the same birthday. 
When N=3, the odds of a common birthday increase ever so slightly (because any pair of those 
three may share a common birthday). So here’s the question: what is the smallest value of N 
such that the odds of a common birthday in the group reach 50%? In other words, how large a group must you 
convene in order to have a 50-50 chance that two people in the group share a birthday?

If you’re not sure, take a guess based on your intuition and check the solution below to see how close you got. 
But try to work out the solution on your own before checking the answer. You'll get a lot more out of
it that way.

<br><br>

## SPOILER -- SOLUTION BELOW...

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 1

Imagine this (very unlikely but possible) scenario: 365 people enter a room and they all have different 
birthdays – every day of the year is claimed by one and only one person. Now the 366th person enters the 
room and there are no unclaimed days left – that person must share a birthday with one of the 365 people 
already in this (now very crowded) room. Thus, the smallest value of N such you are guaranteed to have at 
least one common birthday is 366 (I'm ignoring leap years for this exercise).

## Part 2

Let’s call the probability that two or more people in the group share a common birthday P(CB) (“Common Birthday”). 
The easiest way to solve this part of the puzzle is to calculate the opposite of what you’re interested in, i.e. 
the probability that no pair of people in the group share a birthday - we’ll call this P(NCB) (“No Common Birthday”)
and then subtract that value from one. This works because the sum of the probabilities of two mutually
exclusive, complementary events is always one.

How do we calculate p(NCB) for some group N? When the first person enters the room, P(NCB) = 1 because you can’t 
have a shared birthday with only one person. When the second person enters the room, P(NCB) = (364/365). When the 
third person enters the room, P(NCB) = (364/365) * (363/365), and so on.

Take a look at the table of values for P(NCB) and P(CB) below with N varying from 10 to 30. 
By examining this table, you can see that P(CB) first exceeds .5 at N=23. In other words, any time you assemble 23 or more people in a group, there’s a better than 50% chance that two or more people in the room have a common birthday. You can read more about this puzzle [here](https://en.wikipedia.org/wiki/Birthday_problem).

 &nbsp;&nbsp;N&nbsp;&nbsp; | P(NCB) | P(CB)         
-----|---------------------|------------------
 15  | 0.747098680236313&nbsp;&nbsp;&nbsp;&nbsp; | 0.252901319763686&nbsp;&nbsp;&nbsp;&nbsp;
 16  | 0.716395994747149   | 0.283604005252850  
 17  | 0.684992334703439   | 0.315007665296560  
 18  | 0.653088582128210   | 0.346911417871789  
 19  | 0.620881473968463   | 0.379118526031536 
 20  | 0.588561616419419   | 0.411438383580580 
 21  | 0.556311664834794   | 0.443688335165206   
 22  | 0.524304692337449   | 0.475695307662550  
 **23**  | **0.492702765676014**   | **0.507297234323985**
 24  | 0.461655742085471   | 0.538344257914529   
 25  | 0.431300296030536   | 0.568699703969464 
