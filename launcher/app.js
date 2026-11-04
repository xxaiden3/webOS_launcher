// Sade webOS launcher. Sadece ES5: let/const, ok fonksiyon, template string yok.
(function () {
  'use strict';

  var DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  var MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
                'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  var cfg = window.CONFIG || {};
  var apps = cfg.apps || [];
  var use24h = cfg.use24h !== false;

  var clockEl = document.getElementById('clock');
  var dateEl = document.getElementById('date');
  var weatherEl = document.getElementById('weather');
  var dockEl = document.getElementById('dock');
  var trackEl = document.getElementById('track');
  var toastEl = document.getElementById('toast');

  // Sag ust dugmeler (soldan saga). Ayari olmayan dugme gizlenir.
  var topBtns = [
    { el: document.getElementById('wifi'),     cfg: cfg.wifi,     name: 'Wi-Fi ayarları' },
    { el: document.getElementById('settings'), cfg: cfg.settings, name: 'Ayarlar' }
  ];
  var topList = [];

  var tiles = [];
  var current = 0;
  var topIdx = 0;
  var zone = 'dock';   // 'dock' (uygulama satiri) ya da 'top' (sag ust dugmeler)
  var toastTimer = null;

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function tick() {
    var d = new Date();
    var h = d.getHours();
    var text;
    if (use24h) {
      text = pad(h) + ':' + pad(d.getMinutes());
    } else {
      var suffix = h >= 12 ? ' PM' : ' AM';
      h = h % 12;
      if (h === 0) { h = 12; }
      text = h + ':' + pad(d.getMinutes()) + suffix;
    }
    clockEl.textContent = text;
    dateEl.textContent = d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + DAYS[d.getDay()];
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    if (toastTimer) { clearTimeout(toastTimer); }
    toastTimer = setTimeout(function () {
      toastEl.style.display = 'none';
    }, 4000);
  }

  // ---- Hava durumu -------------------------------------------------------

  var WEATHER_TEXT = {
    0: 'Açık', 1: 'Az bulutlu', 2: 'Parçalı bulutlu', 3: 'Bulutlu',
    45: 'Sisli', 48: 'Sisli',
    51: 'Çise', 53: 'Çise', 55: 'Çise', 56: 'Çise', 57: 'Çise',
    61: 'Yağmurlu', 63: 'Yağmurlu', 65: 'Yağmurlu', 66: 'Yağmurlu', 67: 'Yağmurlu',
    71: 'Karlı', 73: 'Karlı', 75: 'Karlı', 77: 'Karlı',
    80: 'Sağanak', 81: 'Sağanak', 82: 'Sağanak', 85: 'Kar sağanağı', 86: 'Kar sağanağı',
    95: 'Fırtına', 96: 'Fırtına', 99: 'Fırtına'
  };

  var weatherTimer = null;

  function showWeather(temp, cond) {
    var wc = cfg.weather || {};
    var parts = [];
    if (wc.name) { parts.push(wc.name); }
    parts.push(Math.round(temp) + '°');
    if (cond) { parts.push(cond); }
    weatherEl.textContent = parts.join('  ·  ');
    weatherEl.style.display = 'block';
  }

  function httpGet(url, onOk, onFail) {
    var xhr = new XMLHttpRequest();
    var done = false;
    function fail() { if (!done) { done = true; onFail(); } }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4 || done) { return; }
      if (xhr.status >= 200 && xhr.status < 300) {
        done = true;
        onOk(xhr.responseText);
      } else {
        fail();
      }
    };
    xhr.onerror = fail;
    xhr.ontimeout = fail;
    try {
      xhr.open('GET', url, true);
      xhr.timeout = 15000;
      xhr.send();
    } catch (e) {
      fail();
    }
  }

  function cacheWeather(temp, cond) {
    try {
      localStorage.setItem('weather', JSON.stringify({ t: temp, c: cond }));
    } catch (e) { /* depolama yoksa sorun degil */ }
  }

  function loadCachedWeather() {
    try {
      var raw = localStorage.getItem('weather');
      if (raw) {
        var w = JSON.parse(raw);
        if (typeof w.t === 'number') { showWeather(w.t, w.c); }
      }
    } catch (e) { /* onbellek yok */ }
  }

  function scheduleWeather(ms) {
    if (weatherTimer) { clearTimeout(weatherTimer); }
    weatherTimer = setTimeout(fetchWeather, ms);
  }

  function weatherOk(temp, cond) {
    showWeather(temp, cond);
    cacheWeather(temp, cond);
    scheduleWeather(30 * 60 * 1000);   // 30 dk'da bir yenile
  }

  function weatherFail() {
    scheduleWeather(2 * 60 * 1000);    // basarisizsa 2 dk sonra tekrar dene
  }

  // Yedek kaynak: Open-Meteo acilmazsa (ornegin eski sertifika) wttr.in, duz http
  function fetchWeatherBackup(wc) {
    var url = 'http://wttr.in/' + encodeURIComponent(wc.name) + '?format=%25t%7C%25C&lang=tr';
    httpGet(url, function (text) {
      var t = String(text).replace(/^\s+|\s+$/g, '');
      var bits = t.split('|');
      var temp = parseFloat(bits[0]);
      if (t.length > 60 || isNaN(temp)) { weatherFail(); return; }
      weatherOk(temp, bits[1] ? bits[1].replace(/^\s+|\s+$/g, '') : '');
    }, weatherFail);
  }

  function fetchWeather() {
    var wc = cfg.weather;
    if (!wc) { return; }
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + wc.lat +
      '&longitude=' + wc.lon + '&current=temperature_2m,weather_code&timezone=auto';
    httpGet(url, function (text) {
      var data;
      try { data = JSON.parse(text); } catch (e) { data = null; }
      var cur = data && data.current;
      if (!cur || typeof cur.temperature_2m !== 'number') {
        fetchWeatherBackup(wc);
        return;
      }
      weatherOk(cur.temperature_2m, WEATHER_TEXT[cur.weather_code] || '');
    }, function () {
      fetchWeatherBackup(wc);
    });
  }

  // ---- Uygulama acma -----------------------------------------------------

  // webOS servislerini cagirmak icin dahili PalmServiceBridge (webOSTV.js'in kullandigi yontem)
  function lunaCall(uri, params, onOk, onFail) {
    if (!window.PalmServiceBridge) {
      if (onFail) { onFail({ errorText: 'PalmServiceBridge yok' }); }
      return;
    }
    var bridge = new window.PalmServiceBridge();
    bridge.onservicecallback = function (msg) {
      var res;
      try {
        res = JSON.parse(msg);
      } catch (e) {
        res = { returnValue: false, errorText: 'yanıt okunamadı' };
      }
      if (res && res.returnValue === false) {
        if (onFail) { onFail(res); }
      } else if (onOk) {
        onOk(res);
      }
    };
    bridge.call(uri, JSON.stringify(params));
  }

  // id: uygulama kimligi, extra: istege bagli params, name: hata mesaji icin gorunen ad
  function launchById(id, extra, name) {
    var params = { id: id };
    if (extra) { params.params = extra; }
    lunaCall('luna://com.webos.applicationManager/launch', params, null, function () {
      // eski surumler icin yedek yol
      lunaCall('luna://com.palm.applicationManager/launch', params, null, function (err) {
        var why = err && err.errorText ? ': ' + err.errorText : '';
        showToast(name + ' açılamadı' + why);
      });
    });
  }

  function launchApp(app) {
    if (app) { launchById(app.id, null, app.name); }
  }

  function launchTop(btn) {
    if (btn && btn.cfg) { launchById(btn.cfg.id, btn.cfg.params, btn.name); }
  }

  // ---- Odak ve gezinme ---------------------------------------------------

  function scrollToCurrent() {
    if (!tiles.length) { return; }
    var vw = dockEl.clientWidth;
    var tw = trackEl.scrollWidth;
    var left;
    if (tw <= vw) {
      left = (vw - tw) / 2;
    } else {
      var t = tiles[current];
      left = vw / 2 - (t.offsetLeft + t.offsetWidth / 2);
      if (left > 0) { left = 0; }
      if (left < vw - tw) { left = vw - tw; }
    }
    trackEl.style.left = left + 'px';
  }

  function render() {
    var i;
    for (i = 0; i < tiles.length; i++) {
      tiles[i].className = (zone === 'dock' && i === current) ? 'tile focused' : 'tile';
    }
    for (i = 0; i < topList.length; i++) {
      topList[i].el.className = (zone === 'top' && i === topIdx) ? 'topbtn focused' : 'topbtn';
    }
    scrollToCurrent();
  }

  function setFocus(i) {
    if (!tiles.length) { return; }
    if (i < 0) { i = tiles.length - 1; }
    if (i >= tiles.length) { i = 0; }
    current = i;
    zone = 'dock';
    render();
  }

  function setTop(i) {
    if (!topList.length) { return; }
    if (i < 0) { i = 0; }
    if (i >= topList.length) { i = topList.length - 1; }
    topIdx = i;
    zone = 'top';
    render();
  }

  function addLogo(iconEl, textEl, src) {
    var img = document.createElement('img');
    img.onload = function () {
      img.style.display = 'block';
      textEl.style.display = 'none';
    };
    img.onerror = function () {
      // dosya yok ya da acilamadi: harfli kutu kalir
      if (img.parentNode) { img.parentNode.removeChild(img); }
    };
    iconEl.appendChild(img);
    img.src = src;
  }

  function build() {
    var i;
    for (i = 0; i < apps.length; i++) {
      (function (idx) {
        var app = apps[idx];
        var tile = document.createElement('div');
        tile.className = 'tile';

        var icon = document.createElement('div');
        icon.className = 'icon';
        if (app.color) { icon.style.background = app.color; }

        var letter = document.createElement('span');
        letter.appendChild(document.createTextNode(app.letter || app.name.charAt(0)));
        icon.appendChild(letter);
        if (app.icon) { addLogo(icon, letter, app.icon); }

        var label = document.createElement('div');
        label.className = 'label';
        label.appendChild(document.createTextNode(app.name));

        tile.appendChild(icon);
        tile.appendChild(label);

        // Magic Remote (isaretci) destegi
        tile.onmouseover = function () { setFocus(idx); };
        tile.onclick = function () { setFocus(idx); launchApp(app); };

        trackEl.appendChild(tile);
        tiles.push(tile);
      })(i);
    }

    var j;
    for (j = 0; j < topBtns.length; j++) {
      (function (btn) {
        if (!btn.cfg) {
          btn.el.style.display = 'none';
          return;
        }
        var idx = topList.length;
        topList.push(btn);
        btn.el.onmouseover = function () { setTop(idx); };
        btn.el.onclick = function () { setTop(idx); launchTop(btn); };
      })(topBtns[j]);
    }
  }

  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    if (zone === 'dock') {
      if (k === 37) {            // sol
        setFocus(current - 1);
        e.preventDefault();
      } else if (k === 39) {     // sag
        setFocus(current + 1);
        e.preventDefault();
      } else if (k === 38) {     // yukari: sag ust dugmeler
        if (topList.length) { setTop(topIdx); }
        e.preventDefault();
      } else if (k === 13) {     // OK
        launchApp(apps[current]);
        e.preventDefault();
      }
    } else {                     // sag ust dugmelerden biri secili
      if (k === 37) {
        setTop(topIdx - 1);
        e.preventDefault();
      } else if (k === 39) {
        setTop(topIdx + 1);
        e.preventDefault();
      } else if (k === 40) {     // asagi: satira don
        setFocus(current);
        e.preventDefault();
      } else if (k === 13) {
        launchTop(topList[topIdx]);
        e.preventDefault();
      } else if (k === 38) {
        e.preventDefault();
      }
    }
    // 461 (Geri) bilerek islenmiyor: sistem uygulamadan cikarir
  }, false);

  function refresh() {
    tick();
    render();
    if (cfg.weather) { scheduleWeather(1000); }
  }

  window.addEventListener('resize', scrollToCurrent, false);
  window.addEventListener('load', render, false);
  document.addEventListener('webOSRelaunch', refresh, false);

  build();
  tick();
  setInterval(tick, 5000);
  setFocus(0);
  if (cfg.weather) {
    loadCachedWeather();
    fetchWeather();
  }
})();
