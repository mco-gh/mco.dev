+++
categories = ["Education"]
tags = ["ai"]
title = "Machine Learning Explained in Three Easy Steps"
date = "2024-11-02"
coverImage = "/img/whatisml.png"
+++

You've probably heard the term "machine learning" and how it's changing everything.
In this article, I'm going to explain the fundamental concept behind machine learning.

<!--more-->


There will be no math or programming. There will be no scary diagrams. You won't need a background in computer science or engineering. All you need is the ability to read and think, which you obviously already have if you've made it this far. 

### Foxes and Dogs

There's a cute sentence that is famous for containing every letter in the English language in one short sentence. Have you seen it?

> The quick brown fox jumps over the lazy dog.

I'm going to slightly perturb this sentence and I'd like you to read it to yourself, out loud:

> The brown quick fox jumps over the lazy dog.

You probably noticed a small change. If you're a native English speaker, chances are the part that I altered stood out like a sore thumb. Do you know why "brown quick fox" sounds wrong?

I once presented this example to a room of 200 people and nearly everyone knew it sounded wrong but only one person had any idea why. The reason you don't like the sound of that phrase is because there are a very distinct set of rules governing the sequence of adjective types in English. To be more precise, adjectives must be arranged in the following order:

<br>

1. Quantity or number
1. Quality or opinion
1. Size
1. Age
1. Shape
1. Color
1. Proper adjective (often nationality, other place of origin, or material)
1. Purpose or qualifier
 
Since quick is a quality/opinion and brown is a color, "quick brown" is the proper order, not "brown quick". To give an extreme example, this is fine: "one big old antique American car" but perturb that sequence of adjectives in any way you like and the results sound very wrong.

The amazing thing about this sequence is that nearly every native English speaker "knows" it, but **very few people know they know it**. In my audience of 200 professional CS and IT people, not a single person could tell me this sequence. Nearly every native English speaker knows it in a deeper sense, without being consciously aware of those rules.

How did you come to know things that you don't even know you know? You've been exposed to so many examples of properly and improperly formulated English phrases, along with feedback, that you've developed a finely tuned adjective order detector in your brain.

**Observation one:** Thanks to repetition of examples, you know some things (actually lots of things) you didn't even know you know.

### My Friend Hal

I have a friend named Hal. Hal grew up in a non-English speaking household and, at the ripe old age of 30, Hal begins studying English. Hal asks me about this phrase, why "quick brown fox" is fine but "brown quick fox" is incorrect. I do some research and I share with Hal the adjective ordering list above. Hal studies the list exhaustively and whenever he's about to utter a phrase, he mentally checks his formulation against the list.

This works ok but there are several problems:

<br>

- It's tedious and time consuming to consciously check every sentence. Native English speakers do this automatically, subconsciously, and effortlessly.
- Manual checking is highly error prone and subjective (for example, is "amorphous" a quality or a shape?)
- After doing all this work, Hal is able to (badly) solve just one problem from an enormous set of challenges.

**Observation two:** You can compensate for the lack of an automatic detection mechanism by internalizing a set of rules (a computer scientist would call this an algorithm) but the rule-based engine is likely to be less efficient, less accurate, and slower than the experience-based engine.

### How Babies Learn

The difference between the two examples above is basically the difference between how a baby acquires language and how an adult acquires language. A baby learns a language by listening to millions of examples, over and over, for many years, most of which come from their personal language tutor (which is why your native language is called your "mother tongue").

At some point, babies learn to make their own sounds, begin to formulate their own sentences, and they receive feedback from their environment about the correctness of such attempts. Without even thinking about it, they build an efficient neural network in their brain that automatically recognizes correct linguistic constructs, like the proper order of adjectives.

An adult learner, on the other hand, doesn't have the luxury of spending 18 years building a finely tuned pattern matching engine and probably doesn't have a full-time dedicated language teacher. So the best way for an adult to quickly acquire language skills is to try to boil the language down to a set of algorithmic rules they can apply through conscious thought, usually with less satisfying results.

This explains why, sadly, after several years of study and pratice, I speak French worse than the average four year old in Paris. 

**Observation three:**  Experience based learning leads to entities that "know" things more deeply, and more intutively than rule based learning.

### So, what is machine learning? 

Rather than trying to encode a definitive set of rules, which is the method used by previous generations of artificial intelligence research (and which largely failed), machine learning is the process of training a computer to learn something the same way a child acquires language, by repeated exposure to examples and experience, and fine tuning their understanding based on direct feedback.

In so doing, we've enabled a new generation of software capable of doing some amazing things, like <a target="_blank" href="https://www.nytimes.com/2016/12/14/magazine/the-great-ai-awakening.html">language translation</a>, <a target="_blank" href="https://www.youtube.com/watch?v=gg7WjuFs8F4">protein folding</a>, <a target="_blank" href="https://news.harvard.edu/gazette/story/2024/09/new-ai-tool-can-diagnose-cancer-guide-treatment-predict-patient-survival/">cancer detection</a>, beating humans at <a target="_blank" href="https://www.youtube.com/watch?v=WXuK6gekU1Y">Go</a>, and, of course, the large language models we now use every day.

That, in a nutshell is what machine learning is all about and why people are so excited about its potential. In a future article, I'll explain a concrete example of a simple machine learning application, to help you understand some of the mechanics behind applying this technology to a real world problem.

Enjoyed this artice? You might be interested in my new **Intro to AI** course, which you can read about <a target="_blank" href="https://mco.dev/courses">here</a>.
