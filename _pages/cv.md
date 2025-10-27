---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

## Education

- ### Shandong University, Jinan, China  
  *Sep. 2022 - Jul. 2023*

- ### Shandong University, Qingdao, China  
  *Jul. 2023 - Now*  
  - **GPA:** 88.5/100  
  - **Rank:** 5/22

- ### Xintai No.1 Middle School, Taian, China  
  *Secondary Education, Jun. 2022*  
  - Within the top 1%


## Experience

- ### iLearn [Qingdao, Shandong University & Shenzhen, Harbin Institute of Technology](https://ilearn.qd.sdu.edu.cn/index.htm)
  **Research Assistant**  
  *Jul. 2023 - Now*
  - Under the guidance of Associate Professor [Xuemeng Song (宋雪萌)](mailto:bohanhou@foxmail.com)
  - Have a certain understanding of multimodal large models.
  - Currently working on applying large models to retrieval.
  - Research on **Composed Image Retrieval** aims to allow users to retrieve target images by referencing images and modification text.
  - Very familiar with a series of CIR models, which has also given a good understanding of multimodality.
  **Visiting Student**  
  *Jan. 2025 - Apr. 2025*
  - Under the guidance of Associate Professor Xiang Deng (邓翔)
  - Embodied AI and Robotics.
