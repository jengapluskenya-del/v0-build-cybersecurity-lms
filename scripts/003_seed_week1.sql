-- Seed Week 1: Intro to Cybersecurity Course

-- Create the course
INSERT INTO public.courses (id, title, description, week_number)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Intro to Cybersec',
  'Introduction to Cybersecurity - Understanding the fundamentals of cybersecurity, its history, importance, core terminology, ethics, and standards.',
  1
) ON CONFLICT DO NOTHING;

-- Module 1: Understanding Cybersecurity
INSERT INTO public.modules (id, course_id, title, sort_order)
VALUES (
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Module 1: Understanding Cybersecurity',
  1
) ON CONFLICT DO NOTHING;

-- Module 1 Lessons
INSERT INTO public.lessons (id, module_id, title, content, lesson_type, sort_order)
VALUES
(
  'c1000001-0000-0000-0000-000000000001',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'What is Cybersecurity?',
  'Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. It aims at protecting people, systems and data from cyberattacks by using various technologies, processes and policies.

In today''s digital world, cybersecurity is essential because almost everything depends on technology, including: Businesses, banks, hospitals, governments, communication systems and personal devices.

Cybersecurity acts like a protection system that ensures safety, privacy, and stability in the digital environment. Without cybersecurity, systems and data would be exposed to cybercriminals, hackers, and malicious attacks.',
  'lesson',
  1
),
(
  'c1000001-0000-0000-0000-000000000002',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'History of Cybersecurity',
  'The origins of cybersecurity are directly connected to the development of early computer networks. During the 1960s, computers were large, expensive systems used primarily by governments, research institutions, and universities.

1. The Beginning of Networked Computing (1960s)
In 1965, Donald Davies proposed the concept of packet switching. In 1969, the U.S. Department of Defense launched ARPANET, the first operational packet-switching network and the precursor to the modern Internet.

2. The First Computer Worm (1971)
Bob Thomas created the first known self-replicating program called Creeper. Ray Tomlinson developed Reaper, widely recognized as the first antivirus software.

3. Cryptographic Advancements (1976)
The Diffie-Hellman key exchange protocol was introduced, revolutionizing cryptography.

4. The Antivirus Era (1980s)
1983 - ARPANET Hacking Incident by the 414s hacker group
1987 - John McAfee founded McAfee Associates
1988 - The Morris Worm exposed critical weaknesses in network security

5. Cybercrime Expansion (1990s)
1991 - Polymorphic Viruses emerged
1999 - The Melissa Virus caused $80 million in damages

6. Large-Scale Global Attacks (2000-2010)
2000 - The ILOVEYOU Virus
2003 - SQL Slammer Worm
Regulatory developments: HIPAA, PCI-DSS

7. State-Sponsored Attacks (2010-2020)
2010 - Stuxnet targeted Iranian nuclear facilities
2013 - Target Data Breach (40 million credit cards)
2017 - WannaCry Ransomware and NotPetya

8. Modern Cybersecurity: AI, Cloud, and Quantum (2020-Present)
AI-driven threat detection, quantum-resistant encryption, and 5G security challenges.',
  'lesson',
  2
),
(
  'c1000001-0000-0000-0000-000000000003',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'Why Cybersecurity Matters',
  'To Organizations:
1. Preventing Financial Loss - The global average cost of a data breach was approximately $4.88 million in 2024.
2. Ensuring Business Continuity - Ransomware and DDoS attacks can disrupt normal operations.
3. Building and Maintaining Customer Trust - Protecting customer personal and financial information.
4. Regulatory and Legal Compliance - GDPR, HIPAA, Data Protection Act compliance.
5. Protecting Intellectual Property - Business strategies, trade secrets, product designs.

To Individuals:
1. Preventing Identity Theft - Protecting personal identity from cybercriminals.
2. Protecting Financial Information - Securing online banking and mobile money.
3. Ensuring Personal Privacy - Protecting emails, social media, and health records.

Broader Societal Importance:
- Protecting National Security and Critical Infrastructure
- Supporting the Data-Driven Economy
- Protecting Emerging Technologies (AI, self-driving cars, medical devices)',
  'lesson',
  3
),
(
  'c1000001-0000-0000-0000-000000000004',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'Careers in Cybersecurity',
  '1. Defense and Operations (Blue Team)
- Information Security Analyst
- Security Operations Center (SOC) Analyst
- Incident Responder
- Security Systems Administrator
- Network Security Engineer

2. Offensive Security and Testing (Red Team)
- Penetration Tester (Ethical Hacker)
- Vulnerability Analyst
- Red Team Engineer

3. Investigation and Forensics
- Digital Forensics Examiner
- Cybercrime Investigator
- Malware Analyst

4. Design and Specialized Engineering
- Cybersecurity Architect
- Cloud Security Engineer
- Security Software Developer
- Cryptography Engineer

5. Governance, Risk, and Compliance (GRC)
- IT Auditor
- Cybersecurity Risk Analyst
- Compliance Analyst

6. Leadership and Strategy
- Chief Information Security Officer (CISO)
- Cybersecurity Manager',
  'lesson',
  4
),
(
  'c1000001-0000-0000-0000-000000000005',
  'b1b2c3d4-e5f6-7890-abcd-ef1234567891',
  'Quiz (Game)',
  'Test your knowledge of Module 1: Understanding Cybersecurity fundamentals.',
  'quiz',
  5
)
ON CONFLICT DO NOTHING;

