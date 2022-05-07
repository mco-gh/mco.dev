+++
categories = ["Puzzles"]
tags = []
date = "2022-05-07"
title = "Card Detective"
coverImage = "/img/cards.jpg"
+++

You and two of your friends (not facebook friends, real world friends, remember those?) are playing a game. The other players in the game are known to be perfectly logical people.

<!--more-->

The dealer (not one of the three players) holds three cards, which may contain any number of aces (0, 1, 2 or 3). Each player is dealt one card face down, and asked to hold their card up against their forehead, value facing out, without looking at it. At this point, none of the players know which card they hold but can see the other two players’ cards. 

The dealer asks you to raise your hand if you see one or more Aces. You look around and notice that both of your opponsents are showing Aces so, of course, you raise your hand. The other two players also have their hands in the air. 

Next, the dealer says: "If you know whether your own card is an Ace or not, lower your hand". A few long minutes go by, as all three players ponder this question. After some time, all three hands remain in the air.

**Given everything I’ve told you, can you determine whether you have an Ace or not?**

<details>
<summary>Click here for a hint.</summary>
The solution to this puzzle involves indirect thinking, in the sense that it requires you to reach a conclusion based on other people’s inability to reach a conclusion. 
</details>
<br>
<details>
<summary>Click here for the solution.</summary>
Let’s call the three players A (that's you), B, and C. Player B’s hand is in the air because he sees at least one ace – player C’s card. Now let’s imagine that you hold some card other an ace. Player B will reason as follows:

Player C’s hand is in the air so she sees an ace but it can’t be A’s card because I (player B) can see that player A’s card is not an ace. Therefore, player C must be looking at my ace.

Player C can make a symmetric argument (if A doesn’t have an ace, then B must be looking at my ace). Thus, if you don’t hold an ace, with a moment of thought it will be obvious to hyper-logical players B and C that they hold aces and their hands will go down in short order. The fact that they don’t reach that conclusion, after some time, suggests that you must be holding an ace.
</details>
