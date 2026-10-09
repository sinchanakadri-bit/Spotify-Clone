/**
 * Spotify Clone - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Player Engine
  const player = new AudioPlayerEngine();

  // 2. Application State
  const state = {
    currentView: 'home', // 'home' | 'search' | 'playlist'
    viewHistory: ['home'],
    historyIndex: 0,
    currentPlaylistId: null,
    likedSongIds: new Set(JSON.parse(localStorage.getItem('spotify_liked_songs') || '["track_1", "track_2", "track_4", "track_7"]')),
    customPlaylists: JSON.parse(localStorage.getItem('spotify_custom_playlists') || '[]'),
    activeLyricsTrackId: null
  };

  // Sync initial liked state with data
  SPOTIFY_DATA.songs.forEach(song => {
    song.liked = state.likedSongIds.has(song.id);
  });

  // 3. DOM Elements
  const elements = {
    // Nav & Header
    navHome: document.getElementById('nav-home'),
    navSearch: document.getElementById('nav-search'),
    navBackBtn: document.getElementById('nav-back-btn'),
    navForwardBtn: document.getElementById('nav-forward-btn'),
    headerSearchBox: document.getElementById('header-search-box'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    topHeader: document.querySelector('.top-header'),
    greetingText: document.getElementById('greeting-text'),
    logoHomeLink: document.getElementById('logo-home-link'),

    // Views
    mainScroll: document.getElementById('main-content-scroll'),
    homeView: document.getElementById('home-view'),
    searchView: document.getElementById('search-view'),
    playlistView: document.getElementById('playlist-view'),

    // Home Shelves
    quickRecentsGrid: document.getElementById('quick-recents-grid'),
    madeForYouShelf: document.getElementById('made-for-you-shelf'),
    topHitsShelf: document.getElementById('top-hits-shelf'),
    chillShelf: document.getElementById('chill-shelf'),
    artistsShelf: document.getElementById('artists-shelf'),

    // Search View
    browseCategoriesSection: document.getElementById('browse-categories-section'),
    searchResultsSection: document.getElementById('search-results-section'),
    categoriesGrid: document.getElementById('categories-grid'),
    topResultCard: document.getElementById('top-result-card'),
    searchSongsList: document.getElementById('search-songs-list'),
    searchPlaylistsShelf: document.getElementById('search-playlists-shelf'),

    // Playlist View
    playlistHeroBanner: document.getElementById('playlist-hero-banner'),
    playlistCoverImg: document.getElementById('playlist-cover-img'),
    customCoverPlaceholder: document.getElementById('custom-cover-placeholder'),
    playlistHeroTitle: document.getElementById('playlist-hero-title'),
    playlistHeroDesc: document.getElementById('playlist-hero-desc'),
    playlistTypeTag: document.getElementById('playlist-type-tag'),
    playlistAuthorName: document.getElementById('playlist-author-name'),
    playlistTrackCount: document.getElementById('playlist-track-count'),
    playlistTotalDuration: document.getElementById('playlist-total-duration'),
    playlistPlayAllBtn: document.getElementById('playlist-play-all-btn'),
    playlistLikeToggleBtn: document.getElementById('playlist-like-toggle-btn'),
    playlistTracklistBody: document.getElementById('playlist-tracklist-body'),

    // Sidebar
    sidebarPlaylistsList: document.getElementById('sidebar-playlists-list'),
    likedSongsNavItem: document.getElementById('liked-songs-nav-item'),
    likedCount: document.getElementById('liked-count'),
    createPlaylistBtn: document.getElementById('create-playlist-btn'),
    libraryFilterInput: document.getElementById('library-filter-input'),

    // Player Bar
    playerCover: document.getElementById('player-cover'),
    playerTitle: document.getElementById('player-title'),
    playerArtist: document.getElementById('player-artist'),
    playerLikeBtn: document.getElementById('player-like-btn'),
    playPauseBtn: document.getElementById('play-pause-btn'),
    playPauseIcon: document.getElementById('play-pause-icon'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    shuffleBtn: document.getElementById('shuffle-btn'),
    repeatBtn: document.getElementById('repeat-btn'),
    currentTime: document.getElementById('current-time'),
    totalTime: document.getElementById('total-time'),
    progressWrapper: document.getElementById('progress-wrapper'),
    progressFill: document.getElementById('progress-fill'),
    progressTooltip: document.getElementById('progress-tooltip'),
    volumeWrapper: document.getElementById('volume-wrapper'),
    volumeFill: document.getElementById('volume-fill'),
    volumeIconBtn: document.getElementById('volume-icon-btn'),
    volumeIcon: document.getElementById('volume-icon'),

    // Lyrics Modal
    lyricsBtn: document.getElementById('lyrics-btn'),
    lyricsModal: document.getElementById('lyrics-overlay-modal'),
    closeLyricsBtn: document.getElementById('close-lyrics-btn'),
    lyricsTrackTitle: document.getElementById('lyrics-track-title'),
    lyricsTrackArtist: document.getElementById('lyrics-track-artist'),
    lyricsContentContainer: document.getElementById('lyrics-content-container'),

    // Queue Sidebar
    queueBtn: document.getElementById('queue-btn'),
    queueSidebar: document.getElementById('queue-sidebar'),
    closeQueueBtn: document.getElementById('close-queue-btn'),
    queueCurrentTrack: document.getElementById('queue-current-track'),
    queueNextList: document.getElementById('queue-next-list'),

    // Create Playlist Modal
    createPlaylistModal: document.getElementById('create-playlist-modal'),
    closeCreateModal: document.getElementById('close-create-modal'),
    cancelCreatePlaylist: document.getElementById('cancel-create-playlist'),
    createPlaylistForm: document.getElementById('create-playlist-form'),
    newPlaylistName: document.getElementById('new-playlist-name'),
    newPlaylistDesc: document.getElementById('new-playlist-desc'),

    // Toast
    toast: document.getElementById('toast-notification'),
    toastMsg: document.getElementById('toast-message')
  };

  /* ==========================================================================
     HELPER FUNCTIONS
     ========================================================================== */
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function showToast(message) {
    elements.toastMsg.textContent = message;
    elements.toast.classList.remove('hidden');
    clearTimeout(elements.toastTimeout);
    elements.toastTimeout = setTimeout(() => {
      elements.toast.classList.add('hidden');
    }, 2800);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  function saveLikes() {
    localStorage.setItem('spotify_liked_songs', JSON.stringify([...state.likedSongIds]));
    elements.likedCount.textContent = state.likedSongIds.size;
  }

  function saveCustomPlaylists() {
    localStorage.setItem('spotify_custom_playlists', JSON.stringify(state.customPlaylists));
  }

  /* ==========================================================================
     ROUTING & VIEW MANAGEMENT
     ========================================================================== */
  function switchView(viewName, playlistId = null, pushState = true) {
    state.currentView = viewName;
    if (playlistId) state.currentPlaylistId = playlistId;

    if (pushState) {
      state.viewHistory.push({ view: viewName, playlistId });
      state.historyIndex = state.viewHistory.length - 1;
    }

    // Update Header Navigation History Buttons state
    elements.navBackBtn.disabled = state.historyIndex <= 0;
    elements.navForwardBtn.disabled = state.historyIndex >= state.viewHistory.length - 1;

    // View Panel visibility
    elements.homeView.classList.toggle('active-view', viewName === 'home');
    elements.searchView.classList.toggle('active-view', viewName === 'search');
    elements.playlistView.classList.toggle('active-view', viewName === 'playlist');

    // Sidebar active indicators
    elements.navHome.classList.toggle('active', viewName === 'home');
    elements.navSearch.classList.toggle('active', viewName === 'search');

    // Search input visibility in header
    if (viewName === 'search') {
      elements.headerSearchBox.classList.remove('hidden');
      elements.searchInput.focus();
    } else {
      elements.headerSearchBox.classList.add('hidden');
    }

    // Scroll to top of main content
    elements.mainScroll.scrollTop = 0;

    // Handle view specific rendering
    if (viewName === 'playlist') {
      renderPlaylistView(playlistId);
    }
  }

  // History Navigation Back & Forward
  elements.navBackBtn.addEventListener('click', () => {
    if (state.historyIndex > 0) {
      state.historyIndex--;
      const step = state.viewHistory[state.historyIndex];
      switchView(step.view, step.playlistId, false);
    }
  });

  elements.navForwardBtn.addEventListener('click', () => {
    if (state.historyIndex < state.viewHistory.length - 1) {
      state.historyIndex++;
      const step = state.viewHistory[state.historyIndex];
      switchView(step.view, step.playlistId, false);
    }
  });

  // Top header scroll blur background
  elements.mainScroll.addEventListener('scroll', () => {
    if (elements.mainScroll.scrollTop > 50) {
      elements.topHeader.classList.add('header-scrolled');
    } else {
      elements.topHeader.classList.remove('header-scrolled');
    }
  });

  /* ==========================================================================
     HOME VIEW RENDERING
     ========================================================================== */
  function initHomeView() {
    elements.greetingText.textContent = getGreeting();

    // 1. Quick recents grid (6 items)
    const quickItems = [
      { id: 'liked', title: 'Liked Songs', isLiked: true },
      ...SPOTIFY_DATA.playlists.slice(0, 5)
    ];

    elements.quickRecentsGrid.innerHTML = quickItems.map(item => {
      if (item.isLiked) {
        return `
          <div class="quick-card" data-playlist-id="liked">
            <div class="quick-thumb-icon quick-thumb-liked">
              <i class="fa-solid fa-heart"></i>
            </div>
            <span>Liked Songs</span>
            <button class="quick-play-btn" data-play-playlist="liked" title="Play Liked Songs">
              <i class="fa-solid fa-play"></i>
            </button>
          </div>
        `;
      }
      return `
        <div class="quick-card" data-playlist-id="${item.id}">
          <img src="${item.cover}" alt="${item.title}" />
          <span>${item.title}</span>
          <button class="quick-play-btn" data-play-playlist="${item.id}" title="Play ${item.title}">
            <i class="fa-solid fa-play"></i>
          </button>
        </div>
      `;
    }).join('');

    // 2. Made For You Shelf
    elements.madeForYouShelf.innerHTML = SPOTIFY_DATA.playlists.slice(0, 4).map(renderPlaylistCard).join('');

    // 3. Today's Top Hits Shelf
    elements.topHitsShelf.innerHTML = [
      SPOTIFY_DATA.playlists[0],
      SPOTIFY_DATA.playlists[3],
      SPOTIFY_DATA.playlists[4],
      SPOTIFY_DATA.playlists[1]
    ].map(renderPlaylistCard).join('');

    // 4. Chill & Focus Shelf
    elements.chillShelf.innerHTML = [
      SPOTIFY_DATA.playlists[1],
      SPOTIFY_DATA.playlists[2],
      SPOTIFY_DATA.playlists[5]
    ].map(renderPlaylistCard).join('');

    // 5. Popular Artists Shelf
    elements.artistsShelf.innerHTML = SPOTIFY_DATA.artists.map(art => `
      <div class="music-card" data-artist-id="${art.id}">
        <div class="card-img-wrapper">
          <img src="${art.avatar}" alt="${art.name}" class="card-img" />
          <button class="card-play-btn" data-play-artist="${art.id}">
            <i class="fa-solid fa-play"></i>
          </button>
        </div>
        <div class="card-title">${art.name}</div>
        <div class="card-desc">Artist • ${art.genre}</div>
      </div>
    `).join('');
  }

  function renderPlaylistCard(pl) {
    return `
      <div class="music-card" data-playlist-id="${pl.id}">
        <div class="card-img-wrapper">
          <img src="${pl.cover}" alt="${pl.title}" class="card-img" />
          <button class="card-play-btn" data-play-playlist="${pl.id}" title="Play ${pl.title}">
            <i class="fa-solid fa-play"></i>
          </button>
        </div>
        <div class="card-title">${pl.title}</div>
        <div class="card-desc">${pl.description}</div>
      </div>
    `;
  }

  /* ==========================================================================
     SEARCH & EXPLORE VIEW
     ========================================================================== */
  function initSearchView() {
    // Render Browse all category cards
    elements.categoriesGrid.innerHTML = SPOTIFY_DATA.categories.map(cat => `
      <div class="category-card" style="background-color: ${cat.color}" data-genre="${cat.id}">
        <span class="category-title">${cat.title}</span>
        <img src="${cat.image}" alt="${cat.title}" class="category-img" />
      </div>
    `).join('');

    // Search Input Event
    elements.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      elements.clearSearchBtn.classList.toggle('hidden', query.length === 0);

      if (query.length === 0) {
        elements.searchResultsSection.classList.add('hidden');
        elements.browseCategoriesSection.classList.remove('hidden');
      } else {
        performSearch(query);
      }
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      elements.clearSearchBtn.classList.add('hidden');
      elements.searchResultsSection.classList.add('hidden');
      elements.browseCategoriesSection.classList.remove('hidden');
      elements.searchInput.focus();
    });
  }

  function performSearch(query) {
    elements.browseCategoriesSection.classList.add('hidden');
    elements.searchResultsSection.classList.remove('hidden');

    // Filter matching songs
    const matchedSongs = SPOTIFY_DATA.songs.filter(s =>
      s.title.toLowerCase().includes(query) ||
      s.artist.toLowerCase().includes(query) ||
      s.album.toLowerCase().includes(query)
    );

    // Filter matching playlists
    const matchedPlaylists = SPOTIFY_DATA.playlists.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );

    // Top Result
    if (matchedSongs.length > 0) {
      const top = matchedSongs[0];
      elements.topResultCard.innerHTML = `
        <img src="${top.cover}" alt="${top.title}" class="top-result-img" />
        <div class="top-result-title">${top.title}</div>
        <div class="top-result-meta">
          <span class="badge-tag">Song</span>
          <span class="card-desc">${top.artist} • ${top.album}</span>
        </div>
        <button class="top-result-play-btn" data-play-track-id="${top.id}" title="Play ${top.title}">
          <i class="fa-solid fa-play"></i>
        </button>
      `;
    } else {
      elements.topResultCard.innerHTML = `
        <div class="top-result-title">No songs found</div>
        <p class="card-desc">Try searching for an artist, song title, or album.</p>
      `;
    }

    // Song rows list (up to 4 songs)
    if (matchedSongs.length > 0) {
      elements.searchSongsList.innerHTML = matchedSongs.slice(0, 4).map(song => {
        const isCurrent = player.currentTrack && player.currentTrack.id === song.id;
        const isLiked = state.likedSongIds.has(song.id);
        return `
          <div class="search-song-row ${isCurrent ? 'playing' : ''}" data-track-id="${song.id}">
            <div class="search-song-left">
              <img src="${song.cover}" alt="${song.title}" class="search-song-thumb" />
              <div class="search-song-info">
                <span class="search-song-title">${song.title}</span>
                <span class="search-song-artist">${song.artist}</span>
              </div>
            </div>
            <div class="track-col-duration-wrap">
              <button class="track-row-like-btn ${isLiked ? 'liked' : ''}" data-like-track-id="${song.id}">
                <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </button>
              <span class="track-duration-text">${formatTime(song.duration)}</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      elements.searchSongsList.innerHTML = `<p style="padding: 12px; color: var(--text-subdued);">No matching songs found</p>`;
    }

    // Matching Playlists Shelf
    if (matchedPlaylists.length > 0) {
      elements.searchPlaylistsShelf.innerHTML = matchedPlaylists.map(renderPlaylistCard).join('');
    } else {
      elements.searchPlaylistsShelf.innerHTML = SPOTIFY_DATA.playlists.slice(0, 4).map(renderPlaylistCard).join('');
    }
  }

  /* ==========================================================================
     PLAYLIST DETAILS VIEW
     ========================================================================== */
  function renderPlaylistView(playlistId) {
    let title, desc, cover, color, author, tracks = [];

    if (playlistId === 'liked') {
      title = "Liked Songs";
      desc = "All your favorite tracks saved in one place.";
      cover = null;
      color = "#450af5";
      author = SPOTIFY_DATA.user.name;
      tracks = SPOTIFY_DATA.songs.filter(s => state.likedSongIds.has(s.id));
      elements.playlistTypeTag.textContent = "Playlist";
      elements.playlistCoverImg.classList.add('hidden');
      elements.customCoverPlaceholder.classList.remove('hidden');
      elements.customCoverPlaceholder.style.background = "linear-gradient(135deg, #450af5, #c4efd9)";
      elements.customCoverPlaceholder.innerHTML = `<i class="fa-solid fa-heart" style="color: white; font-size: 5rem;"></i>`;
    } else {
      // Find curated or custom playlist
      let pl = SPOTIFY_DATA.playlists.find(p => p.id === playlistId);
      if (!pl) {
        pl = state.customPlaylists.find(p => p.id === playlistId);
      }

      if (pl) {
        title = pl.title;
        desc = pl.description;
        cover = pl.cover || null;
        color = pl.accentColor || "#535353";
        author = pl.author || SPOTIFY_DATA.user.name;
        elements.playlistTypeTag.textContent = "Public Playlist";

        if (cover) {
          elements.playlistCoverImg.src = cover;
          elements.playlistCoverImg.classList.remove('hidden');
          elements.customCoverPlaceholder.classList.add('hidden');
        } else {
          elements.playlistCoverImg.classList.add('hidden');
          elements.customCoverPlaceholder.classList.remove('hidden');
          elements.customCoverPlaceholder.style.background = "#282828";
          elements.customCoverPlaceholder.innerHTML = `<i class="fa-solid fa-music"></i>`;
        }

        // Resolve tracks
        if (pl.trackIds) {
          tracks = pl.trackIds.map(id => SPOTIFY_DATA.songs.find(s => s.id === id)).filter(Boolean);
        } else {
          tracks = SPOTIFY_DATA.songs.slice(0, 5); // Fallback tracks
        }
      }
    }

    // Set Hero Metadata
    elements.playlistHeroTitle.textContent = title;
    elements.playlistHeroDesc.textContent = desc;
    elements.playlistAuthorName.textContent = author;
    elements.playlistHeroBanner.style.background = `linear-gradient(180deg, ${color} 0%, #121212 100%)`;
    elements.playlistTrackCount.textContent = `${tracks.length} songs`;

    const totalSeconds = tracks.reduce((acc, t) => acc + (t.duration || 180), 0);
    elements.playlistTotalDuration.textContent = formatDurationLong(totalSeconds);

    // Render Tracklist rows
    if (tracks.length === 0) {
      elements.playlistTracklistBody.innerHTML = `
        <div style="padding: 48px; text-align: center; color: var(--text-subdued);">
          <h3>Songs you like will appear here</h3>
          <p style="margin-top: 8px;">Save songs by tapping the heart icon on any track.</p>
        </div>
      `;
    } else {
      elements.playlistTracklistBody.innerHTML = tracks.map((track, idx) => {
        const isCurrent = player.currentTrack && player.currentTrack.id === track.id;
        const isPlayingNow = isCurrent && player.isPlaying;
        const isLiked = state.likedSongIds.has(track.id);

        return `
          <div class="track-row ${isCurrent ? 'playing' : ''}" data-track-id="${track.id}" data-index="${idx}">
            <div class="track-col-index">
              <span class="track-index-num">${idx + 1}</span>
              <button class="track-row-play-btn" title="Play ${track.title}">
                <i class="fa-solid fa-play"></i>
              </button>
              <div class="equalizer-bars">
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
                <div class="eq-bar"></div>
              </div>
            </div>
            <div class="track-col-title">
              <img src="${track.cover}" alt="${track.title}" class="track-thumb" />
              <div class="track-title-block">
                <span class="track-col-title-text">${track.title}</span>
                <span class="track-col-artist-text">${track.artist}</span>
              </div>
            </div>
            <div class="track-col-album">${track.album}</div>
            <div class="track-col-date">${track.dateAdded || 'Just now'}</div>
            <div class="track-col-duration-wrap">
              <button class="track-row-like-btn ${isLiked ? 'liked' : ''}" data-like-track-id="${track.id}" title="${isLiked ? 'Remove from Liked' : 'Save to Liked'}">
                <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
              </button>
              <span class="track-duration-text">${formatTime(track.duration)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Play All Button in Hero
    elements.playlistPlayAllBtn.onclick = () => {
      if (tracks.length > 0) {
        const isCurrentPlaylist = player.queue.length === tracks.length && player.queue[0]?.id === tracks[0]?.id;
        if (isCurrentPlaylist) {
          player.togglePlay();
        } else {
          player.loadPlaylist(tracks, 0, true);
        }
      }
    };
  }

  function formatDurationLong(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs} sec`;
  }

  /* ==========================================================================
     SIDEBAR & LIBRARY MANAGEMENT
     ========================================================================== */
  function renderSidebarPlaylists() {
    elements.likedCount.textContent = state.likedSongIds.size;

    // Render Curated Playlists + Custom Playlists
    const allPlaylists = [
      ...SPOTIFY_DATA.playlists,
      ...state.customPlaylists
    ];

    const currentFilter = elements.libraryFilterInput.value.toLowerCase().trim();
    const filtered = allPlaylists.filter(p => p.title.toLowerCase().includes(currentFilter));

    const html = filtered.map(pl => `
      <li class="playlist-row ${state.currentPlaylistId === pl.id ? 'active-playlist' : ''}" data-playlist-id="${pl.id}">
        ${pl.cover ? `
          <img src="${pl.cover}" alt="${pl.title}" class="playlist-cover-thumbnail" />
        ` : `
          <div class="custom-playlist-thumb"><i class="fa-solid fa-music"></i></div>
        `}
        <div class="playlist-info">
          <span class="playlist-title">${pl.title}</span>
          <span class="playlist-subtext">Playlist • ${pl.author || 'User'}</span>
        </div>
      </li>
    `).join('');

    // Remove existing dynamic rows, preserve Liked Songs item
    const existingDynamic = elements.sidebarPlaylistsList.querySelectorAll('.playlist-row:not(#liked-songs-nav-item)');
    existingDynamic.forEach(el => el.remove());

    elements.sidebarPlaylistsList.insertAdjacentHTML('beforeend', html);
  }

  // Filter Library
  elements.libraryFilterInput.addEventListener('input', () => {
    renderSidebarPlaylists();
  });

  // Create Playlist Modal Handlers
  elements.createPlaylistBtn.addEventListener('click', () => {
    elements.createPlaylistModal.classList.remove('hidden');
    elements.newPlaylistName.value = `My Playlist #${state.customPlaylists.length + 1}`;
    elements.newPlaylistName.focus();
  });

  elements.closeCreateModal.addEventListener('click', () => {
    elements.createPlaylistModal.classList.add('hidden');
  });

  elements.cancelCreatePlaylist.addEventListener('click', () => {
    elements.createPlaylistModal.classList.add('hidden');
  });

  elements.createPlaylistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = elements.newPlaylistName.value.trim();
    const desc = elements.newPlaylistDesc.value.trim();
    if (!name) return;

    const newId = `custom_pl_${Date.now()}`;
    const newPlaylist = {
      id: newId,
      title: name,
      description: desc || "Personal collection of favorite tracks.",
      cover: null,
      accentColor: "#2e77d0",
      author: SPOTIFY_DATA.user.name,
      trackIds: ["track_1", "track_2"] // initial recommended songs
    };

    state.customPlaylists.push(newPlaylist);
    saveCustomPlaylists();
    renderSidebarPlaylists();
    elements.createPlaylistModal.classList.add('hidden');
    showToast(`Created playlist "${name}"`);
    switchView('playlist', newId);
  });

  /* ==========================================================================
     GLOBAL CLICK & EVENT DELEGATION
     ========================================================================== */
  document.addEventListener('click', (e) => {
    // 1. Navigation items
    const navItem = e.target.closest('.nav-item');
    if (navItem) {
      const view = navItem.dataset.view;
      if (view) switchView(view);
      return;
    }

    if (e.target.closest('#logo-home-link')) {
      switchView('home');
      return;
    }

    // 2. Liked songs sidebar click
    const likedNav = e.target.closest('#liked-songs-nav-item');
    if (likedNav) {
      switchView('playlist', 'liked');
      return;
    }

    // 3. Playlist row in sidebar
    const sidebarPlRow = e.target.closest('.sidebar .playlist-row:not(#liked-songs-nav-item)');
    if (sidebarPlRow) {
      const id = sidebarPlRow.dataset.playlistId;
      switchView('playlist', id);
      return;
    }

    // 4. Play button on card or quick recents
    const playPlBtn = e.target.closest('[data-play-playlist]');
    if (playPlBtn) {
      e.stopPropagation();
      const plId = playPlBtn.dataset.playPlaylist;
      playPlaylistById(plId);
      return;
    }

    // 5. Music Card click (Open playlist)
    const musicCard = e.target.closest('.music-card[data-playlist-id]');
    if (musicCard) {
      const id = musicCard.dataset.playlistId;
      switchView('playlist', id);
      return;
    }

    // 6. Quick card click (Open playlist)
    const quickCard = e.target.closest('.quick-card[data-playlist-id]');
    if (quickCard) {
      const id = quickCard.dataset.playlistId;
      switchView('playlist', id);
      return;
    }

    // 7. Track row click inside playlist
    const trackRow = e.target.closest('.track-row');
    if (trackRow && !e.target.closest('.track-row-like-btn')) {
      const trackId = trackRow.dataset.trackId;
      const track = SPOTIFY_DATA.songs.find(s => s.id === trackId);
      if (track) {
        // Build playlist tracks from current view
        const currentTracks = getCurrentViewTracks();
        const index = currentTracks.findIndex(t => t.id === trackId);
        player.loadPlaylist(currentTracks, index >= 0 ? index : 0, true);
      }
      return;
    }

    // 8. Like Button on Track Row or Search Row
    const likeTrackBtn = e.target.closest('[data-like-track-id]');
    if (likeTrackBtn) {
      e.stopPropagation();
      const trackId = likeTrackBtn.dataset.likeTrackId;
      toggleLikeTrack(trackId);
      return;
    }

    // 9. Play Track in Search View
    const searchPlayBtn = e.target.closest('[data-play-track-id]');
    if (searchPlayBtn) {
      e.stopPropagation();
      const trackId = searchPlayBtn.dataset.playTrackId;
      const track = SPOTIFY_DATA.songs.find(s => s.id === trackId);
      if (track) {
        player.loadPlaylist([track, ...SPOTIFY_DATA.songs.filter(s => s.id !== trackId)], 0, true);
      }
      return;
    }

    // 10. Search Song Row click
    const searchRow = e.target.closest('.search-song-row');
    if (searchRow && !e.target.closest('.track-row-like-btn')) {
      const trackId = searchRow.dataset.trackId;
      const track = SPOTIFY_DATA.songs.find(s => s.id === trackId);
      if (track) {
        player.loadPlaylist([track, ...SPOTIFY_DATA.songs.filter(s => s.id !== trackId)], 0, true);
      }
      return;
    }

    // 11. Genre / Category Card Click
    const genreCard = e.target.closest('.category-card');
    if (genreCard) {
      const genre = genreCard.dataset.genre;
      elements.searchInput.value = genre;
      performSearch(genre);
      return;
    }
  });

  function getCurrentViewTracks() {
    if (state.currentView === 'playlist') {
      if (state.currentPlaylistId === 'liked') {
        return SPOTIFY_DATA.songs.filter(s => state.likedSongIds.has(s.id));
      }
      const pl = SPOTIFY_DATA.playlists.find(p => p.id === state.currentPlaylistId) ||
                 state.customPlaylists.find(p => p.id === state.currentPlaylistId);
      if (pl && pl.trackIds) {
        return pl.trackIds.map(id => SPOTIFY_DATA.songs.find(s => s.id === id)).filter(Boolean);
      }
    }
    return SPOTIFY_DATA.songs;
  }

  function playPlaylistById(id) {
    let tracks = [];
    if (id === 'liked') {
      tracks = SPOTIFY_DATA.songs.filter(s => state.likedSongIds.has(s.id));
    } else {
      const pl = SPOTIFY_DATA.playlists.find(p => p.id === id) ||
                 state.customPlaylists.find(p => p.id === id);
      if (pl && pl.trackIds) {
        tracks = pl.trackIds.map(tid => SPOTIFY_DATA.songs.find(s => s.id === tid)).filter(Boolean);
      }
    }
    if (tracks.length > 0) {
      player.loadPlaylist(tracks, 0, true);
      showToast(`Playing ${id === 'liked' ? 'Liked Songs' : 'Playlist'}`);
    } else {
      showToast('No songs found in this playlist yet');
    }
  }

  function toggleLikeTrack(trackId) {
    const isLiked = state.likedSongIds.has(trackId);
    if (isLiked) {
      state.likedSongIds.delete(trackId);
      showToast("Removed from your Liked Songs");
    } else {
      state.likedSongIds.add(trackId);
      showToast("Added to your Liked Songs");
    }
    saveLikes();

    // Update active player like button if currently playing
    if (player.currentTrack && player.currentTrack.id === trackId) {
      updatePlayerLikeState(!isLiked);
    }

    // Refresh active view to reflect updated hearts
    if (state.currentView === 'playlist') {
      renderPlaylistView(state.currentPlaylistId);
    } else if (state.currentView === 'search') {
      performSearch(elements.searchInput.value.trim().toLowerCase());
    }
  }

  /* ==========================================================================
     PLAYER CONTROLS & TIMELINE
     ========================================================================== */
  elements.playPauseBtn.addEventListener('click', () => {
    player.togglePlay();
  });

  elements.prevBtn.addEventListener('click', () => {
    player.prev();
  });

  elements.nextBtn.addEventListener('click', () => {
    player.next();
  });

  elements.shuffleBtn.addEventListener('click', () => {
    const active = player.toggleShuffle();
    elements.shuffleBtn.classList.toggle('active', active);
    showToast(active ? "Shuffle on" : "Shuffle off");
  });

  elements.repeatBtn.addEventListener('click', () => {
    const mode = player.toggleRepeat();
    elements.repeatBtn.classList.toggle('active', mode !== 'off');
    if (mode === 'one') {
      elements.repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i><span style="position: absolute; font-size: 8px; font-weight: 800; top: 1px; right: 2px;">1</span>';
      showToast("Repeat one");
    } else if (mode === 'all') {
      elements.repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
      showToast("Repeat playlist");
    } else {
      elements.repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
      showToast("Repeat off");
    }
  });

  // Track Progress Scrubbing
  let isScrubbing = false;
  elements.progressWrapper.addEventListener('mousedown', (e) => {
    isScrubbing = true;
    updateSeekFromEvent(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isScrubbing) {
      updateSeekFromEvent(e);
    }
    // Tooltip update
    const rect = elements.progressWrapper.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top - 15 && e.clientY <= rect.bottom + 15) {
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const totalSec = player.getDuration();
      elements.progressTooltip.textContent = formatTime(totalSec * percent);
      elements.progressTooltip.style.left = `${percent * 100}%`;
    }
  });

  window.addEventListener('mouseup', () => {
    isScrubbing = false;
  });

  function updateSeekFromEvent(e) {
    const rect = elements.progressWrapper.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    elements.progressFill.style.width = `${percent * 100}%`;
    player.seekPercent(percent);
  }

  // Volume Bar Scrubbing
  let isVolumeScrubbing = false;
  elements.volumeWrapper.addEventListener('mousedown', (e) => {
    isVolumeScrubbing = true;
    updateVolumeFromEvent(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isVolumeScrubbing) {
      updateVolumeFromEvent(e);
    }
  });

  window.addEventListener('mouseup', () => {
    isVolumeScrubbing = false;
  });

  function updateVolumeFromEvent(e) {
    const rect = elements.volumeWrapper.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    elements.volumeFill.style.width = `${percent * 100}%`;
    player.setVolume(percent);
    updateVolumeIcon(percent);
  }

  elements.volumeIconBtn.addEventListener('click', () => {
    const muted = player.toggleMute();
    if (muted) {
      elements.volumeFill.style.width = '0%';
      elements.volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else {
      elements.volumeFill.style.width = `${player.volume * 100}%`;
      updateVolumeIcon(player.volume);
    }
  });

  function updateVolumeIcon(vol) {
    if (vol === 0) {
      elements.volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (vol < 0.5) {
      elements.volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
      elements.volumeIcon.className = 'fa-solid fa-volume-high';
    }
  }

  // Like Song from Player Bar
  elements.playerLikeBtn.addEventListener('click', () => {
    if (player.currentTrack) {
      toggleLikeTrack(player.currentTrack.id);
    }
  });

  function updatePlayerLikeState(isLiked) {
    elements.playerLikeBtn.classList.toggle('liked', isLiked);
    elements.playerLikeBtn.innerHTML = `<i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
  }

  /* ==========================================================================
     AUDIO PLAYER ENGINE CALLBACKS
     ========================================================================== */
  player.onTrackChange = (track) => {
    elements.playerCover.src = track.cover;
    elements.playerTitle.textContent = track.title;
    elements.playerArtist.textContent = track.artist;
    elements.totalTime.textContent = formatTime(track.duration);

    const isLiked = state.likedSongIds.has(track.id);
    updatePlayerLikeState(isLiked);

    // Update active highlight in playlist rows
    document.querySelectorAll('.track-row').forEach(row => {
      row.classList.toggle('playing', row.dataset.trackId === track.id);
    });

    // Update active lyrics if lyrics modal is open
    if (!elements.lyricsModal.classList.contains('hidden')) {
      renderLyrics(track);
    }

    // Update Queue drawer
    updateQueueDrawer();
  };

  player.onPlayStateChange = (isPlaying) => {
    if (isPlaying) {
      elements.playPauseIcon.className = 'fa-solid fa-pause';
      elements.playlistPlayAllBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
      elements.playPauseIcon.className = 'fa-solid fa-play';
      elements.playlistPlayAllBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  };

  player.onTimeUpdate = (currentTime, duration) => {
    if (!isScrubbing) {
      const percent = duration > 0 ? (currentTime / duration) * 100 : 0;
      elements.progressFill.style.width = `${percent}%`;
      elements.currentTime.textContent = formatTime(currentTime);
      elements.totalTime.textContent = formatTime(duration);
    }

    // Sync Karaoke Lyrics
    if (!elements.lyricsModal.classList.contains('hidden') && player.currentTrack) {
      syncLyricsWithTime(currentTime);
    }
  };

  player.onQueueChange = () => {
    updateQueueDrawer();
  };

  /* ==========================================================================
     LYRICS MODAL & KARAOKE SYNC
     ========================================================================== */
  elements.lyricsBtn.addEventListener('click', () => {
    const isHidden = elements.lyricsModal.classList.toggle('hidden');
    elements.lyricsBtn.classList.toggle('active', !isHidden);
    if (!isHidden && player.currentTrack) {
      renderLyrics(player.currentTrack);
    }
  });

  elements.closeLyricsBtn.addEventListener('click', () => {
    elements.lyricsModal.classList.add('hidden');
    elements.lyricsBtn.classList.remove('active');
  });

  function renderLyrics(track) {
    elements.lyricsTrackTitle.textContent = track.title;
    elements.lyricsTrackArtist.textContent = track.artist;

    if (!track.lyrics || track.lyrics.length === 0) {
      elements.lyricsContentContainer.innerHTML = `
        <div style="font-size: 1.8rem; color: rgba(255,255,255,0.5); font-weight: 700;">
          Looks like we don't have the lyrics for this song yet.
        </div>
      `;
      return;
    }

    elements.lyricsContentContainer.innerHTML = track.lyrics.map((line, idx) => `
      <div class="lyrics-line" data-time="${line.time}" data-index="${idx}">
        ${line.text}
      </div>
    `).join('');

    // Click lyric line to seek
    elements.lyricsContentContainer.querySelectorAll('.lyrics-line').forEach(lineEl => {
      lineEl.addEventListener('click', () => {
        const targetTime = parseFloat(lineEl.dataset.time);
        player.seekTo(targetTime);
      });
    });
  }

  function syncLyricsWithTime(time) {
    const lines = elements.lyricsContentContainer.querySelectorAll('.lyrics-line');
    if (lines.length === 0) return;

    let activeLine = null;
    lines.forEach(line => {
      const lineTime = parseFloat(line.dataset.time);
      if (time >= lineTime) {
        activeLine = line;
      }
      line.classList.remove('active');
    });

    if (activeLine) {
      activeLine.classList.add('active');
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ==========================================================================
     QUEUE SIDEBAR
     ========================================================================== */
  elements.queueBtn.addEventListener('click', () => {
    const isHidden = elements.queueSidebar.classList.toggle('hidden');
    elements.queueBtn.classList.toggle('active', !isHidden);
    if (!isHidden) {
      updateQueueDrawer();
    }
  });

  elements.closeQueueBtn.addEventListener('click', () => {
    elements.queueSidebar.classList.add('hidden');
    elements.queueBtn.classList.remove('active');
  });

  function updateQueueDrawer() {
    if (elements.queueSidebar.classList.contains('hidden')) return;

    if (player.currentTrack) {
      elements.queueCurrentTrack.innerHTML = `
        <img src="${player.currentTrack.cover}" alt="${player.currentTrack.title}" />
        <div class="queue-item-info">
          <span class="queue-item-title" style="color: var(--spotify-green);">${player.currentTrack.title}</span>
          <span class="queue-item-artist">${player.currentTrack.artist}</span>
        </div>
      `;
    }

    const nextTracks = player.queue.slice(player.queueIndex + 1);
    if (nextTracks.length === 0) {
      elements.queueNextList.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">Queue is empty</span>`;
    } else {
      elements.queueNextList.innerHTML = nextTracks.slice(0, 10).map((t, i) => `
        <div class="queue-item" data-queue-jump="${player.queueIndex + 1 + i}">
          <img src="${t.cover}" alt="${t.title}" />
          <div class="queue-item-info">
            <span class="queue-item-title">${t.title}</span>
            <span class="queue-item-artist">${t.artist}</span>
          </div>
        </div>
      `).join('');
    }
  }

  /* ==========================================================================
     KEYBOARD SHORTCUTS
     ========================================================================== */
  window.addEventListener('keydown', (e) => {
    // Avoid triggering shortcuts while typing inside an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        player.togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        player.seekTo(Math.max(0, player.getCurrentTime() - 5));
        break;
      case 'ArrowRight':
        e.preventDefault();
        player.seekTo(Math.min(player.getDuration(), player.getCurrentTime() + 5));
        break;
      case 'ArrowUp':
        e.preventDefault();
        player.setVolume(Math.min(1, player.volume + 0.05));
        elements.volumeFill.style.width = `${player.volume * 100}%`;
        updateVolumeIcon(player.volume);
        break;
      case 'ArrowDown':
        e.preventDefault();
        player.setVolume(Math.max(0, player.volume - 0.05));
        elements.volumeFill.style.width = `${player.volume * 100}%`;
        updateVolumeIcon(player.volume);
        break;
      case 'KeyM':
        player.toggleMute();
        break;
      case 'KeyL':
        if (player.currentTrack) {
          toggleLikeTrack(player.currentTrack.id);
        }
        break;
    }
  });

  /* ==========================================================================
     INITIAL BOOTSTRAP
     ========================================================================== */
  initHomeView();
  initSearchView();
  renderSidebarPlaylists();

  // Load first playlist by default (ready to play)
  const defaultPlaylist = SPOTIFY_DATA.playlists[0];
  const initialTracks = defaultPlaylist.trackIds.map(id => SPOTIFY_DATA.songs.find(s => s.id === id)).filter(Boolean);
  player.loadPlaylist(initialTracks, 0, false);
});
