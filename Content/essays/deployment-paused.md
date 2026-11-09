---
title: Deployment Paused
createdAt: 2026-11-09
lastUpdated: 2026-11-09
tags:
  - software-issues
type: evergreen
published: true
---

### Why My Website Deployment Was Paused on Vercel

My website was temporarily taken offline because Vercel, the platform I use to host and deploy it, flagged my account for exceeding its fair-use limits on its free hosting plan.

To understand what happened, it's helpful to know that hosting a website requires more than just storing its files online. Whenever someone visits a website, the hosting platform does some work behind the scenes to load pages, retrieve information, process requests and deliver content to visitors.

This work uses computing resources, particularly processing power. Vercel provides a certain amount of these resources under its free plan, but it also monitors how heavily those resources are being used.

In my case, Vercel flagged the account's use of something called **Fluid Active CPU**. In simple terms, this measures how much processing work the website's server performs while actively handling requests. It is different from simply counting how many people visit the website or how much data is transferred.

As a result, Vercel temporarily paused deployments under my team account. This meant I could no longer deploy updates to my website during the suspension period.

One important detail is that I had more than one application deployed under the same Vercel team account. This means usage from other projects may also have contributed to the overall resource consumption, although I couldn't conclusively establish how much each project contributed.

The experience highlighted a limitation of relying on a free hosting plan for a business website. While it is convenient and affordable when starting out, the restrictions and resource limits can become a problem as the website and its activities grow.

Ultimately, the issue was not necessarily that the website was poorly built or that it had been hacked. It was a hosting-plan limitation and resource-usage restriction imposed by the platform.

This is one of the reasons I decided to move my online store back to Shopify. I would rather use a platform designed to manage the technical infrastructure of an online store, so I can spend more time running and growing the business instead of constantly managing hosting, deployments and server-related issues.

I also moved this site to netlify since I didn't want it to stay offline for the whole of November. All my other website deployed via vercel have all been put on pause until November 30th.