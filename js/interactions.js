/* =================================================================
   CV interactivo — Martín Aguirre Herrera
   Portada, apertura, doble página, contraportada y los servicios
   de Nigiri, Wasabi y Omakase dentro de la página izquierda.
   ================================================================= */

(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const scene = document.getElementById("scene");
  const book = document.getElementById("book");
  const faces = {
    cover: document.getElementById("face-cover"),
    left: document.getElementById("face-left"),
    right: document.getElementById("face-right"),
    back: document.getElementById("face-back"),
  };
  const pageStart = document.getElementById("page-start");

  const singlePage = window.matchMedia("(orientation: portrait)");

  /* ---------------------------------------------------------------
     Estado del objeto
     closed → open → back   (y viceversa)
     --------------------------------------------------------------- */

  const transitions = {
    open:          { from: "closed", to: "open",   motion: "open-front"  },
    "close-front": { from: "open",   to: "closed", motion: "close-front" },
    "close-back":  { from: "open",   to: "back",   motion: "close-back"  },
    "open-back":   { from: "back",   to: "open",   motion: "open-back"   },
  };

  let busy = false;
  let busyUntil = 0;
  let keyboardUser = false;
  document.addEventListener("keydown", () => { keyboardUser = true; }, true);
  document.addEventListener("pointerdown", () => { keyboardUser = false; }, true);

  function turnDuration() {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--turn").trim();
    const ms = value.endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000;
    return Number.isFinite(ms) ? ms : 1800;
  }

  /* Solo las caras visibles reciben foco y clics */
  function syncFaces(state) {
    const visible = {
      closed: ["cover"],
      open: ["left", "right"],
      back: ["back"],
    }[state];
    Object.entries(faces).forEach(([key, el]) => {
      const active = visible.includes(key);
      el.inert = !active;
      el.setAttribute("aria-hidden", String(!active));
    });
  }

  function setState(state) {
    book.dataset.state = state;
    scene.dataset.state = state;
    syncFaces(state);
  }

  function run(action) {
    const t = transitions[action];
    // el seguro de tiempo evita que un temporizador perdido deje la carta bloqueada
    if (busy && Date.now() > busyUntil) settle();
    if (!t || busy || book.dataset.state !== t.from) return;

    // la carta se cierra limpia: ningún servicio sigue animándose durante el giro
    resetServing();
    busy = true;
    busyUntil = Date.now() + turnDuration() + 1200;
    if (t.to === "open") book.dataset.side = action === "open-back" ? "right" : "left";
    book.dataset.motion = t.motion;
    setState(t.to);

    window.clearTimeout(run.timer);
    run.timer = window.setTimeout(() => settle(t.to), turnDuration() + 60);
  }

  function settle(to) {
    window.clearTimeout(run.timer);
    if (book.dataset.motion !== "pan") delete book.dataset.motion;
    busy = false;
    if (!to || !keyboardUser) return;
    if (to === "open") pageStart.focus({ preventScroll: true });
    else (to === "closed" ? faces.cover : faces.back).querySelector(".face__hit").focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------
     Vista de una página (pantallas verticales)
     --------------------------------------------------------------- */

  function showSide(side) {
    if (book.dataset.state !== "open" || book.dataset.side === side || busy) return;
    if (served) closeServing();
    book.dataset.motion = "pan";
    book.dataset.side = side;
    window.setTimeout(() => {
      if (book.dataset.motion === "pan") delete book.dataset.motion;
    }, 950);
  }

  // tocar el borde visible de la otra página la trae al frente
  [["left", faces.left], ["right", faces.right]].forEach(([side, face]) => {
    face.addEventListener("click", (event) => {
      if (!singlePage.matches || book.dataset.state !== "open" || book.dataset.side === side) return;
      event.preventDefault();
      event.stopPropagation();
      showSide(side);
    }, true);

    face.addEventListener("focusin", () => {
      if (singlePage.matches && book.dataset.state === "open") showSide(side);
    });
  });

  // deslizar horizontalmente (pantallas verticales).
  // Se escuchan eventos touch y no pointer: en un teléfono real el navegador
  // cancela el puntero (pointercancel) en cuanto el dedo se desplaza, y el
  // gesto nunca llegaba a pasar de página.
  const zoomed = () => (window.visualViewport ? window.visualViewport.scale > 1.02 : false);
  let swipe = null;
  scene.addEventListener("touchstart", (event) => {
    // con dos dedos (pellizco) o con zoom activo, el gesto es del navegador
    if (event.touches.length !== 1 || zoomed() || !singlePage.matches || book.dataset.state !== "open") {
      swipe = null;
      return;
    }
    const t = event.touches[0];
    swipe = { x: t.clientX, y: t.clientY, at: Date.now() };
  }, { passive: true });
  scene.addEventListener("touchend", (event) => {
    if (!swipe || event.touches.length > 0) { if (event.touches.length === 0) swipe = null; return; }
    const t = event.changedTouches[0];
    const dx = t.clientX - swipe.x;
    const dy = t.clientY - swipe.y;
    const slow = Date.now() - swipe.at > 900;
    swipe = null;
    if (zoomed() || slow || Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    showSide(dx < 0 ? "right" : "left");
  }, { passive: true });
  scene.addEventListener("touchcancel", () => { swipe = null; }, { passive: true });

  /* Navegación sobre la mesa: en pantallas verticales avanza página a página
     (portada ← página izquierda ↔ página derecha → contraportada). */
  const navFront = document.querySelector(".table-nav__link--front");
  const navBack = document.querySelector(".table-nav__link--back");
  function syncNav() {
    const paged = singlePage.matches && book.dataset.state === "open";
    const onLeft = book.dataset.side !== "right";
    navFront.dataset.action = paged && !onLeft ? "side-left" : "close-front";
    navBack.dataset.action = paged && onLeft ? "side-right" : "close-back";
    navFront.textContent = navFront.dataset.action === "side-left" ? "Página" : "Portada";
    navBack.textContent = navBack.dataset.action === "side-right" ? "Página" : "Contraportada";
  }
  new MutationObserver(syncNav).observe(book, { attributes: true, attributeFilter: ["data-state", "data-side"] });
  singlePage.addEventListener?.("change", syncNav);

  /* ---------------------------------------------------------------
     Gestos y teclado
     --------------------------------------------------------------- */

  scene.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    const action = trigger.dataset.action;
    if (action.startsWith("side-")) showSide(action.slice(5));
    else run(action);
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const state = book.dataset.state;

    if (served && (event.key === "Escape" || event.key.startsWith("Arrow"))) {
      const hotspot = served.hotspot;
      closeServing();
      if (event.key === "Escape") hotspot.focus({ preventScroll: true });
      return;
    }

    if (event.key === "ArrowRight") {
      if (state === "closed") run("open");
      else if (state === "open" && singlePage.matches && book.dataset.side === "left") showSide("right");
      else if (state === "open") run("close-back");
    } else if (event.key === "ArrowLeft") {
      if (state === "back") run("open-back");
      else if (state === "open" && singlePage.matches && book.dataset.side === "right") showSide("left");
      else if (state === "open") run("close-front");
    }
  });

  /* ---------------------------------------------------------------
     Platos (etapas 2–4)
     Arquitectura lista: cada hotspot conoce su plato y su rasgo.
     Nigiri (etapa 2) y Wasabi (etapa 3) abren su servicio; Omakase aún no.
     --------------------------------------------------------------- */

  /* Solo existe un servicio abierto a la vez. Un plato tiene interacción
     si su <section class="serving"> vive dentro de una página
     (por ahora solo Nigiri; Wasabi y Omakase siguen reservados). */

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
  const quick = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let served = null;   // { dish, serving, hotspot, item, page } — el plato abierto o abriéndose

  // cada servicio lleva su propio turno: abrir de nuevo un plato que se está
  // cerrando (o al revés) anula la secuencia anterior sin dejarla a medias
  const turns = new WeakMap();
  const nextTurn = (el) => { const n = (turns.get(el) || 0) + 1; turns.set(el, n); return n; };
  const current = (el, n) => turns.get(el) === n;

  function servingFor(dish) {
    const serving = document.querySelector(`.page .serving[data-dish="${dish}"]`);
    if (!serving) return null;
    return {
      dish,
      serving,
      hotspot: document.querySelector(`.dish__hotspot[data-dish="${dish}"]`),
      item: document.querySelector(`.dish[data-dish="${dish}"]`),
      page: serving.closest(".page"),
    };
  }

  // la pieza entera viaja desde su lugar en la carta hasta el escenario
  function flight(s, reverse) {
    const whole = s.serving.querySelector(".serving__whole");
    const from = s.item.querySelector(".dish__photo").getBoundingClientRect();
    const to = whole.getBoundingClientRect();
    if (!to.width) return Promise.resolve();
    const k = from.width / to.width;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    const away = { transform: `translate(${dx}px, ${dy}px) scale(${k})` };
    const home = { transform: "translate(0, 0) scale(1)" };
    whole.getAnimations().forEach((a) => a.cancel());
    const anim = whole.animate(reverse ? [home, away] : [away, home], {
      duration: quick() ? 1 : 750,
      easing: "cubic-bezier(.3, .6, .25, 1)",
      fill: reverse ? "forwards" : "none",
    });
    return anim.finished.catch(() => {});
  }

  // tiempos entre fases: data-open="tras reconocer,tras girar" · data-close="…"
  function beat(s, key, i, fallback) {
    if (quick()) return 0;
    const list = s.serving.dataset[key];
    return list ? Number(list.split(",")[i]) || 0 : fallback;
  }

  async function openServing(dish) {
    const s = servingFor(dish);
    if (!s || book.dataset.state !== "open" || served?.serving === s.serving) return;
    const prev = served;
    served = s;
    const turn = nextTurn(s.serving);
    s.hotspot.setAttribute("aria-expanded", "true");
    // relevo en la misma página: el texto no reaparece entre un plato y otro
    if (prev) await closeServing(prev, prev.page === s.page);
    if (!current(s.serving, turn)) return;

    s.serving.classList.remove("is-closing");
    s.serving.hidden = false;
    s.page.classList.add("is-serving");
    s.item.classList.add("is-served");

    await frame();
    await flight(s, false);
    if (!current(s.serving, turn)) return;

    const layered = s.serving.classList.contains("has-layers");
    s.serving.classList.add("is-split");
    await frame();
    await wait(beat(s, "open", 0, 0));
    if (!current(s.serving, turn)) return;
    s.serving.classList.add("is-apart");
    await wait(beat(s, "open", 1, layered ? 750 : 0));
    if (!current(s.serving, turn)) return;
    // estación intermedia opcional (data-further="espera al abrir,espera al cerrar")
    if (s.serving.dataset.further) {
      s.serving.classList.add("is-further");
      await wait(beat(s, "further", 0, 0));
      if (!current(s.serving, turn)) return;
    }
    s.serving.classList.add("is-annotated");
  }

  // cierre instantáneo (al girar la carta): vuelve todo al estado de carga
  function resetServing() {
    document.querySelectorAll(".page .serving").forEach((el) => {
      nextTurn(el);
      el.classList.remove("is-split", "is-apart", "is-further", "is-annotated", "is-closing");
      el.querySelector(".serving__whole")?.getAnimations().forEach((a) => a.cancel());
      el.hidden = true;
    });
    document.querySelectorAll(".dish.is-served").forEach((el) => el.classList.remove("is-served"));
    document.querySelectorAll(".page.is-serving").forEach((el) => el.classList.remove("is-serving"));
    document.querySelectorAll(".dish__hotspot[aria-expanded='true']").forEach((el) => el.setAttribute("aria-expanded", "false"));
    served = null;
  }

  async function closeServing(s = served, handoff = false) {
    if (!s) return;
    if (served === s) served = null;
    const turn = nextTurn(s.serving);
    s.hotspot.setAttribute("aria-expanded", "false");
    // nunca llegó a mostrarse (relevo anulado): basta con devolver el plato
    if (s.serving.hidden) { s.item.classList.remove("is-served"); return; }

    const layered = s.serving.classList.contains("has-layers");
    const steps = [
      () => s.serving.classList.remove("is-annotated"), beat(s, "close", 0, 280),
      () => s.serving.classList.remove("is-further"), s.serving.classList.contains("is-further") ? beat(s, "further", 1, 0) : 0,
      // la foto entera vuelve mientras las capas terminan de juntarse
      () => s.serving.classList.remove("is-apart"), beat(s, "close", 1, layered ? 420 : 0),
      () => s.serving.classList.remove("is-split"), beat(s, "close", 2, layered ? 260 : 0),
    ];
    s.serving.classList.add("is-closing");
    for (let k = 0; k < steps.length; k += 2) {
      steps[k]();
      await wait(steps[k + 1]);
      if (!current(s.serving, turn)) return;   // se volvió a abrir: manda la apertura
    }
    if (!handoff && served?.page !== s.page) s.page.classList.remove("is-serving");
    await flight(s, true);
    if (!current(s.serving, turn)) return;

    s.serving.classList.remove("is-closing");
    s.item.classList.remove("is-served");
    s.serving.hidden = true;
    s.serving.querySelector(".serving__whole").getAnimations().forEach((a) => a.cancel());
  }

  scene.addEventListener("click", (event) => {
    const hotspot = event.target.closest(".dish__hotspot");
    if (hotspot) {
      const dish = hotspot.dataset.dish;
      if (served && served.dish === dish) closeServing();
      else if (servingFor(dish)) openServing(dish);
      else closeServing();
      return;
    }
    // clic fuera del área activa
    if (served && !event.target.closest(".serving")) closeServing();
  });

  /* ---------------------------------------------------------------
     Assets pendientes
     Cada contenedor declara su archivo; si existe se muestra,
     si no, el contenedor permanece limpio (sin marcadores visibles).
     --------------------------------------------------------------- */

  // carga una imagen en su propio <img> (una sola petición) y avisa si existe
  function load(img, src) {
    return new Promise((resolve) => {
      img.addEventListener("load", () => resolve(img.naturalWidth > 0), { once: true });
      img.addEventListener("error", () => { img.removeAttribute("src"); resolve(false); }, { once: true });
      img.src = src;
    }).then(async (ok) => {
      // decodificada antes de que la página quede a la vista
      if (ok) await img.decode?.().catch(() => {});
      return ok;
    });
  }

  function probe(src) {
    return load(new Image(), src);
  }

  document.querySelectorAll("img[data-src]:not(.serving__layer)").forEach(async (img) => {
    if (await load(img, img.dataset.src)) {
      img.classList.add("is-loaded");
      img.closest(".dish")?.classList.add("has-photo");
    }
  });

  // capas de cada servicio: se activan solas cuando existen los archivos requeridos
  document.querySelectorAll(".serving").forEach(async (serving) => {
    const layers = [...serving.querySelectorAll(".serving__layer[data-src]")];
    const found = await Promise.all(layers.map(async (img) => {
      if (!(await load(img, img.dataset.src))) return false;
      img.classList.add("is-ready");
      return true;
    }));
    const required = layers.every((img, i) => found[i] || img.hasAttribute("data-optional"));
    serving.classList.toggle("has-layers", layers.length > 0 && required);
  });

  // fondos CSS que solo se ven dentro de un servicio: se traen antes de abrirlo
  ["assets/decor/giro-wasabi.svg"].forEach(probe);

  document.querySelectorAll(".decor[data-asset]").forEach(async (el) => {
    if (await probe(el.dataset.asset)) {
      el.style.backgroundImage = `url("${el.dataset.asset}")`;
      el.classList.add("has-asset");
    }
  });

  /* ---------------------------------------------------------------
     Inicio
     --------------------------------------------------------------- */

  // al volver con «atrás» (caché de página de Safari) o al regresar a la pestaña,
  // ninguna animación puede quedar a medias: se asienta el estado actual
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    resetServing();
    settle();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && busy && Date.now() > busyUntil) settle();
  });

  setState(book.dataset.state || "closed");
  syncNav();
  // fin del arranque: a partir del segundo frame ya se puede animar
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-booting")));
})();
