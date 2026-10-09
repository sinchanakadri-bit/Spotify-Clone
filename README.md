# 🎵 Spotify Clone Web Application

A pixel-perfect, responsive Spotify Web Player clone built with modern vanilla HTML5, CSS3, and JavaScript.

---

## ✨ Features

- **Spotify Dark Theme UI**:
  - Authentic Spotify color scheme (`#121212`, `#181818`, `#282828`, and Spotify green `#1ed760`).
  - Dynamic gradient hero banners that reflect playlist moods.
  - Hover animations with elevating cards and smooth floating green play buttons.
  - Animated equalizer bars on actively playing track rows.
  - Custom sleek Spotify scrollbars.

- **Audio Playback Engine**:
  - Full HTML5 Audio player with play, pause, next, previous, seek timeline, and volume controls.
  - **Procedural Web Audio Synth Fallback**: Automatically generates soothing ambient chords / lo-fi beats if external audio streams face CORS / network restrictions or when offline, guaranteeing playback always works.
  - Interactive scrubbing seek bar with real-time hover timestamp tooltips.
  - Real-time animated audio visualizer canvas in the player bar.
  - Shuffle and Repeat modes (`all`, `one`, `off`).

- **Navigation & Views**:
  - **Home View**: Time-of-day greeting ("Good morning / afternoon / evening"), quick-access recently played cards, "Made For You", "Today's Biggest Hits", "Chill & Focus", and "Popular Artists".
  - **Search / Explore View**: Real-time instant search across songs, artists, and albums. Browse all genre/category cards (Pop, Lo-Fi, Hip-Hop, Rock, Dance, Indie, Focus, Workout, Jazz).
  - **Playlist Details View**: Full playlist hero with cover art, metadata, track count, total duration, Play All button, and track table with row hover play buttons.
  - **Liked Songs**: Dedicated playlist with favorite songs, preserved in `localStorage`.
  - **Full-Screen / Karaoke Synchronized Lyrics**: Real-time synchronized lyrics display with active line highlighting and click-to-seek functionality.
  - **Slide-out Playback Queue**: Real-time view of what's playing now and upcoming tracks.
  - **Create Custom Playlist**: Modal to create custom playlists with custom names and descriptions, stored in `localStorage`.

- **Keyboard Shortcuts**:
  - `Space`: Play / Pause toggle
  - `ArrowLeft` / `ArrowRight`: Skip backward / forward 5 seconds
  - `ArrowUp` / `ArrowDown`: Volume up / down 5%
  - `M`: Mute / Unmute toggle
  - `L`: Like / Unlike current playing song

---

## 🚀 How to Run

### Option 1: Direct File Open
Simply double-click `index.html` in your file explorer or open it in any modern browser (Chrome, Edge, Firefox, Brave, Safari).

### Option 2: Local HTTP Server (Python)
Run the following in PowerShell or terminal inside the `spotify-clone` directory:
```bash
py -m http.server 3000
```
Then visit:
[http://localhost:3000](http://localhost:3000)

---

## 📁 File Structure
```
spotify-clone/
├── index.html            # Main HTML structure and semantic views
├── css/
│   └── style.css         # Spotify design system, layout, and responsive styles
├── js/
│   ├── songs.js          # Track catalogue, playlists, categories, and lyrics data
│   ├── audio-player.js   # Audio engine with Web Audio synthesizer fallback & visualizer
│   └── app.js            # Router, search filter, playlists, queue, lyrics, and shortcuts
└── README.md             # Project documentation
```
