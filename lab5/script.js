"use strict";

const VARIANT = 27;
const TABLE1 = [
  [1, 2, 3, 4, 5], [1, 3, 4, 5, 6], [1, 4, 5, 6, 7], [1, 5, 6, 7, 8], [1, 6, 7, 8, 9],
  [1, 7, 8, 9, 10], [1, 2, 4, 6, 8], [1, 3, 5, 7, 9], [1, 2, 3, 6, 7], [1, 3, 4, 8, 9],
  [1, 4, 6, 7, 8], [1, 5, 7, 8, 9], [1, 3, 4, 6, 8], [1, 4, 5, 7, 9], [1, 3, 6, 8, 10],
];
const FORM_VARIANT = ((VARIANT - 1) % TABLE1.length) + 1;
const FORM_ROWS = TABLE1[FORM_VARIANT - 1];
const GRID_VARIANT = ((VARIANT - 1) % 10) + 1;

const UA = "А-ЯІЇЄҐа-яіїєґ";
const FIELDS = {
  1:  { name: "fio",      label: "ПІБ",        ph: "Власюк В.А.",
        re: /^[А-ЯІЇЄҐ][а-яіїєґ']{1,}\s[А-ЯІЇЄҐ]\.[А-ЯІЇЄҐ]\.$/,
        err: "Формат: Прізвище І.П." },
  2:  { name: "variant",  label: "Варіант",    ph: "27",
        re: /^\d{1,3}$/, err: "Лише число" },
  3:  { name: "group",    label: "Група",      ph: "ІП-72",
        re: /^[А-ЯІЇЄҐ]{2}-\d{2}$/, err: "Формат: ТТ-ЧЧ" },
  4:  { name: "phone",    label: "Телефон",    ph: "(099)-305-84-42",
        re: /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/, err: "Формат: (ЧЧЧ)-ЧЧЧ-ЧЧ-ЧЧ" },
  5:  { name: "idcard",   label: "ID-card",    ph: "ВА №123456",
        re: /^[А-ЯІЇЄҐ]{2} №\d{6}$/, err: "Формат: ТТ №ЧЧЧЧЧЧ" },
  6:  { name: "faculty",  label: "Факультет",  ph: "ФІОТ",
        re: /^[А-ЯІЇЄҐA-Z]{4}$/, err: "Формат: ТТТТ" },
  7:  { name: "birth",    label: "Дата народж.", ph: "25.03.2005",
        re: /^\d{2}\.\d{2}\.\d{4}$/, err: "Формат: ЧЧ.ЧЧ.ЧЧЧЧ", check: validDate },
  8:  { name: "address",  label: "Адреса",     ph: "м. 123456",
        re: /^м\. \d{6}$/, err: "Формат: м. ЧЧЧЧЧЧ" },
  9:  { name: "email",    label: "e-mail",     ph: "ivanov@example.com",
        re: /^[A-Za-z]+@[A-Za-z]+\.com$/, err: "Формат: тттттт@ттттт.com" },
  10: { name: "telegram", label: "Telegram",   ph: "@I_Ivan",
        re: /^@[A-Za-z]_[A-Za-z]{5}$/, err: "Формат: @Т_ТТТТТ" },
};

function validDate(s) {
  const [d, m, y] = s.split(".").map(Number);
  const dt = new Date(y, m - 1, d);
  return y >= 1900 && dt <= new Date() &&
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

const form = document.getElementById("form");
const fieldsBox = document.getElementById("fields");
const output = document.getElementById("output");

FORM_ROWS.forEach((row) => {
  const f = FIELDS[row];
  const wrap = document.createElement("div");
  wrap.className = "field";
  wrap.innerHTML =
    `<input type="text" name="${f.name}" placeholder="${f.label} (напр. ${f.ph})" autocomplete="off">` +
    `<div class="err"></div>`;
  fieldsBox.appendChild(wrap);
});

function validateField(row, input) {
  const f = FIELDS[row];
  const val = input.value.trim();
  const ok = f.re.test(val) && (!f.check || f.check(val));
  input.classList.toggle("invalid", !ok);
  input.classList.toggle("valid", ok);
  input.parentElement.querySelector(".err").textContent = ok ? "" : f.err;
  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = [...fieldsBox.querySelectorAll("input")];
  const results = inputs.map((inp, i) => validateField(FORM_ROWS[i], inp));
  if (!results.every(Boolean)) return;
  showData(inputs.map((inp, i) => [FIELDS[FORM_ROWS[i]].label, inp.value.trim()]));
});

form.addEventListener("input", (e) => {
  const i = [...fieldsBox.querySelectorAll("input")].indexOf(e.target);
  if (i >= 0 && e.target.classList.contains("invalid")) validateField(FORM_ROWS[i], e.target);
});

function esc(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function showData(pairs) {
  const rows = pairs.map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v)}</p>`).join("");
  const w = window.open("", "result", "width=380,height=420");
  if (w) {
    w.document.open();
    w.document.write(
      `<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"><title>Введені дані</title></head>` +
      `<body style="font-family:Times New Roman,serif;padding:16px"><h3>Введені дані</h3>${rows}</body></html>`
    );
    w.document.close();
    w.focus();
  } else {
    output.hidden = false;
    output.innerHTML = `<h3>Введені дані</h3>${rows}`;
  }
}

const N = 6;
const grid = document.getElementById("grid");
const palette = document.getElementById("palette");
document.getElementById("target-num").textContent = GRID_VARIANT;

for (let r = 0; r < N; r++) {
  const tr = grid.insertRow();
  for (let c = 0; c < N; c++) {
    const td = tr.insertCell();
    td.textContent = r * N + c + 1;
  }
}

const target = grid.rows[Math.floor((GRID_VARIANT - 1) / N)].cells[(GRID_VARIANT - 1) % N];
target.classList.add("target");
const targetRow = target.parentElement.rowIndex;

const randomColor = () =>
  "#" + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, "0");

let baseColor = "";
target.addEventListener("mouseover", () => {
  baseColor = target.style.backgroundColor;
  target.style.backgroundColor = randomColor();
});
target.addEventListener("mouseout", () => {
  target.style.backgroundColor = baseColor;
});

let clickTimer = null;
target.addEventListener("click", () => {
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    if (palette.showPicker) { try { palette.showPicker(); } catch (_) { palette.click(); } }
    else palette.click();
  }, 250);
});
palette.addEventListener("input", () => {
  baseColor = palette.value;
  target.style.backgroundColor = palette.value;
});

target.addEventListener("dblclick", () => {
  clearTimeout(clickTimer);
  for (let r = targetRow; r < N; r += 2) {
    for (const cell of grid.rows[r].cells) cell.style.backgroundColor = palette.value;
  }
  baseColor = target.style.backgroundColor;
});