+++
images = []
banner = ""
menu = ""
description = ""
categories = []
image = "birthday.jpg"
tags = ["puzzles"]
date = "2011-01-01"
title = "The Konigsberg Bridge Problem"
+++
I first read about today’s puzzle as a young boy and it’s stayed with me all these years later. In Germany, there was a city named Königsberg (it’s now a Russian city called Kaliningrad), which is set on a river. Situated in this river are two islands, which are connected to the river banks and to each other by a series of seven bridges, as illustrated in the image on the right.

Here’s the challenge: starting anywhere you like, can you traverse all seven bridges once and only once? According to the book I read as a child, this challenge was a popular pastime in the 1700s – on Sundays, the families of Königsberg would set out on a leisurely promenade in an attempt to traverse all seven bridges once. Did anyone succeed? Can you find a non-overlapping route across all seven bridges? I’ll be very impressed if you can. Check back tomorrow for the solution.

Solution: Hats off to Muzaffer, Simon and Al for finding the answer. Al gets the creativity prize for coming up with a solution involving swimming. :)

If you tried to solve this problem by looking for a route across all seven bridges, I’m betting you got pretty frustrated, as I did when I first tried to solve it. No matter where you start or how many different paths you try, you always seem to end up needing to cross a bridge twice. After a while, you begin to suspect there might not be any solution. In mathematics and computer science, we often find problems, like this one, which we suspect may not have a solution. But it’s not enough to suspect there is no solution – it could be that one exists and we just haven’t found it yet. In order to be sure, we need to prove there is or is not a solution. That’s exactly what we’re going to do now.

The first step is to redraw the map to simplify the problem. Notice that we effectively have four land masses (A, B, C and D in the diagram above) and seven bridges. If we collapse the land masses into single points (we’ll call these nodes) and represent the bridges as lines between our points (we’ll call these arcs), we get the picture on the right. Using this diagram, which, in mathematical terms is called a graph, we can restate our challenge like this: starting at any of the four nodes A, B, C or D, find a path through the graph such that you travel across each arc exactly once.

Before we go on, we need to understand something about the nodes in this, and any, graph: if a node has an even number of arcs, then if you start at that node (and you traverse each arc exactly once), then you must also end your route at that same node. On the other hand, if a node has an odd number of arcs, then if you start at that node (and you traverse each arc exactly once) then you must end your route at some other node.

Armed with that knowledge, let’s imagine you start your stroll at node A. In order to cross one or more bridges, you’re going to have to move to some other node so let’s assume you then move to node C. Notice that node C has five arcs, however, you’ve already used one of them (you might think about this as literally “burning your bridges” every time you cross an arc), so it’s as if you’re now starting at a node with an even number of arcs. We know from the previous paragraph that means your route must end at node C. Where to next?

Let’s say you then move to node B, which also has an odd number of arcs. Again you’ve used up one arc and you’re left with an even number of arcs at node B, which implies your route must end at node B. But we’ve just established that your route must end at node C so we have a contradiction, Thus, given your starting path (A->C->B), no route meeting the required conditions is possible.

How can we generalize this conclusion to apply to all possible routes? Notice that all four nodes have an odd number of arcs. Therefore, it doesn’t really matter where you start – the second node you visit is going to have an even number of arcs left after you arrive there and, therefore, we must end our route on that second node. But the same thing will be true of the third node we visit. So, regardless of the path we take through our first three nodes, we’re going to conclude that our path must end at our second AND third nodes. No route could end in two places so we’ve effectively proven, by contradiction, that no possible route can be found which satisfies our conditions.

This problem was originally solved by the great mathematician Leonhard Euler and spawned an entire branch of mathematics called Graph Theory. You can read more about the Bridges of Konigsberg here. According to this article, two of the bridges were destroyed during WWI and three were rebuilt. Thus, there are now five bridges of Konigsberg, now Kaliningrad, two of which date back to Euler’s time.
