const screens = [...document.querySelectorAll('.screen')];
const modal = document.getElementById('modal');

const show = id => {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
};

function makePattern(container, size, seedText) {
  if (!container) return;
  const chars = [...seedText].map(c => c.charCodeAt(0));
  const cells = [];
  const finderInner = (x, y, ox, oy, box) => x >= ox && x < ox + box && y >= oy && y < oy + box;
  const finderPixel = (x, y, ox, oy, box) => {
    const lx = x - ox;
    const ly = y - oy;
    const edge = lx === 0 || ly === 0 || lx === box - 1 || ly === box - 1;
    const dot = lx >= 2 && lx <= box - 3 && ly >= 2 && ly <= box - 3;
    return edge || dot;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let on;
      const box = size >= 21 ? 7 : 5;
      if (finderInner(x, y, 0, 0, box)) on = finderPixel(x, y, 0, 0, box);
      else if (finderInner(x, y, size - box, 0, box)) on = finderPixel(x, y, size - box, 0, box);
      else if (finderInner(x, y, 0, size - box, box)) on = finderPixel(x, y, 0, size - box, box);
      else {
        const code = chars[(x * 7 + y * 13) % chars.length];
        on = ((x * 17 + y * 11 + code) % 4) !== 0;
      }
      cells.push(`<span class="${on ? '' : 'off'}"></span>`);
    }
  }
  container.innerHTML = cells.join('');
}

document.getElementById('openCert').addEventListener('click', () => show('screen-card'));
document.getElementById('closeCard').addEventListener('click', () => show('screen-list'));
document.getElementById('issueBtn').addEventListener('click', () => modal.classList.add('show'));
document.getElementById('confirmIssue').addEventListener('click', () => {
  modal.classList.remove('show');
  show('screen-list');
});
document.getElementById('certCard').addEventListener('click', () => show('screen-detail'));
document.getElementById('refreshBtn').addEventListener('click', () => show('screen-back'));
document.getElementById('closeBack').addEventListener('click', () => show('screen-card'));
document.getElementById('refreshBack').addEventListener('click', () => show('screen-card'));
document.getElementById('refreshDetail').addEventListener('click', () => show('screen-card'));

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

makePattern(document.getElementById('qrBox'), 21, '24638145027Z고영후건축산업기사');
makePattern(document.getElementById('microQr'), 13, 'DEMO-24638145027Z');
