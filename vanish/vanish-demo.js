// Plays a scripted match on the hero board to show the 3-piece rule.
(() => {
  const board = document.querySelector("[data-demo-board]");
  const caption = document.querySelector("[data-demo-caption]");
  if (!board) return;
  const text = JSON.parse(board.dataset.captions);
  const cells = [...board.querySelectorAll(".cell")];
  const marks = {
    o: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="13" fill="none" stroke="#00d1e6" stroke-width="5"/></svg>',
    x: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 9l22 22M31 9L9 31" stroke="#f0a62e" stroke-width="5" stroke-linecap="round"/></svg>',
  };
  const moves = [["o", 0], ["x", 4], ["o", 2], ["x", 1], ["o", 7], ["x", 6], ["o", 3], ["x", 8], ["o", 5]];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    [["o", 2], ["x", 4], ["o", 7], ["x", 6], ["o", 3], ["x", 8]].forEach(([p, i]) => { cells[i].innerHTML = marks[p]; });
    caption.textContent = text.static;
    return;
  }

  const placed = { o: [], x: [] };
  let step = 0;
  const reset = () => {
    cells.forEach((c) => { c.innerHTML = ""; });
    placed.o = []; placed.x = [];
    step = 0;
  };
  const tick = () => {
    if (step === moves.length) { reset(); caption.textContent = ""; return setTimeout(tick, 900); }
    const [p, i] = moves[step++];
    board.querySelectorAll(".oldest").forEach((s) => s.classList.remove("oldest"));
    let vanished = false;
    if (placed[p].length === 3) {
      const old = placed[p].shift();
      const svg = cells[old].firstElementChild;
      svg.classList.add("leave");
      setTimeout(() => { cells[old].innerHTML = ""; }, 450);
      vanished = true;
    }
    cells[i].innerHTML = marks[p];
    const svg = cells[i].firstElementChild;
    svg.classList.add("enter");
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove("enter")));
    placed[p].push(i);
    const next = p === "o" ? "x" : "o";
    if (placed[next].length === 3) cells[placed[next][0]].firstElementChild.classList.add("oldest");
    caption.textContent = vanished ? text.vanish : placed[next].length === 3 ? text.warn : text.place;
    setTimeout(tick, 1300);
  };
  setTimeout(tick, 600);
})();
