# webOS Launcher (com.yasin.launcher)

LG webOS TV'ler için sade bir ana ekran / başlatıcı uygulaması. LG 49LF630V (webOS 2.2.3) üzerinde test edildi.

## Özellikler
- Saat, hava durumu (Open-Meteo, API anahtarı gerekmez)
- Uygulama kısayolları (Netflix, YouTube, Prime Video, Tarayıcı, Canlı TV, LG Menü)
- Wi-Fi ve Ayarlar kısayolları
- Uzaktan kumanda ile gezinme

## Ayarlar
Uygulama listesini, saat formatını ve şehri `launcher/config.js` dosyasından değiştirebilirsin.

## Kurulum
`.ipk` dosyasını [Releases](../../releases) sayfasından indir ve TV'ye yükle:

```bash
# Developer Mode açık ve TV `ares-setup-device` ile tanıtılmış olmalı
ares-install --device tv com_yasin_launcher_1_4_0_all.ipk
ares-launch  --device tv com.yasin.launcher
```

## Paketleme (kaynaktan .ipk üretme)
```bash
ares-package launcher
```

## Dosya yapısı
```
launcher/
  appinfo.json   uygulama bilgileri
  index.html     arayüz
  app.js         mantık
  style.css      stil
  config.js      kullanıcı ayarları
  *.png, bg.jpg  görseller
```
