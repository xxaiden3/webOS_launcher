var CONFIG = {
  use24h: true,
  blur: false,   // true enables a live frosted-glass blur on the tiles (heavier on the TV)
  apps: [
    { id: "netflix",              name: "Netflix",        letter: "N", icon: "logos/netflix.svg" },
    { id: "youtube.leanback.v4",  name: "YouTube",        letter: "Y", icon: "logos/youtube.svg" },
    { id: "amazon",               name: "Prime Video",    letter: "P", icon: "logos/prime.svg" },
    { id: "com.wbd.stream",       name: "HBO Max",        letter: "M", icon: "logos/hbomax.svg" },
    { id: "com.apple.appletv",    name: "Apple TV",       letter: "tv", icon: "logos/appletv.svg" },
    { id: "spotify-beehive",      name: "Spotify",        letter: "S", icon: "logos/spotify.svg" },
    { id: "tv.twitch.tv.starshot.lg", name: "Twitch",     letter: "T", icon: "logos/twitch.svg" },
    { id: "com.webos.app.livetv", name: "Live TV",       letter: "TV", icon: "logos/livetv.svg" },
    { id: "com.webos.app.browser",name: "Browser",       letter: "W", icon: "logos/browser.svg" },
    { id: "com.webos.app.home",   name: "LG Home",        letter: "LG", icon: "logos/lg.svg" }
  ],
  // Apps that are not in the dock by default but get their logo in the all-apps grid.
  // names: the app's title on the TV (lowercase); matches even if the id differs
  known: [
    { id: "com.disney.disneyplus-prod", names: ["disney+", "disney plus"], name: "Disney+", letter: "D", icon: "logos/disney.svg" },
    { id: "com.apple.music", names: ["apple music", "music"], name: "Apple Music", letter: "M", icon: "logos/applemusic.svg" },
    { id: "com.webos.app.mediadiscovery", name: "Media Player", letter: "MP", icon: "logos/media.svg" },
    { id: "airplay", name: "AirPlay", letter: "AP", icon: "logos/airplay.svg" }
  ],
  inputs: [
    { id: "com.webos.app.hdmi1", name: "HDMI 1" },
    { id: "com.webos.app.hdmi2", name: "HDMI 2" },
    { id: "com.webos.app.hdmi3", name: "HDMI 3" },
    { id: "com.webos.app.hdmi4", name: "HDMI 4" }
  ],
  // App order: hold OK on a dock tile, move with left/right. Increase this number to reset the saved order.
  orderVersion: 2,
  // Background slideshow. Put your own images in the wallpapers/ folder and list them here (1920x1080 JPG recommended).
  // wallpaperEvery: seconds between images (0 = stay on the first image)
  wallpaperEvery: 120,
  // Memory cleanup: reload the page every N hours while idle on the home screen (0 = off)
  refreshHours: 6,
  wallpapers: [
    "bg.jpg",
    "wallpapers/autumn-lake.jpg",
    "wallpapers/crater-lake.jpg",
    "wallpapers/morning-cliff.jpg",
    "wallpapers/silent-lake.jpg",
    "wallpapers/lake-view.jpg"
  ],
  // Control panel (gear button). key: wifi | bluetooth | memory | tv | restore
  control: [
    { key: "wifi",      title: "Wi-Fi",       sub: "Network settings",      app: { id: "com.palm.app.settings", params: { target: "network" } } },
      { key: "bluetooth", title: "Bluetooth",   sub: "Audio output",       app: { id: "com.palm.app.settings", params: { target: "sound" } } },
    { key: "memory",    title: "Memory",      sub: "Loading…" },
    { key: "tv",        title: "TV Settings", sub: "All settings",      app: { id: "com.palm.app.settings" } },
    { key: "restore",   title: "Default",  sub: "Reset dock" }
  ],
  // All-apps grid (down key). If the list cannot be read from the TV, this built-in list is shown.
  // ssapHosts: addresses of the TV's own remote-control interface to try, in order (add your TV's IP if 127.0.0.1 fails)
  ssapHosts: ["127.0.0.1"],
  gridHide: [],
  allApps: [
    { id: "amazon", title: "Prime Video" },
    { id: "com.apple.appletv", title: "Apple TV" },
    { id: "com.palm.app.settings", title: "Settings" },
    { id: "com.wbd.stream", title: "HBO Max" },
    { id: "com.webos.app.browser", title: "Web Browser" },
    { id: "com.webos.app.camera", title: "Camera" },
    { id: "com.webos.app.channeledit", title: "Edit Channels" },
    { id: "com.webos.app.discovery", title: "LG Content Store" },
    { id: "com.webos.app.gameoptimizer", title: "Game Optimizer" },
    { id: "com.webos.app.home", title: "LG Home" },
    { id: "com.webos.app.homeconnect", title: "Home Hub" },
    { id: "com.webos.app.igallery", title: "Gallery" },
    { id: "com.webos.app.livetv", title: "Live TV" },
    { id: "com.webos.app.miracast", title: "Screen Share" },
    { id: "com.webos.app.self-diagnosis", title: "Self Diagnosis" },
    { id: "com.webos.app.tvuserguide", title: "User Guide" },
    { id: "com.webos.app.voice", title: "Voice Assistant" },
    { id: "netflix", title: "Netflix" },
    { id: "spotify-beehive", title: "Spotify" },
    { id: "tv.twitch.tv.starshot.lg", title: "Twitch" },
    { id: "youtube.leanback.v4", title: "YouTube" }
  ],
  // auto: true -> the city is found automatically from your IP address (ipwho.is). If that fails, the city below is used.
  // Set auto: false to always show the city below.
  weather:  { auto: true, name: "Ankara", lat: 39.93, lon: 32.86 }
};
