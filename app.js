/* =========================================================
   KOKORO · App de socios + Punto de venta
   Firebase Auth + Cloud Firestore (SDK modular 10.12.2)
   ========================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc, collection, query, where,
  orderBy, limit, getDocs, onSnapshot, runTransaction, serverTimestamp, Timestamp, increment, writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------- Firebase ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAnq1OZavOTquMPyLs_etqA0qystCd7rMI",
  authDomain: "oracles-99bc3.firebaseapp.com",
  projectId: "oracles-99bc3",
  storageBucket: "oracles-99bc3.firebasestorage.app",
  messagingSenderId: "785165056789",
  appId: "1:785165056789:web:ffb2e1a6f8736d940d871c",
  measurementId: "G-W7LWPEWW8Z"
};
const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);

/* ---------- Constantes ---------- */
const LOGO = "data:image/webp;base64,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";
const QR_PREFIX = "KOKORO"; // el QR lleva KOKORO + uid (solo letras y números: funciona con cualquier lector USB)
const PROGRAMA_BASE = { sellosParaRecompensa: 8, modoSellos: "porBebida", nombreRecompensa: "Un café gratis", descuentoSocio: 0 };
const PRODUCTOS_BASE = [
  { nombre: "Kokoro", detalle: "12 oz", precio: 55, categoria: "Café", otorgaSello: true, activo: true, orden: 1 },
  { nombre: "Ooki", detalle: "16 oz", precio: 70, categoria: "Café", otorgaSello: true, activo: true, orden: 2 }
];
const METODOS = { efectivo: "Efectivo", tarjeta: "Tarjeta", transferencia: "Transferencia" };

/* ---------- Estado ---------- */
const S = {
  user: null, perfil: null, programa: { ...PROGRAMA_BASE },
  subs: [],
  productos: [], promos: [], promosCliente: [],
  cat: "", cart: [], cliente: null, usarRecompensa: false, descuentoId: "", metodo: "efectivo",
  clientes: null, ventasLista: [], rango: { resumen: "hoy", ventas: "hoy" },
  pendingPerfil: null, prevTot: null, prevRecs: null,
  vista: null, cpane: "tarjeta", apane: "caja",
  scanner: null, scanBusy: false, qrKey: "", reqId: 0
};

/* =========================================================
   UTILIDADES
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const money = n => MXN.format(Number(n) || 0);
const round2 = n => Math.round((Number(n) || 0) * 100) / 100;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const lowerFirst = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : "";
const plural = (n, s, p) => `${n} ${n === 1 ? s : (p || s + "s")}`;
const toDate = t => t?.toDate ? t.toDate() : (t instanceof Date ? t : null);
const fFecha = t => { const d = toDate(t); return d ? d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "—"; };
const fHora = t => { const d = toDate(t); return d ? d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }) : "Ahora"; };
const fFechaHora = t => { const d = toDate(t); return d ? d.toLocaleString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Ahora"; };
const folio = id => String(id).slice(0, 6).toUpperCase();
const meta = () => Math.min(20, Math.max(3, parseInt(S.programa.sellosParaRecompensa, 10) || 8));
const icon = id => `<svg class="ic"><use href="#i-${id}"/></svg>`;

const pref = {
  get() { try { return localStorage.getItem("kokoro-vista"); } catch { return null; } },
  set(v) { try { localStorage.setItem("kokoro-vista", v); } catch { /* sin almacenamiento */ } }
};

function toast(msg, error = false) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.toggle("is-error", error);
  t.classList.toggle("is-admin", S.vista === "admin");
  t.classList.add("is-on");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("is-on"), 3400);
}

function genCodigo() {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const a = new Uint32Array(6);
  crypto.getRandomValues(a);
  return "KK-" + [...a].map(x => A[x % A.length]).join("");
}

const ERRORES = {
  "auth/invalid-email": "El correo no tiene un formato válido.",
  "auth/missing-password": "Escribe tu contraseña.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/invalid-login-credentials": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "No hay una cuenta con ese correo.",
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo. Entra con él.",
  "auth/weak-password": "La contraseña necesita al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos y vuelve a probar.",
  "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.",
  "auth/popup-blocked": "El navegador bloqueó la ventana de Google. Permite ventanas emergentes.",
  "auth/operation-not-allowed": "Este método de acceso no está activado en Firebase Authentication.",
  "auth/unauthorized-domain": "Este dominio no está autorizado en Firebase Authentication.",
  "auth/account-exists-with-different-credential": "Ese correo ya tiene cuenta con contraseña. Entra con tu correo y contraseña.",
  "auth/network-request-failed": "Sin conexión. Revisa tu internet.",
  "permission-denied": "Firestore rechazó la operación. Revisa que publicaste las reglas de seguridad.",
  "unavailable": "Sin conexión con la base de datos. Revisa tu internet."
};
const errMsg = e => {
  if (e?.code === "auth/unauthorized-domain") {
    const host = location.hostname;
    return host
      ? `Agrega “${host}” en Firebase Console > Authentication > Configuración > Dominios autorizados.`
      : "Abre la app desde un servidor web (https o localhost), no con doble clic en el archivo.";
  }
  return ERRORES[e?.code] || e?.message || "Algo salió mal. Intenta de nuevo.";
};

function setErr(form, msg = "") { const p = $(".form__error", form); if (p) p.textContent = msg; }

function busy(btn, on, txt) {
  if (!btn) return;
  if (on) { btn.dataset.html = btn.innerHTML; btn.disabled = true; if (txt) btn.textContent = txt; }
  else { btn.disabled = false; if (btn.dataset.html) { btn.innerHTML = btn.dataset.html; delete btn.dataset.html; } }
}

function confirmar(titulo, texto, okTxt = "Confirmar", peligro = false) {
  return new Promise(res => {
    const d = $("#dlgConfirm"), ok = $("#cfOk");
    $("#cfTitulo").textContent = titulo;
    $("#cfTexto").textContent = texto;
    ok.textContent = okTxt;
    ok.classList.toggle("btn--danger", peligro);
    let r = false;
    ok.onclick = () => { r = true; d.close(); };
    d.addEventListener("close", () => res(r), { once: true });
    d.showModal();
  });
}

function descargar(nombre, contenido, tipo) {
  const blob = contenido instanceof Blob ? contenido : new Blob([contenido], { type: tipo });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* =========================================================
   ARRANQUE Y SESIÓN
   ========================================================= */
$$("[data-logo]").forEach(i => { i.src = LOGO; });
$("#favicon").href = LOGO;

function show(v) {
  ["auth", "onboard", "cliente", "admin"].forEach(n => { $("#view-" + n).hidden = n !== v; });
  S.vista = v;
  $("#toast").classList.remove("is-on");
  $("#boot").classList.add("is-done");
  window.scrollTo(0, 0);
}

function limpiarSubs() { S.subs.forEach(u => { try { u(); } catch { /* nada */ } }); S.subs = []; }

onAuthStateChanged(auth, user => arrancar(user));

async function arrancar(user) {
  limpiarSubs();
  await cerrarScanner();
  S.user = user; S.perfil = null; S.prevTot = null; S.prevRecs = null; S.clientes = null; S.qrKey = "";
  resetVenta(false);
  if (!user) { $("#formLogin").reset(); $("#formRegistro").reset(); authTab("login"); show("auth"); return; }
  try {
    const ref = doc(db, "usuarios", user.uid);
    let snap = await getDoc(ref);
    if (!snap.exists()) {
      if (S.pendingPerfil) {
        await crearPerfil(user, S.pendingPerfil);
        S.pendingPerfil = null;
        snap = await getDoc(ref);
      } else { abrirOnboard(user); return; }
    }
    S.perfil = { id: snap.id, ...snap.data() };
    await cargarPrograma();
    if (S.perfil.rol === "admin" && pref.get() !== "cliente") entrarAdmin();
    else entrarCliente();
  } catch (e) {
    console.error(e);
    S.pendingPerfil = null;
    const msg = errMsg(e);
    await signOut(auth).catch(() => {});
    setTimeout(() => { setErr($("#formLogin"), msg); toast(msg, true); }, 50);
  }
}

async function cargarPrograma() {
  try {
    const s = await getDoc(doc(db, "config", "programa"));
    S.programa = { ...PROGRAMA_BASE, ...(s.exists() ? s.data() : {}) };
  } catch { S.programa = { ...PROGRAMA_BASE }; }
}

async function crearPerfil(user, { nombre, telefono }) {
  await setDoc(doc(db, "usuarios", user.uid), {
    nombre: String(nombre || "").trim(),
    email: user.email || "",
    telefono: String(telefono || "").trim(),
    cumpleanos: "", bebidaFavorita: "", leche: "", notas: "",
    codigo: genCodigo(),
    rol: "cliente",
    sellos: 0, sellosTotales: 0, recompensasDisponibles: 0, recompensasCanjeadas: 0,
    visitas: 0, totalGastado: 0, ultimaVisita: null,
    creado: serverTimestamp()
  });
}

/* ---------- Pantalla de acceso ---------- */
function authTab(t) {
  $$("[data-auth-tab]").forEach(b => { const on = b.dataset.authTab === t; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on); });
  $("#formLogin").hidden = t !== "login";
  $("#formRegistro").hidden = t !== "registro";
  $("#authTitle").textContent = t === "login" ? "Tu café, con memoria." : "Hazte socio de Kokoro.";
  setErr($("#formLogin")); setErr($("#formRegistro"));
}

