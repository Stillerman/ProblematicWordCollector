import csv
import json

# Define the input and output file paths
input_csv_path = 'word_freq_5000.csv'
output_json_path = 'word-selector-vite/src/word_freq.json'

# Read the CSV file
data = []
with open(input_csv_path, newline='', encoding='utf-8') as csvfile:
    csvreader = csv.reader(csvfile)
    # Skip header row if there is one
    next(csvreader, None)
    for row in csvreader:
        word, probability = row
        data.append({"word": word, "probability": float(probability)})

# Write the data to a JSON file
with open(output_json_path, 'w', encoding='utf-8') as jsonfile:
    json.dump(data, jsonfile, ensure_ascii=False, indent=4)

print(f"Data has been successfully converted and saved to {output_json_path}")