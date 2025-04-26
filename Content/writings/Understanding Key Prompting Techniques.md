---
Author: Lilian
Cover:
  - "[[www.theclevernod.com_(Surface_Pro_7)_(5).png]]"
Date: 2025-04-22
Excerpt: Crafting the most effective prompt can becomplicated, but here’s a breakdown into the key prompting techniques.
Published: false
Slug: understanding-key-prompting-techniques
tags:
  - Artificial-Intelligence
---
Welcome to prompt engineering! It's all about crafting the right text inputs, or **prompts**, to get the best responses from language models (LLMs). Think of it as guiding a super-smart AI to understand what you need. Here are some key techniques to get you started:

  

**→ General Prompting / Zero-Shot:** This is the simplest way. You give the LLM a task description without any examples. It's like asking a question directly.

- **Example:** "Classify this movie review as POSITIVE, NEUTRAL, or NEGATIVE. Review: 'This film was absolutely amazing!'". The LLM should ideally output "POSITIVE".

  

**→ One-Shot & Few-Shot:** When zero-shot isn't enough, you can provide examples in your prompt.

- **One-Shot:** You give one example to show the LLM what you're looking for.
    - **Example:** "Translate 'Hello' to French. Bonjour. Translate 'Thank you' to French." The LLM should output "Merci".
- **Few-Shot:** You provide multiple examples (usually 3-5) to show a pattern. This helps the LLM understand the task better.
    - **Example:**  
        The LLM should complete with "Tokyo".  
        
        ```Plain
        Question: What is the capital of France? Answer: Paris.
        Question: What is the capital of Germany? Answer: Berlin.
        Question: What is the capital of Japan? Answer:
        ```
        

  

**→ System, Contextual, and Role Prompting:** These techniques help you guide the LLM in different ways.

- **System Prompting:** You set the overall context or goal for the LLM. It defines the 'big picture'.
    - **Example:** "Classify movie reviews as positive, neutral or negative. Only return the label in uppercase. Review: 'It was a terrible movie.' Sentiment:". The LLM should output "NEGATIVE".
- **Contextual Prompting:** You provide specific background information relevant to the current task. This helps the LLM understand the details.
    - **Example:** "Context: You are writing for a blog about retro 80's arcade video games. Suggest 3 topics to write an article about...".
- **Role Prompting:** You assign a specific persona or role to the LLM. This influences the style and voice of its responses.
    - **Example:** "I want you to act as a travel guide... My suggestion: 'I am in Amsterdam and I want to visit only museums.' Travel Suggestions:".

  

**→ Step-Back Prompting:** You first ask the LLM a general question related to the specific task to activate background knowledge, then use that answer in the main prompt.

- **Example:**
    - **Step-Back Prompt:** "Based on popular first-person shooter action games, what are 5 fictional key settings that contribute to a challenging and engaging level storyline...?".
    - **(LLM's Response - excerpt):** "1. Abandoned Military Base...".
    - **Final Prompt:** "Context: 5 engaging themes for a first person shooter video game: 1. Abandoned Military Base... Take one of the themes and write a one paragraph storyline...".

  

**→ Chain of Thought (CoT):** You prompt the LLM to explain its reasoning step by step before giving the final answer. This helps it solve complex problems.

- **Example:** "When I was 3 years old, my partner was 3 times my age. Now, I am 20 years old. How old is my partner? Let's think step by step.".

  

**→ Self-Consistency:** You generate multiple reasoning paths (using CoT with a higher randomness) and choose the most common answer. This improves accuracy.

  

**→ Tree of Thoughts (ToT):** This advanced technique allows the LLM to explore multiple reasoning paths simultaneously.

  

**→ ReAct (reason & act):** The LLM combines reasoning with the ability to take external actions (like using search engines) in a loop to solve tasks.

  

**→ Automatic Prompt Engineering (APE):** You use an LLM to automatically generate and evaluate different prompt variations.

  

![[LilysLab-Logo.png]]