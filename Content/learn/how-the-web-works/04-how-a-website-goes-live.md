---
title: "How a website goes live"
description: "To make a website available to anyone, its files need to be stored on a server that's always on. This is called hosting."
section: "How the Web Works"
createdAt: 2026-11-10
published: true
---

You can build a beautiful website on your laptop, but right now, only you can see it. If you send someone the file, they'd have to download it and open it on their own device. That's not a website people can visit. So how does a website go from your laptop to being available to anyone, anywhere, at any time?

This lesson brings together everything we've learned so far.

###  The problem with your laptop

Remember from Lesson 2: websites live on **servers**, computers that are always switched on and always connected to the internet.

Your laptop could technically act as a server, but:

- You switch it off at night.
- It goes to sleep when you close the lid.
- NEPA takes light.
- Your internet connection comes and goes.

Every time any of that happens, your website would disappear for everyone. That's why we use **hosting**.

###  What is hosting?

**Hosting** means renting space on a server owned by a company whose job is to keep it running 24 hours a day, with steady power and a strong internet connection.

You put your website's files on their server, and they make sure it's always available.

###  Picture renting a shop in a plaza

Imagine you make beautiful handmade bags at home. They're good, but nobody can buy them because nobody knows where to find you, and your house isn't open to the public.

So you:

1. **Rent a shop in a plaza.** The plaza is open every day, has security, power, and customers walking past. This is **hosting**.
2. **Put up a signboard with your shop's name.** Now people can find you by name. This is your **domain name**.
3. **Bring your bags in and arrange them.** This is **uploading your website's files**.
4. **Open your doors.** Your website is now **live**.

| Opening a shop | Putting a website online |
|---|---|
| Your bags at home | Your website's files on your laptop |
| Renting a shop in a plaza | Paying for hosting |
| Your signboard with your shop's name | Your domain name |
| Arranging your bags in the shop | Uploading your files to the server |
| Opening your doors | Your website going live |

###  You need both: a domain and hosting

This confuses a lot of people, so let's be clear:

- **A domain name** is just the name. On its own, it points nowhere, like a signboard leaning against a wall with no shop behind it.
- **Hosting** is the space where your files live. On its own, people would have to type a long string of numbers (the IP address) to find it, like a shop with no signboard.

You need both, and you need to **connect them**, so that when someone types your domain name, they're sent to your hosting. This is done through the DNS settings we talked about in Lesson 2: you're basically adding your site's details to the internet's contact list.

Many companies sell domains and hosting together and connect them for you, which makes things easier.

###  Where do you get a domain and hosting?

Companies that sell domain names are called **domain registrars**. Companies that provide server space are called **hosting providers**. Many do both.

Some options:

- **Nigerian companies** like Whogohost and Qservers sell domains (including .ng ones) and hosting, and you can pay in Naira.
- **International companies** like Namecheap and GoDaddy sell domains and hosting, usually priced in dollars.
- **Free hosting services** like GitHub Pages and Netlify let you host simple websites (HTML and CSS) for free. You can still connect your own domain to them.

Prices change often, so always check the company's website for current rates. Generally:

- A domain costs a yearly fee, and .ng domains are often cheaper locally.
- Hosting can be free for simple sites, or a monthly or yearly fee for bigger ones.

###  What about website builders?

You may have heard of tools like Wix, Squarespace, or Shopify. These are **website builders**. They give you hosting, a design tool, and ready-made templates all in one package. You drag and drop instead of writing code.

They're great for getting something up quickly. But in this class, we're learning to build websites ourselves, so you'll understand what's happening underneath and won't be limited by what a template allows.

###  The full journey

Here's everything from this track, put together:

1. You **build** your website's files (HTML, CSS, JavaScript, images). *(Lesson 3)*
2. You **rent hosting** and upload your files to a server.
3. You **register a domain name**. *(Lesson 2)*
4. You **connect** the domain to your hosting using DNS. *(Lesson 2)*
5. Someone types your domain name. DNS finds the server's IP address, the server sends your files, and their browser displays your website.
6. That information travels across the internet, the roads, cables, and packets we covered in Lesson 1.

And that's how the web works.


###  Activity

1. Take the three domain names you came up with in Lesson 2.
2. Go to a domain registrar's website (for example, Whogohost or Namecheap) and use their search bar to check whether each name is available.
3. For each name, write down:
   - Is it available?
   - What does it cost per year?
   - If it's taken, what alternatives does the site suggest?
4. Pick your favorite available option. Don't buy it yet; just keep it in mind. You'll have something to put on it by the end of this class.