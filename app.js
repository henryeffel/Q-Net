const certData = [
  {
    id: 'arch-ind-001',
    type: '건축산업기사',
    owner: '고영후',
    spacedOwner: '고 영 후',
    birth: '1996년 10월 24일',
    issuedBy: '한국산업인력공단',
    certNumber: '24638145027Z',
    passDate: '2026년 06월 05일',
    issueDate: '2026년 06월 16일',
    managementNumber: '202606160945-10-482731',
    department: '국토교통부',
    status: 'kept',
    photo: 'profile.png'
  }
];

const state = {
  activeTab: 'kept',
  selectedId: certData[0]?.id ?? null,
  query: '',
};

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const screens = $$('[data-screen]');
const modal = $('#modal');
const certList = $('#certList');
const searchInput = $('#searchInput');
const frontCard = $('#frontCard');
const backCard = $('#backCard');
const detailCard = $('#detailCard');

const showScreen = id => {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
};

const currentCert = () => certData.find(cert => cert.id === state.selectedId) ?? certData[0];

const formatCertRow = cert => `
  <button class="cert-row" data-id="${cert.id}">
    <div>
      <div class="badge-row">
        <span class="state-badge">${state.activeTab === 'kept' ? '보관' : '발급'}</span>
      </div>
      <strong>${cert.type}</strong>
      <span class="meta-inline">${cert.issuedBy}&nbsp;&nbsp;|&nbsp;&nbsp;${cert.passDate}</span>
    </div>
    <span class="mini-id">▣</span>
  </button>
`;

const filteredCerts = () => {
  const query = state.query.trim();
  return certData
    .filter(cert => cert.status === state.activeTab)
    .filter(cert => !query || [cert.type, cert.owner, cert.certNumber].some(v => v.includes(query)));
};

const renderCertList = () => {
  const items = filteredCerts();
  if (!items.length) {
    certList.innerHTML = `<div class="empty-state">조건에 맞는 자격증이 없습니다.</div>`;
    return;
  }
  certList.innerHTML = items.map(formatCertRow).join('');
  $$('.cert-row').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedId = btn.dataset.id;
      renderCards();
      showScreen('screen-front');
    });
  });
};

const renderFrontCard = cert => {
  frontCard.innerHTML = `
    <div class="card-head">${cert.type}</div>
    <div class="photo" aria-label="증명사진"><img src="${cert.photo}" alt="${cert.owner} 증명사진" /></div>
    <h1 class="cert-name">${cert.spacedOwner}</h1>
    <p class="cert-birth">${cert.birth}</p>
    <dl class="cert-meta">
      <dt>발급기관</dt><dd>${cert.issuedBy}</dd>
      <dt>자격번호</dt><dd>${cert.certNumber}</dd>
      <dt>합격일자</dt><dd>${cert.passDate}</dd>
    </dl>
  `;
  frontCard.onclick = () => showScreen('screen-detail');
};

const createPseudoQR = seed => {
  const size = 21;
  const cells = [];
  const finder = (x, y) => (
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)
  );
  const finderInner = (x, y, ox, oy) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  const finderPixel = (x, y, ox, oy) => {
    const lx = x - ox;
    const ly = y - oy;
    if (lx === 0 || lx === 6 || ly === 0 || ly === 6) return true;
    if (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4) return true;
    return false;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let on;
      if (finderInner(x, y, 0, 0)) on = finderPixel(x, y, 0, 0);
      else if (finderInner(x, y, size - 7, 0)) on = finderPixel(x, y, size - 7, 0);
      else if (finderInner(x, y, 0, size - 7)) on = finderPixel(x, y, 0, size - 7);
      else {
        const code = seed.charCodeAt((x * 7 + y * 13) % seed.length);
        on = ((x * 17 + y * 11 + code) % 3) !== 0;
      }
      cells.push(`<span class="${on ? '' : 'off'}"></span>`);
    }
  }
  return `<div class="qr-grid" aria-hidden="true">${cells.join('')}</div>`;
};

const renderBackCard = cert => {
  backCard.innerHTML = `
    <div class="card-head">${cert.type}</div>
    <div class="photo small" aria-label="증명사진"><img src="${cert.photo}" alt="${cert.owner} 증명사진" /></div>
    <h1 class="cert-name">${cert.spacedOwner}</h1>
    <p class="cert-birth">${cert.birth}</p>
    <div class="qr-wrap">${createPseudoQR(cert.certNumber + cert.owner + cert.passDate)}</div>
  `;
};

const renderDetailCard = cert => {
  detailCard.innerHTML = `
    <div class="detail-head">국가기술자격증</div>
    <div class="photo detail-photo" aria-label="증명사진"><img src="${cert.photo}" alt="${cert.owner} 증명사진" /></div>
    <dl class="detail-list">
      <dt>자격관리번호</dt><dd>${cert.managementNumber}</dd>
      <dt>자격번호</dt><dd>${cert.certNumber}</dd>
      <dt>자격종목</dt><dd>${cert.type}</dd>
      <dt>성명</dt><dd>${cert.owner}</dd>
      <dt>생년월일</dt><dd>${cert.birth}</dd>
      <dt>합격연월일</dt><dd>${cert.passDate}</dd>
      <dt>발급연월일</dt><dd>${cert.issueDate}</dd>
      <dt>주무부처(청)</dt><dd>${cert.department}</dd>
    </dl>
    <div class="stamp">한국산업인력공단 이사장</div>
    <div class="footer-mark">HRDK</div>
  `;
};

const renderCards = () => {
  const cert = currentCert();
  renderFrontCard(cert);
  renderBackCard(cert);
  renderDetailCard(cert);
};

$('#closeFrontBtn').addEventListener('click', () => showScreen('screen-list'));
$('#closeBackBtn').addEventListener('click', () => showScreen('screen-front'));
$('#toBackBtn').addEventListener('click', () => showScreen('screen-back'));
$('#toFrontBtn').addEventListener('click', () => showScreen('screen-front'));
$('#detailBackBtn').addEventListener('click', () => showScreen('screen-front'));
$('#issueBtn').addEventListener('click', () => modal.classList.add('show'));
$('#confirmIssue').addEventListener('click', () => {
  modal.classList.remove('show');
  state.activeTab = 'issued';
  certData.forEach(cert => {
    if (cert.id === state.selectedId) cert.status = 'issued';
  });
  syncTabs();
  renderCertList();
  showScreen('screen-list');
});
modal.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('show');
});

function syncTabs() {
  $$('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === state.activeTab));
}

$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    state.activeTab = tab.dataset.tab;
    syncTabs();
    renderCertList();
  });
});

searchInput.addEventListener('input', e => {
  state.query = e.target.value;
  renderCertList();
});

$('#sortBtn').addEventListener('click', () => {
  certData.sort((a, b) => b.passDate.localeCompare(a.passDate, 'ko'));
  renderCertList();
});

renderCards();
renderCertList();