$("#formLogin").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f);
  const email = f.email.value.trim(), password = f.password.value;
  if (!email || !password) { setErr(f, "Escribe tu correo y tu contraseña."); return; }
  setErr(f); busy(btn, true, "Entrando…");
  try { await signInWithEmailAndPassword(auth, email, password); }
  catch (err) { setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

$("#formRegistro").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f);
  const nombre = f.nombre.value.trim(), telefono = f.telefono.value.trim();
  const email = f.email.value.trim(), password = f.password.value;
  if (!nombre) { setErr(f, "Escribe tu nombre."); return; }
  if (!email) { setErr(f, "Escribe tu correo."); return; }
  if (password.length < 6) { setErr(f, "La contraseña necesita al menos 6 caracteres."); return; }
  setErr(f); busy(btn, true, "Creando tu cuenta…");
  S.pendingPerfil = { nombre, telefono };
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    updateProfile(cred.user, { displayName: nombre }).catch(() => {});
  } catch (err) { S.pendingPerfil = null; setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

$("#btnOlvide").addEventListener("click", async () => {
  const f = $("#formLogin"), email = f.email.value.trim();
  if (!email) { setErr(f, "Escribe tu correo arriba y vuelve a tocar “Olvidé mi contraseña”."); f.email.focus(); return; }
  try { await sendPasswordResetEmail(auth, email); setErr(f); toast("Te enviamos un correo para cambiar tu contraseña."); }
  catch (err) { setErr(f, errMsg(err)); }
});

$("#btnGoogle").addEventListener("click", async e => {
  const btn = e.currentTarget;
  busy(btn, true, "Abriendo Google…");
  try { await signInWithPopup(auth, new GoogleAuthProvider()); }
  catch (err) { const f = $("#formLogin").hidden ? $("#formRegistro") : $("#formLogin"); setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

/* ---------- Completar perfil (usuarios de Google) ---------- */
function abrirOnboard(user) {
  const f = $("#formOnboard");
  f.nombre.value = user.displayName || "";
  f.telefono.value = "";
  setErr(f);
  show("onboard");
}

$("#formOnboard").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f);
  if (!f.nombre.value.trim()) { setErr(f, "Escribe tu nombre."); return; }
  busy(btn, true, "Creando tu tarjeta…");
  try {
    await crearPerfil(S.user, { nombre: f.nombre.value, telefono: f.telefono.value });
    await arrancar(S.user);
  } catch (err) { setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

/* =========================================================
   APP DEL CLIENTE
   ========================================================= */
function entrarCliente() {
  pref.set("cliente");
  limpiarSubs();
  show("cliente");
  $("#btnIrPanel").hidden = S.perfil.rol !== "admin";
  S.prevTot = null; S.prevRecs = null;
  renderCliente();
  irCliente("tarjeta");
  const uid = S.user.uid;

  S.subs.push(onSnapshot(doc(db, "usuarios", uid), snap => {
    if (!snap.exists()) return;
    S.perfil = { id: snap.id, ...snap.data() };
    renderCliente();
  }, e => toast(errMsg(e), true)));

  S.subs.push(onSnapshot(doc(db, "config", "programa"), snap => {
    S.programa = { ...PROGRAMA_BASE, ...(snap.data() || {}) };
    renderCliente(); renderPromosCliente();
  }, e => console.warn(e)));

  S.subs.push(onSnapshot(query(collection(db, "promociones"), where("activa", "==", true)), snap => {
    S.promosCliente = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderPromosCliente();
  }, e => console.warn(e)));

  S.subs.push(onSnapshot(query(collection(db, "usuarios", uid, "historial"), orderBy("fecha", "desc"), limit(40)), snap => {
    renderHistorial($("#cHist"), snap.docs.map(d => ({ id: d.id, ...d.data() })), true);
  }, e => console.warn(e)));
}

function irCliente(p) {
  S.cpane = p;
  $$("[data-cpane]").forEach(el => { el.hidden = el.dataset.cpane !== p; });
  $$(".tabbar__btn").forEach(b => b.classList.toggle("is-on", b.dataset.cgo === p));
  $("#view-cliente").classList.toggle("is-qr", p === "qr");
  $("meta[name=theme-color]").content = p === "qr" ? "#20170F" : "#F5EBE1";
  if (p === "perfil") llenarPerfil();
  window.scrollTo(0, 0);
}

function columnasSellos(N) {
  if (N > 12 && N % 6 === 0) return 6;
  if (N % 4 === 0) return 4;
  if (N % 5 === 0) return 5;
  if (N % 3 === 0) return 3;
  return 4;
}

function renderCliente() {
  const p = S.perfil; if (!p) return;
  const N = meta();
  const sellos = Math.min(p.sellos || 0, N);
  const recs = p.recompensasDisponibles || 0;
  const premio = S.programa.nombreRecompensa || PROGRAMA_BASE.nombreRecompensa;

  // ¿llegaron sellos nuevos mientras la app estaba abierta?
  const tot = p.sellosTotales || 0;
  let animar = 0;
  if (S.prevTot !== null && tot > S.prevTot) {
    const g = tot - S.prevTot;
    animar = Math.min(g, sellos);
    if (!(S.prevRecs !== null && recs > S.prevRecs)) toast(g === 1 ? "Sumaste un sello. Gracias por tu visita." : `Sumaste ${g} sellos. Gracias por tu visita.`);
  }
  if (S.prevRecs !== null && recs > S.prevRecs) toast(`Completaste tu tarjeta. ${premio} te espera.`);
  S.prevTot = tot; S.prevRecs = recs;

  $("#cHola").textContent = `Hola, ${(p.nombre || "").split(" ")[0] || "socio"}.`;
  $("#cNombreCard").textContent = p.nombre || "";
  $("#cCodigo").textContent = p.codigo || "";

  const ol = $("#cStamps");
  ol.style.gridTemplateColumns = `repeat(${columnasSellos(N)},1fr)`;
  let html = "";
  for (let i = 1; i <= N; i++) {
    const on = i <= sellos;
    const rot = ((i * 37) % 13) - 6;
    const nuevo = on && animar && i > sellos - animar;
    const delay = nuevo ? `animation-delay:${(i - (sellos - animar) - 1) * 140}ms;` : "";
    if (i === N && !on) html += `<li class="stamp stamp--goal" aria-label="Regalo">${icon("gift")}<span>regalo</span></li>`;
    else html += `<li class="stamp${on ? " is-on" : ""}${nuevo ? " is-new" : ""}" style="--rot:${rot}deg;${delay}" aria-label="${on ? "Sello " + i : "Casilla " + i}"><span>${i}</span></li>`;
  }
  ol.innerHTML = html;

  const faltan = N - sellos;
  $("#cFaltan").innerHTML = faltan === 1
    ? `Te falta <b>1 sello</b> para ${esc(lowerFirst(premio))}.`
    : `Te faltan <b>${faltan} sellos</b> para ${esc(lowerFirst(premio))}.`;

  $("#cReward").hidden = recs < 1;
  $("#cRewardTitle").textContent = recs === 1 ? `${premio} te espera` : `Tienes ${recs} regalos esperándote`;

  $("#cVisitas").textContent = p.visitas || 0;
  $("#cSellosTot").textContent = tot;
  $("#cCanjeados").textContent = p.recompensasCanjeadas || 0;

  // QR (solo se vuelve a dibujar si cambia)
  const key = QR_PREFIX + S.user.uid;
  if (S.qrKey !== key) { $("#cQR").innerHTML = qrSVG(key); S.qrKey = key; }
  $("#cQRNombre").textContent = p.nombre || "";
  $("#cQRCodigo").textContent = p.codigo || "";

  $("#cMetaTxt").textContent = plural(N, "sello");
  $("#cPremioTxt").textContent = lowerFirst(premio);
  $("#cModoTxt").textContent = S.programa.modoSellos === "porVisita" ? "por cada visita." : "por cada bebida.";
}

function promoValor(p) {
  return p.tipo === "porcentaje" ? `${Number(p.valor) || 0}%` : money(p.valor).replace(/\.00$/, "");
}

function renderPromosCliente() {
  const ul = $("#cPromos"); if (!ul) return;
  const list = [...S.promosCliente].sort((a, b) => (a.titulo || "").localeCompare(b.titulo || "", "es"));
  const fija = Number(S.programa.descuentoSocio) > 0
    ? [{ titulo: "Descuento de socio", descripcion: "En todas tus compras, solo por mostrar tu QR.", tipo: "porcentaje", valor: S.programa.descuentoSocio, soloSocios: true }]
    : [];
  const all = [...fija, ...list];
  ul.innerHTML = all.length ? all.map(p => `
    <li class="promo">
      <span class="promo__val">${esc(promoValor(p))}</span>
      <div>
        <h3>${esc(p.titulo)}</h3>
        ${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ""}
        ${p.soloSocios ? `<span class="promo__tag">Solo socios</span>` : ""}
      </div>
    </li>`).join("")
    : `<li class="empty">Por ahora no hay promociones activas. Tus sellos siguen sumando.</li>`;
}

function renderHistorial(ul, items, esCliente) {
  if (!items.length) {
    ul.innerHTML = `<li class="empty">${esCliente ? "Aún no hay visitas. Muestra tu QR en tu próxima compra y aquí aparecerá." : "Este socio aún no tiene compras."}</li>`;
    return;
  }
  ul.innerHTML = items.map(h => {
    if (h.tipo === "ajuste") {
      return `<li><span class="hist__fecha">${fFechaHora(h.fecha)}</span><span class="hist__items">Ajuste de sellos en caja</span><span class="hist__total">${h.delta > 0 ? "+" : ""}${h.delta}</span></li>`;
    }
    const anulada = h.estado === "anulada";
    const items = (h.items || []).map(i => `${i.cantidad} × ${esc(i.nombre)}`).join(", ");
    const b = [];
    if (anulada) b.push(`<span class="badge badge--red">Anulada</span>`);
    if (h.sellosOtorgados > 0) b.push(`<span class="badge">+${plural(h.sellosOtorgados, "sello")}</span>`);
    if (h.recompensaCanjeada) b.push(`<span class="badge badge--dark">Regalo canjeado</span>`);
    if (h.recompensasGeneradas > 0) b.push(`<span class="badge badge--dark">Tarjeta completa</span>`);
    if (h.descuento) b.push(`<span class="badge badge--soft">${esc(h.descuento)}</span>`);
    return `<li class="${anulada ? "is-void" : ""}">
      <span class="hist__fecha">${fFechaHora(h.fecha)}</span>
      <span class="hist__items">${items || "Compra"}</span>
      <span class="hist__total">${money(h.total)}</span>
      ${b.length ? `<span class="hist__badges">${b.join("")}</span>` : ""}
    </li>`;
  }).join("");
}

function llenarPerfil() {
  const f = $("#formPerfil"), p = S.perfil;
  ["nombre", "email", "telefono", "cumpleanos", "bebidaFavorita", "leche", "notas"].forEach(k => { if (f.elements[k]) f.elements[k].value = p[k] || ""; });
  setErr(f);
}

$("#formPerfil").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f);
  const datos = {
    nombre: f.nombre.value.trim(),
    telefono: f.telefono.value.trim(),
    cumpleanos: f.cumpleanos.value,
    bebidaFavorita: f.bebidaFavorita.value.trim(),
    leche: f.leche.value,
    notas: f.notas.value.trim()
  };
  if (!datos.nombre) { setErr(f, "Tu nombre no puede quedar vacío."); return; }
  setErr(f); busy(btn, true, "Guardando…");
  try { await updateDoc(doc(db, "usuarios", S.user.uid), datos); toast("Cambios guardados."); }
  catch (err) { setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

/* ---------- QR ---------- */
function qrMatriz(texto) {
  const q = qrcode(0, "H"); // nivel H: tolera el logo al centro
  q.addData(texto);
  q.make();
  const n = q.getModuleCount();
  let L = Math.round(n * 0.24); if ((n - L) % 2) L++;
  const s = (n - L) / 2, e = s + L;
  return { n, s, e, oscuro: (r, c) => q.isDark(r, c) && !(r >= s && r < e && c >= s && c < e) };
}

function qrSVG(texto) {
  if (typeof qrcode !== "function") return `<p class="muted">No se pudo cargar el generador de QR. Revisa tu conexión.</p>`;
  const { n, s, e, oscuro } = qrMatriz(texto);
  const m = 1, size = n + m * 2;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (oscuro(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
  const L = e - s, cx = m + s + L / 2, rad = L / 2 - 0.2;
  return `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="Tu código QR de socio">
    <path d="${d}" fill="#20170F"/>
    <circle cx="${cx}" cy="${cx}" r="${rad}" fill="#F5EBE1" shape-rendering="geometricPrecision"/>
    <clipPath id="qrclip"><circle cx="${cx}" cy="${cx}" r="${rad - 0.5}"/></clipPath>
    <image href="${LOGO}" x="${cx - rad + 0.5}" y="${cx - rad + 0.5}" width="${(rad - 0.5) * 2}" height="${(rad - 0.5) * 2}" clip-path="url(#qrclip)"/>
  </svg>`;
}

const cargarImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

$("#btnGuardarQR").addEventListener("click", async () => {
  const p = S.perfil;
  const { n, s, e, oscuro } = qrMatriz(QR_PREFIX + S.user.uid);
  const px = 14, m = 3, pad = 36, qr = (n + m * 2) * px, W = qr + pad * 2, H = W + 110;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  x.fillStyle = "#F5EBE1"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#20170F";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (oscuro(r, c)) x.fillRect(pad + (c + m) * px, pad + (r + m) * px, px, px);
  const cx = pad + (m + s + (e - s) / 2) * px, rad = (e - s) / 2 * px - 3;
  try {
    const img = await cargarImg(LOGO);
    x.save(); x.beginPath(); x.arc(cx, cx, rad, 0, Math.PI * 2); x.fillStyle = "#F5EBE1"; x.fill(); x.clip();
    x.drawImage(img, cx - rad, cx - rad, rad * 2, rad * 2); x.restore();
  } catch { /* sin logo */ }
  x.textAlign = "center";
  x.fillStyle = "#20170F"; x.font = `500 34px "Shippori Mincho", Georgia, serif`; x.fillText(p.nombre || "", W / 2, W + 26);
  x.fillStyle = "#7A4221"; x.font = `400 26px Jost, sans-serif`; x.fillText(p.codigo || "", W / 2, W + 70);
  const nombre = `kokoro-${p.codigo || "qr"}.png`;
  cv.toBlob(async blob => {
    if (!blob) return;
    const file = new File([blob], nombre, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Mi QR de Kokoro" }); return; } catch { /* cancelado */ }
    }
    descargar(nombre, blob);
  }, "image/png");
});

/* =========================================================
   PANEL ADMIN
   ========================================================= */
async function entrarAdmin() {
  if (S.perfil?.rol !== "admin") { entrarCliente(); return; }
  pref.set("admin");
  limpiarSubs();
  show("admin");
  $("meta[name=theme-color]").content = "#20170F";
  $("#aWho").textContent = S.perfil.nombre || S.user.email;
  try { await sembrarSiHaceFalta(); } catch (e) { toast(errMsg(e), true); }

  S.subs.push(onSnapshot(doc(db, "config", "programa"), snap => {
    S.programa = { ...PROGRAMA_BASE, ...(snap.data() || {}) };
    renderTicket();
    if (S.apane !== "ajustes") llenarAjustes();
  }, e => toast(errMsg(e), true)));

  S.subs.push(onSnapshot(collection(db, "productos"), snap => {
    S.productos = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || (a.nombre || "").localeCompare(b.nombre || "", "es"));
    renderPOS(); renderProductos();
  }, e => toast(errMsg(e), true)));

  S.subs.push(onSnapshot(collection(db, "promociones"), snap => {
    S.promos = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.activa === true) - (a.activa === true) || (a.titulo || "").localeCompare(b.titulo || "", "es"));
    renderTicket(); renderPromosAdmin();
  }, e => toast(errMsg(e), true)));

  const desdeHash = location.hash.replace("#", "");
  irAdmin($(`[data-apane-id="${desdeHash}"]`) ? desdeHash : "caja");
}

async function sembrarSiHaceFalta() {
  const cfg = await getDoc(doc(db, "config", "programa"));
  if (cfg.exists()) return;
  const batch = writeBatch(db);
  batch.set(doc(db, "config", "programa"), { ...PROGRAMA_BASE });
  const hay = await getDocs(query(collection(db, "productos"), limit(1)));
  if (hay.empty) PRODUCTOS_BASE.forEach(p => batch.set(doc(collection(db, "productos")), p));
  await batch.commit();
  toast("Cargamos tu carta: Kokoro 12 oz y Ooki 16 oz.");
}

function irAdmin(p) {
  S.apane = p;
  $$("[data-apane-id]").forEach(el => { el.hidden = el.dataset.apaneId !== p; });
  $$(".side__btn").forEach(b => b.classList.toggle("is-on", b.dataset.apane === p));
  history.replaceState(null, "", "#" + p);
  if (p === "resumen") renderResumen();
  if (p === "ventas") renderVentas();
  if (p === "clientes") renderClientes();
  if (p === "ajustes") llenarAjustes();
  window.scrollTo(0, 0);
}

/* ---------- Caja: productos ---------- */
function renderPOS() {
  if (S.vista !== "admin") return;
  const activos = S.productos.filter(p => p.activo !== false);
  const cats = [...new Set(activos.map(p => p.categoria || "Otros"))];
  if (S.cat && !cats.includes(S.cat)) S.cat = "";
  $("#posCats").innerHTML = cats.length > 1
    ? [`<button type="button" class="chip${!S.cat ? " is-on" : ""}" data-cat="">Todo</button>`,
       ...cats.map(c => `<button type="button" class="chip${S.cat === c ? " is-on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`)].join("")
    : "";
  const list = activos.filter(p => !S.cat || (p.categoria || "Otros") === S.cat);
  $("#posGrid").innerHTML = list.length ? list.map(p => {
    const q = S.cart.find(i => i.id === p.id)?.cantidad || 0;
    return `<button type="button" class="pitem" data-add="${p.id}">
      ${q ? `<span class="pitem__qty">${q}</span>` : ""}
      <span class="pitem__name">${esc(p.nombre)}</span>
      <span class="pitem__det">${esc(p.detalle || "")}</span>
      <span class="pitem__price">${money(p.precio)}</span>
      ${p.otorgaSello ? `<span class="pitem__sello" lang="ja" title="Suma sello">心</span>` : ""}
    </button>`;
  }).join("") : `<p class="empty">No hay productos disponibles. Agrégalos en Productos.</p>`;
  renderTicket();
}

function agregar(id) {
  const p = S.productos.find(x => x.id === id); if (!p) return;
  const it = S.cart.find(i => i.id === id);
  if (it) it.cantidad++;
  else S.cart.push({ id: p.id, nombre: p.nombre, detalle: p.detalle || "", precio: Number(p.precio) || 0, otorgaSello: !!p.otorgaSello, cantidad: 1 });
  renderPOS();
}
function cambiarCant(id, d) {
  const it = S.cart.find(i => i.id === id); if (!it) return;
  it.cantidad += d;
  if (it.cantidad <= 0) S.cart = S.cart.filter(i => i.id !== id);
  renderPOS();
}

/* ---------- Caja: cálculo ---------- */
function descuentosDisponibles() {
  const ops = [];
  if (S.cliente && Number(S.programa.descuentoSocio) > 0) ops.push({ id: "__socio", titulo: "Descuento de socio", tipo: "porcentaje", valor: Number(S.programa.descuentoSocio) });
  S.promos.filter(p => p.activa && (!p.soloSocios || S.cliente))
    .forEach(p => ops.push({ id: p.id, titulo: p.titulo, tipo: p.tipo, valor: Number(p.valor) || 0 }));
  return ops;
}

function calcular() {
  const sub = round2(S.cart.reduce((a, i) => a + i.precio * i.cantidad, 0));
  const calif = S.cart.filter(i => i.otorgaSello);
  const qtyCalif = calif.reduce((a, i) => a + i.cantidad, 0);
  const articulos = S.cart.reduce((a, i) => a + i.cantidad, 0);
  const puedeRec = !!S.cliente && (S.cliente.recompensasDisponibles || 0) > 0 && qtyCalif > 0;
  if (!puedeRec) S.usarRecompensa = false;
  const itemRec = S.usarRecompensa ? calif.reduce((m, i) => (!m || i.precio > m.precio ? i : m), null) : null;
  const rec = itemRec ? itemRec.precio : 0;
  const base = round2(sub - rec);
  const ops = descuentosDisponibles();
  if (S.descuentoId && !ops.find(o => o.id === S.descuentoId)) S.descuentoId = "";
  const d = ops.find(o => o.id === S.descuentoId) || null;
  let desc = 0;
  if (d) desc = d.tipo === "porcentaje" ? round2(base * d.valor / 100) : Math.min(d.valor, base);
  const total = Math.max(0, round2(base - desc));
  const pagables = qtyCalif - (itemRec ? 1 : 0);
  const sellos = !S.cliente ? 0 : (S.programa.modoSellos === "porVisita" ? (pagables > 0 ? 1 : 0) : pagables);
  return { sub, rec, itemRec, d, desc, total, sellos, puedeRec, qtyCalif, articulos, ops };
}

/* ---------- Caja: ticket ---------- */
function renderTicket() {
  if (S.vista !== "admin") return;
  const c = calcular(), N = meta(), u = S.cliente;

  // cliente
  const box = $("#tkCliente");
  box.classList.toggle("is-socio", !!u);
  if (!u) {
    box.innerHTML = `<div class="tc__public">
      <p><b>Público en general</b>Identifica al socio para sumarle sellos.</p>
      <div class="tc__btns">
        <button type="button" class="btn btn--sm" data-act="scan">${icon("scan")}Escanear QR</button>
        <button type="button" class="btn btn--ghost btn--sm" data-act="buscar">${icon("search")}Buscar socio</button>
      </div></div>`;
  } else {
    const sellos = Math.min(u.sellos || 0, N), recs = u.recompensasDisponibles || 0;
    const gusto = [u.bebidaFavorita && `Pide ${u.bebidaFavorita}`, u.leche && `Leche ${lowerFirst(u.leche)}`, u.notas].filter(Boolean).join(". ");
    box.innerHTML = `<div class="tc__socio">
      <div class="tc__row">
        <div><p class="tc__name">${esc(u.nombre)}</p><p class="tc__meta">${esc(u.codigo || "")}, ${plural(u.visitas || 0, "visita")}</p></div>
        <button type="button" class="icon-btn" data-act="quitar" aria-label="Quitar socio de la venta">${icon("x")}</button>
      </div>
      <div class="tc__dots" aria-hidden="true">${Array.from({ length: N }, (_, i) => `<i class="${i < sellos ? "is-on" : ""}"></i>`).join("")}</div>
      <p class="tc__meta">${sellos} de ${N} sellos${recs ? `, ${recs === 1 ? "1 regalo disponible" : recs + " regalos disponibles"}` : ""}</p>
      ${gusto ? `<p class="tc__pref">${esc(gusto)}</p>` : ""}
    </div>`;
  }

  // artículos
  $("#tkItems").innerHTML = S.cart.length ? S.cart.map(i => `
    <li class="ti">
      <span class="ti__name">${esc(i.nombre)}<small>${esc(i.detalle)}${i.detalle ? ", " : ""}${money(i.precio)}</small></span>
      <span class="ti__sum">${money(i.precio * i.cantidad)}</span>
      <div class="qty">
        <button type="button" data-dec="${i.id}" aria-label="Quitar uno">${icon("minus")}</button>
        <span>${i.cantidad}</span>
        <button type="button" data-inc="${i.id}" aria-label="Agregar uno">${icon("plus")}</button>
      </div>
    </li>`).join("") : `<li class="empty">Toca un producto para agregarlo.</li>`;

  // regalo
  const premio = S.programa.nombreRecompensa || PROGRAMA_BASE.nombreRecompensa;
  $("#tkRecompensaWrap").hidden = !c.puedeRec;
  $("#tkRecompensa").checked = S.usarRecompensa;
  $("#tkRecompensaTxt").textContent = `Canjear ${lowerFirst(premio)}`;
  $("#tkRecompensaSub").textContent = c.itemRec
    ? `Se descuenta ${c.itemRec.nombre} ${c.itemRec.detalle}`.trim()
    : (u ? `Tiene ${u.recompensasDisponibles === 1 ? "1 regalo" : u.recompensasDisponibles + " regalos"} sin usar.` : "");

  // descuentos
  const sel = $("#tkDescuento");
  sel.innerHTML = `<option value="">Sin descuento</option>` + c.ops.map(o =>
    `<option value="${esc(o.id)}">${esc(o.titulo)} (${o.tipo === "porcentaje" ? o.valor + "%" : money(o.valor)})</option>`).join("");
  sel.value = S.descuentoId;
  sel.closest(".field").hidden = !c.ops.length;
  $(".ticket__opts").hidden = !c.ops.length && !c.puedeRec;

  // totales
  $("#tkSubtotal").textContent = money(c.sub);
  $("#tkRowRec").hidden = !c.rec; $("#tkRec").textContent = "−" + money(c.rec);
  $("#tkRowDesc").hidden = !c.desc; $("#tkDescNom").textContent = c.d?.titulo || "Descuento"; $("#tkDesc").textContent = "−" + money(c.desc);
  $("#tkTotal").textContent = money(c.total);

  // pago
  $$("#tkMetodo .seg__btn").forEach(b => { const on = b.dataset.metodo === S.metodo; b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on); });
  $("#tkCash").hidden = S.metodo !== "efectivo";
  renderCambio(c.total);

  // sellos
  const nom = u ? (u.nombre || "").split(" ")[0] : "";
  $("#tkSellosTxt").textContent = u
    ? (c.sellos > 0 ? `Esta venta suma ${plural(c.sellos, "sello")} a la tarjeta de ${nom}.` : (S.cart.length ? "Esta venta no suma sellos." : ""))
    : (c.qtyCalif > 0 ? "Venta al público en general: no suma sellos." : "");

  const btn = $("#btnCobrar");
  if (!btn.dataset.html) { btn.disabled = !S.cart.length; btn.textContent = S.cart.length ? `Cobrar ${money(c.total)}` : "Cobrar"; }
}

function renderCambio(total) {
  const t = total ?? calcular().total;
  const rec = Number($("#tkRecibido").value || 0);
  $("#tkCambio").textContent = money(rec > t ? rec - t : 0);
}

function resetVenta(render = true) {
  S.cart = []; S.cliente = null; S.usarRecompensa = false; S.descuentoId = ""; S.metodo = "efectivo";
  const r = $("#tkRecibido"); if (r) r.value = "";
  if (render) renderPOS();
}

function setCliente(u) {
  S.cliente = u;
  S.usarRecompensa = false;
  if (Number(S.programa.descuentoSocio) > 0 && !S.descuentoId) S.descuentoId = "__socio";
  renderTicket();
  toast(`Socio identificado: ${u.nombre}`);
  if (S.apane !== "caja") irAdmin("caja");
}

/* ---------- Caja: cobrar ---------- */
async function cobrar() {
  if (!S.cart.length) return;
  const c = calcular(), N = meta();
  const recibidoTxt = $("#tkRecibido").value;
  const recibido = S.metodo === "efectivo" && recibidoTxt !== "" ? Number(recibidoTxt) : c.total;
  if (S.metodo === "efectivo" && recibido < c.total) { toast("El monto recibido es menor al total.", true); return; }

  const venta = {
    fecha: serverTimestamp(),
    items: S.cart.map(i => ({ productoId: i.id, nombre: i.nombre, detalle: i.detalle, precio: i.precio, cantidad: i.cantidad, otorgaSello: i.otorgaSello })),
    articulos: c.articulos,
    subtotal: c.sub,
    recompensa: c.itemRec ? { nombre: `${c.itemRec.nombre} ${c.itemRec.detalle}`.trim(), monto: c.rec } : null,
    descuento: c.d ? { id: c.d.id, nombre: c.d.titulo, tipo: c.d.tipo, valor: c.d.valor, monto: c.desc } : null,
    total: c.total,
    metodoPago: S.metodo,
    recibido: round2(recibido),
    cambio: round2(Math.max(0, recibido - c.total)),
    tipo: S.cliente ? "socio" : "publico",
    clienteId: S.cliente?.id || null,
    clienteNombre: S.cliente?.nombre || null,
    clienteCodigo: S.cliente?.codigo || null,
    sellosOtorgados: c.sellos,
    metaSellos: N,
    recompensasGeneradas: 0,
    estado: "completada",
    cajeroId: S.user.uid,
    cajeroNombre: S.perfil.nombre || S.user.email || ""
  };

  const btn = $("#btnCobrar");
  busy(btn, true, "Cobrando…");
  try {
    let res;
    if (!S.cliente) {
      const ref = await addDoc(collection(db, "ventas"), venta);
      res = { id: ref.id };
    } else {
      const uid = S.cliente.id;
      res = await runTransaction(db, async tx => {
        const uRef = doc(db, "usuarios", uid);
        const uSnap = await tx.get(uRef);
        if (!uSnap.exists()) throw new Error("Este socio ya no existe.");
        const u = uSnap.data();
        const usar = venta.recompensa ? 1 : 0;
        if (usar && (u.recompensasDisponibles || 0) < 1) throw new Error("El socio ya no tiene regalos disponibles. Quita el canje.");
        let sellos = (u.sellos || 0) + venta.sellosOtorgados;
        let recs = (u.recompensasDisponibles || 0) - usar;
        let gen = 0;
        while (sellos >= N) { sellos -= N; recs++; gen++; }

        const vRef = doc(collection(db, "ventas"));
        tx.set(vRef, { ...venta, recompensasGeneradas: gen });
        tx.update(uRef, {
          sellos, recompensasDisponibles: recs,
          sellosTotales: increment(venta.sellosOtorgados),
          recompensasCanjeadas: increment(usar),
          visitas: increment(1),
          totalGastado: increment(venta.total),
          ultimaVisita: serverTimestamp()
        });
        tx.set(doc(db, "usuarios", uid, "historial", vRef.id), {
          tipo: "compra", fecha: serverTimestamp(),
          items: venta.items.map(i => ({ nombre: `${i.nombre} ${i.detalle}`.trim(), cantidad: i.cantidad })),
          total: venta.total, sellosOtorgados: venta.sellosOtorgados,
          recompensaCanjeada: !!usar, recompensasGeneradas: gen,
          descuento: venta.descuento?.nombre || null, estado: "completada"
        });
        return { id: vRef.id, gen, sellos, recs };
      });
    }
    S.clientes = null; // refrescar lista de clientes la próxima vez
    busy(btn, false);
    mostrarVentaOk(venta, res);
    resetVenta();
  } catch (e) {
    console.error(e);
    busy(btn, false);
    toast(errMsg(e), true);
    renderTicket();
  }
}

function mostrarVentaOk(v, r) {
  const N = v.metaSellos;
  const filas = [
    ["Cliente", v.clienteNombre || "Público en general"],
    ["Pago", METODOS[v.metodoPago]]
  ];
  if (v.metodoPago === "efectivo") filas.push(["Recibido", money(v.recibido)], ["Cambio", money(v.cambio)]);
  if (v.recompensa) filas.push(["Regalo canjeado", v.recompensa.nombre]);
  if (v.descuento) filas.push([v.descuento.nombre, "−" + money(v.descuento.monto)]);
  if (v.clienteId) filas.push(["Sellos", `+${v.sellosOtorgados}, ahora ${r.sellos} de ${N}`]);
  if (r.gen) filas.push(["Tarjeta completa", `Ganó ${lowerFirst(S.programa.nombreRecompensa)}`]);
  $("#ventaOk").innerHTML = `
    <div class="ok__mark" lang="ja" aria-hidden="true">心</div>
    <p class="muted">Venta registrada, folio ${folio(r.id)}</p>
    <p class="ok__total">${money(v.total)}</p>
    <dl class="ok__lines">${filas.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl>`;
  $("#dlgVentaOk").showModal();
}

/* ---------- Identificar socio: QR, código, búsqueda ---------- */
async function buscarSocioPorCodigo(raw) {
  const t = String(raw || "").trim();
  if (t.startsWith(QR_PREFIX) && t.length > QR_PREFIX.length + 10) {
    const s = await getDoc(doc(db, "usuarios", t.slice(QR_PREFIX.length)));
    return s.exists() ? { id: s.id, ...s.data() } : null;
  }
  let code = t.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length === 6) code = "KK" + code;
  if (!(code.startsWith("KK") && code.length === 8)) return null;
  code = "KK-" + code.slice(2);
  const q = await getDocs(query(collection(db, "usuarios"), where("codigo", "==", code), limit(1)));
  return q.empty ? null : { id: q.docs[0].id, ...q.docs[0].data() };
}

async function abrirScanner() {
  const dlg = $("#dlgScan");
  $("#scanMsg").textContent = "Apunta la cámara al QR del cliente.";
  $("#scanInput").value = "";
  dlg.showModal();
  if (matchMedia("(pointer:fine)").matches) setTimeout(() => $("#scanInput").focus(), 60);
  if (!window.Html5Qrcode) { $("#scanMsg").textContent = "El lector de cámara no cargó. Escribe el código o usa un lector USB."; return; }
  try {
    const sc = new Html5Qrcode("scanReader", { verbose: false });
    S.scanner = sc;
    await sc.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: (w, h) => { const s = Math.floor(Math.min(w, h) * 0.72); return { width: s, height: s }; } },
      txt => onScan(txt),
      () => {}
    );
    if (!dlg.open) await cerrarScanner();
  } catch (e) {
    console.warn(e);
    S.scanner = null;
    $("#scanMsg").textContent = "No pudimos abrir la cámara. Revisa el permiso del navegador o escribe el código.";
  }
}

