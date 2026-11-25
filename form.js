// form.js: başvuru formunu sayfa yenilenmeden işler.
// Zorunlu alan, e-posta, pattern (telefon) ve url denetimlerini tarayıcı yapar;
// "submit" olayı ancak form geçerliyse tetiklenir.
const form = document.querySelector("#basvuru");
const ileti = document.querySelector("#basvuru-ileti");

form.addEventListener("submit", (olay) => {
  olay.preventDefault();            // sayfanın yenilenmesini engeller
  ileti.textContent = "Başvurunuz alındı.";
  form.reset();                     // alanları temizler
});
