import torch
import torch.nn as nn
import torch.optim as optim
import json
import os
import random
import re

# ---------------- CONFIG ----------------
MAX_LEN = 100
EMBED_DIM = 64
EPOCHS = 10
BATCH_SIZE = 16

SKILLS = [
    # Programming Languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "go", "rust", 
    "kotlin", "swift", "php", "ruby", "scala", "matlab", "r", "dart", "bash", "powershell",
    # Frontend
    "html", "css", "sass", "tailwind", "bootstrap", "react", "angular", "vue", 
    "nextjs", "nuxtjs", "redux", "webpack", "vite", "threejs", "d3js", "ui ux", "figma", "adobe xd",
    # Backend
    "node", "express", "django", "flask", "spring boot", "laravel", "asp.net", 
    "fastapi", "graphql", "rest api", "microservices", "authentication", "jwt",
    # Databases
    "mongodb", "mysql", "postgresql", "sqlite", "redis", "cassandra", "firebase", 
    "dynamodb", "neo4j", "elasticsearch",
    # Cloud and DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", 
    "jenkins", "github actions", "ci cd", "nginx", "linux", "bash scripting",
    # Data Science and AI
    "machine learning", "deep learning", "nlp", "computer vision", "data analysis", 
    "pandas", "numpy", "scikit learn", "tensorflow", "pytorch", "keras", 
    "matplotlib", "seaborn", "opencv",
    # Mobile
    "android", "ios", "react native", "flutter", "xamarin", "swift ui",
    # Testing
    "unit testing", "integration testing", "selenium", "jest", "mocha", "pytest", "cypress",
    # Tools and Collaboration
    "git", "github", "gitlab", "bitbucket", "jira", "trello", "slack", "notion", "agile", "scrum"
]

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
    text = re.sub(r'[^a-z\s\+\#]', ' ', text) # Keep + and # for c++, c#
    return re.sub(r'\s+', ' ', text).strip()

def generate_synthetic_data(num_samples_per_skill=50):
    templates = [
        "Certificate of Completion in {skill}",
        "This certifies that Student has completed {skill} training",
        "Awarded for excellence in {skill} development",
        "Verified {skill} developer certification",
        "Expertise in {skill} and related technologies",
        "Successful completion of {skill} bootcamp",
        "Professional certification: {skill} engineer",
        "Technical skills include {skill} and more",
        "Highly proficient in {skill}",
        "Hands-on experience with {skill}"
    ]
    
    data = []
    labels = []
    
    for i, skill in enumerate(SKILLS):
        for _ in range(num_samples_per_skill):
            template = random.choice(templates)
            text = template.replace("{skill}", skill)
            data.append(clean_text(text))
            
            label = [0.0] * len(SKILLS)
            label[i] = 1.0
            labels.append(label)
            
    return data, labels

def build_vocab(texts):
    vocab = {"<PAD>": 0, "<OOV>": 1}
    word_counts = {}
    for text in texts:
        for word in text.split():
            word_counts[word] = word_counts.get(word, 0) + 1
            
    # Sort words by frequency
    sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    for i, (word, count) in enumerate(sorted_words):
        vocab[word] = i + 2
        
    return vocab

def encode_texts(texts, vocab):
    encoded = []
    for text in texts:
        tokens = [vocab.get(w, 1) for w in text.split()]
        padded = tokens[:MAX_LEN] + [0] * max(0, MAX_LEN - len(tokens))
        encoded.append(padded)
    return torch.tensor(encoded, dtype=torch.long)

def train():
    print("Generating synthetic data...")
    texts, labels = generate_synthetic_data()
    vocab = build_vocab(texts)
    
    x_train = encode_texts(texts, vocab)
    y_train = torch.tensor(labels, dtype=torch.float32)
    
    print(f"Vocab size: {len(vocab)}")
    print(f"Number of skills: {len(SKILLS)}")
    
    model = SkillCNN(len(vocab), len(SKILLS))
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    print("Starting training...")
    for epoch in range(EPOCHS):
        model.train()
        permutation = torch.randperm(x_train.size()[0])
        
        epoch_loss = 0
        for i in range(0, x_train.size()[0], BATCH_SIZE):
            optimizer.zero_grad()
            
            indices = permutation[i:i + BATCH_SIZE]
            batch_x, batch_y = x_train[indices], y_train[indices]
            
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
            
        print(f"Epoch {epoch+1}/{EPOCHS}, Loss: {epoch_loss / (x_train.size()[0]/BATCH_SIZE):.4f}")
        
    # Save model, vocab, and skills
    checkpoint = {
        'model_state': model.state_dict(),
        'vocab': vocab,
        'skills': SKILLS
    }
    
    save_path = 'skill_extraction_model.pt'
    torch.save(checkpoint, save_path)
    print(f"Model saved to {save_path}")
    
    # Save vocab.json for consistency
    with open('vocab.json', 'w') as f:
        json.dump(vocab, f)
    print("vocab.json saved")

if __name__ == "__main__":
    train()