async function cerrarScanner() {
  const sc = S.scanner; S.scanner = null;
  if (!sc) return;
  try { await sc.stop(); } catch { /* ya estaba detenido */ }
  try { sc.clear(); } catch { /* nada */ }
}

async function onScan(txt) {
  if (S.scanBusy) return;
  S.scanBusy = true;
  try {
    const u = await buscarSocioPorCodigo(txt);
    if (u) { $("#dlgScan").close(); setCliente(u); }
    else $("#scanMsg").textContent = "Ese código no corresponde a ningún socio.";
  } catch (e) { $("#scanMsg").textContent = errMsg(e); }
  finally { setTimeout(() => { S.scanBusy = false; }, 900); }
}

$("#dlgScan").addEventListener("close", cerrarScanner);
$("#formCodigo").addEventListener("submit", e => { e.preventDefault(); const v = $("#scanInput").value; if (v.trim()) onScan(v); });

// Lector USB/Bluetooth tipo teclado: escanea en Caja sin abrir nada.
const kb = { buf: "", t: 0 };
document.addEventListener("keydown", e => {
  if (S.vista !== "admin" || S.apane !== "caja") return;
  if ($("dialog[open]")) return;
  const a = document.activeElement;
  if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
  const now = performance.now();
  if (now - kb.t > 80) kb.buf = "";
  kb.t = now;
  if (e.key === "Enter") {
    if (kb.buf.length >= 8) {
      e.preventDefault();
      const code = kb.buf; kb.buf = "";
      buscarSocioPorCodigo(code)
        .then(u => u ? setCliente(u) : toast("Ese código no corresponde a ningún socio.", true))
        .catch(err => toast(errMsg(err), true));
    }
    return;
  }
  if (e.key.length === 1) kb.buf += e.key;
});

