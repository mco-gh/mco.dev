+++
categories = ["Puzzles"]
tags = ["puzzle", "OGT"]
date = "2025-05-24"
title = "100 Prisoners Puzzle"
coverImage = "/img/prisoners.jpg"
+++

Today's *One Great Thing* is a neat puzzle that falls into one of my favorite categories: on first hearing this your reaction will likely be "that's impossible". But, of course, there is a solution. You just have to think about it in the right way.

<!--more-->

In case of emergency, you can click the "Click here to reveal solution" text below, but I highly recommend resisting that temptation. You'll get a lot more out of the puzzle if you solve it yourself.

One more thing: this is the kind of solution that requires an "a-ha" moment, the kind of idea that often pops into my head in the shower, for some reason, or some other environment in which I'm not actively trying to solve the problem. So if you get stuck, take a break and let your subconscious mind work on it for a while.

Here's the puzzle:
<br>
> 100 prisoners are imprisoned in solitary cells. Each cell is windowless and soundproof. There's a central living room with one light bulb; the bulb is initially off. No prisoner can see the light bulb from his or her own cell. Each day, the warden picks a prisoner equally at random, and that prisoner visits the central living room; at the end of the day the prisoner is returned to his cell. While in the living room, the prisoner can toggle the bulb on and off if he or she wishes. Also, the prisoner has the option of asserting the claim that all 100 prisoners have been to the living room. If this assertion is false (that is, some prisoners still haven't been to the living room), all 100 prisoners will be shot for their stupidity. However, if it is indeed true, all prisoners are set free and inducted into MENSA, since the world can always use more smart people. Thus, the assertion should only be made if the prisoner is 100% certain of its validity.

> Before this whole procedure begins, the prisoners are allowed to get together in the courtyard to discuss a plan. What is the optimal plan they can agree on, so that eventually, someone will make a correct assertion?

<br>

<details>
  <summary>Click here to reveal the solution.</summary>

In order to solve this problem, you need a way to count, which is impossible to do in any shared way because the prisoners cannot communicate, so the key is to designate one prisoner as the counter. Let's call him/her Prisoner one (P1). Here's the algorithm:


1. P1 starts the count at zero.
2. Imagine some prisoner other than P1 is selected on a given day. We'll call this person Px.

    - If this is Px's first time in the living room, they turn the lamp on to signal that a first time visitor has arrived. If the lamp is already on when Px arrives, that means someone new arrived before them so Px leaves the lamp alone.
    - If Px has previously been to the living room, they leave the lamp alone.
3. If P1 (the counter) is selected, then:
    - If the lamp is on it means a new first time visitor has arrived so P1 increments the count and turns the lamp off to restart the process for the next new visitor.
    - If the lamp is off, there's been no new visitor to count so P1 leaves the lamp alone, doesn't increment the count, and exits the living room.
4. Eventually, P1's count will reach 99, at which point P1 can confidently claim all 100 prisoners (99 counted first time visitors plus P1 him/herself) have visited the living room!
</details>
