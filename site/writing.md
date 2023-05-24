# provocative title

## introduction

Music streaming service [Spotify](https://www.spotify.com/) transformed music listening when it first launched in 2008, and has since become the go-to method for streaming and listening to new music.
Gone were the days of CDs and cassettes; users could now listen to high-quality music at the touch of a button.
One of the greatest conveniences Spotify had to offer, however, was the ability to quickly create and add to playlists.

## about the dataset

Spotify's [Million Playlist Dataset](https://www.aicrowd.com/challenges/spotify-million-playlist-dataset-challenge) contains a million user-created Spotify playlists from between January 2010 and October 2017.

<!---
playlist stats, cheap visualizations
--->

On average, playlists contain _x_ songs and _y_ distinct artists.
Here's a visualization of the distribution of playlist length:

And a visualization of the number of distinct artists represented per playlist:

## artist interactions

Across the million playlists, there are a total of $298,000$ish artists represented.
However, for our analysis, we decided to focus on the top $2500$ artists as determined by the number of occurrences of any of their songs across all playlists.

We were roughly interested in the concept of "artist proximity" -- in other words, how often artists appeared in user-created playlists together. To refine this concept, we defined the "Artist Interaction Score" (AIS) between two artists to be

$$
	\operatorname{AIS}(A,B) = \ln\left(\sum_{p\text{ in playlists}}()()\right)
$$

## PCA (principal component analysis)

## the PCA map

## limitations

## PCA map in all its glory

<!---
comment test, for cecilia's reference
--->
