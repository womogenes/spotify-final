# provocative title 

<div class="subtitle-container">
	<p>By <a href="https://womogenes.github.io" target="_blank">William Y. Feng</a> and <a href="https://tinyurl.com/ceciliasun" target="_blank">Cecilia Sun</a></p>
	<p><i>View the source code for this project <a href="https://github.com/womogenes/spotify-final" target="_blank">here</a>.</i></p>
</div>

## introduction

Music streaming service [Spotify](https://www.spotify.com/) transformed music listening when it first launched in 2008, and has since become the go-to method for streaming and listening to new music.
Gone were the days of CDs and cassettes; users could now listen to high-quality music at the touch of a button.
<!---
One of the greatest conveniences Spotify had to offer, however, was the ability to quickly create and add to playlists.
--->

The rise of Spotify and other online streaming servers has fundamentally changed the way we listen to music. 
Whereas, in the past, individual songs had to be played as part of a complete album by a singular artist, either on vinyl or, later, via cassette tapes, streaming services have made it easier for listeners to mix-and-match individual songs by different artists to curate and share completely personal and original playlists; in short, playlists have become the default way to listen to music.

The content in Spotify playlists can vary widely.
Some Spotify users group music by genre, such as in this k-pop girl group playlist:

<center>  
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2DLAaotcOJPMecaaZtrgtk?utm_source=generator" width="75%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</center>

Others group songs according to a certain set of "vibes", such as in this "chill vibes" playlist: 

<center>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/4PAzvpUoDjE1hsLyYxbxNx?utm_source=generator" width="75%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</center>

Yet others create playlists in order to set the mood for an activity, whether it be a dance party playlist, a workout playlist, or a "soft pop/rock" playlist to "take the edge off" of labor \& delivery (!?):

<center>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXe13FP72mxNn?utm_source=generator" width="75%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</center>

Others are silly, such as this user-created playlist that takes you along on an emotional journey making banana bread:

<center>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/2k9WGCD9GxTUsdYtIDnZhG?utm_source=generator" width="75%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</center>

or this playlist consisting of 343 hours of "Satan's Saxophones":

<center>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5YuogqMDKbD8KSXn71MGdt?utm_source=generator" width="75%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
</center>

## about the dataset

Spotify's [Million Playlist Dataset](https://www.aicrowd.com/challenges/spotify-million-playlist-dataset-challenge) contains a million user-created Spotify playlists from between January 2010 and October 2017.

<!---
playlist stats, cheap visualizations
--->

On average, playlists contain _x_ songs and _y_ distinct artists.
Here's a visualization of the distribution of playlist length:

And a visualization of the number of distinct artists represented per playlist:

## artist interactions

Across the one million playlists, there are a total of 287742 artists represented.
For our analysis, however, we decided to focus on the top 2500 artists as determined by the number of occurrences of any of their songs across all playlists.

<!---
not necessarily 2500
--->
  
We were interested in the concept of "artist proximity" -- in other words, how often two artists appeared in user-created playlists together. 
To rigorize this concept, we defined the "Artist Interaction Score" (AIS) between two artists to be

$$
	\operatorname{AIS}(A,B) = \ln\left(\sum_{p\text{ in playlists}}(\text{number of tracks by }A\text{ in }p)(\text{number of tracks by }B\text{ in }p)\right)
$$

## PCA (principal component analysis)

## the PCA map

## limitations

## PCA map in all its glory
