<img width="1920" height="1080" alt="preview_v14" src="https://github.com/user-attachments/assets/ef33e7e8-2726-45da-a206-10695db70a6b" />
# webOS Launcher (com.simple.launcher)

A simple home screen / launcher app for LG webOS TVs. Tested on an LG 49LF630V (webOS 2.2.3).

## Features
- Clock and weather (Open-Meteo, no API key required)
- App shortcuts (Netflix, YouTube, Prime Video, Browser, Live TV, LG Home)
- Wi-Fi and Settings shortcuts
- Remote control navigation

## Compatibility
Written in plain ES5 JavaScript and basic CSS (no flex/grid/CSS variables) so it runs on the old Chromium 34 web engine of webOS 2.x. Newer webOS versions ship newer engines, so the launcher is intended to work on all webOS TV versions.

- Tested on: LG 49LF630V, webOS 2.2.3
- Other webOS versions: expected to work, but not tested yet. Feedback is welcome via Issues.

## Configuration
Edit `launcher/config.js` to change the app list, the clock format (24h/12h) and the weather city.

## Installation
Download the `.ipk` file from the [Releases](../../releases) page and install it on your TV:

```bash
# Developer Mode must be enabled and the TV registered with `ares-setup-device`
ares-install --device tv webos_launcher.ipk
ares-launch  --device tv com.simple.launcher
```

## Building the .ipk from source
```bash
ares-package launcher
```

## Project structure
```
launcher/
  appinfo.json   app metadata
  index.html     UI
  app.js         logic
  style.css      styles
  config.js      user settings
  *.png, bg.jpg  images
```
