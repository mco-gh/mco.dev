+++
description = "A six-week, hands-on course: go from an idea to a working web app you can share, with AI agents doing the heavy lifting."
title = "Build an App with AI"
url = "/build-an-app"
comments = false
showMeta = false
showActions = false
price = "$200 · €200 · £200"   # shown in the dates list; Stripe charges the buyer's local one

# Published at /build-an-app but unlisted: kept out of the home page, tag and
# archive lists, the RSS feed and the sitemap. Only people with the link find it.
[build]
  list = "never"

# Upcoming offerings, listed by the "Upcoming dates" button in the banner.
# One block per course run, in date order.
#   start    – first lesson date (YYYY-MM-DD); the last lesson is shown 5 weeks later
#   schedule – day, time and time zone of the weekly lesson
#   link     – the Stripe Payment Link for this run (https://book.stripe.com/...)
#   status   – "open", "full" (shows "Full", no button) or "soon" (shows "Coming soon")
[[offerings]]
  start = "2027-02-01"
  schedule = "Mondays, 7–9pm UK time"
  link = "https://book.stripe.com/aFa14n5Xa9f5gt99jNf3a00"
  status = "open"
[[offerings]]
  start = "2027-03-15"
  schedule = "Mondays, 7–9pm UK time"
  link = "https://book.stripe.com/fZubJ14T64YP5OvfIbf3a01"
  status = "open"
+++