-- Module 2: Security Controls
INSERT INTO public.modules (id, course_id, title, sort_order)
VALUES (
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Module 2: Security Controls',
  2
) ON CONFLICT DO NOTHING;

-- Module 2 Lessons
INSERT INTO public.lessons (id, module_id, title, content, lesson_type, sort_order)
VALUES
(
  'c2000001-0000-0000-0000-000000000001',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Pillars of Cybersecurity',
  'Confidentiality: Means to have full trust or reliance. It is a fundamental concept of cybersecurity, with roots in the military attitude of retaining top-down power and control over individuals with access to data. It should be applied in cloud computing, which will raise the danger of data breach.

Integrity: It is a significant part of the structure, execution, and use of any system that stores, interprets, or retrieves data because it protects data correctness and consistency throughout its life cycle. Data integrity failure is defined as any unwanted alterations to data as a result of a storage, retrieval, or computing action.

Availability: Information must be accessible when it is needed for any information system to function well. This implies that the computer systems used to save and analyze the data, as well as the security measures and communication channels required to access it, must all be operational.',
  'lesson',
  1
),
(
  'c2000001-0000-0000-0000-000000000002',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Core Cybersecurity Terminology',
  'Vulnerability: A weakness in a system or an asset that can be exploited by a threat (e.g., a software bug, a missing security patch, or a weak password).

Exploit: Any method used by hackers to gain unauthorized access to computers.

Threat Actor / Malicious Actor: An individual or group responsible for a security incident. Types include: Cybercriminals, Nation-State Actors, Hacktivists, Insider Threats, Script Kiddies.

Threat: A potential danger that may exploit a vulnerability to breach security and cause harm.

Social Engineering: The psychological manipulation of people into performing actions or divulging confidential information, including: Phishing (fraudulent emails), Vishing (voice phishing), Smishing (SMS/text phishing).

Risk: The likelihood that a threat will exploit a vulnerability, multiplied by the impact.

Risk Management Types:
- Risk Acceptance
- Risk Avoidance
- Risk Reduction / Mitigation
- Risk Transfer',
  'lesson',
  2
),
(
  'c2000001-0000-0000-0000-000000000003',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Malware and Types of Malware',
  'Malware is malicious software designed to infiltrate, damage, or gain unauthorized access.

Types of Malware:
- Viruses: Self-replicating programs that attach to files
- Worms: Self-replicating programs that spread across networks
- Ransomware / Crypto-malware: Blocks access until a ransom is paid
- Trojan (Trojan Horse): Disguises itself as legitimate software
- Remote Access Trojan (RAT): Grants remote control over a victim''s machine
- Rootkits: Hides the existence of other malware
- Spyware: Gathers information without knowledge
- Bots & Botnets: Automated programs used for large-scale attacks
- Logic Bombs: Code that executes malicious actions when conditions are met

Common Terminologies:
- CIA Triad: Confidentiality, Integrity, Availability
- Authentication: Verifying identity (passwords, biometrics)
- Authorization: Determining permissions
- Non-Repudiation: Cannot deny the validity of actions
- Defense in Depth: Multiple layered defensive measures
- DDoS: Overwhelming a system with traffic
- Zero-Day Exploit: Targeting unknown vulnerabilities
- Encryption: Converting data into unreadable ciphertext
- MFA: Multi-Factor Authentication
- Penetration Testing: Authorized simulated attacks',
  'lesson',
  3
),
(
  'c2000001-0000-0000-0000-000000000004',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Defense in Depth',
  'Defense in Depth is a security strategy employing multiple, layered defensive measures to protect data. This approach ensures that if one security measure fails, additional layers of defense are in place to prevent a breach.

Key layers include:
1. Physical Security - Access controls to physical locations
2. Network Security - Firewalls, VPNs, and intrusion detection systems
3. Host Security - Antivirus, patch management, and host-based firewalls
4. Application Security - Secure coding practices and application firewalls
5. Data Security - Encryption, access controls, and backup procedures
6. Policies and Procedures - Security policies, incident response plans, and training

The concept ensures comprehensive protection by addressing threats at every possible level.',
  'lesson',
  4
),
(
  'c2000001-0000-0000-0000-000000000005',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Cybersecurity Ethics',
  'Cybersecurity ethics refers to the moral principles, professional standards, and legal responsibilities that guide the conduct of cybersecurity professionals.

The 7 Core Principles:
1. Accountability - Take responsibility for actions, log system activities
2. Transparency - Maintain openness in security practices and incident reporting
3. Confidentiality - Protect sensitive data from unauthorized access
4. Integrity - Ensure data remains accurate and unaltered
5. Availability - Ensure authorized users can access systems when needed
6. Compliance - Adhere to laws, standards, and regulatory frameworks
7. Continuous Learning - Stay updated on new threats and enhance skills

Common Ethical Issues:
- Privacy Intrusion: Balancing monitoring with privacy rights
- Harm to Property: Preventing cyberattack damage
- Resource Allocation: Prioritizing security investments
- Transparency and Disclosure: Responsible vulnerability disclosure
- Disinformation: Addressing deepfakes and AI-generated misinformation',
  'lesson',
  5
),
(
  'c2000001-0000-0000-0000-000000000006',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Cybersecurity Standards and Frameworks',
  'Standards and frameworks provide structured guidelines for protecting information systems.

1. NIST CSF 2.0 - Six core functions: Govern, Identify, Protect, Detect, Respond, Recover
2. ISO/IEC 27001 & 27002 - International standards for Information Security Management Systems (ISMS)
3. GDPR - EU regulation protecting personal data (fines up to 20M EUR or 4% revenue)
4. HIPAA - Healthcare data protection regulation
5. SOC 2 - Auditing framework with 5 trust principles: Security, Availability, Processing Integrity, Confidentiality, Privacy
6. FISMA - Federal government information security framework
7. CIS Critical Security Controls - 18 practical security controls

These frameworks help organizations:
- Manage cybersecurity risks
- Identify security gaps
- Protect critical systems
- Ensure regulatory compliance',
  'lesson',
  6
),
(
  'c2000001-0000-0000-0000-000000000007',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'FlashCards',
  'Review key cybersecurity terms and concepts with interactive flashcards.',
  'flashcard',
  7
),
(
  'c2000001-0000-0000-0000-000000000008',
  'b2b2c3d4-e5f6-7890-abcd-ef1234567892',
  'Final Quiz (Game)',
  'Test your comprehensive knowledge of Week 1 content covering both Module 1 and Module 2.',
  'quiz',
  8
)
ON CONFLICT DO NOTHING;

-- Attachments Module
INSERT INTO public.modules (id, course_id, title, sort_order)
VALUES (
  'b3b2c3d4-e5f6-7890-abcd-ef1234567893',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Attachments',
  3
) ON CONFLICT DO NOTHING;

-- Attachment Lessons
INSERT INTO public.lessons (id, module_id, title, content, lesson_type, sort_order)
VALUES
(
  'c3000001-0000-0000-0000-000000000001',
  'b3b2c3d4-e5f6-7890-abcd-ef1234567893',
  'Study Material (36 pages)',
  'Comprehensive study material covering all Week 1 topics including cybersecurity fundamentals, history, terminology, ethics, and standards.',
  'attachment',
  1
),
(
  'c3000001-0000-0000-0000-000000000002',
  'b3b2c3d4-e5f6-7890-abcd-ef1234567893',
  'TRIOVAULT SURVIVAL CHEAT SHEET (WEEK 1)',
  'Quick reference cheat sheet covering the essential cybersecurity concepts, terminology, and frameworks from Week 1.',
  'attachment',
  2
)
ON CONFLICT DO NOTHING;
