# Minify JSON files to be served to client
# Needed because some of the existing JSON has whitespace to be human-readable

import json

files_to_minify = ["2.5k_artist_data.json",
                   "2.5k_id2name.json",
                   "2.5k_pca_log.json",
                   "2.5k_artist_freq.json"]

for file in files_to_minify:
    print(f"Minifying {file}...")
    with open(f"./data/{file}") as fin:
        data = json.load(fin)
    with open(f"./site/data/{file}", "w") as fout:
        json.dump(data, fout)
