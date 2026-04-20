import sys
import os
import json

# Add server/services to sys.path
sys.path.append(os.path.join(os.getcwd(), 'server', 'services'))

from universal_extractor import extract_recursive

test_text = """
O c t 2 5 , 2 02 4
Ri y a  Sha i kh
Ask Qu estions to Make D ata- D riven D ecisions
an online non-credit course authorized by Google and offered through Coursera
has successfully completed
Amanda Brophy
Global Director of Google Career Certicates
V er if y  at:
h ttp s://co u r ser a.o r g /v er if y /J9WZL 3L 9TB2H
  C ou r ser a h as con fir med  th e id en tity  of th is in d iv id u al an d
th eir  p ar ticip ation  in  th e cou r se.
"""

print("Running Extraction Test...")
skills, domains, weights = extract_recursive(test_text)

print("\nEXTRACTED SKILLS:")
for s in skills:
    print(f"- {s} ({weights.get(s, 0)}%)")

print("\nDOMAINS:")
print(", ".join(domains))

if "Data-Driven Decisions" in skills:
    print("\nSUCCESS: 'Data-Driven Decisions' correctly extracted!")
else:
    print("\nFAILURE: 'Data-Driven Decisions' not found.")
