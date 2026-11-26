// EL-TAŞ Mobil · telefona gelen bildirim (uygulamanın arka plan işçisine eklenir).
// Sunucudan gelen şifreli bildirim tarayıcı tarafından çözülür; burada yalnızca gösterilir.
// Dokununca uygulama Uyarılar sayfasında açılır.

self.addEventListener('push', (olay) => {
  let veri = {};
  try {
    veri = olay.data ? olay.data.json() : {};
  } catch {
    veri = { metin: olay.data ? olay.data.text() : '' };
  }
  const baslik = veri.baslik || 'EL-TAŞ Mobil';
  olay.waitUntil(
    self.registration.showNotification(baslik, {
      body: veri.metin || '',
      icon: 'ikon-192.png',
      badge: 'ikon-192.png',
      tag: veri.etiket || undefined,
      lang: 'tr',
      data: { adres: veri.adres || './#uyarilar' },
    }),
  );
});

self.addEventListener('notificationclick', (olay) => {
  olay.notification.close();
  const adres = new URL(olay.notification.data?.adres || './#uyarilar', self.registration.scope).href;
  olay.waitUntil(
    (async () => {
      const pencereler = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const acik = pencereler.find((p) => p.url.startsWith(self.registration.scope));
      if (acik) {
        await acik.focus();
        acik.postMessage({ eltas: 'uyarilar' });
        return;
      }
      await self.clients.openWindow(adres);
    })(),
  );
});
