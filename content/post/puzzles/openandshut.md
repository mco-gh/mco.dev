+++
categories = ["Puzzles"]
tags = []
date = "2021-05-23"
title = "An Open and Shut Case"
coverImage = "/img/openandshut.jpg"
+++

Today you're going back to school. Imagine you’re standing at one end of a corridor, with exactly 100 lockers all in a row, all of which are initially closed.

<!--more-->

Your eccentric math teacher walks by and asks you to perform the following sequence of tasks:


- Task 1. Visit every locker (1, 2, 3, …, 100) and, for each locker visited, change its state, i.e. if you find it open, close it and if you find it closed, open it. Since all lockers start closed, this effectively opens all 100 lockers.

- Task 2. Visit every 2 lockers (2, 4, 6, …, 100) and, for each locker visited, change its state (again, if you find it open, close it and if you find it closed, open it).
- Tasks 3-100. Continue doing the same sort of task for every 3 lockers, every 4 lockers, etc., all the way up to every 100th locker (which entails visiting only locker 100), each time changing the state of every locker visited.

**Here’s the question**: after completing all 100 tasks above, how many lockers remain open?

<br>

<details>
  <summary>You'll have more fun if you DON'T click here to reveal the solution.</summary>

Think about one particular locker, say, locker 12 - which tasks affect locker 12?

<br>

Task|Effect on locker 12|Why?
----|-------------------|----
1|opens locker 12|12 is divisible by 1
2|closes locker 12|12 is divisible by 2
3|opens locker 12|12 is divisible by 3
4|closes locker 12|12 is divisible by 4
5|no effect|12 is not divisible by 5
6|opens locker 12|12 is divisible by 6
7-11|no effect|12 is not divisible by any of those numbers
12|closes locker 12|12 is divisible by 12
13-100|no effect|all those numbers are greater than 12

Thus, at the end of all 100 tasks, locker 12 will be closed. Take a look at the list of tasks that affected locker 12: {1, 2, 3, 4, 6, 12}. It’s all the factors of 12. So, for any given locker, the set of factors is going to be important.

Another thing to notice: If a locker is opened as many times as it is closed, then it will end up closed. Since locker 12 has an even number of factors (6 factors, to be exact), it ends up closed. The only lockers that will be left open are those that contain an odd number of factors. Any idea which numbers have an odd number of factors? Take a look at a few numbers and see if you can spot a pattern:

Locker|Factors|Even or odd number of factors?
------|-------|------------------------------
1|{1}|**odd**
2|{1, 2}|even
3|{1, 3}|even
4|{1, 2, 4}|**odd**
5|{1, 5}|even
6|{1, 2, 3, 6}|even
7|{1, 7}|even
8|{1, 2, 4, 8}|even
9|{1, 3, 9}|**odd**
10|{1, 2, 5, 10}|even
11|{1, 11}|even
12|{1, 2, 3, 4, 6, 12}|even

Do you see a pattern? 1, 4 and 9 are the only numbers in the above list that have an odd number of factors. It turns out that perfect squares (any whole number that is the product of another whole number multiplied by itself) always have an odd number of factors. I like to think of it this way: every number has pairs of factors but perfect squares have one pair of factors that includes the same number twice, which is what causes them to have an odd number of factors. Thus, only the lockers that correspond to perfect squares will be left open at the end.

Here’s the list of perfect squares between 1 and 100 (inclusive): 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. As you can see, there are ten numbers on this list, so there will be ten open lockers when all is said and done.

</details>
