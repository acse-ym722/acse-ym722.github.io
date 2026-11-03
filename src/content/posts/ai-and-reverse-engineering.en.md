---
title: AI and Reverse Engineering
date: 2026-11-03
category: Personal essay
kind: essay
excerpt: From recreating excellent examples to understanding how they were made, AI lowers the cost of deconstruction and recombination while making curiosity, taste, and original material even more important.
---

Lately, I have increasingly felt that one of AI's strongest and most practical capabilities is reverse engineering.

Suppose you have an idea, but no amount of adjusting your own prompts produces the desired result. If you find an excellent example and ask AI to analyze its structure, style, and implementation, you can often recreate it quickly and then build something new in the same direction. We used to construct everything from scratch. Now we can start with a good result and work backward to understand how it was made.

When code and prompts related to Claude Code were dissected by the community, I wanted to try reverse engineering them myself and created two cases. One relied entirely on my own prompts, while the other was adapted from Claude Code. Unsurprisingly, the prompts refined repeatedly by others worked better.

This made me realize that an excellent example is not merely a result; it also contains a compressed body of knowledge. Prompts, workflows, combinations of tools, and extensive trial and error are all embedded in the final product. AI is very good at unpacking them again.

Recently, I have become particularly absorbed in this approach. When I see an interesting form of science communication on Bilibili or Xiaohongshu, I ask GPT to deconstruct and recreate it, then use a similar approach for topics that interest me. GPT is astonishingly fast at this.

In the past, making a 3Blue1Brown-style video would take me a long time. Although they have open-sourced Manim, connecting mathematical content, animation design, and code still required considerable effort. I tried it as an undergraduate; the process was both enjoyable and exhausting. Now, given a suitable template, AI can assemble a respectable first draft in tens of minutes without me having to watch it constantly.

When using Kimi recently, I have also greatly enjoyed its templates and excellent examples. The value of a template is not merely convenience. More importantly, it allows ordinary people to see directly how a mature workflow is organized. We used to infer the creator's method from the finished product. Now we can unpack that method, modify it, and apply it to our own problems.

The same is true in software. A screenshot can become a webpage, and a demonstration can be deconstructed into a workflow. Soon after Manus and Deep Research appeared, the community produced open-source recreations. The first version of OpenManus took only three hours, while Hugging Face treated its recreation of Deep Research as a twenty-four-hour challenge.

These prototypes are certainly not complete products, and a similar appearance does not imply an identical interior. Stability, data, and engineering details remain substantial barriers. But they at least show that when external behavior is clear enough, AI can help us quickly produce something behaviorally close. Many technical barriers that once seemed solid are becoming thinner.

This kind of reverse engineering has also moved far beyond code and prompts.

I recently came across Huaxin Yuehu's adaptation of “Shang Sanguan” from Strange Tales from a Chinese Studio and found it fascinating. It develops Pu Songling's original story further, with a distinctive visual and narrative style. What made the change in production costs especially tangible to me was the creator's update frequency. Stylized visual work of this scale once took months or even years. Now the creator can release a high-quality episode lasting several to more than ten minutes every day or two. At least in terms of production rhythm, the entire process has changed.

AI has lowered not only the cost of producing an image, but also the cost of repeatedly testing a style, revising a shot, and evaluating a narrative possibility. We can expect much more of this kind of work. Classical literature, local legends, historical fragments, and even personal memories may all be transformed into moving images.

More broadly, scientific research also involves a great deal of reverse engineering. Reconstructing a three-dimensional scene from a set of photographs or finding mathematical formulas in experimental data may seem far removed from recreating a video style, but the direction is similar. Both start with a result and infer the structure that generated it.

This has also changed how I understand learning.

We are used to learning concepts and principles first, practicing second, and attempting creative work last. Reverse engineering offers another path. Start with a sufficiently good work, take it apart, identify which design choices truly matter, and carry away the transferable parts. Art students copying works, programmers reading source code, and students analyzing papers are all doing something similar. The difference is that AI has made deconstruction and recombination so much cheaper.

Recreation can also easily create an illusion of understanding. AI can reproduce an appearance without necessarily understanding why the creator made those choices. Generating a similar result does not necessarily mean grasping the underlying mechanism. Many different processes can produce the same result, and AI has found only one sufficiently workable path.

My preferred approach now is not simply to ask AI for a look-alike. Instead, I ask it to deconstruct the example and organize its findings into an explanation that does not depend on the original work. I borrow only the structure and method, replace all the material with my own, compare the result with the original to identify gaps, and deliberately preserve some different choices. Recreation then becomes not the destination, but a rapid form of learning. What we want to recover is not a particular work, but the method that generated it.

There is always a boundary here. Learning structure and method is not the same as copying someone else's specific expression. Reverse engineering can lower the cost of learning, but it should never become an excuse for superficial imitation, removing attribution, or circumventing permission. The easier recreation becomes, the more important it is to identify our references and consider what we have genuinely added.

I am therefore not especially worried that the future will be full of similar works. A more likely change is that pure production skill will rapidly lose value, while curiosity, aesthetic judgment, lived experience, and original material will become more important. AI can enable a hundred people to make videos in a particular style, but it cannot decide for them what is worth saying or give them something they truly want to express.

In the past, when we saw an excellent work, admiration was all we had. Now we can ask another question: can we take it apart and see how it was generated? As the drawings behind the work are gradually filled in, it ceases to be merely an unattainable result and can become the starting point for the next work.

Perhaps the most fascinating thing about AI is precisely this reversal of direction. It not only helps us create something from nothing; it also helps us return from a finished product to a method, and then travel from that method toward things that did not previously exist.

## References and further reading

- [3Blue1Brown: Manim animation engine (GitHub)](https://github.com/3b1b/manim)
- [OpenManus: Initial release and three-hour prototype (GitHub)](https://github.com/mannaandpoem/OpenManus_Archive)
- [Hugging Face: Open Deep Research (official blog)](https://huggingface.co/blog/open-deep-research)
- [Huaxin Yuehu: “Shang Sanguan,” Strange Tales series (Bilibili)](https://www.bilibili.com/video/BV1EHpv6sEtp/)
