/**
 * Spotify Clone - Songs, Playlists & Categories Dataset
 */

const SPOTIFY_DATA = {
  // Current user's profile info
  user: {
    name: "Sinchana",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    playlists: []
  },

  // Search & Browse categories
  categories: [
    { id: "pop", title: "Pop", color: "#8d67ab", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
    { id: "chill", title: "Chill & Lo-Fi", color: "#477d95", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80" },
    { id: "hip-hop", title: "Hip-Hop", color: "#ba5d07", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80" },
    { id: "rock", title: "Rock Classics", color: "#e91429", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80" },
    { id: "dance", title: "Dance & EDM", color: "#d84000", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80" },
    { id: "indie", title: "Indie & Alternative", color: "#608108", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80" },
    { id: "focus", title: "Deep Focus", color: "#503750", image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&auto=format&fit=crop&q=80" },
    { id: "workout", title: "Workout Energy", color: "#777777", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80" },
    { id: "jazz", title: "Jazz In The City", color: "#bc5900", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=80" },
    { id: "mood", title: "Mood Booster", color: "#e13300", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80" }
  ],

  // Full Song Catalogue
  songs: [
    {
      id: "track_1",
      title: "Midnight City Lights",
      artist: "Neon Echoes",
      album: "Neon Horizons",
      duration: 215, // seconds (3:35)
      dateAdded: "2 days ago",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      synthPreset: "synthwave",
      liked: true,
      lyrics: [
        { time: 0, text: "♪ [Upbeat Synth Intro] ♪" },
        { time: 10, text: "Driving through the neon glow" },
        { time: 18, text: "Counting seconds as the shadows grow" },
        { time: 26, text: "Streets are whispering our secret name" },
        { time: 34, text: "Nothing here will ever feel the same" },
        { time: 42, text: "Midnight city, take me high" },
        { time: 50, text: "Underneath this purple velvet sky" },
        { time: 60, text: "We are infinite tonight..." },
        { time: 75, text: "♪ [Guitar & Synth Solo] ♪" },
        { time: 95, text: "Hold the wheel and never look back down" }
      ]
    },
    {
      id: "track_2",
      title: "Lo-Fi Coffee Shop",
      artist: "Aura Breeze",
      album: "Morning Brew EP",
      duration: 172, // 2:52
      dateAdded: "3 days ago",
      cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      synthPreset: "lofi",
      liked: true,
      lyrics: [
        { time: 0, text: "♪ [Warm Vinyl Crackle & Soft Keys] ♪" },
        { time: 12, text: "Raindrops tapping on the window glass" },
        { time: 22, text: "Watching sleepy early strangers pass" },
        { time: 32, text: "Warm cup in my frozen hands" },
        { time: 45, text: "Drifting through familiar lands" },
        { time: 60, text: "Soft jazz spinning round and round" },
        { time: 80, text: "In the sweetest gentle sound..." }
      ]
    },
    {
      id: "track_3",
      title: "Electric Pulse",
      artist: "Cyber Daze",
      album: "Digital Euphoria",
      duration: 245, // 4:05
      dateAdded: "1 week ago",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      synthPreset: "dance",
      liked: false,
      lyrics: [
        { time: 0, text: "♪ [Bass drop builds up] ♪" },
        { time: 15, text: "Feel the current in your veins" },
        { time: 28, text: "Breaking all the heavy chains" },
        { time: 40, text: "Can you hear the rhythm call?" },
        { time: 55, text: "Let the sound control it all!" },
        { time: 70, text: "Electric pulse, electric night!" }
      ]
    },
    {
      id: "track_4",
      title: "Starlight Memories",
      artist: "Luna Sol",
      album: "Celestial Dreams",
      duration: 198, // 3:18
      dateAdded: "2 weeks ago",
      cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      synthPreset: "ambient",
      liked: true,
      lyrics: [
        { time: 0, text: "♪ [Atmospheric Pad Swells] ♪" },
        { time: 14, text: "Constellations in your eyes" },
        { time: 26, text: "Painting truth across the skies" },
        { time: 38, text: "Every dream we ever knew" },
        { time: 50, text: "Brings me right back home to you" }
      ]
    },
    {
      id: "track_5",
      title: "Sunset Boulevard",
      artist: "The Velvet Waves",
      album: "Pacific Coast",
      duration: 220, // 3:40
      dateAdded: "3 weeks ago",
      cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      synthPreset: "indie",
      liked: false,
      lyrics: [
        { time: 0, text: "Golden hour washing over the bay" },
        { time: 16, text: "Another warm sweet summer day" },
        { time: 30, text: "Cruising down the coastal road" },
        { time: 46, text: "Free of every heavy load" }
      ]
    },
    {
      id: "track_6",
      title: "Deep Focus Ambient",
      artist: "Zenith Flow",
      album: "Flow State Vol. 1",
      duration: 280, // 4:40
      dateAdded: "Just now",
      cover: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      synthPreset: "focus",
      liked: false,
      lyrics: [
        { time: 0, text: "♪ [Binaural focus frequencies] ♪" },
        { time: 30, text: "Inhale calm, exhale the noise" },
        { time: 60, text: "Quiet clarity and balance" }
      ]
    },
    {
      id: "track_7",
      title: "Golden Hour Bloom",
      artist: "Mira Vance",
      album: "Seasons Change",
      duration: 185, // 3:05
      dateAdded: "1 month ago",
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      synthPreset: "pop",
      liked: true,
      lyrics: [
        { time: 0, text: "You walked in with sunshine in your hair" },
        { time: 14, text: "No one else could even compare" },
        { time: 28, text: "Take my hand before it fades" },
        { time: 42, text: "In the amber evening shades" }
      ]
    },
    {
      id: "track_8",
      title: "Tokyo After Dark",
      artist: "Kenji & The Beats",
      album: "Shinjuku Reverie",
      duration: 232, // 3:52
      dateAdded: "1 month ago",
      cover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      synthPreset: "lofi",
      liked: false,
      lyrics: [
        { time: 0, text: "Vending machines buzzing in the lane" },
        { time: 15, text: "Reflecting red neon through the rain" },
        { time: 30, text: "Fast train whispers down the line" },
        { time: 45, text: "Lost inside this space and time" }
      ]
    },
    {
      id: "track_9",
      title: "Rock Anthem '99",
      artist: "Thunder Alley",
      album: "Overdrive Reloaded",
      duration: 204, // 3:24
      dateAdded: "5 days ago",
      cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
      synthPreset: "rock",
      liked: false,
      lyrics: [
        { time: 0, text: "♪ [Overdriven Guitar Riff] ♪" },
        { time: 12, text: "Turn the amplifier all the way to ten!" },
        { time: 24, text: "We are never backing down again!" },
        { time: 36, text: "Shout it out into the roaring night!" }
      ]
    },
    {
      id: "track_10",
      title: "Smooth Velvet Jazz",
      artist: "Miles & Quartet",
      album: "Blue Note Echoes",
      duration: 260, // 4:20
      dateAdded: "1 week ago",
      cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
      synthPreset: "jazz",
      liked: false,
      lyrics: [
        { time: 0, text: "♪ [Walking Double Bass & Brushes] ♪" },
        { time: 20, text: "Midnight trumpet gently sighs" },
        { time: 40, text: "Shadows dancing before our eyes" }
      ]
    }
  ],

  // Curated Playlists
  playlists: [
    {
      id: "pl_today_top_hits",
      title: "Today's Top Hits",
      description: "The biggest tracks right now. Featuring Neon Echoes, Mira Vance, and more.",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=350&auto=format&fit=crop&q=80",
      accentColor: "#1e3264",
      author: "Spotify",
      trackIds: ["track_1", "track_3", "track_7", "track_5", "track_9"]
    },
    {
      id: "pl_chill_lofi",
      title: "Chill Lo-Fi Beats",
      description: "Cozy vibes, rainy afternoon study session, warm chords and peaceful coffee.",
      cover: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=350&auto=format&fit=crop&q=80",
      accentColor: "#477d95",
      author: "Spotify",
      trackIds: ["track_2", "track_8", "track_4", "track_6"]
    },
    {
      id: "pl_deep_focus",
      title: "Deep Focus Flow",
      description: "Keep calm and focus with ambient electronic and calming soundscapes.",
      cover: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=350&auto=format&fit=crop&q=80",
      accentColor: "#503750",
      author: "Spotify",
      trackIds: ["track_6", "track_4", "track_2", "track_10"]
    },
    {
      id: "pl_synthwave_night",
      title: "Synthwave Sunset",
      description: "Retrofuturistic nostalgia, neon synths, and midnight car drives.",
      cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=350&auto=format&fit=crop&q=80",
      accentColor: "#8d2b70",
      author: "Spotify",
      trackIds: ["track_1", "track_3", "track_5"]
    },
    {
      id: "pl_rock_classics",
      title: "Rock Legends",
      description: "Rock and roll anthems that defined generations. Guitars on fire.",
      cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=350&auto=format&fit=crop&q=80",
      accentColor: "#841515",
      author: "Spotify",
      trackIds: ["track_9", "track_5", "track_1"]
    },
    {
      id: "pl_jazz_vibes",
      title: "Jazz in the Rain",
      description: "Mellow trumpet solos, warm walking basslines and candle-lit lounge moods.",
      cover: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=350&auto=format&fit=crop&q=80",
      accentColor: "#bc5900",
      author: "Spotify",
      trackIds: ["track_10", "track_2", "track_8"]
    }
  ],

  // Featured Artists
  artists: [
    {
      id: "art_neon",
      name: "Neon Echoes",
      genre: "Synthwave / Electronic",
      avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80",
      monthlyListeners: "4,821,902 monthly listeners"
    },
    {
      id: "art_aura",
      name: "Aura Breeze",
      genre: "Lo-Fi / Chillhop",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      monthlyListeners: "2,194,540 monthly listeners"
    },
    {
      id: "art_cyber",
      name: "Cyber Daze",
      genre: "Electro Pop",
      avatar: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
      monthlyListeners: "6,419,000 monthly listeners"
    },
    {
      id: "art_mira",
      name: "Mira Vance",
      genre: "Indie Pop",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
      monthlyListeners: "3,890,211 monthly listeners"
    }
  ]
};
