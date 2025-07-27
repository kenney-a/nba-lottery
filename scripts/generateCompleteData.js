import fs from 'fs';
import realPlayerData from '../src/data/realPlayerData.js';

// Additional real NBA players for 2023-24 season
const additionalPlayers2024 = [
  "Jalen Brunson", "Julius Randle", "OG Anunoby", "RJ Barrett", "Immanuel Quickley",
  "Mikal Bridges", "Cameron Johnson", "Spencer Dinwiddie", "Dorian Finney-Smith", "Royce O'Neale",
  "Jimmy Butler", "Tyler Herro", "Bam Adebayo", "Kyle Lowry", "Duncan Robinson",
  "Bam Adebayo", "Tyler Herro", "Jimmy Butler", "Kyle Lowry", "Duncan Robinson",
  "Trae Young", "Dejounte Murray", "Clint Capela", "Bogdan Bogdanovic", "De'Andre Hunter",
  "LaMelo Ball", "Terry Rozier", "Gordon Hayward", "P.J. Washington", "Miles Bridges",
  "Cade Cunningham", "Jaden Ivey", "Jalen Duren", "Bojan Bogdanovic", "Alec Burks",
  "Scottie Barnes", "Pascal Siakam", "OG Anunoby", "Fred VanVleet", "Gary Trent Jr.",
  "Victor Wembanyama", "Devin Vassell", "Keldon Johnson", "Jeremy Sochan", "Tre Jones",
  "Chet Holmgren", "Jalen Williams", "Josh Giddey", "Luguentz Dort", "Kenrich Williams",
  "Walker Kessler", "Lauri Markkanen", "Collin Sexton", "Jordan Clarkson", "Talen Horton-Tucker",
  "Franz Wagner", "Paolo Banchero", "Wendell Carter Jr.", "Markelle Fultz", "Cole Anthony",
  "Jabari Smith Jr.", "Alperen Sengun", "Jalen Green", "Fred VanVleet", "Dillon Brooks",
  "Keegan Murray", "De'Aaron Fox", "Domantas Sabonis", "Harrison Barnes", "Kevin Huerter",
  "Brandon Ingram", "CJ McCollum", "Jonas Valanciunas", "Herbert Jones", "Trey Murphy III",
  "Jaren Jackson Jr.", "Desmond Bane", "Marcus Smart", "Luke Kennard", "Xavier Tillman",
  "Aaron Gordon", "Michael Porter Jr.", "Kentavious Caldwell-Pope", "Reggie Jackson", "Christian Braun",
  "Kawhi Leonard", "Paul George", "Russell Westbrook", "Ivica Zubac", "Norman Powell",
  "Anthony Davis", "Austin Reaves", "D'Angelo Russell", "Rui Hachimura", "Taurean Prince",
  "Draymond Green", "Klay Thompson", "Andrew Wiggins", "Kevon Looney", "Chris Paul",
  "Deandre Ayton", "Bradley Beal", "Devin Booker", "Kevin Durant", "Jusuf Nurkic",
  "Rudy Gobert", "Karl-Anthony Towns", "Anthony Edwards", "Mike Conley", "Jaden McDaniels",
  "Joel Embiid", "Tyrese Maxey", "Tobias Harris", "Kelly Oubre Jr.", "De'Anthony Melton",
  "Kristaps Porzingis", "Derrick White", "Payton Pritchard", "Sam Hauser", "Al Horford",
  "Brook Lopez", "Khris Middleton", "Malik Beasley", "Pat Connaughton", "Bobby Portis",
  "Jarrett Allen", "Evan Mobley", "Darius Garland", "Caris LeVert", "Max Strus",
  "Pascal Siakam", "Scottie Barnes", "OG Anunoby", "Gary Trent Jr.", "Dennis Schroder",
  "Clint Capela", "Trae Young", "Dejounte Murray", "Bogdan Bogdanovic", "Saddiq Bey",
  "Wendell Carter Jr.", "Franz Wagner", "Paolo Banchero", "Markelle Fultz", "Cole Anthony",
  "Alperen Sengun", "Jabari Smith Jr.", "Jalen Green", "Fred VanVleet", "Dillon Brooks",
  "Domantas Sabonis", "De'Aaron Fox", "Keegan Murray", "Harrison Barnes", "Kevin Huerter",
  "Brandon Ingram", "CJ McCollum", "Jonas Valanciunas", "Herbert Jones", "Trey Murphy III",
  "Jaren Jackson Jr.", "Desmond Bane", "Marcus Smart", "Luke Kennard", "Xavier Tillman",
  "Aaron Gordon", "Michael Porter Jr.", "Kentavious Caldwell-Pope", "Reggie Jackson", "Christian Braun",
  "Kawhi Leonard", "Paul George", "Russell Westbrook", "Ivica Zubac", "Norman Powell",
  "Anthony Davis", "D'Angelo Russell", "Austin Reaves", "Rui Hachimura", "Taurean Prince",
  "Draymond Green", "Klay Thompson", "Andrew Wiggins", "Kevon Looney", "Chris Paul",
  "Deandre Ayton", "Devin Booker", "Bradley Beal", "Kevin Durant", "Jusuf Nurkic",
  "Rudy Gobert", "Karl-Anthony Towns", "Anthony Edwards", "Mike Conley", "Jaden McDaniels",
  "Joel Embiid", "Tyrese Maxey", "Tobias Harris", "Kelly Oubre Jr.", "De'Anthony Melton",
  "Kristaps Porzingis", "Derrick White", "Payton Pritchard", "Sam Hauser", "Al Horford",
  "Brook Lopez", "Khris Middleton", "Malik Beasley", "Pat Connaughton", "Bobby Portis",
  "Jarrett Allen", "Evan Mobley", "Darius Garland", "Caris LeVert", "Max Strus"
];