<style>
/* The theme sets 1rem = 10px. */
.bab { --blue:#349ef3; --violet:#7c5cff; --pink:#e84c8a; --orange:#f59e0b; --green:#10b981; --teal:#06b6d4; --ink:#2f3a44; --muted:#6b7780; --line:#e3e7ea; }
.bab-hero { margin: 0 0 4rem; padding: 4.8rem 3.6rem; border-radius: 22px; color: #fff; background: linear-gradient(125deg, #349ef3 0%, #7c5cff 55%, #e84c8a 100%); box-shadow: 0 10px 30px rgba(124,92,255,.25); }
.post .post-content .bab-hero h2 { margin: 0 0 1.2rem; color: #fff; font-size: 4rem; line-height: 1.15; letter-spacing: -.02em; }
.post .post-content .bab-hero p { margin: 0 0 2.4rem; font-size: 2rem; line-height: 1.55; color: rgba(255,255,255,.95); max-width: 56rem; }
.post .post-content .bab-pills { display: flex; flex-wrap: wrap; gap: .8rem; margin: 2.4rem 0 2.8rem; padding: 0; list-style: none; }
.post .post-content .bab-pills li { margin: 0; padding: .5rem 1.4rem; border-radius: 999px; background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.35); font-size: 1.5rem; font-weight: 600; }
.bab a.bab-btn, .bab a.bab-btn:visited { display: inline-flex; align-items: center; min-height: 44px; padding: 1rem 2.4rem; line-height: 1.3; border-radius: 10px; background: #fff; color: #5b3fe0; font-family: "Open Sans", sans-serif; font-size: 1.6rem; font-weight: 700; text-decoration: none; }
.bab a.bab-btn:hover { background: #f1edff; text-decoration: none; }

/* Upcoming dates: a <details> whose summary is the banner button; the list opens inside the banner. */
.bab-cal > summary { list-style: none; cursor: pointer; }
.bab-cal > summary::-webkit-details-marker { display: none; }
.bab .bab-cal > summary.bab-btn { display: inline-flex; align-items: center; gap: .6rem; min-height: 44px; padding: 1rem 2.4rem; line-height: 1.3; border-radius: 10px; background: #fff; color: #5b3fe0; font-family: "Open Sans", sans-serif; font-size: 1.6rem; font-weight: 700; }
.bab .bab-cal > summary.bab-btn:hover { background: #f1edff; }
.bab .bab-cal > summary.bab-btn::after { content: "▾"; margin-left: .8rem; transition: transform .2s; }
.bab .bab-cal[open] > summary.bab-btn::after { transform: rotate(180deg); }
.bab-cal-panel { margin-top: 1.6rem; padding: .8rem 2rem 1.6rem; border-radius: 14px; background: #fff; color: var(--ink); box-shadow: 0 6px 20px rgba(40,20,120,.18); }
.post .post-content .bab-cal-list { list-style: none; margin: 0; padding: 0; }
.post .post-content .bab-cal-row { display: flex; align-items: center; gap: 1.6rem; margin: 0; padding: 1.4rem 0; border-bottom: 1px solid var(--line); }
.bab-cal-date { flex: none; width: 5.6rem; border-radius: 10px; overflow: hidden; text-align: center; border: 1px solid var(--line); font-family: "Open Sans", sans-serif; }
.bab-cal-date span { display: block; padding: .2rem 0; background: var(--pink); color: #fff; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
.bab-cal-date b { display: block; padding: .3rem 0 .4rem; font-size: 2.2rem; color: var(--ink); line-height: 1.2; }
.bab-cal-info { flex: 1; min-width: 0; }
.bab-cal-info strong { display: block; font-size: 1.6rem; }
.bab-cal-info span { display: block; font-size: 1.4rem; color: var(--muted); }
.bab-cal-sample { display: inline-block; margin-top: .3rem; padding: 0 .8rem; border-radius: 999px; background: #fff3d6; color: #9a6400; font-size: 1.2rem; font-style: normal; font-weight: 700; }
.bab a.bab-cal-btn, .bab a.bab-cal-btn:visited { flex: none; display: inline-flex; align-items: center; min-height: 44px; padding: 0 1.8rem; border-radius: 10px; background: #7c5cff; color: #fff; font-family: "Open Sans", sans-serif; font-size: 1.5rem; font-weight: 700; text-decoration: none; white-space: nowrap; }
.bab a.bab-cal-btn:hover { background: #5b3fe0; color: #fff; text-decoration: none; }
.bab-cal-tag { flex: none; padding: .6rem 1.4rem; border-radius: 10px; background: #eef1f4; color: var(--muted); font-family: "Open Sans", sans-serif; font-size: 1.4rem; font-weight: 700; }
.post .post-content .bab-hero p.bab-cal-foot, .post .post-content .bab-hero p.bab-cal-empty { margin: 1.4rem 0 0; font-size: 1.4rem; line-height: 1.5; color: var(--muted); max-width: none; }
.post .post-content .bab-cal-foot a { color: #5b3fe0; }
@media (max-width: 560px) { .post .post-content .bab-cal-row { flex-wrap: wrap; } .bab a.bab-cal-btn, .bab-cal-tag { margin-left: 7.2rem; } .bab-cal-panel { padding: .4rem 1.4rem 1.4rem; } }

.bab-three { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); gap: 1.6rem; margin: 2.4rem 0 4rem; }
.bab-tile { padding: 2.2rem 2.2rem 2rem; border-radius: 16px; border-top: 5px solid var(--c); background: color-mix(in srgb, var(--c) 7%, #fff); }
.post .post-content .bab-tile h3 { margin: 0 0 .8rem; font-size: 1.9rem; color: var(--ink); }
.post .post-content .bab-tile p { margin: 0; font-size: 1.5rem; line-height: 1.6; color: var(--muted); }
.bab-tile .bab-icon { font-size: 2.8rem; line-height: 1; margin-bottom: 1rem; }

.bab-weeks { list-style: none; margin: 2.4rem 0 4rem; padding: 0; counter-reset: wk; }
.post .post-content .bab-weeks > li { position: relative; margin: 0 0 1.4rem; padding: 1.8rem 2.2rem 1.8rem 8.4rem; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.bab-weeks > li::before { counter-increment: wk; content: counter(wk); position: absolute; left: 2rem; top: 1.8rem; width: 4.4rem; height: 4.4rem; border-radius: 50%; display: grid; place-items: center; background: var(--c); color: #fff; font-family: "Open Sans", sans-serif; font-size: 2rem; font-weight: 700; }
.bab-weeks strong { display: block; font-size: 1.8rem; color: var(--ink); }
.bab-weeks span { display: block; margin-top: .3rem; font-size: 1.5rem; line-height: 1.55; color: var(--muted); }

.bab-new { margin: 2.4rem 0 4rem; padding: 2.6rem 2.8rem; border-radius: 16px; background: #fff8eb; border-left: 5px solid var(--orange); }
.post .post-content .bab-new ul { margin: 1rem 0 0; }
.post .post-content .bab-new li { margin: .6rem 0; }

.bab-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: 1.2rem; margin: 2.4rem 0 4rem; }
.bab-fact { padding: 1.8rem; border-radius: 14px; text-align: center; background: color-mix(in srgb, var(--c) 10%, #fff); }
.bab-fact b { display: block; font-family: "Open Sans", sans-serif; font-size: 2.6rem; color: var(--c); line-height: 1.2; }
.bab-fact small { font-size: 1.4rem; color: var(--muted); }

.bab-me { display: flex; gap: 2.4rem; align-items: center; margin: 2.4rem 0 4rem; padding: 2.4rem; border-radius: 16px; background: #f4f8fb; }
.bab-me img { flex: none; width: 11rem; height: 11rem; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 4px 14px rgba(0,0,0,.1); margin: 0 !important; }
.post .post-content .bab-me p { margin: 0; font-size: 1.6rem; line-height: 1.65; }
@media (max-width: 560px) { .bab-hero { padding: 3.2rem 2.2rem; } .post .post-content .bab-hero h2 { font-size: 3rem; } .bab-me { flex-direction: column; text-align: center; } .post .post-content .bab-weeks > li { padding-left: 7.4rem; } }


.bab-cta { margin: 4rem 0 2rem; padding: 3.2rem; border-radius: 18px; text-align: center; background: linear-gradient(125deg, #e8f3fe, #f1edff 60%, #fde8f1); }
.post .post-content .bab-cta p { margin: 0 0 2rem; font-size: 1.8rem; color: var(--ink); }
.bab-cta a.bab-btn, .bab-cta a.bab-btn:visited { background: #7c5cff; color: #fff; }
.bab-cta a.bab-btn:hover { background: #5b3fe0; color: #fff; }
</style>

<div class="bab">

<div class="bab-hero">
  <h2>Leverage the power of AI</h2>
  <p>You have an idea for an app. You'll learn how to build a working app, live on the web, with a link you can send to anyone. No programming experience needed.</p>
  <ul class="bab-pills">
    <li>6 weeks x 2 hours</li>
    <li>Live online</li>
    <li>Beginner friendly</li>
  </ul>
  <details class="bab-cal" id="dates">
    <summary class="bab-btn">📅 Upcoming dates &amp; sign up</summary>
    {{< offerings >}}
  </details>
</div>

## Apps I've built this way

Every one of these free apps was built with AI tools, using the same approach you'll learn in the course. Each one runs in your browser, so tap a card to try it.

{{< apps-carousel >}}

## Why now?

Not long ago, building an app meant months of learning to code first. That's changed. Today's AI agents can plan a project, write the code, fix their own mistakes and put the result online, as long as someone gives them a clear idea and good direction. **That someone is you.** This course teaches you how to be a good director: how to install and use the latest AI tools, describe what you want to build, check what the AI built, and steer it toward what you had in mind.

<div class="bab-three">
  <div class="bab-tile" style="--c:var(--blue)">
    <div class="bab-icon">🌐</div>
    <h3>Understand the web</h3>
    <p>Learn how web pages and web apps actually work: front end, back end and how they talk to each other.</p>
  </div>
  <div class="bab-tile" style="--c:var(--violet)">
    <div class="bab-icon">🤖</div>
    <h3>Work with AI agents</h3>
    <p>Use AI to plan, write, test, debug and explain code, and learn which tasks it's good at and where it needs you.</p>
  </div>
  <div class="bab-tile" style="--c:var(--pink)">
    <div class="bab-icon">🚀</div>
    <h3>Ship your own app</h3>
    <p>Plan, build and deploy a working prototype of <em>your</em> idea, then show it to the class.</p>
  </div>
</div>

## The six weeks

Each lesson has a short talk, a live demo and time to work on your own project, with a little homework between sessions to keep things moving.

<ol class="bab-weeks">
  <li style="--c:var(--blue)"><strong>Build your first web page</strong><span>How the web works. You'll make a page of your own and put it online in the first session.</span></li>
  <li style="--c:var(--teal)"><strong>From web pages to web apps</strong><span>The building blocks of a web app: front end, back end and when you need each one.</span></li>
  <li style="--c:var(--violet)"><strong>Plan and start your app</strong><span>Choosing AI tools, writing good prompts, and turning your idea into a project plan the AI can follow.</span></li>
  <li style="--c:var(--pink)"><strong>Develop your app</strong><span>A practical workflow for building with AI, adding a back end, and saving your work safely on GitHub.</span></li>
  <li style="--c:var(--orange)"><strong>Deploy your app</strong><span>Put your app on the web for real, and learn how to keep hosting and AI costs under control.</span></li>
  <li style="--c:var(--green)"><strong>Show and tell</strong><span>Testing, debugging and next steps. Then everyone demos what they built.</span></li>
</ol>

## Is this course for you?

It's for anyone who's curious and has an idea they'd like to build: a tool for a hobby, a game, something for a club or small business, or just an experiment. **You don't need any math, programming or technical background.**

To be clear about what it isn't: this isn't a programming course, and you won't come out of it a professional developer. Real production apps take teams of people and years of experience. You'll build a real, working *prototype*, and you'll understand enough to keep going.

<div class="bab-facts">
  <div class="bab-fact" style="--c:var(--blue)"><b>6</b><small>weekly lessons</small></div>
  <div class="bab-fact" style="--c:var(--violet)"><b>2 hours</b><small>live online lesson</small></div>
  <div class="bab-fact" style="--c:var(--pink)"><b>~2 hrs</b><small>project time per week</small></div>
  <div class="bab-fact" style="--c:var(--green)"><b style="font-size:2rem">$200 · €200 · £200</b><small>in your currency · concessions available</small></div>
</div>

## Your teacher

<div class="bab-me">
  <img src="/img/mco.png" alt="Marc Cohen">
  <p>I'm Marc Cohen, an American software engineer based in London. I've spent over 40 years as a developer and engineering manager at Bell Labs, Lucent and Google, and I now build tools, tutorials and courses that make computing more accessible to everyone. I built the <a href="/apps">free apps on this site</a> with the same AI tools and techniques you'll learn in this course.</p>
</div>

<div class="bab-cta">
  <p><strong>Ready to build your app?</strong><br>Pick a start date that suits you and book your place.</p>
  <a class="bab-btn" href="#dates" onclick="document.getElementById('dates').open = true">📅 See upcoming dates</a>
</div>

</div>
