---
title: "Domain names and IP addresses"
description: "Every computer on the internet has a number address. Domain names are the easy-to-remember names that point to those numbers."
section: "How the Web Works"
createdAt: 2026-11-10
published: true
--- 

In the last lesson, we learned that the internet is millions of computers connected together. But that raises a question: with so many computers, how does information know where to go? When you type google.com, how does your phone find the right computer out of millions?

That's what this lesson is about.

### Where do websites live?

A website is a set of files. Those files have to be stored somewhere, on a computer that's always switched on and always connected to the internet. That computer is called a **server**.

Think of a restaurant. The kitchen holds the ingredients and prepares the food. You sit at a table and order. You never walk into the kitchen; you ask, and the food comes to you.

- The **server** is the kitchen. It stores the website and sends it out.
- Your phone or laptop is the customer. It asks for the website and receives it.

So when you visit a website, your device is really asking: "Server, please send me your files." But to ask, it first needs to know where that server is.

### Every computer has an address: the IP address

Every device connected to the internet has an address made of numbers. This is called an **IP address** (IP stands for Internet Protocol, but you don't need to remember that).

An IP address looks something like this:

`172.217.16.142`

Four sets of numbers, separated by dots. Your phone has one. Your laptop has one. Every server has one. It's how computers find each other, the same way a delivery rider needs an address to find your house.

### The problem: nobody remembers numbers

Imagine if, to visit Google, you had to type `172.217.16.142`. And for Instagram, a different set of numbers. And your bank, another one. You'd never remember them all.

### The solution: domain names

A **domain name** is a friendly, easy-to-remember name that points to an IP address. Words like:

- google.com
- jumia.com.ng
- bbc.co.uk

You type the name, and behind the scenes, it gets translated into the number.

Think about the contacts on your phone.

You don't memorize your sister's 11-digit number. You save it as "Ada" and tap the name whenever you want to call. Your phone quietly looks up the number behind the name and dials it.

| On your phone | On the internet |
|---|---|
| Contact name ("Ada") | Domain name (google.com) |
| Phone number (0803...) | IP address (172.217.16.142) |
| Your contacts list | DNS |

### DNS: the internet's contact list

The system that matches domain names to IP addresses is called **DNS** (Domain Name System).

Here's what happens when you type a website into your browser:

1. You type `google.com` and press Enter.
2. Your device asks DNS: "What's the number for google.com?"
3. DNS replies: "It's 172.217.16.142."
4. Your device goes to that address and asks the server for the website.
5. The server sends the website back, and it appears on your screen.

All of this happens in a fraction of a second, every single time you open a site.

### Breaking down a web address

The full address you see in your browser's bar is called a **URL**. Let's take this one apart:

`https://www.jumia.com.ng/phones`

| Part | What it means |
|---|---|
| `https://` | The method used to send the website securely. The "s" stands for secure; it means information between you and the site is scrambled so others can't read it. |
| `www.` | An optional extra. Many sites work with or without it. |
| `jumia` | The name the business chose. |
| `.com.ng` | The ending, called the **extension**. |
| `/phones` | A specific page on the website, like a particular aisle in a supermarket. |

### What do the endings mean?

The ending of a domain often tells you something about the website:

- **.com** was originally for companies and is now used by almost anyone.
- **.org** is often used by organizations and charities.
- **.ng** is Nigeria's own ending. Variations like **.com.ng** and **.org.ng** also exist.
- **.co.uk** is for the United Kingdom.
- **.gov.ng** is reserved for Nigerian government websites.

Newer endings like **.shop**, **.store**, and **.africa** also exist. You can pick whatever fits your brand, as long as the name isn't already taken.

### One important thing: you rent domains, you don't own them

When you get a domain name, you don't buy it forever. You pay for it yearly (or for a few years at a time). If you forget to renew, it can expire, and someone else could take it.

It's like renting a shop name on a big signboard. Keep paying, and it stays yours.

### Activity

1. Pick three websites you use regularly.
2. For each one, write down the full URL from your browser's address bar.
3. Label each part: the `https://`, the name, the extension, and any page after the `/`.
4. Bonus: Think of a name for your own future website. Write down three possible domain names using different extensions (for example: `Lily.com`, `john.xyz`, `Johndoe.me`). We'll check if they're available in Lesson 4.