async function cargarClientes(force = false) {
  if (S.clientes && !force) return S.clientes;
  const snap = await getDocs(collection(db, "usuarios"));
  S.clientes = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"));
  return S.clientes;
}

function filtrarClientes(q) {
  const t = norm(q).trim();
  if (!t) return S.clientes || [];
  const dig = t.replace(/\D/g, "");
  return (S.clientes || []).filter(c =>
    norm([c.nombre, c.email, c.codigo].join(" ")).includes(t) ||
    (dig.length >= 3 && String(c.telefono || "").replace(/\D/g, "").includes(dig)));
}

async function abrirBuscar() {
  const dlg = $("#dlgBuscar"), inp = $("#buscarInput");
  inp.value = "";
  $("#buscarResultados").innerHTML = `<li class="muted" style="padding:12px 4px">Cargando socios…</li>`;
  dlg.showModal();
  setTimeout(() => inp.focus(), 60);
  try { await cargarClientes(); pintarBusqueda(""); }
  catch (e) { $("#buscarResultados").innerHTML = `<li class="form__error">${esc(errMsg(e))}</li>`; }
}

function pintarBusqueda(q) {
  const list = filtrarClientes(q).slice(0, 40);
  $("#buscarResultados").innerHTML = list.length ? list.map(c => `
    <li><button type="button" data-elegir="${c.id}">
      <span><b>${esc(c.nombre)}</b><small>${esc([c.codigo, c.telefono, c.email].filter(Boolean).join(", "))}</small></span>
      <span class="badge">${c.sellos || 0}/${meta()}</span>
    </button></li>`).join("")
    : `<li class="muted" style="padding:12px 4px">Sin resultados. Prueba con otro dato.</li>`;
}
$("#buscarInput").addEventListener("input", e => pintarBusqueda(e.target.value));

