+++
categories = ["Puzzles"]
tags = []
date = "2022-01-22"
title = "The answer to this puzzle will surprise you"
coverImage = "/img/coins.jpg"
+++

Imagine tossing a coin repeatedly until you get a certain pattern, let’s say HTT (head, tail, tail).

<!--more-->

For example, in this sequence of outcomes:

> **HHTHHTH<span style="color:red">HTT</span>**

the desired pattern was reached after the 10th toss (highlighted in red).

Now let’s imagine you repeat that same experiment and each time you record the number of tosses required to see the desired pattern. The first time you might see HTT after 10 tosses (as in the example above), the second time you might see HTT after 7 tosses, the third time after 15 tosses, etc. After many such experiments, you calculate the average number of tosses needed to see the HTT pattern.

At the same time, imagine your friend conducts the same number of experiments but she’s looking for a different pattern:  HTH (head, tail, head).

**Here’s the question**:  on average, will it take more flips to see HTT than HTH, or vice versa, or about the same number of flips to see both patterns?

If you're impatient, try this software simulation (which I’ve written for today’s puzzle) and the answer will reveal itself. Each test runs 1,000 trials.

<script>
let data_init = {
  HTT: {seq: "", exp: 0, tot: 0},
  HTH: {seq: "", exp: 0, tot: 0},
}
let data = {}
data = JSON.parse(JSON.stringify(data_init))

function display(pattern) {
  exp = document.getElementById(pattern + "_exp");
  avg = document.getElementById(pattern + "_avg");
  seq = document.getElementById(pattern + "_seq");
  exp.innerHTML = data[pattern].exp
  tmp_avg = 0;
  if (data[pattern].exp > 0) {
    tmp_avg = (data[pattern].tot / data[pattern].exp).toFixed(2);
  }
  avg.innerHTML = tmp_avg;
  subseq = data[pattern].seq.slice(-10);
  first = subseq.substr(0, subseq.length - 3);
  last = subseq.slice(-3);
  seq.innerHTML = first + "<span style=\"color:red\">" + last + "</span>"
}

function refresh() {
  display("HTT");
  display("HTH");
}

function trial(pattern) {
  data[pattern].seq = "";
  data[pattern].exp++;
  while (data[pattern].seq.length < 3 || data[pattern].seq.slice(-3) != pattern) {
    data[pattern].seq += flip();
    data[pattern].tot++;
  }
}

function start() {
  for (i = 0; i < 1000; i++) {
    trial("HTT");
    trial("HTH");
  }
  refresh();
}

function reset() {
  data = JSON.parse(JSON.stringify(data_init))
  refresh();
}

function flip() {
  if (Math.random() < 0.5) {
    return "H";
  } else {
    return "T";
  }
}
</script>

<br>
<div style="text-align:center">
<button onclick="start()">Run Test</button>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<button onclick="reset()">Reset</button>
</div>
<br>
<table>
<thead>
<tr><th>Pattern</th><th>Trials</th><th>End of Last Sequence</th><th>Average Flips per Trial</th></tr>
<thead>
<tbody>
<tr><td>HTT</td><td id="HTT_exp"></td><td id="HTT_seq"></td><td id="HTT_avg"></td></tr>
<tr><td>HTH</td><td id="HTH_exp"></td><td id="HTH_seq"></td><td id="HTH_avg"></td></tr>
<tbody>
</table>

<br>

<details>
  <summary>
<span style="font-size:24px"><strong>Solution</strong></span>
  </summary>
<br>
If you didn’t figure this one out, you’re in good company. Most people think it should take the same number of tosses to see both patterns, however, as the software simulation above shows, on average, it takes more tosses to see HTH (10) than HTT (8). Here’s why...

Imagine you’re waiting for HTH and you see a head followed by a tail. You’re two thirds of the way there! On the next toss one of two things will happen: 
- It’s a head, in which case you’re done.
- It’s a tail, in which case you have to start all over again.

Now imagine the same scenario when you’re looking for HTT. You see a head followed by a tail, at which point you are, again, one toss away from success. Again, there two possibilities on the next toss:
- It’s a tail, in which case you’re done.
- It’s a head, in which case you **don't have to start all over again**, because you’re already one-third of the way toward a new HTT sequence. 

A failed HTT sequence overlaps with the next potentially valid sequence. This fact gives HTT a small built-in advantage over HTH.

</details>
