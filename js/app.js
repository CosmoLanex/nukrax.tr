document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    Charts.init();
    
    // Initialize 3D Tilt
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
    });

    // Form submission
    document.getElementById('trade-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const tradeData = {
            date: document.getElementById('t-date').value,
            type: document.getElementById('t-type').value,
            entry: document.getElementById('t-entry').value,
            sl: document.getElementById('t-sl').value,
            tp: document.getElementById('t-tp').value,
            lot: document.getElementById('t-lot').value,
            profit: document.getElementById('t-profit').value,
            result: document.getElementById('t-result').value,
            notes: document.getElementById('t-notes').value,
        };

        Storage.saveTrade(tradeData);
        toggleModal(false);
        updateUI();
        Charts.updateCharts();
        e.target.reset();
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function toggleModal(show) {
    document.getElementById('trade-modal').style.display = show ? 'flex' : 'none';
}

function updateUI() {
    const stats = Storage.getStats();
    document.getElementById('stat-winrate').innerText = `${stats.winRate}%`;
    document.getElementById('winrate-fill').style.width = `${stats.winRate}%`;
    document.getElementById('stat-profit').innerText = `$${stats.profit}`;
    document.getElementById('stat-streak').innerText = stats.streak;
    document.getElementById('stat-total').innerText = stats.total;

    const trades = Storage.getTrades();
    const tableBody = document.getElementById('trade-log-body');
    tableBody.innerHTML = trades.reverse().map(t => `
        <tr>
            <td>${t.date}</td>
            <td style="color: ${t.type === 'Buy' ? '#4da3ff' : '#ffaa00'}">${t.type}</td>
            <td>${t.entry}</td>
            <td>${t.sl} / ${t.tp}</td>
            <td>${t.lot}</td>
            <td class="${parseFloat(t.profit) >= 0 ? 'win-text' : 'loss-text'}">$${t.profit}</td>
            <td><span class="badge">${t.result}</span></td>
            <td><button onclick="deleteTrade(${t.id})" style="background:none; border:none; color:red; cursor:pointer;">✖</button></td>
        </tr>
    `).join('');
}

function deleteTrade(id) {
    if(confirm('Delete this entry?')) {
        Storage.deleteTrade(id);
        updateUI();
        Charts.updateCharts();
    }
}
