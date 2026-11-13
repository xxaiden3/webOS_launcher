!(function () {
  "use strict";
  var e = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    t = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    n = window.CONFIG || {},
    a = n.apps || [],
    r = !1 !== n.use24h,
    o = document.getElementById("clock"),
    l = document.getElementById("date"),
    c = document.getElementById("weather"),
    i = document.getElementById("dock"),
    u = document.getElementById("track"),
    s = document.getElementById("toast"),
    d = [
      {
        el: document.getElementById("inputbtn"),
        cfg: n.inputs && n.inputs.length ? { picker: !0 } : null,
        name: "Input",
      },
      {
        el: document.getElementById("settings"),
        cfg: { ctrl: !0 },
        name: "Controls",
      },
    ],
    m = [],
    f = [],
    p = 0,
    g = 0,
    h = "dock",
    v = null;
  function y(e) {
    return e < 10 ? "0" + e : "" + e;
  }
  function w() {
    var n,
      a = new Date(),
      c = a.getHours();
    if (r) n = y(c) + ":" + y(a.getMinutes());
    else {
      var i = c >= 12 ? " PM" : " AM";
      (0 === (c %= 12) && (c = 12), (n = c + ":" + y(a.getMinutes()) + i));
    }
    ((o.textContent = n),
      (l.textContent =
        a.getDate() + " " + t[a.getMonth()] + ", " + e[a.getDay()]));
  }
  var k = {
      0: "Clear",
      1: "Az bulutlu",
      2: "Partly cloudy",
      3: "Bulutlu",
      45: "Sisli",
      48: "Sisli",
      51: "Drizzle",
      53: "Drizzle",
      55: "Drizzle",
      56: "Drizzle",
      57: "Drizzle",
      61: "Rain",
      63: "Rain",
      65: "Rain",
      66: "Rain",
      67: "Rain",
      71: "Snow",
      73: "Snow",
      75: "Snow",
      77: "Snow",
      80: "Showers",
      81: "Showers",
      82: "Showers",
      85: "Snow showers",
      86: "Snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm",
      99: "Thunderstorm",
    },
    E = null;
  function C(e, t) {
    var a = n.weather || {},
      r = [];
    (a.name && r.push(a.name),
      r.push(Math.round(e) + "°"),
      t && r.push(t),
      (c.textContent = r.join("  ·  ")),
      (c.style.display = "block"));
  }
  function S(e, t, n) {
    var a = new XMLHttpRequest(),
      r = !1;
    function o() {
      r || ((r = !0), n());
    }
    ((a.onreadystatechange = function () {
      4 !== a.readyState ||
        r ||
        (a.status >= 200 && a.status < 300
          ? ((r = !0), t(a.responseText))
          : o());
    }),
      (a.onerror = o),
      (a.ontimeout = o));
    try {
      (a.open("GET", e, !0), (a.timeout = 15e3), a.send());
    } catch (e) {
      o();
    }
  }
  function N(e) {
    (E && clearTimeout(E), (E = setTimeout(x, e)));
  }
  function b(e, t) {
    (C(e, t),
      (function (e, t) {
        try {
          localStorage.setItem("weather", JSON.stringify({ t: e, c: t }));
        } catch (e) {}
      })(e, t),
      N(18e5));
  }
  function I() {
    N(12e4);
  }
  function T(e) {
    S(
      "http://wttr.in/" +
        encodeURIComponent(e.name) +
        "?format=%25t%7C%25C&lang=en",
      function (e) {
        var t = String(e).replace(/^\s+|\s+$/g, ""),
          n = t.split("|"),
          a = parseFloat(n[0]);
        t.length > 60 || isNaN(a)
          ? I()
          : b(a, n[1] ? n[1].replace(/^\s+|\s+$/g, "") : "");
      },
      I,
    );
  }
  // Automatic location: the city is looked up from the IP address (cached for a day). Falls back to the city in config.js.
  function geoApply(g) {
    var w = n.weather;
    if (g && g.name && "number" == typeof g.lat && "number" == typeof g.lon) {
      w.name = g.name;
      w.lat = g.lat;
      w.lon = g.lon;
    }
  }
  function geoCached() {
    try {
      var g = JSON.parse(localStorage.getItem("geo") || "null");
      if (g && Date.now() - g.at < 864e5) return g;
    } catch (e) {}
    return null;
  }
  function geoLoad(done) {
    var g = geoCached();
    if (g) {
      geoApply(g);
      return done();
    }
    S(
      "https://ipwho.is/?fields=success,city,latitude,longitude",
      function (t) {
        try {
          var r = JSON.parse(t);
          if (r && r.success && r.city) {
            g = { name: r.city, lat: r.latitude, lon: r.longitude, at: Date.now() };
            geoApply(g);
            localStorage.setItem("geo", JSON.stringify(g));
          }
        } catch (e) {}
        done();
      },
      done,
    );
  }
  function x() {
    var e = n.weather;
    if (e && e.auto && !e.geoDone) {
      e.geoDone = !0;
      return geoLoad(x);
    }
    e &&
      S(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          e.lat +
          "&longitude=" +
          e.lon +
          "&current=temperature_2m,weather_code&timezone=auto",
        function (t) {
          var n;
          try {
            n = JSON.parse(t);
          } catch (e) {
            n = null;
          }
          var a = n && n.current;
          a && "number" == typeof a.temperature_2m
            ? b(a.temperature_2m, k[a.weather_code] || "")
            : T(e);
        },
        function () {
          T(e);
        },
      );
  }
  function B(e, t, n, a) {
    if (window.PalmServiceBridge) {
      var r = new window.PalmServiceBridge();
      ((r.onservicecallback = function (e) {
        var t;
        try {
          t = JSON.parse(e);
        } catch (e) {
          t = { returnValue: !1, errorText: "could not read response" };
        }
        t && !1 === t.returnValue ? a && a(t) : n && n(t);
      }),
        r.call(e, JSON.stringify(t)));
    } else a && a({ errorText: "PalmServiceBridge not available" });
  }
  function D(e, t, n) {
    var a = { id: e };
    (t && (a.params = t),
      B("luna://com.webos.applicationManager/launch", a, null, function () {
        B("luna://com.palm.applicationManager/launch", a, null, function (e) {
          var t,
            a = e && e.errorText ? ": " + e.errorText : "";
          ((t = n + " could not be opened" + a),
            (s.textContent = t),
            (s.style.display = "block"),
            v && clearTimeout(v),
            (v = setTimeout(function () {
              s.style.display = "none";
            }, 4e3)));
        });
      }));
  }
  function M(e) {
    e && D(e.id, null, e.name);
  }
  function O(e) {
    e &&
      e.cfg &&
      (e.cfg.picker
        ? Q()
        : e.cfg.ctrl
          ? CO()
          : D(e.cfg.id, e.cfg.params, e.name));
  }
  function P() {
    if (f.length) {
      var e,
        t = i.clientWidth,
        n = u.scrollWidth;
      if (n <= t) e = (t - n) / 2;
      else {
        var a = f[p];
        ((e = t / 2 - (a.offsetLeft + a.offsetWidth / 2)) > 0 && (e = 0),
          e < t - n && (e = t - n));
      }
      u.style.webkitTransform = u.style.transform =
        "translate3d(" + e + "px,0,0)";
    }
  }
  // ---- Reordering apps (edit mode) ----
  // Long-press OK (0.7 s) on a dock tile -> edit mode: the tile gets a yellow ring.
  // Left/right moves the tile. OK, Back, up or down ends editing.
  // Magic Remote: click and hold a tile. The order is stored on the TV.
  // To reset the order, increase orderVersion in config.js.
  var okTimer = null,
    okArm = false,
    mTimer = null,
    mFired = false,
    delAsk = false, // waiting for delete confirmation?
    hid = []; // kaldirilan (gizlenen) uygulamalar
  function OS() {
    try {
      var ids = [],
        i;
      for (i = 0; i < a.length; i++) ids.push(a[i].id);
      localStorage.setItem("order", JSON.stringify(ids));
      localStorage.setItem("added", JSON.stringify(added));
      var hs = [];
      for (i = 0; i < hid.length; i++) hs.push(hid[i].id);
      localStorage.setItem("hidden", JSON.stringify(hs));
      localStorage.setItem("orderV", String(n.orderVersion || 0));
    } catch (e) {}
  }
  function OA() {
    try {
      if (String(localStorage.getItem("orderV") || "0") !== String(n.orderVersion || 0))
        return;
      var i,
        j,
        out = [],
        ids = [],
        raw = localStorage.getItem("order"),
        ad = JSON.parse(localStorage.getItem("added") || "[]");
      // apps pinned from the all-apps grid
      for (i = 0; i < ad.length; i++)
        if (ad[i] && ad[i].id && idOf(a, ad[i].id) < 0) {
          delete ad[i].color; // eski surumde kaydedilen renk/ikon temayi bozmasin
          if (ad[i].icon && ad[i].icon.indexOf("logos/") !== 0) delete ad[i].icon;
          a.push(ad[i]);
          added.push(ad[i]);
        }
      if (raw) ids = JSON.parse(raw);
      for (i = 0; i < ids.length; i++)
        for (j = 0; j < a.length; j++)
          if (a[j].id === ids[i] && out.indexOf(a[j]) < 0) {
            out.push(a[j]);
            break;
          }
      // apps added to config.js later are appended at the end
      for (j = 0; j < a.length; j++) out.indexOf(a[j]) < 0 && out.push(a[j]);
      a.length = 0;
      for (i = 0; i < out.length; i++) a.push(out[i]);
      // hide removed apps (at least one app always stays)
      var hs = JSON.parse(localStorage.getItem("hidden") || "[]");
      for (j = a.length - 1; j >= 0; j--)
        if (hs.indexOf(a[j].id) >= 0 && a.length > 1) hid.unshift(a.splice(j, 1)[0]);
    } catch (e) {}
  }
  function EE(i) {
    if (!f.length) return;
    p = i;
    h = "edit";
    okArm = true; // basili tutulan OK'in tekrarlari modu hemen kapatmasin
    delAsk = false;
    f[p].lastChild.innerHTML = "◀  Move  ▶<br>▼  Remove";
    z();
  }
  function EX() {
    if (f[p]) f[p].lastChild.textContent = a[p].name;
    delAsk = false;
    h = "dock";
    z();
  }
  // Remove: in edit mode press down -> confirm -> OK removes, Back cancels
  function DQ() {
    if (a.length < 2) return; // the last app cannot be removed
    delAsk = true;
    f[p].lastChild.innerHTML = "OK: remove<br>Back: cancel";
    z();
  }
  function DC() {
    delAsk = false;
    f[p].lastChild.innerHTML = "◀  Move  ▶<br>▼  Remove";
    z();
  }
  function DX() {
    var tl = f[p];
    hid.push(a[p]);
    a.splice(p, 1);
    f.splice(p, 1);
    u.removeChild(tl);
    if (p >= f.length) p = f.length - 1;
    delAsk = false;
    h = "dock";
    OS();
    z();
  }
  // Puts all removed apps back at the end (control panel card)
  function RS() {
    // resets the dock to the default apps from config.js
    var i;
    while (u.firstChild) u.removeChild(u.firstChild);
    f.length = 0;
    a.length = 0;
    hid.length = 0;
    added.length = 0;
    for (i = 0; i < baseApps.length; i++) {
      a.push(baseApps[i]);
      TB(baseApps[i]);
    }
    p = 0;
    OS();
    z();
    gridUpdate();
  }
  function RT() {
    return "Reset dock";
  }
  // Builds one app tile and appends it to the end of the dock
  function TB(t) {
    var n = document.createElement("div");
    n.className = "tile";
    var r = document.createElement("div");
    r.className = "icon";
    t.color && (r.style.background = t.color);
    var s = document.createElement("span");
    s.appendChild(document.createTextNode(t.letter || t.name.charAt(0)));
    r.appendChild(s);
    if (t.icon) {
      var i = document.createElement("img");
      i.onload = function () {
        i.style.display = "block";
        s.style.display = "none";
      };
      i.onerror = function () {
        i.parentNode && i.parentNode.removeChild(i);
      };
      r.appendChild(i);
      i.src = t.icon;
    }
    var d = document.createElement("div");
    d.className = "label";
    d.appendChild(document.createTextNode(t.name));
    n.appendChild(r);
    n.appendChild(d);
    // the index is computed from the tile every time because the order can change
    n.onmouseover = function () {
      "edit" !== h && A(f.indexOf(n));
    };
    n.onmousedown = function () {
      if ("edit" === h) return;
      mTimer && clearTimeout(mTimer);
      mTimer = setTimeout(function () {
        mTimer = null;
        mFired = true;
        EE(f.indexOf(n));
      }, 700);
    };
    n.onmouseup = n.onmouseleave = function () {
      mTimer && (clearTimeout(mTimer), (mTimer = null));
    };
    n.onclick = function () {
      if (mFired) {
        mFired = false; // uzun basmadan sonra gelen tikla uygulama acilmasin
        return;
      }
      if ("edit" === h) {
        EX();
        return;
      }
      A(f.indexOf(n));
      M(t);
    };
    u.appendChild(n);
    f.push(n);
    return n;
  }
  function EM(d) {
    var j = p + d;
    if (j < 0 || j >= f.length) return;
    var ta = a[p],
      tf = f[p],
      i;
    a[p] = a[j];
    a[j] = ta;
    f[p] = f[j];
    f[j] = tf;
    for (i = 0; i < f.length; i++) u.appendChild(f[i]);
    p = j;
    OS();
    z();
  }
  // ---- All apps grid ----
  // Press down on the home screen: the screen slides up and every app on the TV is shown in a grid.
  // The list is fetched in this order: 1) luna listLaunchPoints  2) the launcher's own service
  // 3) SSAP (the TV's remote-control protocol; asks for permission on the TV the first time)  4) allApps in config.js.
  // In the grid: OK = open, long-press OK = menu (add to / remove from dock, uninstall).
  var sliderEl = document.getElementById("slider"),
    gdimEl = document.getElementById("gdim"),
    gtrackEl = document.getElementById("gtrack"),
    gstatusEl = document.getElementById("gstatus"),
    baseApps = a.slice(0), // config.js'deki uygulamalar (kaydedilmis siralama uygulanmadan once)
    added = [], // apps pinned from the grid (stored on the TV)
    gridItems = [],
    gridTiles = [],
    gridIdx = 0,
    gridCols = 5,
    gridTimer = null,
    gridArm = false,
    gridBusy = false,
    gridNewIds = [];

  function lsGet(key, def) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      return def;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }
  function idOf(list, id) {
    var i;
    for (i = 0; i < list.length; i++) if (list[i].id === id) return i;
    return -1;
  }
  function hueGradient(id) {
    var hu = 0,
      i;
    for (i = 0; i < id.length; i++) hu = (hu * 31 + id.charCodeAt(i)) % 360;
    return (
      "linear-gradient(135deg, hsla(" + hu + ",55%,42%,0.75), hsla(" + hu + ",60%,20%,0.85))"
    );
  }
  function gridToast(msg) {
    s.textContent = msg;
    s.style.display = "block";
    v && clearTimeout(v);
    v = setTimeout(function () {
      s.style.display = "none";
    }, 3000);
  }
  function gridStatus(msg) {
    gstatusEl.textContent = msg || "";
  }

  // Turns the records from the TV into {id, title, icon} and filters out system inputs
  function gridClean(list) {
    var out = [],
      seen = {},
      hide = n.gridHide || [],
      i,
      it,
      icon;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      if (!it || !it.id || !it.title || seen[it.id] || it.visible === false) continue;
      if (/^com\.webos\.app\.(hdmi\d|externalinput|inputcommon)/.test(it.id)) continue;
      if (hide.indexOf(it.id) >= 0) continue;
      seen[it.id] = true;
      icon = it.icon || (it.largeIcon && it.largeIcon) || "";
      if (icon && icon.charAt(0) === "/") icon = "file://" + icon;
      out.push({ id: it.id, title: it.title, icon: icon });
    }
    return out;
  }

  // live: the list really came from the TV (not cache/fallback) -> "New" badges are computed
  function gridApply(list, live) {
    var items = gridClean(list),
      i,
      known;
    gridNewIds = lsGet("gridNew", []);
    if (live) {
      known = lsGet("gridKnown", null);
      if (known === null) {
        // first run: everything is "known", no badges
        known = [];
        for (i = 0; i < items.length; i++) known.push(items[i].id);
      } else {
        for (i = 0; i < items.length; i++)
          if (known.indexOf(items[i].id) < 0) {
            known.push(items[i].id);
            gridNewIds.indexOf(items[i].id) < 0 && gridNewIds.push(items[i].id);
          }
      }
      lsSet("gridKnown", known);
      lsSet("gridNew", gridNewIds);
      lsSet("gridCache", items);
    }
    // new apps first, then alphabetical
    items.sort(function (x, y) {
      var nx = gridNewIds.indexOf(x.id) >= 0,
        ny = gridNewIds.indexOf(y.id) >= 0;
      if (nx !== ny) return nx ? -1 : 1;
      return x.title.localeCompare(y.title);
    });
    gridItems = items;
    gridRender();
  }

  function gridKnownApp(id, title) {
    var i = idOf(baseApps, id),
      kl = n.known || [],
      k,
      lt = (title || "").toLowerCase();
    if (i >= 0) return baseApps[i];
    for (k = 0; k < kl.length; k++)
      if (kl[k].id === id || (lt && kl[k].names && kl[k].names.indexOf(lt) >= 0)) return kl[k];
    i = idOf(added, id);
    return i >= 0 ? added[i] : null;
  }

  function gridTile(item) {
    var kn = gridKnownApp(item.id, item.title),
      tile = document.createElement("div"),
      icon = document.createElement("div"),
      letter = document.createElement("span"),
      label = document.createElement("div"),
      badge = document.createElement("span"),
      pin = document.createElement("span"),
      src = kn && kn.icon ? kn.icon : "";
    tile.className = "tile";
    icon.className = "icon";
    letter.appendChild(
      document.createTextNode((kn && kn.letter) || item.title.charAt(0).toUpperCase()),
    );
    icon.appendChild(letter);
    if (src) {
      var img = document.createElement("img");
      // logos of apps defined in config are drawn for the tile; the TV's square icon is shown small
      if (!(kn && kn.icon)) img.className = "rawicon";
      img.onload = function () {
        img.style.display = "block";
        letter.style.display = "none";
      };
      img.onerror = function () {
        img.parentNode && img.parentNode.removeChild(img);
      };
      icon.appendChild(img);
      img.src = src;
    }
    badge.className = "gbadge";
    badge.appendChild(document.createTextNode("New"));
    pin.className = "gpin";
    pin.appendChild(document.createTextNode("✓"));
    icon.appendChild(badge);
    icon.appendChild(pin);
    label.className = "label";
    label.appendChild(document.createTextNode(kn ? kn.name : item.title));
    tile.appendChild(icon);
    tile.appendChild(label);

    var holdTimer = null,
      held = false;
    tile.onmouseover = function () {
      if ("grid" === h) {
        gridIdx = gridTiles.indexOf(tile);
        gridUpdate();
      }
    };
    tile.onmousedown = function () {
      held = false;
      holdTimer && clearTimeout(holdTimer);
      holdTimer = setTimeout(function () {
        holdTimer = null;
        held = true;
        gridMenuOpen(item);
      }, 700);
    };
    tile.onmouseup = tile.onmouseleave = function () {
      holdTimer && (clearTimeout(holdTimer), (holdTimer = null));
    };
    tile.onclick = function () {
      if (held) {
        held = false; // uzun basmadan sonra gelen tikla uygulama acilmasin
        return;
      }
      gridLaunch(item);
    };
    return tile;
  }

  function gridRender() {
    var i;
    gtrackEl.innerHTML = "";
    gridTiles = [];
    for (i = 0; i < gridItems.length; i++) {
      gridTiles.push(gridTile(gridItems[i]));
      gtrackEl.appendChild(gridTiles[i]);
    }
    if (gridIdx >= gridItems.length) gridIdx = Math.max(0, gridItems.length - 1);
    gridUpdate();
  }

  function gridUpdate() {
    var i,
      cls,
      id;
    for (i = 0; i < gridTiles.length; i++) {
      id = gridItems[i].id;
      cls = "tile";
      if ("grid" === h && i === gridIdx) cls += " focused";
      if (idOf(a, id) >= 0) cls += " pinned";
      if (gridNewIds.indexOf(id) >= 0) cls += " isnew";
      if (gridTiles[i].className !== cls) gridTiles[i].className = cls;
    }
    // scroll so that the focused row is visible with one row above it
    var rowH = gridTiles.length > gridCols ? gridTiles[gridCols].offsetTop - gridTiles[0].offsetTop : 0,
      row = Math.floor(gridIdx / gridCols),
      y = -Math.max(0, row - 1) * rowH,
      tr = "translate3d(0," + y + "px,0)";
    gtrackEl.style.webkitTransform = tr;
    gtrackEl.style.transform = tr;
  }

  function gridLaunch(item) {
    if (!item) return;
    var k = gridNewIds.indexOf(item.id);
    if (k >= 0) {
      gridNewIds.splice(k, 1);
      lsSet("gridNew", gridNewIds);
    }
    var kn = gridKnownApp(item.id, item.title);
    D(item.id, null, kn ? kn.name : item.title);
  }

  // Removes the app from the dock if it is there (at least one stays), otherwise adds it
  function gridPin(item) {
    if (!item) return;
    var idx = idOf(a, item.id),
      t,
      tl,
      hi;
    if (idx >= 0) {
      if (a.length < 2) {
        gridToast("At least one app must stay in the dock");
        return;
      }
      t = a[idx];
      tl = f[idx];
      a.splice(idx, 1);
      f.splice(idx, 1);
      u.removeChild(tl);
      if (p >= f.length) p = f.length - 1;
      hid.push(t);
      gridToast(t.name + " removed from dock");
    } else {
      hi = idOf(hid, item.id);
      if (hi >= 0) {
        t = hid.splice(hi, 1)[0];
      } else {
        t = gridKnownApp(item.id, item.title);
        t = t
          ? { id: item.id, name: t.name, letter: t.letter, icon: t.icon }
          : { id: item.id, name: item.title, letter: item.title.charAt(0).toUpperCase() };
        added.push(t);
      }
      a.push(t);
      TB(t);
      gridToast(t.name + " added to dock");
    }
    OS();
    gridUpdate();
    z();
  }

  function gridOpen() {
    h = "grid";
    z();
    sliderEl.style.webkitTransform = sliderEl.style.transform = "translate3d(0,-100%,0)";
    gdimEl.style.opacity = "0.62";
    if (!gridItems.length) {
      var cached = lsGet("gridCache", null);
      cached && gridApply(cached, false);
    }
    gridUpdate();
    gridFetch();
  }

  function gridClose() {
    gridTimer && (clearTimeout(gridTimer), (gridTimer = null));
    h = "dock";
    sliderEl.style.webkitTransform = sliderEl.style.transform = "translate3d(0,0,0)";
    gdimEl.style.opacity = "0";
    z();
  }


  // --- Long-press menu: add to / remove from dock, uninstall ---
  var gmenuEl = document.createElement("div"),
    gmenuItems = [],
    gmenuIdx = 0,
    gmenuApp = null,
    gmenuConfirm = false;
  gmenuEl.id = "gmenu";
  document.body.appendChild(gmenuEl);

  function gridMenuRender() {
    var i,
      html = "<div class='gmt'>" + gmenuApp.title + "</div>";
    if (gmenuConfirm) html += "<div class='gms'>Uninstall this app from the TV?</div>";
    for (i = 0; i < gmenuItems.length; i++)
      html +=
        "<div class='gmi" + (i === gmenuIdx ? " on" : "") + (gmenuItems[i].danger ? " danger" : "") +
        "'>" + gmenuItems[i].text + "</div>";
    gmenuEl.innerHTML = html;
  }
  function gridMenuOpen(item) {
    if (!item) return;
    gmenuApp = item;
    gmenuConfirm = false;
    gmenuIdx = 0;
    gridMenuItems();
    h = "gmenu";
    gmenuEl.style.display = "block";
    gridMenuRender();
  }
  function gridMenuItems() {
    gmenuItems = gmenuConfirm
      ? [
          { text: "Yes, uninstall", act: "del", danger: true },
          { text: "Cancel", act: "close" },
        ]
      : [
          { text: idOf(a, gmenuApp.id) >= 0 ? "Remove from dock" : "Add to dock", act: "pin" },
          { text: "Uninstall app", act: "ask", danger: true },
          { text: "Cancel", act: "close" },
        ];
  }
  function gridMenuClose() {
    gmenuEl.style.display = "none";
    h = "grid";
    z();
  }
  function gridMenuKey(t, e) {
    var act;
    if (461 === t || 27 === t || 8 === t) gridMenuClose();
    else if (38 === t) gmenuIdx > 0 && (gmenuIdx--, gridMenuRender());
    else if (40 === t) gmenuIdx < gmenuItems.length - 1 && (gmenuIdx++, gridMenuRender());
    else if (13 === t && !gridArm) {
      gridArm = true; // tus basili kalirsa tekrarlayan Enter'lar yeni eylem baslatmasin
      act = gmenuItems[gmenuIdx].act;
      if ("pin" === act) {
        gridMenuClose();
        gridPin(gmenuApp);
      } else if ("ask" === act) {
        if (/^(com\.webos\.|com\.palm\.|airplay$|com\.lge\.)/.test(gmenuApp.id)) {
          gridMenuClose();
          gridToast("System apps cannot be uninstalled");
        } else {
          gmenuConfirm = true;
          gmenuIdx = 1;
          gridMenuItems();
          gridMenuRender();
        }
      } else if ("del" === act) {
        gridMenuClose();
        gridUninstall(gmenuApp);
      } else gridMenuClose();
    }
    e.preventDefault();
  }
  function gridUninstall(item) {
    gridToast(item.title + " is being uninstalled…");
    B(
      "luna://com.webos.appInstallService/remove",
      { id: item.id, subscribe: false },
      function () {
        var i = idOf(gridItems, item.id),
          di = idOf(a, item.id);
        if (di >= 0 && a.length > 1) {
          a.splice(di, 1);
          u.removeChild(f[di]);
          f.splice(di, 1);
          if (p >= f.length) p = f.length - 1;
        }
        i >= 0 && gridItems.splice(i, 1);
        lsSet("gridCache", gridItems);
        gridRender();
        OS();
        z();
        gridToast(item.title + " uninstalled");
      },
      function (r) {
        gridToast("Could not uninstall: " + ((r && r.errorText) || "the TV denied permission"));
      },
    );
  }

  function gridKey(t, e) {
    var cnt = gridItems.length;
    if (461 === t || 27 === t || 8 === t) gridClose();
    else if ("gmenu" === h) return void gridMenuKey(t, e);
    else if (37 === t) gridIdx > 0 && (gridIdx--, gridUpdate());
    else if (39 === t) gridIdx < cnt - 1 && (gridIdx++, gridUpdate());
    else if (38 === t) gridIdx < gridCols ? gridClose() : ((gridIdx -= gridCols), gridUpdate());
    else if (40 === t) {
      if (gridIdx + gridCols < cnt) gridIdx += gridCols;
      else if (Math.floor(gridIdx / gridCols) < Math.floor((cnt - 1) / gridCols)) gridIdx = cnt - 1;
      gridUpdate();
    } else if (13 === t) {
      // short press: opens when the key is released (keyup), long press: opens the menu
      if (!gridTimer && !gridArm && cnt)
        gridTimer = setTimeout(function () {
          gridTimer = null;
          gridArm = true;
          gridMenuOpen(gridItems[gridIdx]);
        }, 700);
    }
    e.preventDefault();
  }

  // --- List sources ---

  // SSAP: the TV's own remote-control API. The launcher connects to ws://127.0.0.1:3000 like the
  // "LG Remote App" does. The first time a permission prompt appears on the TV; the key is stored.
  function ssapList(ok, no, status) {
    if (!window.WebSocket || !window.SSAP_PAIRING) return no();
    var hosts = n.ssapHosts || ["127.0.0.1"],
      hi = 0,
      finished = false,
      key = null;
    try {
      key = localStorage.getItem("ssapKey");
    } catch (e) {}
    function tryHost() {
      if (finished) return;
      if (hi >= hosts.length) {
        finished = true;
        return no();
      }
      var ws,
        moved = false,
        unsigned = false,
        keyRetried = false,
        guard;
      try {
        ws = new WebSocket("ws://" + hosts[hi++] + ":3000");
      } catch (e) {
        return tryHost();
      }
      function next() {
        if (moved || finished) return;
        moved = true;
        clearTimeout(guard);
        try {
          ws.close();
        } catch (e) {}
        tryHost();
      }
      function done(list) {
        if (finished) return;
        finished = true;
        moved = true;
        clearTimeout(guard);
        try {
          ws.close();
        } catch (e) {}
        list ? ok(list) : no();
      }
      function reg(noSig) {
        var pr = JSON.parse(JSON.stringify(window.SSAP_PAIRING));
        if (noSig) {
          delete pr.manifest.signed;
          pr.manifest.appVersion = "1.0";
        }
        if (key) pr["client-key"] = key;
        ws.send(JSON.stringify({ type: "register", id: "reg", payload: pr }));
      }
      function ask(id, uri) {
        ws.send(JSON.stringify({ type: "request", id: id, uri: uri }));
      }
      guard = setTimeout(next, 45000); // includes time for the permission prompt
      ws.onopen = function () {
        status("Connected to TV…");
        reg(false);
      };
      ws.onerror = next;
      ws.onclose = next;
      ws.onmessage = function (ev) {
        var m, pl;
        try {
          m = JSON.parse(ev.data);
        } catch (e) {
          return;
        }
        pl = m.payload || {};
        if (m.id === "reg") {
          if (m.type === "registered") {
            if (pl["client-key"]) {
              key = pl["client-key"];
              try {
                localStorage.setItem("ssapKey", key);
              } catch (e) {}
            }
            status("Liste TV'den isteniyor…");
            ask("lp", "ssap://com.webos.applicationManager/listLaunchPoints");
          } else if (m.type === "response") {
            status("Approve the permission prompt shown on the TV");
          } else if (m.type === "error") {
            if (!unsigned && /blacklisted certificate/i.test(String(m.error))) {
              unsigned = true;
              reg(true);
            } else if (key && !keyRetried) {
              // the stored key may be invalid: retry without a key
              keyRetried = true;
              key = null;
              try {
                localStorage.removeItem("ssapKey");
              } catch (e) {}
              reg(unsigned);
            } else {
              status("The TV did not allow it: " + m.error);
              next();
            }
          }
        } else if (m.id === "lp") {
          if (m.type === "response" && pl.launchPoints && pl.launchPoints.length)
            done(pl.launchPoints);
          else ask("ap", "ssap://com.webos.applicationManager/listApps");
        } else if (m.id === "ap") {
          done(m.type === "response" && pl.apps && pl.apps.length ? pl.apps : null);
        }
      };
    }
    tryHost();
  }

  function gridFetch() {
    if (gridBusy) return;
    gridBusy = true;
    gridStatus("Loading app list…");
    var steps = [
        function (ok, no) {
          B(
            "luna://com.webos.applicationManager/listLaunchPoints",
            {},
            function (r) {
              r && r.launchPoints && r.launchPoints.length ? ok(r.launchPoints) : no();
            },
            no,
          );
        },
        function (ok, no) {
          B(
            "luna://com.custom.launcher.service/listApps",
            {},
            function (r) {
              r && r.apps && r.apps.length ? ok(r.apps) : no();
            },
            no,
          );
        },
        function (ok, no) {
          ssapList(ok, no, gridStatus);
        },
      ],
      si = 0;
    function next() {
      if (si >= steps.length) {
        // nothing worked: use the previous list or the built-in list from config.js
        gridBusy = false;
        var fb = n.allApps || [];
        if (!gridItems.length && fb.length) {
          gridApply(fb, false);
          gridStatus("Could not read the list from the TV, showing built-in list");
        } else {
          gridStatus(
            gridItems.length
              ? "Could not update from the TV, showing previous list"
              : "Could not load the app list",
          );
        }
        return;
      }
      var step = steps[si++],
        settled = false,
        tm = null;
      function ok(list) {
        if (settled) return;
        settled = true;
        tm && clearTimeout(tm);
        gridBusy = false;
        gridApply(list, true);
        gridStatus(gridItems.length + " apps");
      }
      function no() {
        if (settled) return;
        settled = true;
        tm && clearTimeout(tm);
        next();
      }
      // if a luna call does not answer, move on to the next source after 4 s (SSAP manages its own timeout)
      if (si < steps.length) tm = setTimeout(no, 4000);
      step(ok, no);
    }
    next();
  }

  function EK(t, e) {
    if (delAsk) {
      if (13 === t) okArm || DX();
      else if (461 === t || 27 === t || 8 === t || 38 === t || 37 === t || 39 === t) DC();
    } else if (37 === t) EM(-1);
    else if (39 === t) EM(1);
    else if (40 === t) DQ();
    else if (13 === t) okArm || EX();
    else if (461 === t || 27 === t || 8 === t || 38 === t) EX();
    e.preventDefault();
  }
  function z() {
    var e;
    for (e = 0; e < f.length; e++) {
      var q =
        ("dock" === h || "edit" === h) && e === p
          ? "edit" === h
            ? delAsk
              ? "tile focused editing deleting"
              : "tile focused editing"
            : "tile focused"
          : "tile";
      f[e].className !== q && (f[e].className = q);
    }
    for (e = 0; e < m.length; e++) {
      // if the input or control panel is open, the top button that opened it keeps the focus
      var q2 =
        ("top" === h || "panel" === h || "ctrl" === h) && e === g
          ? "topbtn focused"
          : "topbtn";
      m[e].el.className !== q2 && (m[e].el.className = q2);
    }
    P();
  }
  function A(e) {
    f.length &&
      (e < 0 && (e = f.length - 1),
      e >= f.length && (e = 0),
      (p = e),
      (h = "dock"),
      z());
  }
  function K(e) {
    m.length &&
      (e < 0 && (e = 0),
      e >= m.length && (e = m.length - 1),
      (g = e),
      (h = "top"),
      z());
  }
  // ---- Background slideshow ----
  // config.js: wallpapers: [ "bg.jpg", "wallpapers/x.jpg", ... ], wallpaperEvery: seconds (0 = off)
  // The next image is loaded in the background first, then shown with a 4 s crossfade.
  // The current image is remembered; on the next start the slideshow continues with the following one.
  var wp = n.wallpapers || [],
    wpEvery = "number" == typeof n.wallpaperEvery ? n.wallpaperEvery : 120,
    wpIdx = 0,
    bgEl = document.getElementById("bg"),
    bg2El = document.getElementById("bg2"),
    wpFadeTimer = null,
    wpBusy = false;
  function WPSave() {
    try {
      localStorage.setItem("wpIdx", String(wpIdx));
    } catch (e) {}
  }
  function WPNext() {
    // skip this round if a transition is running or the app is in the background
    if (wp.length < 2 || document.hidden || wpBusy) return;
    wpBusy = true;
    var nextIdx = (wpIdx + 1) % wp.length,
      src = wp[nextIdx],
      img = new Image();
    img.onload = function () {
      img.onload = img.onerror = null; // referansi birak, bellek serbest kalsin
      img = null;
      wpIdx = nextIdx;
      WPSave();
      bg2El.style.backgroundImage = "url(" + src + ")";
      bg2El.style.opacity = "1";
      wpFadeTimer && clearTimeout(wpFadeTimer);
      wpFadeTimer = setTimeout(function () {
        // the same image is on both layers, so hiding the top layer is not noticeable
        bgEl.style.backgroundImage = "url(" + src + ")";
        bg2El.style.opacity = "0";
        bg2El.style.backgroundImage = "none"; // so the hidden layer does not hold the image
        wpBusy = false;
      }, 4200);
    };
    // if the image fails to load this round is skipped, the next round advances
    img.onerror = function () {
      img.onload = img.onerror = null;
      img = null;
      wpIdx = nextIdx;
      wpBusy = false;
    };
    img.src = src;
  }
  if (wp.length > 0) {
    try {
      wpIdx = (parseInt(localStorage.getItem("wpIdx"), 10) + 1) % wp.length;
    } catch (e) {}
    if (isNaN(wpIdx) || wpIdx < 0) wpIdx = 0;
    bgEl.style.backgroundImage = "url(" + wp[wpIdx] + ")";
    WPSave();
    wpEvery > 0 && wp.length > 1 && setInterval(WPNext, wpEvery * 1000);
  }

  // Memory cleanup: the webOS browser does not give memory back when left open for a long time.
  // While idle on the home screen (no panel/grid open) the page reloads every refreshHours hours.
  (function () {
    var started = new Date().getTime(),
      limit = (typeof n.refreshHours === "number" ? n.refreshHours : 6) * 3600 * 1000;
    if (limit <= 0) return;
    setInterval(function () {
      if (new Date().getTime() - started > limit && "dock" === h && !document.hidden)
        location.reload();
    }, 60000);
  })();

  var ip = n.inputs || [],
    pn = document.getElementById("panel"),
    pl = document.getElementById("plist"),
    pi = 0,
    pe = [];
  function PR() {
    for (var j = 0; j < pe.length; j++)
      pe[j].className = j === pi ? "pitem focused" : "pitem";
  }
  function PC() {
    pn.style.display = "none";
    h = "top";
    z();
  }
  function PL() {
    var j = ip[pi];
    (PC(), j && D(j.id, null, j.name));
  }
  function Q() {
    ip.length &&
      ((pi = 0), (pn.style.display = "block"), (h = "panel"), PR(), z());
  }
  function R(t, e) {
    38 === t
      ? (pi > 0 ? (pi--, PR()) : PC(), e.preventDefault())
      : 40 === t
        ? (pi < ip.length - 1 && (pi++, PR()), e.preventDefault())
        : 13 === t
          ? (PL(), e.preventDefault())
          : 461 === t || 27 === t || 8 === t || 37 === t || 39 === t
            ? (PC(), e.preventDefault())
            : e.preventDefault();
  }
  !(function () {
    for (var j = 0; j < ip.length; j++)
      !(function (j) {
        var it = document.createElement("div");
        ((it.className = "pitem"),
          it.appendChild(document.createTextNode(ip[j].name)),
          (it.onmouseover = function () {
            ((pi = j), PR());
          }),
          (it.onclick = function () {
            ((pi = j), PL());
          }),
          pl.appendChild(it),
          pe.push(it));
      })(j);
  })();

  var cs = n.control || [],
    cp = document.getElementById("ctrl"),
    cg = document.getElementById("cgrid"),
    ci = 0,
    ce = [];
  var CI = {
    wifi: '<svg viewBox="0 0 24 24"><path d="M2 9c5.5-5 14.5-5 20 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5.5 12.7c3.6-3.3 9.4-3.3 13 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 16.3c1.7-1.5 4.3-1.5 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="20" r="1.5" fill="currentColor"/></svg>',
    bluetooth:
      '<svg viewBox="0 0 24 24"><path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    memory:
      '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="10" y="10" width="4" height="4" fill="currentColor"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    restore:
      '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tv: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
  };
  function CR() {
    for (var j = 0; j < ce.length; j++) {
      var q = j === ci ? "citem focused" : "citem";
      ce[j].el.className !== q && (ce[j].el.className = q);
    }
  }
  function CC() {
    cp.style.display = "none";
    h = "top";
    z();
  }
  function CS(j, t, pct) {
    ce[j].sub.textContent = t;
    if (null != pct) {
      ce[j].bar.style.display = "block";
      ce[j].fill.style.width = Math.max(2, Math.min(100, pct)) + "%";
    } else ce[j].bar.style.display = "none";
  }
  function CF(j) {
    var m = window.performance && performance.memory;
    if (m && m.jsHeapSizeLimit) {
      CS(
        j,
        "Launcher: " + Math.round(m.usedJSHeapSize / 1048576) + " MB",
        (100 * m.usedJSHeapSize) / m.jsHeapSizeLimit,
      );
    } else CS(j, "No info", null);
  }
  function CT(t) {
    s.textContent = t;
    s.style.display = "block";
    v && clearTimeout(v);
    v = setTimeout(function () {
      s.style.display = "none";
    }, 7e3);
  }
  function CE(r) {
    return r && r.errorText
      ? String(r.errorText).replace(/\s+/g, " ").substring(0, 80)
      : "hata";
  }
  function PB() {
    window.PalmSystem && PalmSystem.platformBack
      ? PalmSystem.platformBack()
      : window.close();
  }
  function CM(j, dbg) {
    var er = [],
      fin = !1;
    function ok(t, pct) {
      fin || ((fin = !0), CS(j, t, pct), dbg && CT("Memory: data received"));
    }
    function P3() {
      fin ||
        ((fin = !0), CF(j), dbg && CT("Memory unavailable → " + er.join(" | ")));
    }
    function P2() {
      B(
        "luna://com.webos.service.memorymanager/getMemoryStatus",
        {},
        function (r) {
          var m = r && r.system;
          if (m && "number" == typeof m.available) {
            var tot = m.total || m.totalMemory || m.physical || 0;
            if (tot > m.available) {
              var u = (100 * (tot - m.available)) / tot;
              ok(Math.round(u) + "% · " + m.available + " MB free", u);
            } else
              ok(
                m.available + " MB free" + (m.level ? " · " + m.level : ""),
                null,
              );
          } else {
            er.push("service: unexpected response");
            P3();
          }
        },
        function (r) {
          er.push("servis: " + CE(r));
          P3();
        },
      );
    }
    function PX() {
      try {
        var x = new XMLHttpRequest();
        x.open("GET", "file:///proc/meminfo", !0);
        x.timeout = 2500;
        x.onload = function () {
          var t = x.responseText || "",
            a1 = /MemTotal:\s+(\d+)/.exec(t),
            a2 = /MemAvailable:\s+(\d+)/.exec(t),
            f = /MemFree:\s+(\d+)/.exec(t),
            b = /Buffers:\s+(\d+)/.exec(t),
            c1 = /\nCached:\s+(\d+)/.exec(t);
          if (a1 && (a2 || f)) {
            var tot = +a1[1] / 1024,
              av = a2
                ? +a2[1] / 1024
                : (+f[1] + (b ? +b[1] : 0) + (c1 ? +c1[1] : 0)) / 1024,
              u = (100 * (tot - av)) / tot;
            ok(Math.round(u) + "% · " + Math.round(av) + " MB free", u);
          } else {
            er.push("proc: empty response");
            P2();
          }
        };
        x.onerror =
          x.ontimeout =
          x.onabort =
            function () {
              er.push("proc: no access");
              P2();
            };
        x.send();
      } catch (e) {
        er.push("proc: " + e.message);
        P2();
      }
    }
    B(
      "luna://com.custom.launcher.service/getMemory",
      {},
      function (r) {
        if (r && r.totalKB > 0 && "number" == typeof r.availableKB) {
          var u = (100 * (r.totalKB - r.availableKB)) / r.totalKB;
          ok(
            Math.round(u) +
              "% · " +
              Math.round(r.availableKB / 1024) +
              " MB free",
            u,
          );
        } else {
          er.push("service: unexpected response");
          PX();
        }
      },
      function (r) {
        er.push("hizmet: " + CE(r));
        PX();
      },
    );
  }
  function CU() {
    for (var j = 0; j < cs.length; j++)
      !(function (j) {
        var k = cs[j].key;
        "wifi" === k
          ? B(
              "luna://com.webos.service.connectionmanager/getStatus",
              {},
              function (r) {
                var t;
                t =
                  r && r.wifi && "connected" === r.wifi.state
                    ? r.wifi.ssid || "Connected"
                    : r && r.wired && "connected" === r.wired.state
                      ? "Wired"
                      : "Not connected";
                CS(j, t, null);
              },
              function () {
                CS(j, cs[j].sub || "", null);
              },
            )
          : "memory" === k
            ? CM(j)
            : "restore" === k && CS(j, RT(), null);
      })(j);
  }
  function CO() {
    cs.length &&
      ((ci = 0), (cp.style.display = "block"), (h = "ctrl"), CR(), CU(), z());
  }
  function CL() {
    var j = cs[ci];
    j &&
      ("memory" === j.key
        ? CM(ci, !0)
        : "restore" === j.key
          ? (RS(), CS(ci, RT(), null))
          : (CC(), j.app && D(j.app.id, j.app.params, j.title)));
  }
  function CK(t, e) {
    var c = ci % 2;
    if (37 === t) c > 0 && (ci--, CR());
    else if (39 === t) c < 1 && ci + 1 < cs.length && (ci++, CR());
    else if (38 === t) ci >= 2 ? ((ci -= 2), CR()) : CC();
    else if (40 === t) ci + 2 < cs.length && ((ci += 2), CR());
    else if (13 === t) CL();
    else if (461 === t || 27 === t || 8 === t) CC();
    e.preventDefault();
  }
  !(function () {
    cp.onclick = function (e) {
      e.target === cp && CC();
    };
    for (var j = 0; j < cs.length; j++)
      !(function (j) {
        var d = cs[j],
          it = document.createElement("div"),
          ic = document.createElement("div"),
          tx = document.createElement("div"),
          ti = document.createElement("div"),
          su = document.createElement("div"),
          ba = document.createElement("div"),
          fi = document.createElement("div");
        it.className = "citem";
        ic.className = "cicon";
        ic.innerHTML = CI[d.key] || "";
        tx.className = "ctext";
        ti.className = "ctitle";
        ti.appendChild(document.createTextNode(d.title));
        su.className = "csub";
        su.appendChild(document.createTextNode(d.sub || ""));
        ba.className = "cbar";
        fi.className = "cfill";
        ba.appendChild(fi);
        tx.appendChild(ti);
        tx.appendChild(su);
        tx.appendChild(ba);
        it.appendChild(ic);
        it.appendChild(tx);
        it.onmouseover = function () {
          ci = j;
          CR();
        };
        it.onclick = function () {
          ci = j;
          CL();
        };
        cg.appendChild(it);
        ce.push({ el: it, sub: su, bar: ba, fill: fi });
      })(j);
  })();
  (document.addEventListener(
    "keydown",
    function (e) {
      var t = e.keyCode;
      if ("edit" === h) return void EK(t, e);
      if ("dock" === h && 13 === t) {
        // OK: short press opens the app (on key release), long press starts edit mode
        e.preventDefault();
        okTimer ||
          (okTimer = setTimeout(function () {
            okTimer = null;
            EE(p);
          }, 700));
        return;
      }
      if ("panel" === h) return void R(t, e);
      if ("ctrl" === h) return void CK(t, e);
      if ("grid" === h || "gmenu" === h) return void gridKey(t, e);
      if (461 === t || 27 === t || 8 === t)
        return void ("top" === h ? A(p) : PB(), e.preventDefault());
      "dock" === h
        ? 37 === t
          ? (A(p - 1), e.preventDefault())
          : 39 === t
            ? (A(p + 1), e.preventDefault())
            : 38 === t
              ? (m.length && K(g), e.preventDefault())
              : 40 === t
                ? (gridOpen(), e.preventDefault())
                : !1
        : 37 === t
          ? (K(g - 1), e.preventDefault())
          : 39 === t
            ? (K(g + 1), e.preventDefault())
            : 40 === t
              ? (A(p), e.preventDefault())
              : 13 === t
                ? (O(m[g]), e.preventDefault())
                : 38 === t && e.preventDefault();
    },
    !1,
  ),
    document.addEventListener(
      "keyup",
      function (e) {
        if (13 !== e.keyCode) return;
        // if released before the timer fired it is a short press: open the app
        if (okTimer) {
          clearTimeout(okTimer);
          okTimer = null;
          "dock" === h && M(a[p]);
        }
        okArm = false;
        // short OK in the grid: open the app; a long press has already opened the menu
        if (gridTimer) {
          clearTimeout(gridTimer);
          gridTimer = null;
          "grid" === h && gridLaunch(gridItems[gridIdx]);
        }
        gridArm = false;
      },
      !1,
    ),
    window.addEventListener("resize", P, !1),
    window.addEventListener("load", z, !1),
    document.addEventListener(
      "webOSRelaunch",
      function () {
        ("grid" === h && gridClose(), w(), z(), n.weather && N(1e3));
      },
      !1,
    ),
    (function () {
      var e, t;
      OA(); // kaydedilmis siralamayi uygula
      for (e = 0; e < a.length; e++) TB(a[e]);
      for (t = 0; t < d.length; t++)
        (function (e) {
          if (e.cfg) {
            var t = m.length;
            (m.push(e),
              (e.el.onmouseover = function () {
                K(t);
              }),
              (e.el.onclick = function () {
                (K(t), O(e));
              }));
          } else e.el.style.display = "none";
        })(d[t]);
    })(),
    n.blur && (document.body.className = "blur"),
    w(),
    setInterval(w, 5e3),
    A(0),
    n.weather &&
      (n.weather.auto && geoApply(geoCached()),
      !(function () {
        try {
          var e = localStorage.getItem("weather");
          if (e) {
            var t = JSON.parse(e);
            "number" == typeof t.t && C(t.t, t.c);
          }
        } catch (e) {}
      })(),
      x()));
})();
