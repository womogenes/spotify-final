# Find most popular genres and assign each artist to one of those

from utils import artist_data
from collections import defaultdict
from tqdm import tqdm
import json

genre_freq_dict = defaultdict(int)
for data in artist_data.values():
    for g in data["genres"]:
        genre_freq_dict[g] += 1

genre_freq = sorted(genre_freq_dict.items(), key=lambda x: -x[1])

top_genres = [g[0] for g in genre_freq[:12]]
print(f"Top genres: {top_genres}")

for artist_id, data in tqdm(artist_data.items()):
    genres = set(data["genres"])

    found = False
    for g in top_genres:
        if g in genres:
            data["main_genre"] = g
            found = True
            break

    if not found:
        data["main_genre"] = "other"

with open("./data/2.5k_artist_data.json", "w") as fout:
    json.dump(artist_data, fout, indent=2)
