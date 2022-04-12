+++
categories = ["Education"]
tags = ["edu"]
title = "Project Lessons"
date = "2022-04-17"
coverImage = "/img/project.jpg"
+++

# Lessons Learned About Effective Team Projects

<!--more-->

## Introduction
We (myself, Ivan Nardini, Saeed Aghabozorgi, and Polong Lin) recently delivered two workshops to enterprise customers, Vodafone and Allegro, featuring a comprehensive data analytics and machine learning demonstration vehicle we call “fraudfinder” (go/fraudfinder). Although the project is still being refined and finalized, I will be less involved going forward so I thought I would take this opportunity to capture some observations about what worked well, and some lessons we learned along the way.

## It All Starts with an Idea
Ivan, one of our Google Cloud CEs, came up with the idea of a financial services application illustrating the power of our latest Vertex AI features. Ivan approached Sara Robinson, who forwarded an invitation to several DAs to see if we might be interested in working with him. I took the opportunity to find out more and met with Ivan. I was impressed by his vision and passion, and we decided to collaborate to turn the vision into useful assets to be leveraged by both the Devrel and CE teams.

> Lesson:  Be open to partnering opportunities, especially with people in different organizations. There’s a lot to be learned and you can usually get more done working with others.

## Make a Plan
I find the best way to get started and to maximize the chance of success is to do something that seems obvious but is often neglected: write a planning doc. Sometimes people feel this step is superfluous because they already know what they’re doing but the devil is in the details. Writing a formal plan forces you to think through several critical considerations:

- What am I making? (one sentence goal)
- Why am I making it? (justification)
- How will it work? (requirements and user experience)
- What will the system look like? (high level architecture)
- What are the major components? (module breakdown)
- What’s an approximate timeline? (schedule)
- How will I know when I’ve succeeded (success criteria/metrics)

Another reason to adopt this level of formality is that a team of people often agree on the above items in principle, but they frequently have a divergent set of details in their heads. Writing things down becomes a forcing function to make sure everyone is on the same page (pun intended). We adopted this approach early on in the fraudfinder project, establishing a common planning document jointly owned by all team members and it paid huge dividends.

People often think such documents are for communicating the project to other people. In fact, the first and most important audience is yourself - writing things down forces you to organize your thoughts and to clarify ambiguity. Whenever I do this, I’m often surprised at how much I hadn’t considered.

> Lesson:  A formal planning document is not a luxury, it’s a critical step to maximize the chance of success and avoid downstream problems.

## Focus on Independent Modules
While designing your project’s high level architecture, try to compose your system using relatively independent software modules. This promotes the most powerful optimization ever, which is parallel processing, because each person on the team can work on a module independently.

The cost of this parallelism is coordination.  Specifically, it’s critically important to identify all the interfaces and specify them as early, clearly, and completely as possible. These interfaces form a contract between modules and, as such, they should be negotiated between producers and consumers. All inter-module interfaces should be specified in the planning document.

Lesson: Prioritize identifying, negotiating, and specifying inter-module interfaces early, to maximize parallel development and minimize downstream churn.

## Diversity Always Helps
Diversity in all respects is crucial to success because it brings different backgrounds, skills, and perspectives to your project. Don’t fall into the trap of working with the same people repeatedly out of convenience or routine. Start your team with module owners who bring unique perspectives to the project.

On fraudfinder, we had people from different cultural backgrounds, different organizations, and different disciplines. We also had people with diverse skill sets, including machine learning, big data, SQL, Python, app deployment, web programming, automation/scripting, and other areas of expertise. This enabled us to assign modules and mentorship roles to the person best suited to the task. Thanks to this diversity, we learned new and useful things from each other and we obtained greater insight into others’ roles within Google.

It’s also important to maintain a good mix of seasoned veterans and junior staff members to promote growth and mentoring, which builds trust and coherence within the team, and helps people with less experience grow their knowledge and skills.

> Lesson:  To optimize results and to maximize inter-team learning and growth, prioritize composing your team with a diverse set of skills, backgrounds, experience levels, and perspectives.

## Delegate Module Ownership
There is often a temptation for the project leader to express opinions on individual module decisions. My advice is to respect the term “module owner”. This person owns, in the fullest sense of the word, everything about their module. Team members should feel free to share ideas, suggestions, feedback on any module, but unless a decision risks harming the overall team goals, the module owner has the final say on what gets implemented and how.
> Lesson: Everyone on the team must respect module ownership. Input and feedback are helpful and encouraged, but the owner decisions about their module.

## Grow Your Team Judiciously
As time goes on, you may discover the need for more modules than originally expected or find that one or more modules should be decomposed into sub-components. That’s a good news/bad news story: your team now has more work to do but you also have an opportunity for more parallelism and more learning. Consider onboarding additional teammates to help with the new modules.

Expand your team carefully. If you grow the team too early or too fast, you may run into a common pitfall: more contributors than modules. This can lead to duplicate effort,  artificial module decompositions, unnecessary interfaces, and confusion at the project level.

