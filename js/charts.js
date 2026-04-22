const Charts = {
    equity: null,
    winRate: null,

    init() {
        const ctxEquity = document.getElementById('equityChart').getContext('2d');
        const ctxWinRate = document.getElementById('winRateChart').getContext('2d');

        this.equity = new Chart(ctxEquity, this.getConfig('Equity ($)', '#4da3ff'));
        this.winRate = new Chart(ctxWinRate, this.getConfig('Win Rate (%)', '#00ff88'));
        
        this.updateCharts();
    },

    getConfig(label, color) {
        return {
            type: 'line',
            data: { labels: [], datasets: [{ label, data: [], borderColor: color, tension: 0.4, fill: true, backgroundColor: 'rgba(77, 163, 255, 0.1)' }] },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        };
    },

    updateCharts() {
        const trades = Storage.getTrades();
        
        // Equity Curve
        let currentEquity = 0;
        const equityData = trades.map(t => currentEquity += parseFloat(t.profit));
        
        // Win Rate Evolution
        let wins = 0;
        const winRateData = trades.map((t, idx) => {
            if (t.result === 'Win') wins++;
            return ((wins / (idx + 1)) * 100).toFixed(1);
        });

        const labels = trades.map((_, i) => `T-${i + 1}`);

        this.equity.data.labels = labels;
        this.equity.data.datasets[0].data = equityData;
        this.equity.update();

        this.winRate.data.labels = labels;
        this.winRate.data.datasets[0].data = winRateData;
        this.winRate.update();
    }
};
