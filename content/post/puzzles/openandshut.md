+++
images = []
banner = ""
menu = ""
description = ""
categories = ["Puzzles"]
image = ""
tags = ["puzzles"]
date = "2011-01-07"
title = "An Open and Shut Case"
subtitle = "Imagine you’re standing at one end of a corridor, with exactly 100 lockers all in a row, numbered 1 to 100..."
+++

For today’s puzzle, I’m taking you back to school. Imagine you’re standing at one end of a corridor, with exactly 100 lockers all in a row, numbered 1 to 100, all of which are initially closed. Your math teacher walks by and asks you to perform the following sequence of tasks:

Task 1: Visit every locker (1, 2, 3, …, 100) and, for each locker visited, change its state, i.e. if you find it open, close it and if you find it closed, open it. Since all lockers start out closed, this first task amounts to opening all 100 lockers.
Task 2: Visit every 2 lockers (2, 4, 6, …, 100) and, for each locker visited, change its state (again, if you find it open, close it and if you find it closed, open it).
Task 3: Visit every 3 lockers (3, 6, 9, …, 99) and, again, for each locker visited, change its state.
Tasks 4 through 100: Continue doing the same sort of task for every 4 lockers, every 5 lockers, etc., all the way up to every 100th locker (which entails visiting only locker 100), each time changing the state of every locker visited.
Here’s the big question (drumroll): after doing all 100 tasks above, how many lockers are open?

Solution: Let’s think about one particular locker, say, locker 12. Which tasks affect locker 12 (and how)?

task 1 opens locker 12 (because 12 is divisible by 1)
task 2 closes locker 12 (because 12 is divisible by 2)
task 3 opens locker 12 (because 12 is divisible by 3)
task 4 closes locker 12 (because 12 is divisible by 4)
task 5 does not affect locker 12 (because 12 is NOT divisible by 5)
task 6 opens locker 12 (because 12 is divisible by 6)
tasks 7-11 do not affect locker 12 (because 12 is NOT divisible by any of those numbers)
task 12 closes locker 12 (because 12 is divisible by 12)
tasks 13-100 do not affect locker 12 (because 12 is NOT divisible by any of those numbers)
So at the end of all 100 tasks, locker 12 will be closed. Now let’s look at the list of tasks that affected locker 12: 1, 2, 3, 4, 6, 12. Notice anything interesting about that list? It’s a list of the factors of 12, i.e. the numbers that can be divided evenly into 12. So, for any given locker, the set of factors is going to be important.

Another thing to notice: If a locker is opened as many times as it is closed, then it will end up closed. Since locker 12 has an even number of factors (6 factors, to be exact), it ends up closed. The only lockers that will be left open are those that contain an odd number of factors. Any idea which numbers have an odd number of factors? Let’s look at a few numbers and see if we can spot a pattern:

LOCKER   	FACTORS	EVEN OR ODD NUMBER OF FACTORS?
1	(1)	ODD
2	(1, 2)	even
3	(1, 3)	even
4	(1, 2, 4)	ODD
5	(1, 5)	even
6	(1, 2, 3, 6)	even
7	(1, 7)	even
8	(1, 2, 4, 8)	even
9	(1, 3, 9)	ODD
10	(1, 2, 5, 10)	even
11	(1, 11)	even
12	(1, 2, 3, 4, 6, 12)   	even
Do you see a pattern? 1, 4 and 9 are the only numbers in the above list that have an odd number of factors. It turns out that perfect squares (any whole number that is the product of another whole number multiplied by itself) always have an odd number of factors. I like to think of it this way: every number has pairs of factors but perfect squares have one pair of factors that includes the same number twice, which is what causes them to have an odd number of factors. Thus, only the lockers that correspond to perfect squares will be left open at the end.

Here’s the list of perfect squares between 1 and 100 (inclusive): 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. As you can see, there are ten numbers on this list, so there will be ten open lockers when all is said and done.

Hats off to Al Pessot, who solved this puzzle analytically, and Simon and Muzaffer, both of whom solved the puzzle by a so-called “brute force” method – they wrote a program to perform the 100 tasks in software and count the resulting open lockers. Well done!
