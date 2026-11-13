var pkgInfo = require('./package.json');
var Service = require('webos-service');
var fs = require('fs');

var service = new Service(pkgInfo.name);

function parseMeminfo(txt) {
  function g(k) {
    var m = new RegExp('^' + k + ':\\s+(\\d+)', 'm').exec(txt);
    return m ? parseInt(m[1], 10) : null;
  }
  var total = g('MemTotal');
  var avail = g('MemAvailable');
  if (avail === null) {
    var f = g('MemFree'), b = g('Buffers'), c = g('Cached');
    if (f !== null) avail = f + (b || 0) + (c || 0);
  }
  return { totalKB: total, availableKB: avail };
}

service.register('getMemory', function (message) {
  fs.readFile('/proc/meminfo', 'utf8', function (err, txt) {
    if (err) {
      message.respond({ returnValue: false, errorText: String(err) });
      return;
    }
    var r = parseMeminfo(txt);
    if (r.totalKB === null || r.availableKB === null) {
      message.respond({ returnValue: false, errorText: 'meminfo parse failed' });
      return;
    }
    r.returnValue = true;
    message.respond(r);
  });
});

// Yuklu uygulama listesi: once listLaunchPoints, olmazsa listApps.
// TV bu cagrilari ucuncu taraf servislere kapatmis olabilir; o durumda hata doner ve launcher baska yola gecer.
service.register('listApps', function (message) {
  service.call('luna://com.webos.applicationManager/listLaunchPoints', {}, function (res) {
    var p = (res && res.payload) || {};
    if (p.returnValue !== false && p.launchPoints && p.launchPoints.length) {
      message.respond({ returnValue: true, apps: p.launchPoints });
      return;
    }
    service.call('luna://com.webos.applicationManager/listApps', {}, function (res2) {
      var p2 = (res2 && res2.payload) || {};
      if (p2.returnValue !== false && p2.apps && p2.apps.length) {
        message.respond({ returnValue: true, apps: p2.apps });
      } else {
        message.respond({ returnValue: false, errorText: p2.errorText || p.errorText || 'liste alinamadi' });
      }
    });
  });
});
