---
title: "What a website is made of"
description: "Every website is built with three languages working together: HTML for structure, CSS for style, and JavaScript for behavior."
section: "How the Web Works"
createdAt: 2026-11-10
published: true
---

So far, we know that websites are files stored on servers, and that domain names help us find them. But what's actually *inside* those files? What is a website made of?

The answer is simpler than you might think. Almost every website in the world is built using three languages working together.

###  Wait, "languages"?

When we say "language" here, we don't mean English or Igbo. We mean a set of written instructions that a computer understands.

A website is basically a set of instructions for your browser: "Put a heading here. Make it blue. When someone clicks this button, show a message." The browser reads those instructions and builds the page you see.

These instructions are written in three languages:

1. **HTML**
2. **CSS**
3. **JavaScript**

Each has a different job.

###  Picture building a house

Imagine you're building a house from scratch.

**First, the structure.** You lay the foundation, put up the walls, and decide where the rooms, doors, and windows go. At this stage, the house exists, but it's bare: grey blocks and cement.

**Next, the finishing.** You paint the walls, lay the tiles, hang the curtains, and bring in the furniture. Same house, but now it looks good.

**Finally, the wiring and plumbing.** You install switches that turn on lights, taps that run water, and a doorbell that rings when pressed. Now the house doesn't just look good; it *does* things.

A website is built the same way:

| Building a house | Building a website | Language |
|---|---|---|
| Structure: walls, rooms, doors | What's on the page: headings, paragraphs, images, buttons | **HTML** |
| Finishing: paint, tiles, furniture | How it looks: colors, fonts, spacing, layout | **CSS** |
| Wiring: switches, taps, doorbell | What happens when you interact: menus opening, forms checking your details, sliders moving | **JavaScript** |

###  HTML: the structure

HTML tells the browser **what each thing is**. "This is a heading. This is a paragraph. This is an image. This is a link."

Without HTML, there's no website at all, just like there's no house without walls.

Here's a small taste of what HTML looks like. Don't worry about understanding it yet; that's what the next track is for:

    <h1>Welcome to my shop</h1>
    <p>We sell notebooks and planners.</p>

A page built with only HTML works, but it looks plain: black text on a white background, everything stacked from top to bottom.

###  CSS: the style

CSS tells the browser **how things should look**. Colors, font sizes, spacing, where things sit on the page, how the page rearranges itself on a phone versus a laptop.

Here's a taste:

    h1 {
      color: purple;
      font-size: 40px;
    }

That says: "Make every main heading purple and large."

Two websites can have the exact same HTML but look completely different, because of their CSS. Just like two houses with the same floor plan can look nothing alike inside.

###  JavaScript: the behavior

JavaScript tells the browser **what to do when something happens**. When you click, type, scroll, or tap.

Some things JavaScript makes possible:

- A menu that slides open when you tap the ☰ icon on a phone
- A form that warns you "Please enter a valid email" before you submit
- Photos that slide one after the other on a shop's homepage
- A cart that updates the total when you add an item

Not every website needs JavaScript. A simple page with information and pictures can work perfectly with just HTML and CSS. But anything interactive usually needs it.

###  What else lives in a website's files?

Besides the three languages, a website's folder usually contains:

- **Images:** photos, logos, icons
- **Fonts:** custom lettering styles
- **Videos or documents:** anything the site lets you view or download

When you visit a site, the server sends all these files to your browser, and the browser assembles them into one page.

###  Seeing it for yourself

You can look at the instructions behind any website right now:

- **On a laptop:** Open any website in Chrome, right-click on an empty part of the page, and choose **View Page Source**. A new tab opens full of text and symbols. That's the HTML (with some CSS and JavaScript mixed in).
- **On a phone:** This is harder to do, so use a laptop if you can.

It will look confusing at first. That's normal. By the end of this class, you'll recognize much of what you see there.


###  Activity

1. Open a website you like (a shop, a news site, a brand you follow).
2. Find and write down:
   - **Two examples of HTML** (things that are on the page: a heading, an image, a button, a paragraph).
   - **Two examples of CSS** (how something looks: a color, a font style, how items are arranged).
   - **One example of JavaScript** (something that reacts when you interact: a menu opening, a slider moving, a pop-up appearing).
3. If you have a laptop, try **View Page Source** on that same site. Scroll through and see if you can spot any of the text you saw on the page.