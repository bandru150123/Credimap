import json
import sys
import re
import os
from collections import Counter

# ---------------- CONFIG ----------------
MAX_LEN = 100
EMBED_DIM = 64
CONFIDENCE_THRESHOLD = 0.65

# 1. EXPANDED UNIVERSAL SKILL DICTIONARY (Universal Head)
UNIVERSAL_SKILLS_DB = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c", "c++", "c#", "go", "rust", 
        "kotlin", "swift", "php", "ruby", "scala", "matlab", "r", "dart", "bash", "powershell",
        "perl", "haskell", "clojure", "elixir", "erlang", "lua", "julia", "objective-c", "fortran", "assembly", "solidity",
        "sql", "html5", "css3", "xml", "json", "yaml", "markdown", "latex", "verilog", "vhdl", "ada", "cobol", "lisp", "prolog", "scheme"
    ],
    "Frontend Development": [
        "html", "css", "sass", "scss", "tailwind", "bootstrap", "react", "angular", "vue", 
        "nextjs", "nuxtjs", "redux", "webpack", "vite", "threejs", "d3js", "ui ux", "figma", "adobe xd",
        "svelte", "emberjs", "backbonejs", "material ui", "ant design", "chakra ui", "styled components", "framer motion", "gsap", "sketch", "invision", "zeplin",
        "jquery", "ajax", "responsive design", "progressive web apps", "web components", "canvas", "svg", "webgl", "tailwindcss", "bulma", "foundation", "semantic ui"
    ],
    "Backend Development": [
        "node", "express", "django", "flask", "spring boot", "laravel", "asp.net", 
        "fastapi", "graphql", "rest api", "microservices", "authentication", "jwt",
        "nest js", "koa", "meteor", "ruby on rails", "phoenix", "grpc", "soap", "websocket", "webrtc", "websockets", "oauth", "saml", "sso", "redis", "memcached", "rabbitmq", "kafka", "celery",
        "api design", "serverless", "lambda functions", "server architecture", "load balancing", "caching", "session management", "middleware", "routing", "controllers"
    ],
    "Databases": [
        "mongodb", "mysql", "postgresql", "sqlite", "redis", "cassandra", "firebase", 
        "dynamodb", "neo4j", "elasticsearch", "mariadb", "oracle", "sql server", "db2", "couchbase", "couchdb", "influxdb", "timescaledb", "hadoop", "spark", "hive", "presto", "snowflake", "bigquery", "redshift", "supabase", "prisma", "typeorm", "mongoose", "sequelize", "hibernate",
        "database design", "query optimization", "data modeling", "nosql", "relational databases", "data migration", "backup and recovery"
    ],
    "Cloud and DevOps": [
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible",
        "jenkins", "github actions", "ci cd", "nginx", "linux", "bash scripting",
        "circleci", "travis ci", "gitlab ci", "argo cd", "pulumi", "chef", "puppet", "vagrant", "packer", "promotheus", "grafana", "datadog", "new relic", "splunk", "elk stack", "logstash", "kibana", "fluentd", "istio", "envoy", "helm", "serverless", "lambda", "cloudfront", "route53", "s3", "ec2", "ecs", "eks", "fargate", "vpc", "iam", "cloudwatch", "cloudformation", "elastic beanstalk", "azure devops", "azure functions", "acr", "aks", "app service", "cosmos db", "cloud run", "app engine", "gke", "pub sub", "cloud storage",
        "infrastructure as code", "continuous integration", "continuous deployment", "monitoring", "logging", "containerization", "orchestration", "cloud architecture", "devsecops", "site reliability"
    ],
    "Data Science and AI": [
        "machine learning", "deep learning", "nlp", "computer vision", "data analysis",
        "data-driven decisions", "data visualization", "pandas", "numpy", "scikit learn", "tensorflow", "pytorch", "keras", 
        "matplotlib", "seaborn", "opencv", "excel", "power bi", "tableau", "sql", "data analytics", "data warehousing",
        "google data analytics", "google project management", "google ux design",
        "artificial intelligence", "neural networks", "reinforcement learning", "transfer learning", "generative ai", "llm", "langchain", "llama", "chatgpt", "openai", "stable diffusion", "midjourney", "prompt engineering", "data engineering", "data lake", "etl", "elt", "airflow", "luigi", "dbt", "kafka streams", "flink", "storm",
        "statistical analysis", "predictive modeling", "data mining", "big data", "data science", "analytics", "business intelligence", "data governance", "data quality", "feature engineering"
    ],
    "Mobile Development": [
        "android", "ios", "react native", "flutter", "xamarin", "swift ui",
        "ionic", "cordova", "capacitor", "objective c", "jetpack compose", "expo",
        "mobile app development", "cross-platform development", "native development", "mobile ui", "mobile ux", "app deployment", "app store optimization"
    ],
    "Testing": [
        "unit testing", "integration testing", "selenium", "jest", "mocha", "pytest", "cypress",
        "puppeteer", "playwright", "jasmine", "karma", "chai", "enzyme", "testing library", "rspec", "cucumber", "appium", "katalon", "postman", "soapui", "jmeter", "loadrunner", "gatling", "locust",
        "test automation", "quality assurance", "performance testing", "security testing", "usability testing", "regression testing", "acceptance testing"
    ],
    "Tools and Collaboration": [
        "git", "github", "gitlab", "bitbucket", "jira", "trello", "slack", "notion", "agile", "scrum",
        "kanban", "confluence", "asana", "monday.com", "microsoft teams", "zoom", "google workspace", "office 365", "vscode", "intellij", "pycharm", "eclipse", "webstorm", "visual studio", "xcode", "android studio", "vim", "emacs", "nano", "tmux",
        "version control", "project management", "documentation", "code review", "pair programming", "mentoring", "technical writing"
    ],
    "Cybersecurity": [
        "cyber security", "ethical hacking", "penetration testing", "vulnerability assessment", "security analysis",
        "network security", "information security", "data protection", "encryption", "firewall", "intrusion detection", "malware analysis",
        "digital forensics", "security auditing", "risk assessment", "security protocols", "oauth", "saml", "ldap", "active directory"
    ],
    "Business and Management": [
        "project management", "product management", "business analysis", "strategic planning", "leadership",
        "team management", "communication", "problem solving", "critical thinking", "decision making",
        "negotiation", "stakeholder management", "resource allocation", "budget management", "risk management",
        "business development", "marketing", "sales", "customer relationship management", "business intelligence"
    ],
    "Design and Creative": [
        "graphic design", "web design", "user interface design", "user experience design", "interaction design",
        "visual design", "motion graphics", "animation", "video editing", "photo editing", "illustration",
        "branding", "typography", "color theory", "layout design", "prototyping", "wireframing"
    ],
    "General Professional": [
        "technical support", "customer service", "ask questions", "research", "analytical thinking", "creativity",
        "innovation", "adaptability", "time management", "organization", "attention to detail", "multitasking",
        "presentation skills", "public speaking", "writing skills", "documentation", "training", "mentoring"
    ]
}

