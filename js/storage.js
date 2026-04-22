const Storage = {
    DB_NAME: 'nukrax_trades',

    getTrades() {
        const data = localStorage.getItem(this.DB_NAME);
        return data ? JSON.parse(data) : [];
    },

    saveTrade(trade) {
        const trades = this.getTrades();
        trades.push({
            id: Date.now(),
            ...trade
        });
        localStorage.setItem(this.DB_NAME, JSON.stringify(trades));
    },

    deleteTrade(id) {
        const trades = this.getTrades().filter(t => t.id !== id);
        localStorage.setItem(this.DB_NAME, JSON.stringify(trades));
    },

    getStats() {
        const trades = this.getTrades();
        const total = trades.length;
        const wins = trades.filter(t => t.result === 'Win').length;
        const profit = trades.reduce((sum, t) => sum + parseFloat(t.profit), 0);
        
        let streak = 0;
        for (let i = trades.length - 1; i >= 0; i--) {
            if (trades[i].result === 'Win') streak++;
            else break;
        }

        return {
            total,
            winRate: total > 0 ? ((wins / total) * 100).toFixed(1) : 0,
            profit: profit.toFixed(2),
            streak
        };
    }
};
