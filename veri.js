// veri.js: ilanları getirir. Sayfayla ilgili hiçbir şey bilmez.
export async function ilanlariGetir(adres) {
  const yanit = await fetch(adres);
  if (!yanit.ok) {
    throw new Error("Sunucu hata verdi, durum kodu: " + yanit.status);
  }
  return await yanit.json();
}