> Lesson: To maintain maximum team productivity and focus, grow your team incrementally and thoughtfully. Before adding a new member, make sure you have a well-defined need and a modular component for that person to own.

## Maintain Regular Synchronization
Schedule regular team meetings, at the least frequent interval necessary. Meeting too often will reduce team productivity, but meeting too infrequently will affect project cohesion and stability. Try to find that sweet spot where everyone is staying up to date without consuming too much precious time. For the fraudfinder team, this was once a week for 30 minutes, with topic-based, ad hoc subteam meetings whenever necessary. Your needs may vary, of course, depending on the size and complexity of your project.

Make sure your meetings are as productive and short as possible by focussing on the following elements:

Assign a notetaker at every meeting and rotate this role each time. For fraudfinder, Polong was our chief notetaker. In my next project, I’m going to do a better job on the rotation part.
Add the meeting notes to the end of the planning doc.
First, talk about any issues that are affecting multiple modules.
Second, do a quick around the table soliciting updates from each module owner. These updates should focus on critical issues or questions affecting the owner’s module, or inter-module communication.
It’s fine to share updates about individual progress on a module but sharing such updates via email might be more respectful of peoples’ time.
Be flexible about scheduling ad hoc meetings when significant issues arise (they always do).
> Lesson:  Keep everyone’s eyes on the prize by holding regular team meetings but scheduling them as infrequently and short as possible and prioritize topics affecting multiple modules.

## Get the Most Out of Your Investment
The best chess moves are those that achieve two things with one move. Spend time early in your planning to think about how your team can leverage your work to produce multiple deliverables. For the fraudfinder project, we’re expecting to produce a workshop (already done), an open source repository (nearing completion), a collection of Jupyter notebooks (mostly done), and a series of blog articles.
> Lesson:  Magnify the value of your work by leveraging it as a foundation for multiple deliverables.

## Always Consider Generality
Stay focussed on delivering your commitments as your highest priority, but always keep in mind that your work may solve problems beyond the scope of your specific requirements. Don’t let generalization considerations risk meeting your schedule but if you can solve a problem in a way that might be useful to others, and you can squeeze it in without adding too much risk (or enhance it after finishing your deliverable), consider implementing the more general approach to solve a similar same problem for others.

An example from fraudfinder was some scripting we developed to prepare a highly customized user setup. We’re now rewriting this tool to provide a more general setup toolkit, which should be useful to a wide range of colleagues. Another example is our data generator, which inspired the idea that a general synthetic data source seems like a useful resource, not just for Googlers, but probably for external developers as well. 
> Lesson:  Focus on your requirements but always consider how a generalization of your approach could have wider applicability and solve a broader class or problems.

## Integrate Early and Often
One common pitfall, which we fell into in fraudfinder, is not conducting enough system integration testing. Early and often integration tests can avoid stress, chaos, and last minute design changes. Allocate time in your schedule to verify that your modules work together and prioritize fleshing out inter-module issues as early as possible.

This is easier said than done because modules are often not ready for integration until somewhat late in the development cycle. But this can be mitigated somewhat by planning ahead with mocked interfaces and other techniques to permit assembling modules before they are fully implemented.
> Lesson:  Allocate time in your schedule to integration test your entire system as early and often as possible, ideally once a week. If you don’t have time to do this, it may be a sign that another teammate is warranted to be your integration tester (perhaps not the most glamorous of roles, but worth its weight in gold, if you can get one).

## Test Like a User
Sometimes people test their modules and claim “it works”. But they may be testing using a Google account, with a Google project, perhaps with a beta release of software not yet publicly available. Maybe they’ve manually fixed a number of problems (e.g. IAM permissions), which they haven’t saved in the setup requirements (which is, of course, captured in the planning doc). 

Consequently, when the system is tested with an external identity, we’re often surprised by how many things that “worked on my computer” don't seem to work for an end user. The solution is to obtain external test resources, and use them to verify your work every step of the way.
> Lesson:  Don’t assume your internal environment is a sufficient way to verify a module or the overall system. Test like an end user, early and often.

## Get Feedback From Neophytes
The best way to avoid “the curse of knowledge” is to have people exercise your app, notebook, codelab, or other deliverable and see what sort of problems they run into, mechanical or conceptual. It’s important to have this testing done by someone who isn’t familiar with your work, the domain in which your project functions, or even Google Cloud in general, because you’ll get a perspective on how well your material performs in a self-guided training context.

> Lesson:  Don’t limit your testing to teammates or other colleagues who already know the concepts used in your system. Solicit test feedback from people less familiar with the technical intricacies to understand how real students will experience your work.

## Conclusion
I don’t claim any of these recommendations are revelatory or original. I share them because they all arose in one form or another during our fraudfinder project work and I thought this collection of lessons might be helpful for others, even if it only serves as a reminder of ideas you’ve heard or thought of yourself.

