/**
 * Dashboard Logic v2
 */

// ── Route search ────────────────────────────────────────────────────────────
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
  resultEl.innerHTML =
    '<div style="color:var(--green-text);font-weight:600;margin-bottom:8px">&#10003; Marshrut topildi</div>' +
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

// ── Live routes list ─────────────────────────────────────────────────────────
function renderLiveRoutes(routes) {
  const el = document.getElementById('live-routes');
  if (!el) return;

  // Make the list scrollable if many routes
  el.style.maxHeight = '380px';
  el.style.overflowY = 'auto';

  el.innerHTML = routes.map(r =>
    '<div class="route-item" style="cursor:pointer" onclick="openRoute(' + r.id + ')" title="Jadval ko\'rish">' +
    '<div class="route-num ' + typeClass(r.type) + '">' + r.number + '</div>' +
    '<div class="route-info">' +
      '<div class="route-name">' + r.name + '</div>' +
      '<div class="route-meta">' + r.stops + ' bekat &bull; ' + r.km + ' km &bull; ' + (r.hours || '—') + '</div>' +
    '</div>' +
    statusBadge(r.status) +
    '</div>'
  ).join('');
}

function openRoute(id) {
  window.location.href = '/pages/schedule.html?id=' + id;
}

// ── Dynamic alerts from real route statuses ──────────────────────────────────
function renderAlerts(routes) {
  const el = document.getElementById('alerts-list');
  if (!el) return;

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes());

  const alerts = [];

  // Stopped routes → error alerts
  routes.filter(r => r.status === 'stopped').forEach(r => {
    alerts.push({ type: 'err', text: r.number + ' — ' + r.name + ' to\'xtatildi', time: timeStr });
  });

  // Delayed routes → warning alerts
  routes.filter(r => r.status === 'delay').forEach(r => {
    const min = 3 + Math.floor(Math.random() * 12);
    alerts.push({ type: 'warn', text: r.number + '-marshrut ' + min + ' daqiqa kechikmoqda', time: timeStr });
  });

  // Active routes → info (show up to 3 newest)
  routes.filter(r => r.status === 'active').slice(0, 3).forEach(r => {
    alerts.push({ type: 'ok', text: r.number + ' — ' + r.name + ' jadval bo\'yicha ishlayapti', time: timeStr });
  });

  if (alerts.length === 0) {
    alerts.push({ type: 'info', text: "Hech qanday ogohlantirish yo'q", time: timeStr });
  }

  el.innerHTML = alerts.map(a =>
    '<div class="alert-item">' +
    '<div class="alert-dot ' + a.type + '"></div>' +
    '<div><div class="alert-text">' + a.text + '</div>' +
    '<div class="alert-time">' + a.time + '</div></div>' +
    '</div>'
  ).join('');
}

// ── Passenger chart ──────────────────────────────────────────────────────────
let chartInstance = null;

function renderChart(hourly, currentHour) {
  const canvas = document.getElementById('passengerChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const labels = Array.from({ length: hourly.length }, (_, i) => (6 + i) + ':00');
  const nowIdx   = Math.min(currentHour - 6, hourly.length - 1);
  const bgColors = hourly.map((_, i) =>
    i < nowIdx   ? 'rgba(139,92,246,0.30)' :
    i === nowIdx ? 'rgba(139,92,246,0.80)' : 'rgba(139,92,246,0.08)'
  );
  const borderColors = hourly.map((_, i) =>
    i === nowIdx ? '#8b5cf6' : 'rgba(139,92,246,0.35)'
  );

  if (chartInstance) {
    // Update data in place — no DOM teardown on every 30s refresh
    chartInstance.data.datasets[0].data            = hourly;
    chartInstance.data.datasets[0].backgroundColor = bgColors;
    chartInstance.data.datasets[0].borderColor     = borderColors;
    chartInstance.update('none');
    return;
  }

  chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: "Yo'lovchilar",
        data: hourly,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + Number(ctx.parsed.y).toLocaleString() + " yo'lovchi" } }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#40435c', font: { size: 10, family: "'Plus Jakarta Sans'" } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#40435c', font: { size: 10, family: "'Plus Jakarta Sans'" } } },
      }
    }
  });
}

// ── Refresh ──────────────────────────────────────────────────────────────────
async function refreshData() {
  const [stats, routes] = await Promise.all([API.getStats(), API.getRoutes()]);

  document.querySelectorAll('[data-count]').forEach(el => {
    const key = el.dataset.count;
    if (stats[key] !== undefined) el.textContent = Number(stats[key]).toLocaleString();
  });

  // Update passenger trend badge with last hour's count
  const trendEl = document.getElementById('passenger-trend');
  if (trendEl && stats.hourly && stats.hourly.length) {
    const lastVal = stats.hourly.filter(v => v > 0).slice(-1)[0] || 0;
    trendEl.textContent = '+' + Number(lastVal).toLocaleString();
  }

  renderChart(stats.hourly || [], stats.currentHour ?? new Date().getHours());
  renderLiveRoutes(routes);
  renderAlerts(routes);
}

// ── Init ─────────────────────────────────────────────────────────────────────
(async function init() {
  await refreshData();

  // Auto-refresh every 30 seconds
  setInterval(refreshData, 30000);
})();
