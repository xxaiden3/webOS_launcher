# webOS Launcher (com.yasin.launcher)

A simple home screen / launcher app for LG webOS TVs. Tested on an LG 49LF630V (webOS 2.2.3).

## Features
- Clock and weather (Open-Meteo, no API key required)
- App shortcuts (Netflix, YouTube, Prime Video, Browser, Live TV, LG Home)
- Wi-Fi and Settings shortcuts
- Remote control navigation

## Configuration
Edit `launcher/config.js` to change the app list, the clock format (24h/12h) and the weather city.

## Installation
Download the `.ipk` file from the [Releases](../../releases) page and install it on your TV:

```bash
# Developer Mode must be enabled and the TV registered with `ares-setup-device`
ares-install --device tv com_yasin_launcher_1_4_0_all.ipk
ares-launch  --device tv com.yasin.launcher
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
