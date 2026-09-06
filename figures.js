/* =========================================================
   Fotky pozic hormonální jógy
   Výřezy z původního cvičebního listu (fotografie sestavy),
   srovnané stíny papíru, zvýšený kontrast a doostřené.
   Klíč = id položky v YOGA.sections.
   ========================================================= */

const YOGA_PHOTOS = {
  "w1": "img/yoga/w1.jpg",
  "w2": "img/yoga/w2.jpg",
  "w3": "img/yoga/w3.jpg",
  "w4": "img/yoga/w4.jpg",
  "w5": "img/yoga/w5.jpg",
  "w6": "img/yoga/w6.jpg",
  "w7": "img/yoga/w7.jpg",
  "y1": "img/yoga/y1.jpg",
  "y2": "img/yoga/y2.jpg",
  "y3": "img/yoga/y3.jpg",
  "y4": "img/yoga/y4.jpg",
  "y5": "img/yoga/y5.jpg",
  "y6": "img/yoga/y6.jpg",
  "y7": "img/yoga/y7.jpg",
  "y8": "img/yoga/y8.jpg",
  "y9": "img/yoga/y9.jpg",
  "y10": "img/yoga/y10.jpg",
  "y11": "img/yoga/y11.jpg",
  "y12": "img/yoga/y12.jpg",
  "y13": "img/yoga/y13.jpg",
  "y14": "img/yoga/y14.jpg",
  "y15": "img/yoga/y15.jpg",
  "y16": "img/yoga/y16.jpg"
};

/* Obrázek pozice; prázdný řetězec, pokud fotku nemám. */
function poseImg(id, cls) {
  const src = YOGA_PHOTOS[id];
  if (!src) return "";
  return `<img class="yphoto ${cls || ""}" src="${src}" alt="" loading="lazy" decoding="async">`;
}
