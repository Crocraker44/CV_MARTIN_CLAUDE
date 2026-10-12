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
     En esta etapa no abre nada; solo anuncia la intención.
     --------------------------------------------------------------- */

  document.querySelectorAll(".dish__hotspot").forEach((hotspot) => {
    hotspot.addEventListener("click", () => {
      const dish = hotspot.dataset.dish;
      book.dispatchEvent(new CustomEvent("carta:dish", { bubbles: true, detail: { dish } }));
    });
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
