// app.js: ilanlar.json dosyasını okur ve ilanları kart olarak sayfaya basar.
// Sayfayı Live Server ile açın. file:// ile açılan sayfada fetch çalışmaz.
import { ilanlariGetir } from "./veri.js";

const ADRES = "ilanlar.json";
const ANAHTAR = "basvuracaklarim";
const $ = (secici) => document.querySelector(secici);

const ALAN_ADI = { "on-yuz": "Ön yüz", "arka-uc": "Arka uç", veri: "Veri", sistem: "Sistem" };

let ilanlar = [];
let liste = listeyiOku();   // başvuracağım ilanların id'leri, örn. [2, 7]

// ---- Başvuracaklarım listesi (localStorage) ----
function listeyiOku() {
  try {
    const veri = JSON.parse(localStorage.getItem(ANAHTAR));
    return Array.isArray(veri) ? veri.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];   // bozuk JSON gelirse boş liste ile devam et
  }
}

function listeyiKaydet() {
  localStorage.setItem(ANAHTAR, JSON.stringify(liste));
}

function sayaciGuncelle() {
  $("#liste-sayisi").textContent = `Başvuracaklarım: ${liste.length}`;
}

// Dört durum tek yerden yönetilir: yukleniyor, bos, hata, veri.
function durum(tur, mesaj) {
  $("#durum").dataset.durum = tur;
  $("#durum").textContent = mesaj;
}

// Bir ilan nesnesinden bir kart (<li>) üretir.
function kart(ilan) {
  const li = document.createElement("li");
  li.className = "kart";
  li.dataset.id = ilan.id;

  const baslik = document.createElement("h3");
  baslik.textContent = ilan.pozisyon;

  const firma = document.createElement("p");
  firma.textContent = `${ilan.firma} · ${ilan.sehir}`;

  const bilgi = document.createElement("p");
  bilgi.textContent = `${ALAN_ADI[ilan.alan] ?? ilan.alan} · ` +
    `${ilan.tur === "staj" ? "Staj" : "İş"} · son başvuru ${ilan.sonBasvuru}`;

  const aciklama = document.createElement("p");
  aciklama.textContent = ilan.aciklama;

  const dugme = document.createElement("button");
  dugme.type = "button";
  dugme.className = "basvur";
  dugme.textContent = liste.includes(Number(ilan.id)) ? "Listemden çıkar" : "Listeme ekle";

  li.append(baslik, firma, bilgi, aciklama, dugme);
  return li;
}

// Verilen listeyi #ilanlar içine çizer ve durumu günceller.
function ciz(gosterilecek) {
  $("#ilanlar").replaceChildren(...gosterilecek.map(kart));
  if (gosterilecek.length === 0) durum("bos", "Gösterilecek ilan yok.");
  else durum("veri", `${gosterilecek.length} ilan`);
}

// Alan seçimi ve arama kutusunu birlikte uygular.
function suz() {
  const alan = $("#alan").value;
  const metin = $("#arama").value.trim().toLocaleLowerCase("tr-TR");
  const sonuc = ilanlar.filter((ilan) =>
    (alan === "" || ilan.alan === alan) &&
    (`${ilan.pozisyon} ${ilan.firma}`.toLocaleLowerCase("tr-TR")).includes(metin)
  );
  ciz(sonuc);
}

// Olay delegasyonu: tek dinleyici, bütün "basvur" düğmeleri için.
$("#ilanlar").addEventListener("click", (olay) => {
  const dugme = olay.target.closest(".basvur");
  if (!dugme) return;
  const id = Number(dugme.closest("li").dataset.id);   // dataset metin verir, sayıya çeviriyoruz
  liste = liste.includes(id) ? liste.filter((x) => x !== id) : [...liste, id];
  listeyiKaydet();
  sayaciGuncelle();
  suz();   // süzgeç korunarak yeniden çiz, düğme yazısı güncellensin
});

$("#alan").addEventListener("change", suz);
$("#arama").addEventListener("input", suz);

async function baslat() {
  sayaciGuncelle();
  durum("yukleniyor", "İlanlar yükleniyor…");
  try {
    ilanlar = await ilanlariGetir(ADRES);
    suz();
  } catch (hata) {
    durum("hata", "İlanlar yüklenemedi: " + hata.message);
  }
}

baslat();
