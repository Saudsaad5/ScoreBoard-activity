// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

// Game simulation data
let gamesData = [
  {
    id: 1,
    homeTeam: { city: "Los Angeles", name: "Lakers", abbreviation: "LAL", wins: 51, losses: 31, score: 52, stats: { fgPercentage: "36.2%", threePointMade: 4, threePointAttempts: 28, rebounds: 35 }},
    awayTeam: { city: "Boston", name: "Celtics", abbreviation: "BOS", wins: 56, losses: 26, score: 69, stats: { fgPercentage: "44.8%", threePointMade: 14, threePointAttempts: 34, rebounds: 32 }},
    period: 3,
    timeRemaining: "6:42",
    gameStatus: "live"
  },
  {
    id: 2,
    homeTeam: { city: "Miami", name: "Heat", abbreviation: "MIA", wins: 45, losses: 37, score: 47, stats: { fgPercentage: "38.5%", threePointMade: 6, threePointAttempts: 22, rebounds: 29 }},
    awayTeam: { city: "Chicago", name: "Bulls", abbreviation: "CHI", wins: 40, losses: 42, score: 52, stats: { fgPercentage: "42.1%", threePointMade: 7, threePointAttempts: 25, rebounds: 31 }},
    period: 2,
    timeRemaining: "2:11",
    gameStatus: "live"
  },
  {
    id: 3,
    homeTeam: { city: "Dallas", name: "Mavericks", abbreviation: "DAL", wins: 50, losses: 32, score: 80, stats: { fgPercentage: "49.0%", threePointMade: 10, threePointAttempts: 30, rebounds: 40 }},
    awayTeam: { city: "Phoenix", name: "Suns", abbreviation: "PHX", wins: 48, losses: 34, score: 72, stats: { fgPercentage: "46.3%", threePointMade: 9, threePointAttempts: 27, rebounds: 38 }},
    period: 4,
    timeRemaining: "3:00",
    gameStatus: "live"
  }
];

// Function to randomly update the score
function simulateGameProgress() {
  gamesData.forEach(game => {
    if (game.gameStatus !== 'live') return;

    const scoringTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    const pointsScored = Math.floor(Math.random() * 4);

    if (pointsScored > 0) {
      game[scoringTeam].score += pointsScored;

      if (pointsScored === 3) {
        game[scoringTeam].stats.threePointMade += 1;
        game[scoringTeam].stats.threePointAttempts += 1;
      } else {
        const newPercentage = Math.min(Math.max(
          parseFloat(game[scoringTeam].stats.fgPercentage) + (Math.random() * 0.5 - 0.25),
          35.0), 65.0).toFixed(1);
        game[scoringTeam].stats.fgPercentage = newPercentage + "%";
      }
    } else {
      if (Math.random() > 0.7) {
        game[scoringTeam].stats.threePointAttempts += 1;
      }
    }

    const reboundTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    if (Math.random() > 0.7) {
      game[reboundTeam].stats.rebounds += 1;
    }

    let [minutes, seconds] = game.timeRemaining.split(':').map(Number);
    seconds -= Math.floor(Math.random() * 24);
    if (seconds < 0) {
      minutes -= 1;
      seconds += 60;
    }

    if (minutes < 0) {
      game.period += 1;
      if (game.period > 4) {
        if (game.homeTeam.score === game.awayTeam.score) {
          game.timeRemaining = "5:00";
        } else {
          game.gameStatus = "final";
          game.timeRemaining = "0:00";
        }
      } else {
        game.timeRemaining = "12:00";
      }
    } else {
      game.timeRemaining = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  });
}


// Simulate game progress every 3 seconds
setInterval(simulateGameProgress, 3000);

// API endpoint to get current game data

app.get('/api/game', (req, res) => {
  res.json(gamesData);
});


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
