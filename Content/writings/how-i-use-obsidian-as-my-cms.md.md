---
title: How I use Obsidian as my CMS
slug: how-i-use-obsidian-as-my-cms
tags:
  - content
  - productivity
  - article
date: 2025-04-26
exerpt: Easy peasy content management system
---

---

### **How I Set Up Obsidian as My Content Management System After Encountering Bugs in Notion's Renderer**

As a creative professional, managing content effectively is crucial. For years, I relied on Notion to keep my notes, ideas, and articles organized. However, after a recent experience with bugs in Notion’s renderer, I decided to explore alternative content management solutions. That's when I discovered Obsidian, a powerful note-taking and knowledge management app that supports markdown files, and it quickly became my new CMS.

Here’s a breakdown of how I set up Obsidian as my CMS and why it has been an excellent replacement for Notion.

#### **1. The Issue with Notion’s Renderer**

Notion has been a fantastic tool for organizing everything from project plans to personal journals. However, I encountered persistent bugs in its markdown renderer. The issues ranged from inconsistent rendering of markdown formatting to missing images and broken links in embedded content. These bugs significantly impacted my workflow, and I realized that I needed a more reliable solution to manage my content, especially for my website and other creative projects.

#### **2. Why I Chose Obsidian**

Obsidian is a local-first, markdown-based note-taking app that provides full control over your content. Unlike Notion, which stores data in a proprietary format, Obsidian stores everything as plain text markdown files. This makes it incredibly flexible and easy to integrate with other tools and platforms. Here's why I chose Obsidian:

- **Markdown-based**: Obsidian uses markdown files, which are lightweight and easy to manage.
    
- **Local storage**: All your notes and files are stored locally, giving you full control over your data.
    
- **Customization**: Obsidian offers a wide range of plugins and customization options, allowing you to tailor the app to your needs.
    

#### **3. Setting Up Obsidian as My CMS**

To set up Obsidian as my content management system, I followed a simple process to organize my files and integrate them with my Next.js website. Here’s how I did it:

1. **Organizing Content in Obsidian**
    
    - I created a folder called **Content** on my local machine to store all my writings. Inside the **Content** folder, I created a subfolder named **Writings** where I would place all my markdown files for blog posts and articles.
        
    - Each writing is stored as a markdown file (e.g., `how-i-use-obsidian-as-my-cms.md`) and contains frontmatter (metadata) such as title, date, tags, and an excerpt.
        
2. **Integrating Obsidian with My Website**
    
    - I built a **Next.js** website that reads markdown files directly from my **Content/Writings** folder.
        
    - Using Node’s **fs** (file system) module, I read the markdown files from the folder and parsed the frontmatter using the **gray-matter** package.
        
    - I created dynamic routes based on the filenames (slugs) to display each article’s content on my website.
        
3. **Keeping It Simple with Frontmatter**
    
    - In each markdown file, I use frontmatter to store metadata. For example, in `how-i-use-obsidian-as-my-cms.md`, the frontmatter might look like this:
        
        ```yaml
        title: "How I Use Obsidian as My CMS"
        date: "2025-04-26"
        excerpt: "After facing issues with Notion's renderer, I turned to Obsidian for a more reliable content management system."
        tags: ["Obsidian", "Content Management", "Tech"]
        coverImage: "/images/obsidian-cms.jpg"
        ```
        
    - The frontmatter includes details like the title, date, excerpt, and tags, which are then used to display metadata on the website and improve SEO.
        
4. **Displaying the Content**
    
    - On my website, I display the article’s title, content, and metadata by reading the markdown file’s content and rendering it into HTML.
        
    - The articles are displayed in a clean and responsive format, allowing users to read and engage with the content easily.
        

#### **4. The Benefits of Using Obsidian as a CMS**

Since switching to Obsidian, I’ve experienced several benefits that make it a great content management system for my needs:

- **Speed and Flexibility**: Markdown files are lightweight and quick to load, ensuring that my website runs smoothly and efficiently.
    
- **Reliability**: Unlike Notion, Obsidian's markdown renderer has been consistently reliable, with no issues in rendering formatting or content.
    
- **Control**: By storing my files locally, I have complete control over my content, and I can back it up easily or move it to other platforms when needed.
    
- **Customization**: Obsidian’s plugins allow me to extend its functionality for even more advanced use cases, such as linking content between articles, tracking tasks, and organizing my writing.
    

#### **5. Conclusion**

While Notion served me well for a time, the bugs in its renderer pushed me to find a more stable solution for managing my content. Obsidian’s local-first approach, markdown support, and flexibility made it an ideal choice for my content management system. Whether you’re a writer, developer, or creative professional, Obsidian offers an efficient and customizable way to manage your content and integrate it with other tools.

If you’re looking for a reliable, flexible, and customizable CMS, I highly recommend giving Obsidian a try. It’s been a game-changer for me, and I’m excited to continue using it to organize and display my work.

---

[^1]

[^1]: **Obsidian’s Open Ecosystem**: Obsidian’s flexibility isn’t just limited to its native features—it also supports a wide range of community plugins that further enhance its capabilities, from task management to knowledge graph visualization. This open ecosystem is one of the reasons I was able to tailor Obsidian to meet my specific CMS needs.
