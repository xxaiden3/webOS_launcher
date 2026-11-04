// Ayarlar. Sirayi degistirebilir, satir ekleyip silebilirsin.
// id yanlissa uygulama acilmaz; ekranda altta kisa bir hata mesaji cikar.
// Logo eklemek icin: kare PNG'yi "icons" klasorune koy, satira icon: "icons/dosya.png" yaz.
// color: kutunun zemin rengi (logonun zemini ile ayni olsun). Yoksa sade cam zemin kullanilir.
// Logo yoksa kutuda "letter" yazisi gorunur.
var CONFIG = {
  use24h: true,
  apps: [
    { id: "netflix",               name: "Netflix",     letter: "N" },
    { id: "youtube.leanback.v4",   name: "YouTube",     letter: "Y" },
    { id: "amazon",                name: "Prime Video", letter: "P" },
    { id: "com.webos.app.browser", name: "Tarayıcı",    letter: "W" },
    { id: "com.webos.app.livetv",  name: "Canlı TV",    letter: "TV" },
    { id: "com.webos.app.home",    name: "LG Menü",     letter: "LG" }
  ],
  // Sag ustteki iki dugme (soldan saga: Wi-Fi, Ayarlar)
  wifi:     { id: "com.palm.app.settings", params: { target: "network" } },
  settings: { id: "com.palm.app.settings" },
  // Hava durumu (Open-Meteo, anahtar gerektirmez). Alinamazsa hic gorunmez.
  weather: { name: "Ankara", lat: 39.93, lon: 32.86 }
};
