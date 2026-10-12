/* =================================================================
   CV interactivo — Martín Aguirre Herrera
   Etapa 1: portada, apertura, doble página, platos cerrados,
   contraportada. Las interacciones de Nigiri / Wasabi / Omakase
   quedan preparadas pero sin desarrollar (etapas 2–4).
   ================================================================= */

(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

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
    if (!t || busy || book.dataset.state !== t.from) return;

    if (served) closeServing();
    busy = true;
    if (t.to === "open") book.dataset.side = action === "open-back" ? "right" : "left";
    book.dataset.motion = t.motion;

    setState(t.to);

    window.setTimeout(() => {
      delete book.dataset.motion;
      busy = false;
      if (t.to === "open") pageStart.focus({ preventScroll: true });
      else (t.to === "closed" ? faces.cover : faces.back).querySelector(".face__hit").focus({ preventScroll: true });
    }, turnDuration() + 60);
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
      if (!singlePage.matches || book.dataset.side === side) return;
      event.preventDefault();
      event.stopPropagation();
      showSide(side);
    }, true);

    face.addEventListener("focusin", () => {
      if (singlePage.matches && book.dataset.state === "open") showSide(side);
    });
  });

  // deslizar horizontalmente
  let swipe = null;
  scene.addEventListener("pointerdown", (event) => {
    if (!singlePage.matches || book.dataset.state !== "open" || event.pointerType === "mouse") return;
    swipe = { x: event.clientX, y: event.clientY };
  });
  scene.addEventListener("pointerup", (event) => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    showSide(dx < 0 ? "right" : "left");
  });
  scene.addEventListener("pointercancel", () => { swipe = null; });

  /* ---------------------------------------------------------------
     Gestos y teclado
     --------------------------------------------------------------- */

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-action]");
    if (trigger) run(trigger.dataset.action);
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
     Nigiri abre su servicio (etapa 2); Wasabi y Omakase aún no.
     --------------------------------------------------------------- */

  /* Solo existe un servicio abierto a la vez. Un plato tiene interacción
     si su <section class="serving"> vive dentro de una página
     (por ahora solo Nigiri; Wasabi y Omakase siguen reservados). */

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
  const quick = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let served = null;   // { dish, serving, hotspot, item, page }
  let serveToken = 0;

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

  async function openServing(dish) {
    const s = servingFor(dish);
    if (!s || book.dataset.state !== "open") return;
    if (served) await closeServing();

    const token = ++serveToken;
    served = s;
    s.serving.hidden = false;
    s.page.classList.add("is-serving");
    s.item.classList.add("is-served");
    s.hotspot.setAttribute("aria-expanded", "true");

    await frame();
    await flight(s, false);
    if (token !== serveToken) return;

    s.serving.classList.add("is-split");
    await frame();
    s.serving.classList.add("is-apart");
    if (s.serving.classList.contains("has-layers")) await wait(quick() ? 0 : 650);
    if (token !== serveToken) return;
    s.serving.classList.add("is-annotated");
  }

  async function closeServing() {
    const s = served;
    if (!s) return;
    const token = ++serveToken;
    served = null;
    s.hotspot.setAttribute("aria-expanded", "false");

    s.serving.classList.remove("is-annotated");
    await wait(quick() ? 0 : 280);
    s.serving.classList.remove("is-apart");
    if (s.serving.classList.contains("has-layers")) await wait(quick() ? 0 : 650);
    s.serving.classList.remove("is-split");
    s.page.classList.remove("is-serving");
    await flight(s, true);

    if (token !== serveToken) return;
    s.item.classList.remove("is-served");
    s.serving.hidden = true;
    s.serving.querySelector(".serving__whole").getAnimations().forEach((a) => a.cancel());
  }

  document.addEventListener("click", (event) => {
    const hotspot = event.target.closest(".dish__hotspot");
    if (hotspot) {
      const dish = hotspot.dataset.dish;
      book.dispatchEvent(new CustomEvent("carta:dish", { bubbles: true, detail: { dish } }));
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

  function probe(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.naturalWidth > 0);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  document.querySelectorAll("img[data-src]").forEach(async (img) => {
    if (await probe(img.dataset.src)) {
      img.src = img.dataset.src;
      // decodificada antes de que la página quede a la vista durante la apertura
      await img.decode?.().catch(() => {});
      img.classList.add("is-loaded");
      img.closest(".dish")?.classList.add("has-photo");
    }
  });

  // capas de cada servicio: se activan solas cuando existen los archivos requeridos
  document.querySelectorAll(".serving").forEach(async (serving) => {
    const layers = [...serving.querySelectorAll(".serving__layer[data-src]")];
    const found = await Promise.all(layers.map(async (img) => {
      if (!(await probe(img.dataset.src))) return false;
      img.src = img.dataset.src;
      await img.decode?.().catch(() => {});
      img.classList.add("is-ready");
      return true;
    }));
    const required = layers.every((img, i) => found[i] || img.hasAttribute("data-optional"));
    serving.classList.toggle("has-layers", layers.length > 0 && required);
  });

  document.querySelectorAll(".decor[data-asset]").forEach(async (el) => {
    if (await probe(el.dataset.asset)) {
      el.style.backgroundImage = `url("${el.dataset.asset}")`;
      el.classList.add("has-asset");
    }
  });

  /* ---------------------------------------------------------------
     Inicio
     --------------------------------------------------------------- */

  setState(book.dataset.state || "closed");
})();
