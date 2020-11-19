+++
categories = ["Newsletter"]
tags = ["nothing"]
title = "The Big Crash"
date = "2020-11-19"
coverImage = "/img/crash.jpg"
+++

Can you imagine the sort of worldwide panic that would ensue if everyone's smart phone suddenly stopped working? Something analogous happened thirty years ago when, on January 15, 1990, the entire US long-distance telephone network crashed for nine hours.

<!--more-->

> This was a strange, dire, huge event. During the nine long hours of frantic effort that it took to restore service, some seventy million telephone calls went uncompleted.

I was working at Bell Labs at the time, which was a subsidiary of AT&T. Limited and isoated failures, akin to modern outages in your ISP's internet service, were relatively common in those days, however, this sort of ubiquitous and sustained service breakdown taking out the entire network was unprecedented.

> Bell Labs engineers, working feverishly in New Jersey, Illinois, and Ohio, first tried their entire repertoire of standard network remedies on the malfunctioning System 7. None of the remedies worked, of course, because nothing like this had ever happened to any phone system before.

Perhaps the most interesting aspect of the story: the crash of Janurary 15, which happened to be Martin Luther King Day, was not caused by Russian agents, cybercriminals, or hackers. **The entire calamity was caused by one line of errant code, written by one very unlucky programmer.**

> As it happened, the problem itself -- the problem per se -- took this form. A piece of telco software had been written in C language, a standard language of the telco field. Within the C software was a long "do... while" construct. The "do... while" construct contained a "switch" statement. The "switch" statement contained an "if" clause. The "if" clause contained a "break." The "break" was supposed to "break" the "if clause." Instead, the "break" broke the "switch" statement.

Read the whole amazing story in the article linked below.

<br>

<blockquote class="quoteback" darkmode="" data-title="PART%20ONE%3A%20Crashing%20the%20System%20" data-author="" cite="http://www.mit.edu/hacker/part1.html">
                      On January 15, 1990, AT&amp;T's long-distance 
telephone switching system crashed.
                      <footer> <cite><a href="http://www.mit.edu/hacker/part1.html">http://www.mit.edu/hacker/part1.html</a></cite></footer>
                      </blockquote>
                      <script note="" src="https://cdn.jsdelivr.net/gh/Blogger-Peer-Review/quotebacks@1/quoteback.js"></script>

