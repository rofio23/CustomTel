const COLORS = [
  {n:"Minuit", a:"#3d3d4d", b:"#1b1b24", clair:false},
  {n:"Perle", a:"#f4f1ee", b:"#d9d4ce", clair:true},
  {n:"Océan", a:"#3b82c4", b:"#1c4f87", clair:false},
  {n:"Menthe", a:"#7fd6b0", b:"#3fa57f", clair:true},
  {n:"Corail", a:"#ff7a6b", b:"#d94b5c", clair:false},
  {n:"Lavande", a:"#a995f0", b:"#6a4fd1", clair:false},
  {n:"Soleil", a:"#ffd05a", b:"#f0a020", clair:true}
];
const FINISHES = ["mat", "brillant"];
const CAMERAS = [1, 2, 3, 4];
const SHAPES = ["rond", "carre", "pilule"];
const SHAPE_LABELS = {rond:"Arrondi", carre:"Carré", pilule:"Pilule"};
const BRANDS = ["Nova", "Aster", "Lumio", "Kora"];

const DEFAULT = {color:0, finish:"mat", cameras:2, shape:"carre", brand:"Nova"};
let state = {...DEFAULT};

const $ = id => document.getElementById(id);
const phone = $("phone"), module_ = $("module"), brand = $("brand");

function makeButtons(container, items, key, label = x => x) {
  container.innerHTML = "";
  items.forEach(v => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt";
    b.textContent = label(v);
    b.dataset.value = v;
    b.addEventListener("click", () => { state[key] = typeof v === "number" ? v : v; render(); });
    container.appendChild(b);
  });
}

function buildColors() {
  const c = $("colors");
  COLORS.forEach((col, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.style.background = `linear-gradient(135deg, ${col.a}, ${col.b})`;
    b.title = col.n;
    b.setAttribute("aria-label", col.n);
    b.addEventListener("click", () => { state.color = i; render(); });
    c.appendChild(b);
  });
}

function render() {
  const col = COLORS[state.color];
  phone.style.setProperty("--phone-2", col.a);
  phone.style.setProperty("--phone", col.b);
  phone.className = `phone ${state.finish}${col.clair ? " clair" : ""}`;

  module_.className = `module ${state.shape} c${state.cameras}`;
  module_.innerHTML = "";
  for (let i = 0; i < state.cameras; i++) {
    const l = document.createElement("div");
    l.className = "lens";
    module_.appendChild(l);
  }
  const f = document.createElement("div");
  f.className = "flash";
  module_.appendChild(f);

  brand.textContent = state.brand;

  document.querySelectorAll(".swatch").forEach((b, i) => b.setAttribute("aria-pressed", i === state.color));
  const sync = (id, val) => document.querySelectorAll(`#${id} .opt`).forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.value) === String(val)));
  sync("finish", state.finish);
  sync("cameras", state.cameras);
  sync("shape", state.shape);
  sync("brands", state.brand);

  $("recap").textContent =
    `${state.brand} · ${col.n} ${state.finish} · ${state.cameras} appareil${state.cameras > 1 ? "s" : ""} photo`;
}

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

buildColors();
makeButtons($("finish"), FINISHES, "finish", s => s[0].toUpperCase() + s.slice(1));
makeButtons($("cameras"), CAMERAS, "cameras", n => `${n}`);
makeButtons($("shape"), SHAPES, "shape", s => SHAPE_LABELS[s]);
makeButtons($("brands"), BRANDS, "brand");

$("random").addEventListener("click", () => {
  state = {color: Math.floor(Math.random() * COLORS.length), finish: pick(FINISHES),
           cameras: pick(CAMERAS), shape: pick(SHAPES), brand: pick(BRANDS)};
  render();
});
$("reset").addEventListener("click", () => { state = {...DEFAULT}; render(); });

render();