# Flatter version for faster lookup
SKILL_TO_DOMAIN = {}
for domain, skill_list in UNIVERSAL_SKILLS_DB.items():
    for s in skill_list:
        SKILL_TO_DOMAIN[s.lower()] = domain

# 2. PATTERN-BASED EXTRACTOR (NER Head)
EXTRACT_PATTERNS = [
    r"(?:proficient in|expertise in|skills include|skilled in|experienced with|expert at|knowledge of|certified in|completed)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"(?:working with|using|familiar with)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"\b(?:languages|tools|technologies|frameworks|stack|skills|expertise)\b:?\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"(?:certificate|certification|course|training|workshop)\s+(?:in|of|for|on)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"(?:learned|studied|mastered|trained|practiced)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"(?:specialized|focused|concentrated)\s+(?:in|on)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"(?:developed|built|created|designed|implemented)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)",
    r"(?:experience|background|knowledge)\s+(?:in|with|of)\s+([a-zA-Z0-9\s\#\.\/\-\,\&\+]+)(?:\.|\n|\,|$)"
]

def clean_text(text):
    text = text.lower()
    # Keep some symbols commonly found in skills like #, ., +, -
    text = re.sub(r'[^a-z0-9\s\#\.\+\-]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def heal_fragmented_text(text):
    """
    Heals fragmented text like 'P y t h o n' or 'D ata- D riven'.
    Matches chains of single-character words and merges them.
    Also handles 2nd-stage heuristic for 1-2 char fragments.
    """
    # Normalize spaces first
    text = re.sub(r'\s+', ' ', text)
    
    # 1. Standard single letter healing: a b c -> abc
    def merge_single(match):
        return match.group(0).replace(" ", "")
    
    text = re.sub(r'(?:\b[a-z0-9]\s){2,}\b[a-z0-9]\b', merge_single, text, flags=re.IGNORECASE)
    
    # 2. Heuristic for word fragmentation: "Qu estions", "cou r se"
    stop_words = {'a', 'an', 'the', 'of', 'in', 'to', 'is', 'it', 'on', 'at', 'by', 'for', 'with', 'and', 'or', 'as'}
    
    def heuristic_merge(match):
        w1, w2 = match.groups()
        # Don't merge if either is a common short word (e.g., "it is", "decisions an")
        if w1.lower() in stop_words or w2.lower() in stop_words:
            return f"{w1} {w2}"
        # Merge if one is a short fragment (1-2 chars) or ends with '-'
        # This handles cases like "v er if y" or "Qu estions"
        if len(w1) <= 2 or w1.endswith('-') or len(w2) <= 2:
            return f"{w1}{w2}"
        return f"{w1} {w2}"

    # Apply 5 times for deep fragmentation like "v er if y a t"
    for _ in range(5):
        # Sub-step A: Merge single-char to neighboring word
        text = re.sub(r'\b([a-z0-9])\s([a-z0-9]+)\b', r'\1\2', text, flags=re.IGNORECASE)
        text = re.sub(r'\b([a-z0-9]+)\s([a-z0-9])\b', r'\1\2', text, flags=re.IGNORECASE)
        # Sub-step B: Merge using heuristic
        text = re.sub(r'\b([a-z0-9\-]+)\s([a-z0-9]+)\b', heuristic_merge, text, flags=re.IGNORECASE)
        
    # 3. Final cleanup for specific symbols
    text = re.sub(r'(\w+)\-\s+(\w+)', r'\1-\2', text, flags=re.IGNORECASE)
        
    return text

def extract_recursive(text):
    """
    Recursive extraction pipeline:
    1. Text Healing (OCR/PDF fragmentation fix)
    2. Pattern matching for open-vocabulary entities
    3. Dictionary matching for known technical terms
    4. Feedback loop: use extracted skills to look for more related items
    """
    text_lower = text.lower()
    
    # 0. HEAL TEXT
    healed_text = heal_fragmented_text(text_lower)
    normalized_text = clean_text(healed_text)
    
    extracted_results = {} # skill -> confidence
    pattern_matched_skills = set() # Skills found via explicit patterns

    # Debug: Log input text length
    sys.stderr.write(f"Processing text of length: {len(text)}\n")

    # HEAD 1: Pattern Matching (NER)
    for pattern in EXTRACT_PATTERNS:
        matches = re.finditer(pattern, text_lower) # Use original text_lower for patterns
        for match in matches:
            phrase = match.group(1).split(',')
            for p in phrase:
                p = p.strip().rstrip('.,!?;:')
                if len(p) > 0 and len(p) < 40:
                    p = re.sub(r'^(and|or|including|such as|in)\s+', '', p)
                    if p:
                        skill_low = p.lower()
                        extracted_results[skill_low] = 85 
                        pattern_matched_skills.add(skill_low)

    # HEAD 2: Dictionary Matching (Deep Scan)
    for skill in SKILL_TO_DOMAIN.keys():
        skill_lower = skill.lower()
        
        # Determine if this skill needs strict matching (single letters like C, R, G, etc.)
        is_single_letter = len(skill_lower) == 1
        
        # Refined regex to handle skills with special chars like ++, #, .
        if skill_lower in ['c++', 'c#']:
            skill_pattern = re.escape(skill_lower) + r'(?!\w)'
        elif is_single_letter:
            skill_pattern = r'\b' + re.escape(skill_lower) + r'\b'
        else:
            skill_pattern = r'\b' + re.escape(skill_lower) + r'\b'
            
        if re.search(skill_pattern, normalized_text):
            # STRICT RULE: Single-letter skills (C, R) MUST be in 
            # pattern_matched_skills OR have very high evidence.
            # This prevents random 'C' or 'R' from being picked up in fragmented dates/names.
            if is_single_letter:
                if skill_lower in pattern_matched_skills:
                    extracted_results[skill_lower] = max(extracted_results.get(skill_lower, 0), 90)
                else:
                    # Skip single letter if no contextual evidence
                    continue
            else:
                # If already found via pattern, boost score
                if skill_lower in extracted_results:
                    extracted_results[skill_lower] = min(100, extracted_results[skill_lower] + 15)
                else:
                    extracted_results[skill_lower] = 80
                
    # POST-PROCESSING: Unique & Confidence filter
    final_skills = []
    final_weights = {}
    domains = set()

    # Sort items by length (longer first) to handle nested skills like "React" in "React Native"
    # Wait, actually we want both usually, but let's deduplicate logically.
    sorted_extracted = sorted(extracted_results.items(), key=lambda x: len(x[0]), reverse=True)
    
    seen_skills = set()
    for skill, confidence in sorted_extracted:
        if confidence >= 70:
            skill_lower = skill.lower()
            if skill_lower in seen_skills:
                continue
            
            # Basic canonical naming
            if skill_lower in ["javascript", "typescript", "c++", "c#"]:
                canonical_skill = {"javascript": "JavaScript", "typescript": "TypeScript", "c++": "C++", "c#": "C#"}[skill_lower]
            elif len(skill_lower) <= 3:
                canonical_skill = skill_lower.upper()
            else:
                canonical_skill = skill_lower.title()
                
            final_skills.append(canonical_skill)
            final_weights[canonical_skill] = confidence
            seen_skills.add(skill_lower)
            
            # Domain mapping
            domain = SKILL_TO_DOMAIN.get(skill_lower, "General Engineering")
            domains.add(domain)

    # Fallback
    if not final_skills:
        sys.stderr.write("No skills found, using fallback\n")
        final_skills = ["Technical Professional"]
        final_weights = {"Technical Professional": 60}
        domains.add("General")

    return list(final_skills), list(domains), final_weights

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing input text"}))
        sys.exit(1)
        
    input_text = sys.argv[1]
    
    try:
        skills, domains, weights = extract_recursive(input_text)
        
        # Format the response for the main AI service
        result = {
            "skills": skills,
            "domains": domains,
            "weights": weights,
            "metadata": {
                "source": "universal_extractor_v2",
                "extracted_count": len(skills)
            }
        }
        
        print(json.dumps(result))
    except Exception as e:
        sys.stderr.write(f"Error in extraction: {str(e)}\n")
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
