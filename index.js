const express = require('express');
const app = express();
app.use(express.json());

let servers = [];

app.post('/register', (req, res) => {
    const { ip, port, name, players, maxPlayers } = req.body;
    const existing = servers.find(s => s.ip === ip && s.port === port);
    if (existing) {
        existing.lastSeen = Date.now();
        existing.players = players;
        existing.name = name;
    } else {
        servers.push({
            ip, port, name, players, maxPlayers,
            lastSeen: Date.now()
        });
    }
    res.send("OK");
});

app.get('/list', (req, res) => {
    const now = Date.now();
    servers = servers.filter(s => now - s.lastSeen < 30000); 
    res.json(servers);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Master server running on port ${PORT}`));