/* ---------- Resumen ---------- */
function inicioRango(r) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (r !== "hoy") d.setDate(d.getDate() - (Number(r) - 1));
  return d;
}

async function cargarVentas(r) {
  const snap = await getDocs(query(collection(db, "ventas"),
    where("fecha", ">=", Timestamp.fromDate(inicioRango(r))), orderBy("fecha", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function renderResumen() {
  const r = S.rango.resumen, id = ++S.reqId;
  $("#kpis").innerHTML = `<p class="muted">Cargando ventas…</p>`;
  let ventas, nuevos = 0;
  try {
    const [v, n] = await Promise.all([
      cargarVentas(r),
      getDocs(query(collection(db, "usuarios"), where("creado", ">=", Timestamp.fromDate(inicioRango(r)))))
    ]);
    ventas = v; nuevos = n.size;
  } catch (e) { $("#kpis").innerHTML = `<p class="form__error">${esc(errMsg(e))}</p>`; return; }
  if (id !== S.reqId) return;

  const ok = ventas.filter(v => v.estado !== "anulada");
  const ingresos = ok.reduce((a, v) => a + (v.total || 0), 0);
  const tickets = ok.length;
  const articulos = ok.reduce((a, v) => a + (v.articulos || 0), 0);
  const socio = ok.filter(v => v.tipo === "socio"), pub = ok.filter(v => v.tipo !== "socio");
  const ingSocio = socio.reduce((a, v) => a + v.total, 0), ingPub = ingresos - ingSocio;
  const sellos = ok.reduce((a, v) => a + (v.sellosOtorgados || 0), 0);
  const regalos = ok.filter(v => v.recompensa).length;
  const anuladas = ventas.length - ok.length;

  $("#kpis").innerHTML = `
    <dl class="kpi kpi--dark"><dt>Ingresos</dt><dd>${money(ingresos)}</dd><small>${anuladas ? plural(anuladas, "venta anulada", "ventas anuladas") + " fuera del total" : "Sin ventas anuladas"}</small></dl>
    <dl class="kpi"><dt>Tickets</dt><dd>${tickets}</dd><small>Promedio ${money(tickets ? ingresos / tickets : 0)}</small></dl>
    <dl class="kpi"><dt>Artículos vendidos</dt><dd>${articulos}</dd><small>${plural(regalos, "regalo canjeado", "regalos canjeados")}</small></dl>
    <dl class="kpi"><dt>Ventas a socios</dt><dd>${tickets ? Math.round(socio.length / tickets * 100) : 0}%</dd><small>${socio.length} de ${tickets} tickets</small></dl>
    <dl class="kpi"><dt>Sellos entregados</dt><dd>${sellos}</dd><small>En ${plural(socio.length, "compra")} de socios</small></dl>
    <dl class="kpi"><dt>Socios nuevos</dt><dd>${nuevos}</dd><small>${r === "hoy" ? "Hoy" : `Últimos ${r} días`}</small></dl>`;

  // gráfica
  let buckets;
  if (r === "hoy") {
    const horas = ok.map(v => toDate(v.fecha)?.getHours()).filter(h => h != null);
    const ini = Math.min(7, ...horas), fin = Math.max(21, ...horas);
    buckets = [];
    for (let h = ini; h <= fin; h++) buckets.push({ label: `${h}h`, val: ok.filter(v => toDate(v.fecha)?.getHours() === h).reduce((a, v) => a + v.total, 0), show: h % 2 === 1 || ini === fin });
    $("#chartTitle").textContent = "Ventas por hora";
  } else {
    const n = Number(r), ini = inicioRango(r);
    buckets = Array.from({ length: n }, (_, i) => {
      const d = new Date(ini); d.setDate(d.getDate() + i);
      const key = d.toDateString();
      const val = ok.filter(v => toDate(v.fecha)?.toDateString() === key).reduce((a, v) => a + v.total, 0);
      const label = n <= 7 ? d.toLocaleDateString("es-MX", { weekday: "short" }) : String(d.getDate());
      return { label, val, show: n <= 7 || i % 5 === 0 || i === n - 1 };
    });
    $("#chartTitle").textContent = "Ventas por día";
  }
  const max = Math.max(0, ...buckets.map(b => b.val));
  $("#chartBars").innerHTML = buckets.map(b => `
    <div class="bar${b.val === max && max > 0 ? " is-max" : ""}" title="${esc(b.label)}: ${money(b.val)}">
      <i style="height:calc((100% - 22px) * ${max ? (b.val / max).toFixed(3) : 0})"></i><span>${b.show ? esc(b.label) : "&nbsp;"}</span>
    </div>`).join("");

  // mezcla
  const pct = ingresos ? Math.round(ingSocio / ingresos * 100) : 0;
  $("#mixBox").innerHTML = `
    <div class="mix" role="img" aria-label="${pct}% de los ingresos vienen de socios">
      <i class="mix__socio" style="width:${ingresos ? pct : 0}%"></i><i class="mix__pub" style="width:${ingresos ? 100 - pct : 0}%"></i>
    </div>
    <div class="legend">
      <div><i class="mix__socio"></i>Socios<b>${plural(socio.length, "ticket")}, ${money(ingSocio)}</b></div>
      <div><i class="mix__pub"></i>Público en general<b>${plural(pub.length, "ticket")}, ${money(ingPub)}</b></div>
    </div>`;

  // métodos
  const filasM = Object.entries(METODOS).map(([k, nom]) => {
    const vs = ok.filter(v => v.metodoPago === k);
    return `<tr><td>${nom}</td><td class="r">${vs.length}</td><td class="r">${money(vs.reduce((a, v) => a + v.total, 0))}</td></tr>`;
  }).join("");
  $("#tblMetodos").innerHTML = `<thead><tr><th>Forma de pago</th><th class="r">Tickets</th><th class="r">Total</th></tr></thead>
    <tbody>${filasM}<tr><td><b>Total</b></td><td class="r"><b>${tickets}</b></td><td class="r"><b>${money(ingresos)}</b></td></tr></tbody>`;

  // top productos
  const agg = {};
  ok.forEach(v => (v.items || []).forEach(i => {
    const k = `${i.nombre} ${i.detalle || ""}`.trim();
    agg[k] = agg[k] || { q: 0, t: 0 };
    agg[k].q += i.cantidad; agg[k].t += i.cantidad * i.precio;
  }));
  const top = Object.entries(agg).sort((a, b) => b[1].q - a[1].q).slice(0, 6);
  $("#tblTop").innerHTML = top.length
    ? `<thead><tr><th>Producto</th><th class="r">Vendidos</th><th class="r">Importe</th></tr></thead><tbody>${top.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="r">${v.q}</td><td class="r">${money(v.t)}</td></tr>`).join("")}</tbody>`
    : `<tbody><tr><td class="muted">Todavía no hay ventas en este periodo.</td></tr></tbody>`;
}

/* ---------- Ventas ---------- */
async function renderVentas() {
  const r = S.rango.ventas, id = ++S.reqId, tbl = $("#tblVentas");
  tbl.innerHTML = `<tbody><tr><td class="empty-row">Cargando ventas…</td></tr></tbody>`;
  try { S.ventasLista = await cargarVentas(r); }
  catch (e) { tbl.innerHTML = `<tbody><tr><td class="empty-row form__error">${esc(errMsg(e))}</td></tr></tbody>`; return; }
  if (id !== S.reqId) return;
  pintarVentas();
}

function ventasFiltradas() {
  const f = $("#ventasTipo").value;
  return S.ventasLista.filter(v =>
    !f ? true : f === "anulada" ? v.estado === "anulada" : (v.estado !== "anulada" && (f === "socio" ? v.tipo === "socio" : v.tipo !== "socio")));
}

function pintarVentas() {
  const list = ventasFiltradas(), hoy = S.rango.ventas === "hoy";
  const total = list.filter(v => v.estado !== "anulada").reduce((a, v) => a + v.total, 0);
  $("#tblVentas").innerHTML = `
    <thead><tr><th>${hoy ? "Hora" : "Fecha"}</th><th>Folio</th><th>Cliente</th><th class="c">Artículos</th><th>Pago</th><th class="r">Total</th><th>Estado</th></tr></thead>
    <tbody>${list.length ? list.map(v => `
      <tr class="is-click${v.estado === "anulada" ? " is-void" : ""}" data-venta="${v.id}">
        <td>${hoy ? fHora(v.fecha) : fFechaHora(v.fecha)}</td>
        <td>${folio(v.id)}</td>
        <td>${v.clienteNombre ? `<span class="tbl__name">${esc(v.clienteNombre)}</span><span class="tbl__sub">${esc(v.clienteCodigo || "")}</span>` : `<span class="muted">Público en general</span>`}</td>
        <td class="c">${v.articulos || 0}</td>
        <td>${METODOS[v.metodoPago] || "—"}</td>
        <td class="r">${money(v.total)}</td>
        <td>${v.estado === "anulada" ? `<span class="badge badge--red">Anulada</span>` : v.tipo === "socio" ? `<span class="badge">+${plural(v.sellosOtorgados || 0, "sello")}</span>` : `<span class="badge badge--soft">Público</span>`}</td>
      </tr>`).join("")
      : `<tr><td colspan="7" class="empty-row">No hay ventas con este filtro.</td></tr>`}
    </tbody>
    ${list.length ? `<tfoot><tr><td colspan="5"><b>${plural(list.length, "venta")}</b></td><td class="r"><b>${money(total)}</b></td><td></td></tr></tfoot>` : ""}`;
}
$("#ventasTipo").addEventListener("change", pintarVentas);

function abrirVenta(id) {
  const v = S.ventasLista.find(x => x.id === id); if (!v) return;
  $("#dvTitulo").textContent = `Venta ${folio(v.id)}`;
  const filas = [
    ["Fecha", fFechaHora(v.fecha)],
    ["Cliente", v.clienteNombre ? `${v.clienteNombre} (${v.clienteCodigo || ""})` : "Público en general"],
    ["Subtotal", money(v.subtotal)],
    ...(v.recompensa ? [["Regalo: " + v.recompensa.nombre, "−" + money(v.recompensa.monto)]] : []),
    ...(v.descuento ? [[v.descuento.nombre, "−" + money(v.descuento.monto)]] : []),
    ["Total", money(v.total)],
    ["Pago", METODOS[v.metodoPago] || "—"],
    ...(v.metodoPago === "efectivo" ? [["Recibido", money(v.recibido)], ["Cambio", money(v.cambio)]] : []),
    ...(v.tipo === "socio" ? [["Sellos otorgados", String(v.sellosOtorgados || 0)]] : []),
    ["Atendió", v.cajeroNombre || "—"],
    ["Estado", v.estado === "anulada" ? "Anulada" : "Completada"]
  ];
  $("#dvBody").innerHTML = `
    <ul class="ticket__items">${(v.items || []).map(i => `<li class="ti"><span class="ti__name">${i.cantidad} × ${esc(i.nombre)}<small>${esc(i.detalle || "")}</small></span><span class="ti__sum">${money(i.precio * i.cantidad)}</span></li>`).join("")}</ul>
    <div class="dc" style="grid-template-columns:1fr;margin-top:10px"><dl>${filas.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("")}</dl></div>
    ${v.estado !== "anulada" ? `<div class="dlg__actions"><button type="button" class="btn btn--danger" data-anular="${v.id}">Anular venta</button></div>` : ""}`;
  $("#dlgVenta").showModal();
}

async function anularVenta(id) {
  const ok = await confirmar("¿Anular esta venta?", "Sale de los reportes y, si fue de un socio, se le quitan los sellos que ganó y se le devuelve el regalo si lo canjeó.", "Anular venta", true);
  if (!ok) return;
  try {
    await runTransaction(db, async tx => {
      const vRef = doc(db, "ventas", id);
      const vs = await tx.get(vRef);
      if (!vs.exists()) throw new Error("La venta ya no existe.");
      const v = vs.data();
      if (v.estado === "anulada") throw new Error("Esta venta ya estaba anulada.");
      let uRef = null, us = null;
      if (v.clienteId) { uRef = doc(db, "usuarios", v.clienteId); us = await tx.get(uRef); }
      if (us && us.exists()) {
        const u = us.data(), N = v.metaSellos || meta();
        const g = v.sellosOtorgados || 0, k = v.recompensasGeneradas || 0, r = v.recompensa ? 1 : 0;
        let sellos = (u.sellos || 0) - g + k * N;
        let recs = (u.recompensasDisponibles || 0) + r - k;
        recs = Math.max(0, recs);
        sellos = Math.min(Math.max(0, sellos), N - 1);
        tx.update(uRef, {
          sellos, recompensasDisponibles: recs,
          sellosTotales: increment(-g), recompensasCanjeadas: increment(-r),
          visitas: increment(-1), totalGastado: increment(-(v.total || 0))
        });
        tx.set(doc(db, "usuarios", v.clienteId, "historial", id), { estado: "anulada" }, { merge: true });
      }
      tx.update(vRef, { estado: "anulada", anuladaPor: S.user.uid, anuladaEn: serverTimestamp() });
    });
    $("#dlgVenta").close();
    toast("Venta anulada.");
    S.clientes = null;
    if (S.apane === "ventas") renderVentas(); else renderResumen();
  } catch (e) { toast(errMsg(e), true); }
}

function exportarCSV() {
  const list = ventasFiltradas();
  if (!list.length) { toast("No hay ventas para exportar.", true); return; }
  const cab = ["Fecha", "Folio", "Tipo", "Cliente", "Código", "Artículos", "Detalle", "Subtotal", "Regalo", "Descuento", "Total", "Pago", "Sellos", "Estado", "Atendió"];
  const q = s => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const filas = list.map(v => [
    toDate(v.fecha)?.toLocaleString("es-MX") || "", folio(v.id), v.tipo === "socio" ? "Socio" : "Público en general",
    v.clienteNombre || "", v.clienteCodigo || "", v.articulos || 0,
    (v.items || []).map(i => `${i.cantidad}x ${i.nombre} ${i.detalle || ""}`.trim()).join(" | "),
    v.subtotal, v.recompensa?.monto || 0, v.descuento?.monto || 0, v.total,
    METODOS[v.metodoPago] || "", v.sellosOtorgados || 0, v.estado, v.cajeroNombre || ""
  ].map(q).join(","));
  descargar(`kokoro-ventas-${new Date().toISOString().slice(0, 10)}.csv`, "\uFEFF" + [cab.map(q).join(","), ...filas].join("\r\n"), "text/csv;charset=utf-8");
}

/* ---------- Clientes ---------- */
async function renderClientes(force = false) {
  const tbl = $("#tblClientes");
  if (!S.clientes || force) tbl.innerHTML = `<tbody><tr><td class="empty-row">Cargando clientes…</td></tr></tbody>`;
  try { await cargarClientes(force); }
  catch (e) { tbl.innerHTML = `<tbody><tr><td class="empty-row form__error">${esc(errMsg(e))}</td></tr></tbody>`; return; }
  pintarClientes();
}

function pintarClientes() {
  const list = filtrarClientes($("#cliBuscar").value), N = meta();
  $("#tblClientes").innerHTML = `
    <thead><tr><th>Cliente</th><th>Código</th><th>Teléfono</th><th class="c">Sellos</th><th class="c">Regalos</th><th class="c">Visitas</th><th class="r">Gastado</th><th>Última visita</th></tr></thead>
    <tbody>${list.length ? list.map(c => `
      <tr class="is-click" data-cliente="${c.id}">
        <td><span class="tbl__name">${esc(c.nombre)}${c.rol === "admin" ? ` <span class="badge badge--dark">Caja</span>` : ""}</span><span class="tbl__sub">${esc(c.email || "")}</span></td>
        <td>${esc(c.codigo || "")}</td>
        <td>${esc(c.telefono || "—")}</td>
        <td class="c">${Math.min(c.sellos || 0, N)}/${N}</td>
        <td class="c">${c.recompensasDisponibles || 0}</td>
        <td class="c">${c.visitas || 0}</td>
        <td class="r">${money(c.totalGastado)}</td>
        <td>${c.ultimaVisita ? fFecha(c.ultimaVisita) : "—"}</td>
      </tr>`).join("")
      : `<tr><td colspan="8" class="empty-row">${S.clientes?.length ? "Sin resultados para esa búsqueda." : "Aún no hay socios registrados. Comparte la app con tus clientes."}</td></tr>`}
    </tbody>`;
}
$("#cliBuscar").addEventListener("input", pintarClientes);
$("#btnCliRefresh").addEventListener("click", () => renderClientes(true));

async function abrirCliente(id) {
  const dlg = $("#dlgCliente");
  $("#dcBody").innerHTML = `<p class="muted">Cargando…</p>`;
  if (!dlg.open) dlg.showModal();
  try {
    const [s, h] = await Promise.all([
      getDoc(doc(db, "usuarios", id)),
      getDocs(query(collection(db, "usuarios", id, "historial"), orderBy("fecha", "desc"), limit(20)))
    ]);
    if (!s.exists()) { $("#dcBody").innerHTML = `<p class="form__error">Este cliente ya no existe.</p>`; return; }
    const c = { id: s.id, ...s.data() }, N = meta(), sellos = Math.min(c.sellos || 0, N);
    if (S.clientes) { const i = S.clientes.findIndex(x => x.id === id); if (i > -1) S.clientes[i] = c; }
    $("#dcNombre").textContent = c.nombre;
    const yo = id === S.user.uid;
    $("#dcBody").innerHTML = `
      <div class="dc">
        <div class="dc__col">
          <dl>
            <div><dt>Código</dt><dd>${esc(c.codigo)}</dd></div>
            <div><dt>Correo</dt><dd>${esc(c.email || "—")}</dd></div>
            <div><dt>Teléfono</dt><dd>${esc(c.telefono || "—")}</dd></div>
            <div><dt>Cumpleaños</dt><dd>${c.cumpleanos ? new Date(c.cumpleanos + "T12:00").toLocaleDateString("es-MX", { day: "numeric", month: "long" }) : "—"}</dd></div>
            <div><dt>Socio desde</dt><dd>${fFecha(c.creado)}</dd></div>
            <div><dt>Bebida favorita</dt><dd>${esc(c.bebidaFavorita || "—")}</dd></div>
            <div><dt>Leche</dt><dd>${esc(c.leche || "—")}</dd></div>
          </dl>
          ${c.notas ? `<p class="tc__pref">${esc(c.notas)}</p>` : ""}
        </div>
        <div class="dc__col">
          <div class="dc__stamps">
            <div class="tc__dots">${Array.from({ length: N }, (_, i) => `<i class="${i < sellos ? "is-on" : ""}"></i>`).join("")}</div>
          </div>
          <dl>
            <div><dt>Sellos actuales</dt><dd>${sellos} de ${N}</dd></div>
            <div><dt>Regalos disponibles</dt><dd>${c.recompensasDisponibles || 0}</dd></div>
            <div><dt>Regalos canjeados</dt><dd>${c.recompensasCanjeadas || 0}</dd></div>
            <div><dt>Visitas</dt><dd>${c.visitas || 0}</dd></div>
            <div><dt>Total gastado</dt><dd>${money(c.totalGastado)}</dd></div>
            <div><dt>Última visita</dt><dd>${c.ultimaVisita ? fFechaHora(c.ultimaVisita) : "—"}</dd></div>
          </dl>
          <div class="dc__acts">
            <button type="button" class="btn btn--sm" data-dc="cobrar" data-id="${c.id}">${icon("register")}Cobrar a este socio</button>
            <button type="button" class="btn btn--ghost btn--sm" data-dc="mas" data-id="${c.id}">${icon("plus")}Sello</button>
            <button type="button" class="btn btn--ghost btn--sm" data-dc="menos" data-id="${c.id}">${icon("minus")}Sello</button>
            ${yo ? "" : `<button type="button" class="btn btn--ghost btn--sm" data-dc="rol" data-id="${c.id}" data-rol="${c.rol === "admin" ? "cliente" : "admin"}">${c.rol === "admin" ? "Quitar acceso a la caja" : "Dar acceso a la caja"}</button>`}
          </div>
        </div>
        <div class="dc__hist"><h3 class="h3">Historial</h3><ul class="hist" id="dcHist"></ul></div>
      </div>`;
    renderHistorial($("#dcHist"), h.docs.map(d => ({ id: d.id, ...d.data() })), false);
    S.dcCliente = c;
  } catch (e) { $("#dcBody").innerHTML = `<p class="form__error">${esc(errMsg(e))}</p>`; }
}

async function ajustarSellos(id, delta) {
  const N = meta();
  try {
    await runTransaction(db, async tx => {
      const ref = doc(db, "usuarios", id);
      const s = await tx.get(ref);
      if (!s.exists()) throw new Error("Este cliente ya no existe.");
      const u = s.data();
      let sellos = (u.sellos || 0) + delta, recs = u.recompensasDisponibles || 0;
      if (sellos >= N) { sellos -= N; recs++; }
      if (sellos < 0) { if (recs > 0) { recs--; sellos += N; } else sellos = 0; }
      tx.update(ref, { sellos, recompensasDisponibles: recs, sellosTotales: increment(delta) });
      tx.set(doc(collection(db, "usuarios", id, "historial")), { tipo: "ajuste", delta, fecha: serverTimestamp(), por: S.user.uid });
    });
    toast(delta > 0 ? "Sello agregado." : "Sello retirado.");
    abrirCliente(id);
    if (S.apane === "clientes") pintarClientes();
  } catch (e) { toast(errMsg(e), true); }
}

async function cambiarRol(id, rol) {
  const c = S.dcCliente;
  const ok = await confirmar(
    rol === "admin" ? `¿Dar acceso a la caja a ${c?.nombre}?` : `¿Quitar el acceso a la caja a ${c?.nombre}?`,
    rol === "admin" ? "Podrá cobrar, ver ventas, clientes y cambiar productos y promociones." : "Volverá a ver solo su tarjeta de socio.",
    rol === "admin" ? "Dar acceso" : "Quitar acceso", rol !== "admin");
  if (!ok) return;
  try { await updateDoc(doc(db, "usuarios", id), { rol }); toast("Acceso actualizado."); abrirCliente(id); if (S.apane === "clientes") pintarClientes(); }
  catch (e) { toast(errMsg(e), true); }
}

/* ---------- Productos ---------- */
function renderProductos() {
  if (S.vista !== "admin") return;
  $("#categorias").innerHTML = [...new Set(S.productos.map(p => p.categoria).filter(Boolean))].map(c => `<option value="${esc(c)}">`).join("");
  $("#tblProductos").innerHTML = `
    <thead><tr><th>Producto</th><th>Categoría</th><th class="r">Precio</th><th class="c">Suma sello</th><th class="c">Disponible</th><th></th></tr></thead>
    <tbody>${S.productos.length ? S.productos.map(p => `
      <tr>
        <td><span class="tbl__name">${esc(p.nombre)}</span><span class="tbl__sub">${esc(p.detalle || "")}</span></td>
        <td>${esc(p.categoria || "—")}</td>
        <td class="r">${money(p.precio)}</td>
        <td class="c">${p.otorgaSello ? `<span lang="ja" style="font-family:var(--serif);color:var(--tostado)">心</span>` : "—"}</td>
        <td class="c"><button type="button" class="switch${p.activo !== false ? " is-on" : ""}" data-toggle-prod="${p.id}" role="switch" aria-checked="${p.activo !== false}" aria-label="Disponible en caja"></button></td>
        <td><div class="tbl__acts">
          <button type="button" class="icon-btn" data-edit-prod="${p.id}" aria-label="Editar">${icon("edit")}</button>
          <button type="button" class="icon-btn icon-btn--danger" data-del-prod="${p.id}" aria-label="Eliminar">${icon("trash")}</button>
        </div></td>
      </tr>`).join("") : `<tr><td colspan="6" class="empty-row">Aún no hay productos. Crea el primero.</td></tr>`}
    </tbody>`;
}

function abrirProducto(id) {
  const p = S.productos.find(x => x.id === id), f = $("#formProducto");
  $("#dpTitulo").textContent = p ? "Editar producto" : "Nuevo producto";
  f.dataset.id = id || "";
  f.nombre.value = p?.nombre || "";
  f.detalle.value = p?.detalle || "";
  f.precio.value = p?.precio ?? "";
  f.categoria.value = p?.categoria || "Café";
  f.otorgaSello.checked = p ? !!p.otorgaSello : true;
  f.activo.checked = p ? p.activo !== false : true;
  setErr(f);
  $("#dlgProducto").showModal();
}

$("#formProducto").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f), id = f.dataset.id;
  const precio = Number(f.precio.value);
  if (!f.nombre.value.trim()) { setErr(f, "Escribe el nombre del producto."); return; }
  if (f.precio.value === "" || !(precio >= 0)) { setErr(f, "Escribe un precio válido."); return; }
  const data = {
    nombre: f.nombre.value.trim(), detalle: f.detalle.value.trim(), precio: round2(precio),
    categoria: f.categoria.value.trim() || "Otros", otorgaSello: f.otorgaSello.checked, activo: f.activo.checked
  };
  busy(btn, true, "Guardando…");
  try {
    if (id) await updateDoc(doc(db, "productos", id), data);
    else await addDoc(collection(db, "productos"), { ...data, orden: Math.max(0, ...S.productos.map(p => p.orden || 0)) + 1 });
    $("#dlgProducto").close();
    toast("Producto guardado.");
  } catch (err) { setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

/* ---------- Promociones ---------- */
function renderPromosAdmin() {
  if (S.vista !== "admin") return;
  $("#tblPromos").innerHTML = `
    <thead><tr><th>Promoción</th><th class="r">Descuento</th><th>Para</th><th class="c">Activa</th><th></th></tr></thead>
    <tbody>${S.promos.length ? S.promos.map(p => `
      <tr>
        <td><span class="tbl__name">${esc(p.titulo)}</span><span class="tbl__sub">${esc(p.descripcion || "")}</span></td>
        <td class="r">${esc(promoValor(p))}</td>
        <td>${p.soloSocios ? "Solo socios" : "Todos"}</td>
        <td class="c"><button type="button" class="switch${p.activa ? " is-on" : ""}" data-toggle-promo="${p.id}" role="switch" aria-checked="${!!p.activa}" aria-label="Activa"></button></td>
        <td><div class="tbl__acts">
          <button type="button" class="icon-btn" data-edit-promo="${p.id}" aria-label="Editar">${icon("edit")}</button>
          <button type="button" class="icon-btn icon-btn--danger" data-del-promo="${p.id}" aria-label="Eliminar">${icon("trash")}</button>
        </div></td>
      </tr>`).join("") : `<tr><td colspan="5" class="empty-row">Aún no hay promociones. Crea una y aparecerá en la app de tus socios.</td></tr>`}
    </tbody>`;
}

function abrirPromo(id) {
  const p = S.promos.find(x => x.id === id), f = $("#formPromo");
  $("#dprTitulo").textContent = p ? "Editar promoción" : "Nueva promoción";
  f.dataset.id = id || "";
  f.titulo.value = p?.titulo || "";
  f.descripcion.value = p?.descripcion || "";
  f.tipo.value = p?.tipo || "porcentaje";
  f.valor.value = p?.valor ?? "";
  f.soloSocios.checked = p ? !!p.soloSocios : true;
  f.activa.checked = p ? !!p.activa : true;
  setErr(f);
  $("#dlgPromo").showModal();
}

$("#formPromo").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f), id = f.dataset.id;
  const valor = Number(f.valor.value);
  if (!f.titulo.value.trim()) { setErr(f, "Escribe un título."); return; }
  if (!(valor > 0)) { setErr(f, "El valor del descuento debe ser mayor a 0."); return; }
  if (f.tipo.value === "porcentaje" && valor > 100) { setErr(f, "Un porcentaje no puede pasar de 100."); return; }
  const data = { titulo: f.titulo.value.trim(), descripcion: f.descripcion.value.trim(), tipo: f.tipo.value, valor: round2(valor), soloSocios: f.soloSocios.checked, activa: f.activa.checked };
  busy(btn, true, "Guardando…");
  try {
    if (id) await updateDoc(doc(db, "promociones", id), data);
    else await addDoc(collection(db, "promociones"), { ...data, creada: serverTimestamp() });
    $("#dlgPromo").close();
    toast("Promoción guardada.");
  } catch (err) { setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

/* ---------- Programa de lealtad ---------- */
function llenarAjustes() {
  const f = $("#formAjustes"), p = S.programa;
  f.sellosParaRecompensa.value = meta();
  f.modoSellos.value = p.modoSellos || "porBebida";
  f.nombreRecompensa.value = p.nombreRecompensa || PROGRAMA_BASE.nombreRecompensa;
  f.descuentoSocio.value = Number(p.descuentoSocio) || 0;
  setErr(f);
}

$("#formAjustes").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget, btn = $("button[type=submit]", f);
  const n = parseInt(f.sellosParaRecompensa.value, 10), d = Number(f.descuentoSocio.value || 0);
  if (!(n >= 3 && n <= 20)) { setErr(f, "Elige entre 3 y 20 sellos."); return; }
  if (!f.nombreRecompensa.value.trim()) { setErr(f, "Escribe el nombre del regalo."); return; }
  if (!(d >= 0 && d <= 50)) { setErr(f, "El descuento de socio va de 0 a 50%."); return; }
  busy(btn, true, "Guardando…");
  try {
    await setDoc(doc(db, "config", "programa"), {
      sellosParaRecompensa: n, modoSellos: f.modoSellos.value,
      nombreRecompensa: f.nombreRecompensa.value.trim(), descuentoSocio: d
    }, { merge: true });
    setErr(f); toast("Programa guardado. Tus socios ya lo ven en su app.");
  } catch (err) { setErr(f, errMsg(err)); }
  finally { busy(btn, false); }
});

/* =========================================================
   EVENTOS GLOBALES (delegación)
   ========================================================= */
document.addEventListener("click", async e => {
  const t = e.target.closest("button, tr[data-venta], tr[data-cliente]");
  if (!t) return;
  const d = t.dataset;

  if (d.authTab) return authTab(d.authTab);
  if (d.action === "logout") { pref.set(""); await cerrarScanner(); return signOut(auth); }
  if (d.cgo) return irCliente(d.cgo);
  if (d.apane) return irAdmin(d.apane);
  if (t.hasAttribute("data-close")) return t.closest("dialog")?.close();

  // caja
  if (d.add) return agregar(d.add);
  if (d.inc) return cambiarCant(d.inc, 1);
  if (d.dec) return cambiarCant(d.dec, -1);
  if (d.cat !== undefined && t.classList.contains("chip")) { S.cat = d.cat; return renderPOS(); }
  if (d.act === "scan") return abrirScanner();
  if (d.act === "buscar") return abrirBuscar();
  if (d.act === "quitar") { S.cliente = null; S.usarRecompensa = false; if (S.descuentoId === "__socio") S.descuentoId = ""; return renderTicket(); }
  if (d.metodo) { S.metodo = d.metodo; return renderTicket(); }
  if (d.elegir) {
    $("#dlgBuscar").close();
    try { const s = await getDoc(doc(db, "usuarios", d.elegir)); if (s.exists()) setCliente({ id: s.id, ...s.data() }); }
    catch (err) { toast(errMsg(err), true); }
    return;
  }

  // rangos de fechas
  if (d.rango) {
    const g = t.closest("[data-rango-group]").dataset.rangoGroup;
    S.rango[g] = d.rango;
    $$(`[data-rango-group="${g}"] .seg__btn`).forEach(b => b.classList.toggle("is-on", b === t));
    return g === "resumen" ? renderResumen() : renderVentas();
  }

  // ventas y clientes
  if (d.venta) return abrirVenta(d.venta);
  if (d.anular) return anularVenta(d.anular);
  if (d.cliente) return abrirCliente(d.cliente);
  if (d.dc === "cobrar") {
    $("#dlgCliente").close();
    try { const s = await getDoc(doc(db, "usuarios", d.id)); if (s.exists()) setCliente({ id: s.id, ...s.data() }); }
    catch (err) { toast(errMsg(err), true); }
    return;
  }
  if (d.dc === "mas") return ajustarSellos(d.id, 1);
  if (d.dc === "menos") return ajustarSellos(d.id, -1);
  if (d.dc === "rol") return cambiarRol(d.id, d.rol);

  // productos
  if (d.editProd) return abrirProducto(d.editProd);
  if (d.toggleProd) {
    const p = S.productos.find(x => x.id === d.toggleProd);
    try { await updateDoc(doc(db, "productos", p.id), { activo: p.activo === false }); } catch (err) { toast(errMsg(err), true); }
    return;
  }
  if (d.delProd) {
    const p = S.productos.find(x => x.id === d.delProd);
    if (await confirmar(`¿Eliminar ${p.nombre}?`, "Las ventas anteriores conservan el producto. Si solo quieres ocultarlo, apaga “Disponible”.", "Eliminar", true)) {
      try { await deleteDoc(doc(db, "productos", p.id)); toast("Producto eliminado."); } catch (err) { toast(errMsg(err), true); }
    }
    return;
  }

  // promociones
  if (d.editPromo) return abrirPromo(d.editPromo);
  if (d.togglePromo) {
    const p = S.promos.find(x => x.id === d.togglePromo);
    try { await updateDoc(doc(db, "promociones", p.id), { activa: !p.activa }); } catch (err) { toast(errMsg(err), true); }
    return;
  }
  if (d.delPromo) {
    const p = S.promos.find(x => x.id === d.delPromo);
    if (await confirmar(`¿Eliminar “${p.titulo}”?`, "Dejará de verse en la app y en la caja.", "Eliminar", true)) {
      try { await deleteDoc(doc(db, "promociones", p.id)); toast("Promoción eliminada."); } catch (err) { toast(errMsg(err), true); }
    }
  }
});

// Cerrar diálogos al tocar fuera
$$("dialog").forEach(dl => dl.addEventListener("click", e => { if (e.target === dl) dl.close(); }));

$("#btnIrPanel").addEventListener("click", entrarAdmin);
$("#btnVerTarjeta").addEventListener("click", entrarCliente);
$("#btnCobrar").addEventListener("click", cobrar);
$("#btnVaciar").addEventListener("click", () => { resetVenta(); });
$("#btnNuevoProducto").addEventListener("click", () => abrirProducto(null));
$("#btnNuevaPromo").addEventListener("click", () => abrirPromo(null));
$("#btnCSV").addEventListener("click", exportarCSV);
$("#tkRecompensa").addEventListener("change", e => { S.usarRecompensa = e.target.checked; renderTicket(); });
$("#tkDescuento").addEventListener("change", e => { S.descuentoId = e.target.value; renderTicket(); });
$("#tkRecibido").addEventListener("input", () => renderCambio());

window.__kokoroListo = true;