- ### 人机智能中心 
  **Intern**  
  *May. 2024 - Now*
  - Serving as an assistant in the research of Pickball sports robots.
  - Participated in explainable Go AI, aiming to enable models to explain every step of Go. Proposed the core algorithm, which was adopted by the team.
  - Under the guidance of Professor [Dong Xuan (宣东)](https://www.cs.sdu.edu.cn/info/1070/5799.htm), an IEEE Fellow.

---

## Highlight Projects
- ### ImgEdit: Open Reproduction of GPT-4o–Level Image Editing
    [Github](https://github.com/PKU-YuanGroup/ImgEdit)
  - Contributed to an open-source framework that aims to replicate GPT-4o–style instruction-based image editing, and to standardize evaluation for controllable visual editing quality and instruction faithfulness.
  - I participated in building the benchmarking and evaluation pipeline and helped construct part of the dataset.
- ### Multimodal Document Retrieval System (WWW’25 Challenge Winner, 1st Place)
  [Github](https://github.com/hbhalpha/MDR)
  - I design an industrial-grade multimodal document retrieval system that fuses visual cues (figures, tables, headers) with text-only retrievers to handle noisy, partially visible, or OCR-imperfect inputs. The system won 1st place in the WWW’25 Multimodal Document Retrieval Challenge.
  - I introduce a visual anchor mechanism and an ensemble retrieval pipeline that aligns semantic regions from document images with large-text retrievers, improving cross-modal relevance and robustness under real-world conditions.
- ### Embodied-AI-Guide: Practical Guide to Embodied Intelligence （Over 8k stars on github)
  [Github](https://github.com/TianxingChen/Embodied-AI-Guide)
  - The project is an open-source guide to embodied AI, aiming to give newcomers a structured path into robot learning — from perception and control to policy learning with multimodal large models — with curated reading lists, conceptual overviews, and practical engineering notes.
  - I contributed written sections on multimodal large models and LLM-for-robotics / VLA (Vision-Language-Action) policies, including how these models ground language instructions into executable actions on physical robots and how they interface with control stacks.
- ### ReKep Deployment on a Physical Dobot Arm
  - I deploy the ReKep manipulation policy on a real Dobot robotic arm, moving beyond purely simulated benchmarks and demonstrating reliable physical pick-and-place and pose adjustment behaviors in a real-world setting.
  - I implement the full perception-to-control pipeline, including camera calibration, target pose estimation, coordinate frame alignment, and motion command generation for the Dobot controller, achieving stable sub-centimeter actuation ac
- ### MLLM as a Universal Image Retriever
  - We introduce an automated pipeline designed to create detailed multimodal composition datasets and present a large-scale dataset, FiGMaQ, to advance research in fine-grained context learning with MLLMs (Multimodal Large Language Models).
  - We propose a two-phase fine-tuning strategy that enhances the MLLM's capabilities in complex context understanding and query-target alignment, improving its performance across a wide range of image retrieval tasks. With distinct fine-tuning goals, this method also reduces the computational load.
  - We performed comprehensive evaluations on seven diverse image retrieval datasets, demonstrating the exceptional performance of our approach. Our method achieved state-of-the-art results across several challenging image retrieval tasks in a zero-shot, single-checkpoint setting, even when using a more compact MLLM architecture.
- ### Pseudo Triplet Guided Few-shot Composed Image Retrieval
  **Tools:** JavaScript, Python, MySQL  
  [GitHub](https://github.com/hbhalpha/PTG-FSCIR)
  - Proposed a two-stage pseudo triplet guided few-shot CIR scheme. The scheme incorporates a pseudo-triplet-based CIR pretraining stage with an attentive masking and captioning-based pseudo triplet generation method.
  - Introduced a pseudo modification text-based sample challenging score estimation method and a top range-based random sampling strategy.  
  - First to highlight the quality of selected training triplets, maximizing the benefit of few annotated triplets.
  - Plug-and-play and compatible with various CIR models, achieving improvements of up to 22.2% across datasets.
- ### Smart Car: Based on Raspberry Pi, Supporting Remote Control and Automatic Line Tracking
  **Tools:** Raspberry Pi, Python  
  [Video](https://www.bilibili.com/video/BV12g4y1578s)
  - Developed a smart car with remote control and automatic line-tracking capabilities.
  - Programmed car movements using Python and integrated sensors for autonomous navigation.
    
## Other Projects
- ### Explainable Go AI
  **Tools:** Python, JavaScript  
  [GitHub](#)
  - Used MLLM and KataGo to align Go AI features with MLLM for game commentary generation.
  - The project is currently applying for national funding for further research.
  - Collaborated with a robotics company to develop an automatic Go-playing robot.

- ### Lightweight Chatbot: Implemented with JS, Python, and MySQL
  **Tools:** JavaScript, Python, MySQL  
  [GitHub](https://github.com/hbhalpha/Mini-chatGPT)
  - Developed a lightweight chatbot for basic conversational interactions.
  - Implemented a Python backend and JavaScript frontend for a seamless user experience.
  - Managed conversation data using MySQL.
  - Applied NLP techniques to improve response accuracy.

- ### AI Intelligent Gomoku: Based on Java and Monte Carlo Tree Search Algorithm
  **Tools:** Java, Monte Carlo Tree Search Algorithm  
  - Developed an AI Gomoku game for human-computer interaction.
  - Enhanced AI decision-making using the Monte Carlo Tree Search algorithm.
  - Created a user-friendly interface and optimized algorithm performance.



- ### Mechanical Structure Analysis: Processing Structural Mechanics Problems Using Intel OneAPI
  **Tools:** Intel OneAPI, SYCL  
  [GitHub](https://github.com/hbhalpha/SYCL_Mechanical-Structure-Analysis)
  - Developed a program to solve complex mechanical structure problems.
  - Used SYCL for parallel computing to accelerate data processing.
  - Created simulation models to analyze stress conditions of structures.

---

## Patents and Publications
S = In Submission, J = Journal, C = Conference, R = Technical Report  

**[C.1]** **Bohan Hou**, Haoqiang Lin, Xuemeng Song, Haokun Wen, Meng Liu, Yupeng Hu, and Xiangyu Zhao (2025). *FiRE: Enhancing MLLMs with Fine-Grained Context Learning for Complex Image Retrieval.* SIGIR ’25. CCF-A / CORE-A Conference.

**[C.2]** **Bohan Hou**, Haoqiang Lin, Haokun Wen, Meng Liu, Mingzhu Xu, and Xuemeng Song (2024). *Pseudo-triplet Guided Few-shot Composed Image Retrieval.* IJCNN ’25. CORE-A Conference.

**[R.1]** **Bohan Hou**, Haokun Wen, Haoqiang Lin, Xuemeng Song and Liqiang Nie (2025). *Visual Anchor Point for Multimodal Document Retrieval.* WWW ’25 Multimodal Document Retrieval Challenge (Oral). CCF-A Conference.

**[C.3]** Yang Ye, … , **Bohan Hou**, et al. (2025). *ImgEdit: A Unified Image Editing Dataset and Benchmark.* NeurIPS ’25. CCF-A Conference.

**[J.1]** Xuemeng Song, Haoqiang Lin, Haokun Wen, **Bohan Hou**, Mingzhu Xu, and Liqiang Nie (2025). *A Comprehensive Survey on Composed Image Retrieval.* Conditionally accepted for publication in TOIS. CCF-A Journal.


---

## Skills

  - **Programming Languages:** Python, C++, C, Java, JavaScript
  - **English:** CET-6 Score: 571
  - **Data Science & Machine Learning:** Torch, Transformers, and other LLM platforms
  - **Specialized Areas:** Information retrieval, Debug
  - **Mathematical & Statistical Tools:** Mathematical analysis, linear algebra, mathematical statistics, probability theory
  - **Research Skills:** Paper reading, experimentation, paper writing, presentation

---

## Honors and Awards
  - **Championship！！** in WWW’25 Multimodal Document Retrieval Challenge, as First Author and Primary Contributor (>90% system design & implementation), Apr. 2025
  - **Second Prize** in National Olympiad in Informatics (NOIP 2020) Advanced Group, Chinese Computer Federation (CCF), Nov. 2020
  - **Second Prize** in Shandong Province High School Mathematics Competition, Shandong Provincial Mathematical Society, Oct. 2020
  - **Best Speed Award** and **Best Functionality Award** in the First Intelligent Vehicle Competition, Taishan College, 2023
  - **Third Prize** in Shandong Province Electronic Design Competition, Shandong Provincial Department of Education, 2023
  - **Shandong University Outstanding Student Scholarship**, 2023
  - **Shandong University Innovation and Entrepreneurship Scholarship**, 2023
  - **Shandong University Outstanding Student Scholarship**, 2024
  - **Shandong University Outstanding Student Scholarship**, 2025
  - **Shandong University  Academic Innovation Scholarship**，2025
  - **Second Prize** in National Undergraduate Mathematics Competition, Chinese Mathematical Society, 2024
  - **Second Prize** in Asia-Pacific Mathematical Modeling Competition, Asia-Pacific Mathematical Modeling Competition Committee, 2024
  - **National First Prize** in the "Shu Wei Cup" Mathematical Modeling Competition, "Shu Wei Cup" Organizing Committee, 2024
  - **Seventh Place** in the National Finals of the "Shu Wei Cup" Mathematics Competition, "Shu Wei Cup" Organizing Committee, 2024

---

## Additional Information

  **Interests:** Sports, Photography, Go, Violin
