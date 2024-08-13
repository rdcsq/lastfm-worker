export type NowPlayingResponse = {
  title: string;
  artist: string;
  artworkUrl: string;
  url: string;
  current: boolean;
  timestamp: string;
};

type LastFmGetRecentTracks = {
  recenttracks: {
    track: {
      name: string; // Track title
      artist: {
        "#text": string; // Artist name
      };
      image: {
        "#text": string; // Image URL
      }[];
      url: string; // Last.fm URL
      "@attr": {
        nowplaying: string;
      };
    }[];
  };
};

export async function getLastPlayed(user: string, apiKey: string): Promise<NowPlayingResponse | null> {
  try {
    const req = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=1`
    );
    const data: LastFmGetRecentTracks = await req.json();
    if (!req.ok) {
      return null;
    }

    const track = data.recenttracks.track[0];
    return {
      title: track.name,
      artist: track.artist["#text"],
      artworkUrl: track.image[track.image.length - 1]["#text"],
      url: track.url,
      current: (track["@attr"]?.nowplaying ?? false) == "true",
      timestamp: new Date().toISOString(),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
