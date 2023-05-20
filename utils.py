import json

with open("./data/name_id_maps.json") as fin:
    data = json.load(fin)
    name2id = data["name2id"]
    id2name = data["id2name"]

with open("./data/artist_freq.json") as fin:
    artist_freq_dict = json.load(fin)

    N = 2500
    top_artists = [a[0] for a in sorted(
        artist_freq_dict.items(), key=lambda x: -x[1])][:N]

with open("./data/2.5k_artist_data.json") as fin:
    artist_data = json.load(fin)


# Subset slices
with open("./data/2.5k_id2name.json", "w") as fout:
    id2name_slice = {artist_id: id2name[artist_id]
                     for artist_id in top_artists}
    json.dump(id2name_slice, fout, indent=2)

with open("./data/2.5k_artist_freq.json", "w") as fout:
    artist_freq_slice = {
        artist_id: artist_freq_dict[artist_id] for artist_id in top_artists}
    json.dump(artist_freq_slice, fout)
