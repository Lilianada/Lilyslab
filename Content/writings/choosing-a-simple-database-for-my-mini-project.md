---
title: Choosing a Simple Database for my Mini Project
createdAt: 2025-05-29
lastUpdated: 2025-06-20
type: evergreen
published: true
tags:
  - web-projects
---

I have been building mini projects, love this for me. But I had a particular issue..."storage". I wanted *storage* without *authentication* and I didn't want to have to use Firebase. The process to initialize and implement is painful for something I've been using for years. I wanted something fast, that would make migration to another platform easy.

I also wanted to be able to share this mini project of mine with the world but also make sure that only I had access to add and edit content so while going through a ton of blogs and personal websites I found how others did theirs. One of the many things I found was utilizing *Github pages* and then deploy to a *custom domain*. I'll try that with [clusters.lilyslab.xyz](https://clusters.lilyslab.xyz).

---

#### Copilot said to do the following:

- Push your app to GitHub.
- Enable GitHub Pages in repo settings.
- Add a CNAME file with your custom domain.
- Set your DNS to point the subdomain to GitHub Pages.
- For app storage, use browser storage or external services.

I'll implement this and see how it goes.

**Updates**

It won't work 😭😭😭 because I want to save new files directly to GitHub Pages from my app’s frontend.

---

#### Obsidian
This won't work either. I can only update from my code editor or directly from obsidian app.

---

#### Notion
This is the only one that might work.
Using **Notion as a database** for my app is a good option for simple, low-traffic projects or personal tools! 

**How It Works**
- **Frontend:** Host my static app on custom domain using vercel.
- **Database:** Use a Notion database (table) to store links, image URLs, color codes, etc.
- **Integration:** My app communicates with Notion via the [Notion API](https://developers.notion.com/).

 **Steps to Set Up**
1. **Create a Notion Database**
- In Notion, create a new database (table) with columns for:
  - Link
  - Image URL
  - Color Code
  - Any other fields you want

2. **Get Notion API Access**
- Go to [Notion Developers](https://www.notion.so/my-integrations) and create a new integration.
- Give it read/write access.
- Share your database with this integration (use the “Share” button in Notion and add your integration).

3. **Get Your API Key and Database ID**
- Copy the integration’s “Internal Integration Token.”
- Copy the Database ID from the Notion URL.

4. **Connect Your App to Notion**
- Use [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js) or call the Notion API directly with `fetch`.
- **You can’t store your Notion token in the frontend.**  
  - Exposing your Notion API token publicly is unsafe.
  - You need a backend (you can use a simple serverless function, e.g., Vercel/Netlify Functions, or a lightweight Express server) to proxy requests securely.

5. **App Flow Example**
- User adds a new link/image/color.
- Frontend sends this data to my serverless backend.
- Backend authenticates with the Notion API and adds a row to my Notion database.
- To display links/images/colors, frontend fetches data from your backend, which reads from Notion.

---


#### TL;DR

→ **Host my frontend on my custom domain.** \
→ **Store content in Notion via the Notion API.** \
→ **Use a backend proxy (serverless function) to keep your Notion token safe.** \
→ **Frontend interacts with backend, backend interacts with Notion.** 


*I'll try this and see how it goes, if I don't encounter any issues then I might migrate from Firebase to notion with this app*