
import re
import json

UNIVERSAL_SKILLS_DB = {
    "software": ["javascript", "typescript", "react", "next.js", "node.js", "express", "python", "django", "flask", "fastapi", "java", "spring boot", "c#", "asp.net", "php", "laravel", "ruby", "rails", "go", "rust", "c++", "c", "swift", "kotlin", "flutter", "react native"],
    "cloud_devops": ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "github actions", "terraform", "ansible", "nginx", "ci/cd", "serverless", "lambda"],
    "data": ["sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "pandas", "numpy", "matplotlib", "tableau", "power bi", "etl", "data engineering", "spark", "hadoop"],
    "ai_ml": ["machine learning", "deep learning", "neural networks", "pytorch", "tensorflow", "scikit-learn", "nlp", "computer vision", "generative ai", "llm", "transformers"],
    "design": ["ui/ux", "figma", "adobe xd", "photoshop", "illustrator", "tailwind css", "sass", "css3", "html5", "responsive design"],
    "testing": ["jest", "cypress", "selenium", "playwright", "mocha", "unit testing", "integration testing"],
    "soft_skills": ["agile", "scrum", "project management", "leadership", "communication", "problem solving", "critical thinking"]
}

SKILL_TO_DOMAIN = {}
for domain, skill_list in UNIVERSAL_SKILLS_DB.items():
    for s in skill_list:
        SKILL_TO_DOMAIN[s] = domain

EXTRACT_PATTERNS = [
    r"(?:proficient in|expertise in|skills include|skilled in|experienced with|expert at|knowledge of|certified in)\s+([a-zA-Z0-9\s\#\.\/\-\,\&]+)(?:\.|\n|\,)",
    r"(?:working with|using|familiar with)\s+([a-zA-Z0-9\s\#\.\/\-\,\&]+)(?:\.|\n|\,)",
    r"\b(?:languages|tools|technologies|frameworks|stack)\b:?\s+([a-zA-Z0-9\s\#\.\/\-\,\&]+)(?:\.|\n|\,)"
]

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s\#\.\+\-]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def extract_recursive(text):
    text_lower = text.lower()
    normalized_text = clean_text(text_lower)
    extracted_results = {}

    for pattern in EXTRACT_PATTERNS:
        matches = re.finditer(pattern, text_lower)
        for match in matches:
            phrase = match.group(1).split(',')
            for p in phrase:
                p = p.strip()
                if len(p) > 1 and len(p) < 30:
                    p = re.sub(r'^(and|or|including|such as)\s+', '', p)
                    if p:
                        extracted_results[p] = 85

    for skill in SKILL_TO_DOMAIN.keys():
        if re.search(r'\b' + re.escape(skill) + r'\b', normalized_text):
            if skill in extracted_results:
                extracted_results[skill] = min(100, extracted_results[skill] + 15)
            else:
                extracted_results[skill] = 80

    final_skills = []
    final_weights = {}
    domains = set()

    for skill, confidence in extracted_results.items():
        if confidence >= 70:
            final_skills.append(skill.title())
            final_weights[skill.title()] = confidence
            domain = SKILL_TO_DOMAIN.get(skill, "General Engineering")
            domains.add(domain)

    if not final_skills:
        final_skills = ["Universal Professional"]
        final_weights = {"Universal Professional": 60}
        domains.add("General")

    return list(final_skills), list(domains), final_weights

test_cases = [
    "Certificate of Completion in NLP",
    "Natural Language Processing Certificate",
    "Skills: NLP, Python, Machine Learning",
    "Proficient in NLP and Deep Learning",
    "NLP certified Professional"
]

for test in test_cases:
    skills, domains, weights = extract_recursive(test)
    print(f"Input: {test}")
    print(f"Skills: {skills}")
    print(f"Domains: {domains}")
    print("-" * 20)
