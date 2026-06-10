/**
 * Dashboard Logic v2
 */
async function findRoute() {
  const from = document.getElementById('from').value.trim();
  const to   = document.getElementById('to').value.trim();
  const resultEl = document.getElementById('search-result');
  if (!from || !to) { showToast("Qayerdan va qayerga maydonlarini to'ldiring", 'warn'); return; }

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = '<span style="color:var(--text-muted)">Qidirilmoqda...</span>';

  const res = await API.search(from, to);

  if (!res.found) {
    resultEl.innerHTML = '<div style="color:var(--red-text)">&#9888; ' + (res.message || 'Marshrut topilmadi') + '</div>';
    return;
  }

  const opts = res.options || [];
  resultEl.innerHTML = '<div style="color:var(--green-text);font-weight:600;margin-bottom:8px">&#10003; Marshrut topildi</div>' +
    opts.map(o =>
      '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin-bottom:8px">' +
      '<div style="font-weight:600;color:var(--text-primary)">' + o.route + '</div>' +
      '<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">' +
        o.duration + ' &bull; ' + o.stops + ' bekat' +
        (o.transfers > 0 ? ' &bull; ' + o.transferStop + ' da o\'tish' : ' &bull; To\'g\'ridan-to\'g\'ri') +
      '</div>' +
      '<div style="font-size:12px;color:var(--green-text);margin-top:4px">Keyingi: ' + o.nextDeparture + '</div>' +
      '</div>'
    ).join('');
}

function renderLiveRoutes(routes) {
  const el = document.getElementById('live-routes');
  if (!el) return;
  el.innerHTML = routes.slice(0,5).map(r =>
    '<div class="route-item">' +
    '<div class="route-num ' + typeClass(r.type) + '">' + r.number + '</div>' +
    '<div class="route-info"><div class="route-name">' + r.name + '</div>' +
    '<div class="route-meta">' + r.stops + ' bekat &bull; ' + r.km + ' km</div></div>' +
    statusBadge(r.status) +
    '</div>'
  ).join('');
}

function renderAlerts() {
  const el = document.getElementById('alerts-list');
  if (!el) return;
  const alerts = [
    { type:'err',  text:"T3 tramvay to'xtatildi - ta'mirlash", time:'07:42' },
    { type:'warn', text:'17-marshrut 7 daqiqa kechikmoqda',    time:'07:38' },
    { type:'info', text:"Yangi 55-marshrut 10 apreldan ishga tushadi", time:'07:10' },
    { type:'ok',   text:'M1 metro jadval bo\'yicha ishlayapti', time:'06:55' },
  ];
  el.innerHTML = alerts.map(a =>
    '<div class="alert-item">' +
    '<div class="alert-dot ' + a.type + '"></div>' +
    '<div><div class="alert-text">' + a.text + '</div>' +
    '<div class="alert-time">' + a.time + '</div></div>' +
    '</div>'
  ).join('');
}

function renderChart(hourly) {
  const canvas = document.getElementById('passengerChart');
  if (!canvas || typeof Chart === 'undefined') return;
  const labels = Array.from({length: hourly.length}, (_,i) => (6+i) + ':00');
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: "Yo'lovchilar",
        data: hourly,
        backgroundColor: 'rgba(31,170,114,0.2)',
        borderColor: '#1faa72',
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color:'#2a2f3a' }, ticks: { color:'#8b92a0', font:{size:10} } },
        y: { grid: { color:'#2a2f3a' }, ticks: { color:'#8b92a0', font:{size:10} } },
      }
    }
  });
}

(async function init() {
  const [stats, routes] = await Promise.all([API.getStats(), API.getRoutes()]);

  // stat cards
  document.querySelectorAll('[data-count]').forEach(el => {
    const key = el.dataset.count;
    if (stats[key] !== undefined) el.textContent = Number(stats[key]).toLocaleString();
  });

  renderChart(stats.hourly || []);
  renderLiveRoutes(routes);
  renderAlerts();
})();