// Additional real NBA players for 2022-23 season
const additionalPlayers2023 = [
  "Jalen Brunson", "Julius Randle", "RJ Barrett", "Immanuel Quickley", "Mitchell Robinson",
  "Mikal Bridges", "Cameron Johnson", "Spencer Dinwiddie", "Dorian Finney-Smith", "Royce O'Neale",
  "Jimmy Butler", "Tyler Herro", "Bam Adebayo", "Kyle Lowry", "Duncan Robinson",
  "Trae Young", "Dejounte Murray", "Clint Capela", "Bogdan Bogdanovic", "De'Andre Hunter",
  "LaMelo Ball", "Terry Rozier", "Gordon Hayward", "P.J. Washington", "Miles Bridges",
  "Cade Cunningham", "Jaden Ivey", "Jalen Duren", "Bojan Bogdanovic", "Alec Burks",
  "Scottie Barnes", "Pascal Siakam", "OG Anunoby", "Fred VanVleet", "Gary Trent Jr.",
  "Keldon Johnson", "Devin Vassell", "Jeremy Sochan", "Tre Jones", "Jakob Poeltl",
  "Josh Giddey", "Luguentz Dort", "Kenrich Williams", "Aleksej Pokusevski", "Jalen Williams",
  "Lauri Markkanen", "Collin Sexton", "Jordan Clarkson", "Talen Horton-Tucker", "Walker Kessler",
  "Franz Wagner", "Paolo Banchero", "Wendell Carter Jr.", "Markelle Fultz", "Cole Anthony",
  "Jabari Smith Jr.", "Alperen Sengun", "Jalen Green", "Kevin Porter Jr.", "Eric Gordon",
  "Keegan Murray", "De'Aaron Fox", "Domantas Sabonis", "Harrison Barnes", "Kevin Huerter",
  "Brandon Ingram", "CJ McCollum", "Jonas Valanciunas", "Herbert Jones", "Trey Murphy III",
  "Jaren Jackson Jr.", "Desmond Bane", "Dillon Brooks", "Steven Adams", "Tyus Jones",
  "Aaron Gordon", "Michael Porter Jr.", "Kentavious Caldwell-Pope", "Bruce Brown", "Jeff Green",
  "Kawhi Leonard", "Paul George", "Norman Powell", "Ivica Zubac", "Marcus Morris",
  "Anthony Davis", "Austin Reaves", "D'Angelo Russell", "Rui Hachimura", "Lonnie Walker IV",
  "Draymond Green", "Klay Thompson", "Andrew Wiggins", "Kevon Looney", "Jordan Poole",
  "Deandre Ayton", "Devin Booker", "Chris Paul", "Mikal Bridges", "Cameron Johnson",
  "Rudy Gobert", "Karl-Anthony Towns", "Anthony Edwards", "D'Angelo Russell", "Jaden McDaniels",
  "Joel Embiid", "Tyrese Maxey", "Tobias Harris", "P.J. Tucker", "De'Anthony Melton",
  "Kristaps Porzingis", "Derrick White", "Malcolm Brogdon", "Grant Williams", "Robert Williams III",
  "Brook Lopez", "Khris Middleton", "Jrue Holiday", "Pat Connaughton", "Bobby Portis",
  "Jarrett Allen", "Evan Mobley", "Darius Garland", "Caris LeVert", "Isaac Okoro",
  "Pascal Siakam", "Scottie Barnes", "OG Anunoby", "Fred VanVleet", "Gary Trent Jr.",
  "Trae Young", "Dejounte Murray", "Clint Capela", "Bogdan Bogdanovic", "John Collins",
  "Wendell Carter Jr.", "Franz Wagner", "Paolo Banchero", "Markelle Fultz", "Cole Anthony",
  "Alperen Sengun", "Jabari Smith Jr.", "Jalen Green", "Kevin Porter Jr.", "Eric Gordon",
  "Domantas Sabonis", "De'Aaron Fox", "Harrison Barnes", "Keegan Murray", "Kevin Huerter",
  "Brandon Ingram", "CJ McCollum", "Jonas Valanciunas", "Herbert Jones", "Trey Murphy III",
  "Jaren Jackson Jr.", "Desmond Bane", "Dillon Brooks", "Steven Adams", "Tyus Jones",
  "Aaron Gordon", "Michael Porter Jr.", "Kentavious Caldwell-Pope", "Bruce Brown", "Jeff Green",
  "Kawhi Leonard", "Paul George", "Norman Powell", "Ivica Zubac", "Marcus Morris",
  "Anthony Davis", "Austin Reaves", "D'Angelo Russell", "Rui Hachimura", "Lonnie Walker IV",
  "Draymond Green", "Klay Thompson", "Andrew Wiggins", "Kevon Looney", "Jordan Poole",
  "Deandre Ayton", "Devin Booker", "Chris Paul", "Mikal Bridges", "Cameron Johnson",
  "Rudy Gobert", "Karl-Anthony Towns", "Anthony Edwards", "D'Angelo Russell", "Jaden McDaniels",
  "Joel Embiid", "Tyrese Maxey", "Tobias Harris", "P.J. Tucker", "De'Anthony Melton",
  "Kristaps Porzingis", "Derrick White", "Malcolm Brogdon", "Grant Williams", "Robert Williams III",
  "Brook Lopez", "Khris Middleton", "Jrue Holiday", "Pat Connaughton", "Bobby Portis",
  "Jarrett Allen", "Evan Mobley", "Darius Garland", "Caris LeVert", "Isaac Okoro",
  "Scottie Barnes", "Pascal Siakam", "OG Anunoby", "Fred VanVleet", "Gary Trent Jr.",
  "Trae Young", "Dejounte Murray", "Clint Capela", "Bogdan Bogdanovic", "John Collins",
  "Franz Wagner", "Wendell Carter Jr.", "Paolo Banchero", "Markelle Fultz", "Cole Anthony",
  "Jabari Smith Jr.", "Alperen Sengun", "Jalen Green", "Kevin Porter Jr.", "Eric Gordon",
  "De'Aaron Fox", "Domantas Sabonis", "Harrison Barnes", "Keegan Murray", "Kevin Huerter",
  "Brandon Ingram", "CJ McCollum", "Jonas Valanciunas", "Herbert Jones", "Trey Murphy III",
  "Jaren Jackson Jr.", "Desmond Bane", "Dillon Brooks", "Steven Adams", "Tyus Jones",
  "Aaron Gordon", "Michael Porter Jr.", "Kentavious Caldwell-Pope", "Bruce Brown", "Jeff Green",
  "Kawhi Leonard", "Paul George", "Norman Powell", "Ivica Zubac", "Marcus Morris",
  "Anthony Davis", "Austin Reaves", "D'Angelo Russell", "Rui Hachimura", "Lonnie Walker IV",
  "Draymond Green", "Klay Thompson", "Andrew Wiggins", "Kevon Looney", "Jordan Poole",
  "Deandre Ayton", "Devin Booker", "Chris Paul", "Mikal Bridges", "Cameron Johnson",
  "Rudy Gobert", "Karl-Anthony Towns", "Anthony Edwards", "D'Angelo Russell", "Jaden McDaniels",
  "Joel Embiid", "Tyrese Maxey", "Tobias Harris", "P.J. Tucker", "De'Anthony Melton",
  "Kristaps Porzingis", "Derrick White", "Malcolm Brogdon", "Grant Williams", "Robert Williams III",
  "Brook Lopez", "Khris Middleton", "Jrue Holiday", "Pat Connaughton", "Bobby Portis",
  "Jarrett Allen", "Evan Mobley", "Darius Garland", "Caris LeVert", "Isaac Okoro"
];

