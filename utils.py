import json

with open("./data/name_id_maps.json") as fin:
    data = json.load(fin)
    name2id = data["name2id"]
    id2name = data["id2name"]

with open("./data/2.5k_artist_freq.json") as fin:
    artist_freq_dict = json.load(fin)

    N = 2500
    top_artists = [a[0] for a in sorted(artist_freq_dict.items(), key=lambda x: -x[1])][:N]

with open("./data/2.5k_artist_data.json") as fin:
    artist_data = json.load(fin)
