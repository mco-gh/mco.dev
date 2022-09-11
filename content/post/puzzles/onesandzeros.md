+++
categories = ["Puzzles"]
tags = ["numbers"]
date = "2022-09-11"
title = "Ones and Zeros"
coverImage = "/img/onesandzeros.jpg"
+++

I like puzzles that are easy to state and don’t require a lengthy explanation. Today’s puzzle falls into that category.

<!--more-->

It comes from one of my oldest and best friends, who asked me this simple but perplexing question: **What is the smallest number evenly divisible by 225 that contains only the digits 1 and 0?**

If you struggle to find the answer analytically, and you know how to code, see if you can solve it algorithmically, using a computer program. It's a fun programming problem.

<br>

<details>
  <summary>Click here to reveal the solution.</summary>

I know of three ways to solve this problem:

### The Slow Search Method
This approach starts with 225 and multiplies it by an ever-increasing sequence of multiples looking for a number that contains only ones and zeros. Here’s the Python code to implement this method:

```python
import time

start = 225  # starting number
cnt = 0
binary_digits = ("0", "1")

start_time = time.time()  # capture start time

while True:
    cnt += 1
    num = start * cnt
    # check for all 1s and 0s in num
    for i, j in enumerate(str(num)):
        if j not in binary_digits:
            break
    if i == len(str(num)) - 1:
        break 

elapsed = time.time() - start_time  # calculate elapsed time
print(f"After {cnt} iterations and {round(elapsed)} seconds, found {num}.")
```

Which prints the following result:
<pre>
After 49382716 iterations and 116 seconds, found 11111111100.
</pre>

### The Fast Search Method
This strategy observes that the desired result looks like a binary number (albeit in base 10) so it tests a sequence of binary numbers, treating each as a base 10 number, looking for one that’s evenly divisible by 225. This is much faster than the previous method because it automatically skips all the base 10 numbers that have digits other than 1 and 0. Here’s the Python code:

```python
import time

def convert(num, b1, b2):
    """convert the passed num from base b1 to base b2"""
    result = 0
    digits = []
    while num:
        digits.append(num % b1)       
        num //= b1
    digits.reverse()
    for i in digits:
        result = (result * b2) + i
    return result

start = 225
num = 1000  # start with smallest possible answer > 225
cnt = 1

# capture start time
start_time = time.time()

while True:
    if (num % start) == 0:       
        break
    # convert to base 2, increment, then convert back to base 10
    num = convert(num, 10, 2)
    num += 1
    num = convert(num, 2, 10)
    cnt += 1
    
elapsed = time.time() - start_time  # calculate elapsed time
print(f"After {cnt} iterations and {round(elapsed, 3)} seconds, found {num}.")
```

which prints the following result:
<pre>
After 2037 iterations and 0.016 seconds, found 11111111100.
</pre>

### The Analytical Method
Because 225 ends in 25, multiples of 225 will end in one of four possible digit pairs: 25, 50, 75 or 00. The only one that meets our requirements (only 1s and 0s allowed) is the last one so we know that the result must end with two 0s.

We can also see that 225 is divisible by 9 (you can check any number for divisibility by 9 by seeing if the digits sum to 9). Therefore, any multiple of 225 must also be divisible by 9. So we know the digits in the result must end in 00, contain only 1s and 0s, and sum to 9.

With those constraints, the smallest possible number meeting our requirements will contain nine consecutive 1s and will end with two 0s: 11111111100.

</details>
