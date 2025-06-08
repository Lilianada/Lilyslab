const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configuration
const BASE_DIR = process.cwd();
const BOOKMARKS_DIR = path.join(BASE_DIR, 'Content/bookmarks');
const ARTICLE_FILE = path.join(BOOKMARKS_DIR, 'article.md');

// Generate a random date between May 17th, 2025 and June 6th, 2025
function randomDate() {
  const start = new Date('2025-05-17');
  const end = new Date('2025-06-06');
  const randomTimestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(randomTimestamp);
  
  // Format as YYYY-MM-DD
  return date.toISOString().split('T')[0];
}

// New articles to add
const newArticles = [
  {
    title: "Postroll",
    url: "https://notes.jeddacp.com/postroll/",
    author: "JEDDACP",
    tags: ["digital-notes", "reflection", "web-culture"]
  },
  {
    title: "Bear blog challenge",
    url: "https://blog.avas.space/bear-blog-challenge/",
    author: "Ava",
    tags: ["blogging", "minimalism", "challenge"]
  },
  {
    title: "Technology is not an end itself",
    url: "https://aramzs.xyz/microblogs/technology-is-not-an-end-in-itself/",
    author: "Aramzs",
    tags: ["technology", "ethics", "purpose"]
  },
  {
    title: "Exercise page",
    url: "https://boffosocko.com/kind/exercise/",
    author: "Boffosocko",
    tags: ["health", "routine", "personal-development"]
  },
  {
    title: "Damn Phone",
    url: "https://blog.avas.space/damn-phone/",
    author: "Ava",
    tags: ["digital-wellbeing", "technology", "mindfulness"]
  },
  {
    title: "Three Strikes Rule for Blogging",
    url: "https://www.swyx.io/three-strikes",
    author: "Swyx",
    tags: ["writing", "productivity", "content-creation"]
  },
  {
    title: "Tending to my Digital Garden",
    url: "https://shkspr.mobi/blog/2024/10/tending-to-my-digital-garden/",
    author: "Shake",
    tags: ["digital-garden", "web-maintenance", "personal-knowledge"]
  },
  {
    title: "Internet is fun",
    url: "https://kwon.nyc/notes/internet-is-fun/",
    author: "Rachel Kwon",
    tags: ["internet-culture", "creativity", "web-exploration"]
  },
  {
    title: "Blog Questions Challenge",
    url: "https://kwon.nyc/notes/blog-questions-challenge/",
    author: "Rachel Kwon",
    tags: ["blogging", "reflection", "personal-growth"]
  },
  {
    title: "Things I don't have to do",
    url: "https://kwon.nyc/notes/things-i-dont-have-to-do/",
    author: "Rachel Kwon",
    tags: ["personal-boundaries", "self-care", "mindfulness"]
  },
  {
    title: "Social Media Dependency",
    url: "https://blog.avas.space/social-media-dependency/",
    author: "Ava",
    tags: ["social-media", "digital-health", "habits"]
  },
  {
    title: "No Trust",
    url: "https://blog.avas.space/no-trust/",
    author: "Ava",
    tags: ["privacy", "internet", "security"]
  },
  {
    title: "Gardens and Streams",
    url: "https://tracydurnell.com/2021/09/26/gardens-and-streams-ii/",
    author: "Tracy Durnell",
    tags: ["digital-garden", "knowledge-management", "web-theory"]
  },
  {
    title: "Websites as Gardens of the Internet Ecosystem",
    url: "https://tracydurnell.com/2024/03/04/websites-as-gardens-of-the-internet-ecosystem/",
    author: "Tracy Durnell",
    tags: ["web-design", "ecology", "internet-culture"]
  },
  {
    title: "Digital Garden & Zettelkasten",
    url: "https://barnsworthburning.net/spaces/recNaicyEYDX4yie6",
    author: "Nick Trombley",
    tags: ["note-taking", "knowledge-management", "zettelkasten"]
  },
  {
    title: "Digital Walled Gardens",
    url: "https://manuelmoreale.com/digital-walled-gardens",
    author: "Manuel Moreale",
    tags: ["privacy", "internet-evolution", "digital-spaces"]
  },
  {
    title: "New Weekly Review Format",
    url: "https://writingatlarge.com/2025/01/29/my-new-weekly-review-format/",
    author: "",
    tags: ["productivity", "reflection", "journaling"]
  },
  {
    title: "Zettelkasten provides a space for deep contextual and nuanced thinking",
    url: "https://wesleyfinck.org/zettelkasten-provides-a-space-for-deep-contextual-and-nuanced-thinking",
    author: "Wesley Finck",
    tags: ["zettelkasten", "thinking", "note-taking"]
  },
  {
    title: "Tracy Durnell's links to blog about",
    url: "https://tracydurnell.com/mind-garden/links-to-blog-about/",
    author: "Tracy Durnell",
    tags: ["curation", "blogging", "resources"]
  },
  {
    title: "How to create a personal wiki",
    url: "https://wiki.garysheng.com/docs/guides/writing/howwiki",
    author: "Gary Sheng",
    tags: ["knowledge-base", "documentation", "organization"]
  },
  {
    title: "Why you should create a personal wiki",
    url: "https://wiki.garysheng.com/docs/guides/writing/whywiki",
    author: "Gary Sheng",
    tags: ["knowledge-management", "productivity", "personal-development"]
  },
  {
    title: "Notes on Digital Gardens and Zettelkasten",
    url: "https://nick.groenen.me/notes/digital-gardens/",
    author: "Nick Groenen",
    tags: ["digital-garden", "zettelkasten", "note-systems"]
  },
  {
    title: "Building a digital garden",
    url: "https://tomcritchlow.com/2019/02/17/building-digital-garden/",
    author: "Tom Critchlow",
    tags: ["digital-garden", "web-development", "knowledge-management"]
  },
  {
    title: "Reflections on Digital Gardening",
    url: "https://strikingloo.github.io/reflections-digital-gardening",
    author: "Strikingloo",
    tags: ["digital-garden", "blogging", "web-publishing"]
  },
  {
    title: "How to grow your digital garden with subdomains",
    url: "https://www.alanwsmith.com/en/28/da/ka/rf/",
    author: "Alan W Smith",
    tags: ["digital-garden", "web-development", "domains"]
  },
  {
    title: "Personal Knowledge Management (PKM)",
    url: "https://www.ssp.sh/brain/personal-knowledge-management-pkm",
    author: "Simon",
    tags: ["pkm", "organization", "knowledge-systems"]
  },
  {
    title: "Smart Note Taking",
    url: "https://www.ssp.sh/brain/smart-note-taking",
    author: "Simon",
    tags: ["note-taking", "productivity", "learning"]
  },
  {
    title: "On the Athletic Club",
    url: "https://wibtal.com/69",
    author: "Dylan Brodeur",
    tags: ["fitness", "community", "lifestyle"]
  },
  {
    title: "Relationship plants",
    url: "https://wibtal.com/67",
    author: "Dylan Brodeur",
    tags: ["relationships", "growth", "metaphor"]
  },
  {
    title: "I don't want to be a monk",
    url: "https://wibtal.com/66",
    author: "Dylan Brodeur",
    tags: ["lifestyle", "balance", "philosophy"]
  },
  {
    title: "Incentives Rule Everything Inside Me",
    url: "https://wibtal.com/64",
    author: "Dylan Brodeur",
    tags: ["motivation", "psychology", "behavior"]
  },
  {
    title: "You should write",
    url: "https://wibtal.com/63",
    author: "Dylan Brodeur",
    tags: ["writing", "creativity", "self-expression"]
  },
  {
    title: "My Writing Process",
    url: "https://wibtal.com/53",
    author: "Dylan Brodeur",
    tags: ["writing", "process", "creativity"]
  },
  {
    title: "Don't Lose Sight of the Goal",
    url: "https://wibtal.com/50",
    author: "",
    tags: ["focus", "goals", "productivity"]
  },
  {
    title: "Why have a blog",
    url: "https://guzey.com/personal/why-have-a-blog/",
    author: "",
    tags: ["blogging", "writing", "self-expression"]
  },
  {
    title: "Why and how to write on the internet",
    url: "https://www.benkuhn.net/writing/",
    author: "",
    tags: ["writing", "digital-presence", "communication"]
  },
  {
    title: "Make the internet fun again",
    url: "https://www.arca.so/make-the-internet-fun-again",
    author: "",
    tags: ["web-culture", "creativity", "digital-spaces"]
  },
  {
    title: "Write simply",
    url: "https://www.paulgraham.com/simply.html",
    author: "Paul Graham",
    tags: ["writing", "clarity", "communication"]
  },
  {
    title: "Putting ideas into words",
    url: "https://www.paulgraham.com/words.html",
    author: "Paul Graham",
    tags: ["writing", "thinking", "expression"]
  },
  {
    title: "Write faster",
    url: "https://sashachapin.substack.com/p/write-faster-130",
    author: "Sasha Chapin",
    tags: ["writing", "productivity", "technique"]
  },
  {
    title: "Make the Internet fun again",
    url: "https://www.notboring.co/p/make-the-internet-fun-again",
    author: "",
    tags: ["internet-culture", "creativity", "web-exploration"]
  },
  {
    title: "Maggie Appleton's Digital Garden Directory",
    url: "https://maggieappleton.com/garden-directory",
    author: "Maggie Appleton",
    tags: ["digital-garden", "resources", "directory"]
  },
  {
    title: "Maggie Appleton's Digital Garden on Tools for Thought",
    url: "https://maggieappleton.com/tools-for-thought",
    author: "Maggie Appleton",
    tags: ["tools-for-thought", "cognition", "productivity"]
  },
  {
    title: "Maggie Appleton's Digital Garden on Digital Gardening",
    url: "https://maggieappleton.com/digital-gardening",
    author: "Maggie Appleton",
    tags: ["digital-garden", "methodology", "web-publishing"]
  },
  {
    title: "Maggie Appleton's Digital Garden on Evergreen Notes",
    url: "https://maggieappleton.com/evergreen-notes",
    author: "Maggie Appleton",
    tags: ["note-taking", "evergreen-notes", "knowledge-management"]
  },
  {
    title: "Michael Ashcroft's Notes",
    url: "https://michaelashcroft.org/notes",
    author: "Michael Ashcroft",
    tags: ["notes", "thoughts", "personal-knowledge"]
  },
  {
    title: "Maggie Appleton's Digital Garden on Digital Gardens",
    url: "https://maggieappleton.com/digital-gardens",
    author: "Maggie Appleton",
    tags: ["digital-garden", "web-history", "knowledge-systems"]
  },
  {
    title: "Maggie Appleton's Digital Garden on Bi-Directional Links",
    url: "https://maggieappleton.com/bi-directional-links",
    author: "Maggie Appleton",
    tags: ["bi-directional-links", "hypertext", "note-taking"]
  },
  {
    title: "Make the web fun again",
    url: "https://blog.neocities.org/blog/2013/05/28/making-the-web-fun-again",
    author: "",
    tags: ["web-culture", "creativity", "personal-websites"]
  },
  {
    title: "Cultivating a Simpler, Thoughtful Web",
    url: "https://glasp.co/hatch/kazuki/p/Y012vhekgBkzKmd5Jb99",
    author: "Kazuki",
    tags: ["digital-minimalism", "web-design", "intentionality"]
  },
  {
    title: "Indie web: How to make the web fun again",
    url: "https://qmunicatemagazine.co.uk/2025/04/12/indieweb-how-to-make-the-internet-fun-again/",
    author: "",
    tags: ["indie-web", "web-culture", "creativity"]
  },
  {
    title: "Why you should have a website",
    url: "https://rscottjones.com/why-you-should-have-a-website/",
    author: "R. Scott Jones",
    tags: ["web-presence", "personal-branding", "digital-identity"]
  },
  {
    title: "On walking",
    url: "https://marblethoughts.bearblog.dev/on-walking/",
    author: "",
    tags: ["walking", "mindfulness", "health"]
  },
  {
    title: "Every site needs a Links Page / Why linking matters",
    url: "https://thoughts.melonking.net/thoughts/every-site-needs-a-links-page-why-linking-matters",
    author: "",
    tags: ["web-design", "linking", "community"]
  },
  {
    title: "A system to organise your life",
    url: "https://johnnydecimal.com/10-19-concepts/11-core/11.01-introduction/",
    author: "",
    tags: ["organization", "systems", "productivity"]
  },
  {
    title: "Keeping notes",
    url: "https://johnnydecimal.com/10-19-concepts/11-core/11.07-keeping-notes/",
    author: "",
    tags: ["note-taking", "organization", "documentation"]
  },
  {
    title: "Feedbackless feed",
    url: "https://fromemily.com/feedbackless-feed/",
    author: "Emily",
    tags: ["social-media", "digital-health", "interface-design"]
  },
  {
    title: "Blogging Has Just Changed Forever and No One Is Talking About It",
    url: "https://www.bramadams.dev/202306052325/",
    author: "Bram Adams",
    tags: ["blogging", "technology", "web-evolution"]
  },
  {
    title: "Writing is thinking",
    url: "https://iamfran.com/blog/writing-is-thinking/",
    author: "Fran",
    tags: ["writing", "thinking", "cognition"]
  },
  {
    title: "Keep it simple stupid",
    url: "https://techcrunch.com/2009/04/28/keep-it-simple-stupid/",
    author: "",
    tags: ["simplicity", "design", "philosophy"]
  },
  {
    title: "Every website is an essay",
    url: "https://css-tricks.com/every-website-is-an-essay/",
    author: "",
    tags: ["web-design", "writing", "communication"]
  },
  {
    title: "A gardening guide for your mind",
    url: "https://www.mentalnodes.com/a-gardening-guide-for-your-mind",
    author: "",
    tags: ["mindfulness", "knowledge-management", "cognitive-health"]
  },
  {
    title: "Threaded thinking instead of linear thinking",
    url: "https://www.mentalnodes.com/threaded-thinking-instead-of-linear-thinking",
    author: "",
    tags: ["thinking", "cognition", "knowledge-structures"]
  },
  {
    title: "Putting all your eggs in one basket",
    url: "https://kevquirk.com/blog/putting-your-eggs-in-one-basket",
    author: "Kev Quirk",
    tags: ["digital-independence", "risk-management", "web-ownership"]
  },
  {
    title: "When you love something made by a terrible person",
    url: "https://anniemueller.com/posts/when-you-love-something-made-by-a-terrible-person",
    author: "Annie",
    tags: ["ethics", "consumerism", "values"]
  },
  {
    title: "Please please please please please please share your big dumb beautiful self with the world",
    url: "https://gkeenan.co/avgb/please-please-please-please-please-please-share-your-big-dumb-beautiful-self-with-the-world/",
    author: "Keenan",
    tags: ["self-expression", "creativity", "authenticity"]
  },
  {
    title: "The shitification of social media",
    url: "https://dospuntostr.es/post/social-media/",
    author: "Mini",
    tags: ["social-media", "digital-culture", "critique"]
  },
  {
    title: "Why Blog?",
    url: "https://www.visruth.com/blog/first/",
    author: "Visruth Srimath Kandali",
    tags: ["blogging", "self-expression", "purpose"]
  },
  {
    title: "Creation and Consumption",
    url: "https://proseandconst.xyz/blog/creation-consumption/",
    author: "",
    tags: ["creativity", "consumption", "balance"]
  },
  {
    title: "Internet Manifesto",
    url: "https://goblin-heart.net/sadgrl/cyberspace/internet-manifesto",
    author: "",
    tags: ["internet-culture", "web-philosophy", "digital-freedom"]
  }
];