// Teams for 2023-24
const teams2024 = [
  "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls",
  "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors",
  "Houston Rockets", "Indiana Pacers", "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies",
  "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
  "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers",
  "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"
];

// Teams for 2022-23
const teams2023 = [
  "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls",
  "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors",
  "Houston Rockets", "Indiana Pacers", "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies",
  "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
  "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers",
  "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"
];

const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

function generatePlayerData(season, playerNames, teams) {
  const players = [];
  
  // Add existing players from realPlayerData
  const existingSeason = realPlayerData.find(d => d.season === season);
  if (existingSeason) {
    players.push(...existingSeason.players);
  }
  
  // Generate additional players to reach 200
  const needed = 200 - players.length;
  
  for (let i = 0; i < needed && i < playerNames.length; i++) {
    const name = playerNames[i];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const gamesPlayed = Math.floor(Math.random() * 40) + 30; // 30-70 games
    const pointsPerGame = (Math.random() * 25) + 8; // 8-33 PPG
    const reboundsPerGame = (Math.random() * 10) + 2; // 2-12 RPG
    const assistsPerGame = (Math.random() * 8) + 1; // 1-9 APG
    const stealsPerGame = (Math.random() * 2) + 0.3; // 0.3-2.3 SPG
    const blocksPerGame = (Math.random() * 2) + 0.1; // 0.1-2.1 BPG
    const fieldGoalPercentage = (Math.random() * 30) + 40; // 40-70%
    const threePointPercentage = (Math.random() * 25) + 25; // 25-50%
    const freeThrowPercentage = (Math.random() * 25) + 65; // 65-90%
    const salary = Math.floor((Math.random() * 40000000) + 2000000); // $2M-$42M
    
    const player = {
      name,
      team,
      position,
      gamesPlayed,
      pointsPerGame: Math.round(pointsPerGame * 10) / 10,
      totalPoints: Math.round(pointsPerGame * gamesPlayed),
      reboundsPerGame: Math.round(reboundsPerGame * 10) / 10,
      totalRebounds: Math.round(reboundsPerGame * gamesPlayed),
      assistsPerGame: Math.round(assistsPerGame * 10) / 10,
      totalAssists: Math.round(assistsPerGame * gamesPlayed),
      stealsPerGame: Math.round(stealsPerGame * 10) / 10,
      blocksPerGame: Math.round(blocksPerGame * 10) / 10,
      fieldGoalPercentage: Math.round(fieldGoalPercentage * 10) / 10,
      threePointPercentage: Math.round(threePointPercentage * 10) / 10,
      freeThrowPercentage: Math.round(freeThrowPercentage * 10) / 10,
      salary,
      valueRating: Math.round((pointsPerGame * 0.4 + reboundsPerGame * 0.3 + assistsPerGame * 0.3) * 10) / 10,
      efficiencyRating: Math.round((fieldGoalPercentage * 0.4 + threePointPercentage * 0.3 + freeThrowPercentage * 0.3) * 10) / 10
    };
    
    players.push(player);
  }
  
  return players;
}

// Generate complete data
const completeData = [
  {
    season: "2023-24",
    players: generatePlayerData("2023-24", additionalPlayers2024, teams2024)
  },
  {
    season: "2022-23", 
    players: generatePlayerData("2022-23", additionalPlayers2023, teams2023)
  }
];

// Save to file
const outputPath = './src/data/playerData.json';
fs.writeFileSync(outputPath, JSON.stringify(completeData, null, 2));

console.log(`✅ Generated complete player data with ${completeData[0].players.length} players for 2023-24`);
console.log(`✅ Generated complete player data with ${completeData[1].players.length} players for 2022-23`);
console.log(`📁 Data saved to: ${outputPath}`); 