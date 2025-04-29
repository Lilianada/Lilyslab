---
author: Lilian
cover:
  - "[[thecreativeindependent.com_(Surface_Pro_7).png]]"
date: 2025-04-18
excerpt: Becoming a pro at prompt engineering takes practice, but following these best practices from the sources will get you on the right track.
published: true
Slug: best-practices-for-prompt-engineering
tags:
  - Artificial-Intelligence
title: Best Practices for Pro Prompt Engineering
readingTime: 3
wordCount: 517
---
### Best Practices for Pro Prompt Engineering

Becoming a pro at prompt engineering takes practice, but following these best practices from the sources will get you on the right track:

- **Provide Examples:** Using **one-shot or few-shot examples** is a highly effective way to guide the LLM. They show the desired output and help the model understand your expectations.
- **Design with Simplicity:** Keep your prompts **clear, concise, and easy to understand**, for both you and the model. Avoid complex language and unnecessary information.
- **Be Specific About the Output:** Clearly define what you want the LLM to produce. Provide specific details using **system or contextual prompting** to focus the model.
    - **Example:** Instead of "Write a blog post about video game consoles," try "Generate a 3 paragraph blog post about the top 5 video game consoles. The blog post should be informative and engaging, and it should be written in a conversational style.".
- **Use Instructions Over Constraints:** Focus on telling the LLM **what to do** rather than what not to do. Positive instructions are generally more effective.
    - **Example:** Instead of "Do not list video game names," try "Only discuss the console, the company who made it, the year, and total sales.".
- **Control the Max Token Length:** Be mindful of the length of the LLM's response. You can set a **maximum number of tokens** in the model's configuration or explicitly request a certain length in your prompt.
- **Use Variables in Prompts:** For reusable and dynamic prompts, use **variables** that you can change for different inputs. This is useful when integrating prompts into applications.
    - **Example:** "You are a travel guide. Tell me a fact about the city: {city}" where "{city}" can be replaced with "Amsterdam" or any other city.
- **Experiment with Input Formats and Writing Styles:** Try different ways of phrasing your prompts (questions, statements, instructions) and different writing styles to see what yields the best results.
- **For Few-Shot Classification, Mix Up Classes:** When providing examples for classification tasks, ensure you **mix the different categories** in your examples to avoid biasing the model.
- **Adapt to Model Updates:** Stay informed about new model versions and features and adjust your prompts accordingly to leverage these improvements.
- **Experiment with Output Formats:** For non-creative tasks, try requesting the output in a **structured format like JSON or XML** for easier parsing.
- **JSON Repair:** If you're working with JSON output and encounter incomplete or invalid JSON due to token limits, consider using tools like **json-repair** to automatically fix it.
- **Working with Schemas:** Use **JSON Schemas** to define the expected structure and data types of your input, providing the LLM with a clear blueprint.
- **Experiment Together:** If possible, collaborate with other prompt engineers to generate and test different prompt approaches.
- **CoT Best Practices:** For Chain of Thought prompting, put the answer after the reasoning and set the temperature to 0 for more deterministic results.
- **Document Your Attempts:** Keep a detailed record of your prompts, model configurations, and results. This helps you learn what works and track your progress. Use a template like the one provided in the source.

By understanding these techniques and following these best practices, you'll be well on your way to becoming a proficient prompt engineer. Remember that prompt engineering is an **iterative process**, so keep experimenting and refining your prompts.

  

![[LilysLab-Logo.png]]