// Append articles to article.md file
function addNewArticles() {
  // Check if the bookmarks directory exists
  if (!fs.existsSync(BOOKMARKS_DIR)) {
    console.error('The bookmarks directory does not exist');
    return false;
  }

  // Check if article.md exists
  if (!fs.existsSync(ARTICLE_FILE)) {
    console.error('The article.md file does not exist');
    return false;
  }

  // Read the existing content to find the last ID
  const existingContent = fs.readFileSync(ARTICLE_FILE, 'utf8');
  
  // Extract all IDs
  const idRegex = /id: article-(\d+)/g;
  const matches = [...existingContent.matchAll(idRegex)];
  
  // Find the highest ID number
  let lastIdNum = 0;
  matches.forEach(match => {
    const idNum = parseInt(match[1]);
    if (idNum > lastIdNum) {
      lastIdNum = idNum;
    }
  });

  // Create content for new articles
  let newContent = '';
  
  newArticles.forEach((article, index) => {
    // Generate a new ID
    const newIdNum = lastIdNum + index + 1;
    const idString = 'article-' + newIdNum.toString().padStart(3, '0');
    
    // Generate new article entry
    newContent += `
---
publish: true
title: ${article.title}
URL: ${article.url}
date: ${randomDate()}
tags:
  - ${article.tags[0]}
  - ${article.tags[1]}
  - ${article.tags[2]}
type: article
id: ${idString}
---`;
  });

  // Append the new content to the file
  fs.appendFileSync(ARTICLE_FILE, newContent);
  
  console.log(`Added ${newArticles.length} new articles to article.md`);
  return true;
}

// Main function
function main() {
  console.log('Starting to add new articles...');
  
  const success = addNewArticles();
  if (!success) {
    console.error('Failed to add new articles');
    process.exit(1);
  }

  console.log('New articles added successfully');
}

// Run the main function
main();
