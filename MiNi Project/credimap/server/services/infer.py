import torch
import torch.nn as nn
import json
import sys
import re

# ---------------- CONFIG (Must match train_model.py) ----------------
MAX_LEN = 100
EMBED_DIM = 64

# ---------------- MODEL CLASS (Must match train_model.py) ----------------
class SkillCNN(nn.Module):
    def __init__(self, vocab_size, num_skills):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, EMBED_DIM, padding_idx=0)
        self.conv = nn.Conv1d(EMBED_DIM, 128, kernel_size=5)
        self.pool = nn.AdaptiveMaxPool1d(1)
        self.fc = nn.Linear(128, num_skills)

    def forward(self, x):
        x = self.embedding(x).transpose(1, 2)
        x = torch.relu(self.conv(x))
        x = self.pool(x).squeeze(2)
        return torch.sigmoid(self.fc(x))

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def encode(text, vocab):
    tokens = [vocab.get(w, 1) for w in text.split()]
    return tokens[:MAX_LEN] + [0] * max(0, MAX_LEN - len(tokens))

# Load model and vocab
MODEL_PATH = sys.argv[2] if len(sys.argv) > 2 else 'skill_extraction_model.pt'

# Suppress warnings
import warnings
warnings.filterwarnings("ignore")

try:
    # Use weights_only=False to support legacy loading if needed, or suppress warning
    checkpoint = torch.load(MODEL_PATH, map_location=torch.device('cpu')) # , weights_only=False)
    vocab = checkpoint['vocab']
    skills = checkpoint['skills']
    
    # Initialize model with correct dimensions from checkpoint
    model = SkillCNN(len(vocab), len(skills))
    model.load_state_dict(checkpoint['model_state'])
    model.eval()
except Exception as e:
    # print(json.dumps({'error': f"Failed to load model: {str(e)}"}))
    sys.exit(1)

def extract_skills(text):
    # Preprocess - Convert to lowercase immediately
    text_lower = text.lower()
    cleaned_text = clean_text(text_lower)
    
    # tokenize
    tokens = [vocab.get(w, 1) for w in cleaned_text.split()]
    
    padded = tokens[:MAX_LEN] + [0] * max(0, MAX_LEN - len(tokens))
    input_tensor = torch.tensor([padded], dtype=torch.long)
    
    # Predict
    with torch.no_grad():
        output = model(input_tensor)
        probs = output[0].tolist()
    
    # Get top skills (threshold 0.25)
    skill_weights = {}
    extracted = []
    
    # First pass: use model predictions
    for i, prob in enumerate(probs):
        if prob > 0.25:
            skill = skills[i]
            skill_weights[skill] = int(prob * 100)
            extracted.append(skill)
    
    # Second pass: Check for direct keyword matches for ALL skills if missing
    # This acts as a robust fallback for case-insensitive matching
    for skill in skills:
        skill_lower = skill.lower()
        if skill not in extracted:
            # Check for word boundary match
            if re.search(r'\b' + re.escape(skill_lower) + r'\b', cleaned_text):
                extracted.append(skill)
                # Assign confidence based on length (longer matches = higher confidence)
                confidence = 85 if len(skill) > 3 else 70
                skill_weights[skill] = confidence

    # Fallback if still no skills found
    if not extracted:
        extracted = ["General Technical"]
        domain = "General"
        skill_weights = {"General": 100}
            
    # Determine domain based on skills
    domain = "General"
    if any(s in ['python', 'java', 'react', 'node', 'docker', 'javascript'] for s in extracted):
        domain = "Software Development"
    elif any(s in ['sql', 'data', 'tableau', 'analysis', 'python', 'pandas', 'google analytics'] for s in extracted):
        domain = "Data Science"
    elif any(s in ['cisco', 'networking', 'security', 'cybersecurity', 'tcp/ip'] for s in extracted):
        domain = "Networking & Security"
    elif any(s in ['crm', 'sales', 'marketing', 'seo', 'google ads', 'content marketing'] for s in extracted):
        domain = "Business & Marketing"
    elif any(s in ['machine learning', 'deep learning', 'nlp', 'pytorch', 'tensorflow'] for s in extracted):
        domain = "AI & Machine Learning"
        
    return extracted, domain, skill_weights

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing input text"}))
        sys.exit(1)
        
    text_input = sys.argv[1]
    
    # Clean the input text
    try:
        text_input = text_input.replace('\x00', '')
        text_input = ' '.join(text_input.split())
        text_input = ''.join(char for char in text_input if char.isprintable() or char.isspace())
    except Exception as e:
        pass 

    try:
        skills, domain, weights = extract_skills(text_input)
        
        result = {
            "skills": skills,
            "domains": [domain],
            "weights": weights
        }
        
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
