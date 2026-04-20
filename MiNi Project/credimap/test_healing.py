import re

def heal_fragmented_text(text):
    # Normalize spaces
    text = re.sub(r'\s+', ' ', text)
    
    # 1. Merge chains of single chars: "P y t h o n" -> "Python"
    # Note: we exclude single letters like 'a', 'i' if they are alone, but if they are in a chain, we merge.
    text = re.sub(r'(?:\b[a-z0-9]\s){2,}\b[a-z0-9]\b', lambda m: m.group(0).replace(" ", ""), text, flags=re.IGNORECASE)
    
    # 2. Merge single char to neighboring word: "D ata-" -> "Data-", "D riven" -> "Driven"
    # We only do this if it's NOT a common standalone word (optional, let's try simple first)
    text = re.sub(r'\b([a-z0-9])\s([a-z0-9]{2,})\b', r'\1\2', text, flags=re.IGNORECASE)
    text = re.sub(r'\b([a-z0-9]{2,})\s([a-z0-9])\b', r'\1\2', text, flags=re.IGNORECASE)
    
    # 3. Handle dashes specifically: "Data- Driven" -> "Data-Driven"
    text = re.sub(r'(\w+)\-\s+(\w+)', r'\1-\2', text, flags=re.IGNORECASE)
    
    return text

test_cases = [
    "D ata- D riven D ecisions",
    "P y t h o n Developer",
    "Qu estions",
    "v er if y  at",
    "cou r se",
    "Ri y a  Sha i kh"
]

for tc in test_cases:
    print(f"Original: {tc}")
    print(f"Healed  : {heal_fragmented_text(tc)}")
    print("-" * 20)
