#!/usr/bin/env node

// Daily NBA Data Update Script
// This script can be run via cron job or GitHub Actions for daily updates

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nbaDataService from '../src/data/nbaDataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DataUpdater {
  constructor() {
    this.dataDir = path.join(__dirname, '../src/data');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  async updatePlayerData() {
    console.log('Starting NBA player data update...');
    
    try {
      // Get current and previous season data
      const seasons = ['2023-24', '2022-23'];
      const allData = [];

      for (const season of seasons) {
        console.log(`Fetching data for ${season}...`);
        
        const stats = await nbaDataService.getCurrentSeasonStats(season);
        const salaries = await nbaDataService.getPlayerSalaries(season);
        
        // Merge salary data with stats
        const mergedData = stats.map(player => ({
          ...player,
          salary: salaries[player.playerId] || 0
        }));

        allData.push({
          season,
          players: mergedData,
          lastUpdated: new Date().toISOString()
        });
      }

      // Save to file
      const outputPath = path.join(this.dataDir, 'playerData.json');
      fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
      
      console.log(`✅ Updated player data for ${seasons.length} seasons`);
      console.log(`📁 Data saved to: ${outputPath}`);
      
      return allData;
    } catch (error) {
      console.error('❌ Error updating player data:', error);
      throw error;
    }
  }

  async updateLotteryData() {
    console.log('Starting NBA lottery data update...');
    
    try {
      // For now, keep existing lottery data structure
      // In the future, this could fetch from NBA API or other sources
      const lotteryDataPath = path.join(__dirname, '../src/lotteryData.json');
      
      if (fs.existsSync(lotteryDataPath)) {
        const existingData = JSON.parse(fs.readFileSync(lotteryDataPath, 'utf8'));
        
        // Update timestamp
        const updatedData = existingData.map(year => ({
          ...year,
          lastUpdated: new Date().toISOString()
        }));
        
        fs.writeFileSync(lotteryDataPath, JSON.stringify(updatedData, null, 2));
        console.log('✅ Updated lottery data timestamps');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error updating lottery data:', error);
      throw error;
    }
  }

  async generateDataSummary() {
    const summary = {
      lastUpdate: new Date().toISOString(),
      playerData: {
        seasons: [],
        totalPlayers: 0
      },
      lotteryData: {
        years: [],
        totalEntries: 0
      }
    };

    // Player data summary
    const playerDataPath = path.join(this.dataDir, 'playerData.json');
    if (fs.existsSync(playerDataPath)) {
      const playerData = JSON.parse(fs.readFileSync(playerDataPath, 'utf8'));
      summary.playerData.seasons = playerData.map(d => d.season);
      summary.playerData.totalPlayers = playerData.reduce((sum, season) => sum + season.players.length, 0);
    }

    // Lottery data summary
    const lotteryDataPath = path.join(__dirname, '../src/lotteryData.json');
    if (fs.existsSync(lotteryDataPath)) {
      const lotteryData = JSON.parse(fs.readFileSync(lotteryDataPath, 'utf8'));
      summary.lotteryData.years = lotteryData.map(d => d.year);
      summary.lotteryData.totalEntries = lotteryData.length;
    }

    // Save summary
    const summaryPath = path.join(this.dataDir, 'dataSummary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('📊 Data summary generated');
    return summary;
  }

  async runFullUpdate() {
    console.log('🚀 Starting full NBA data update...');
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    try {
      await this.updatePlayerData();
      await this.updateLotteryData();
      await this.generateDataSummary();
      
      console.log('✅ Full data update completed successfully!');
      console.log(`⏰ Completed at: ${new Date().toISOString()}`);
      
      return true;
    } catch (error) {
      console.error('❌ Full data update failed:', error);
      throw error;
    }
  }
}

// Run the updater if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const updater = new DataUpdater();
  
  const command = process.argv[2] || 'full';
  
  switch (command) {
    case 'players':
      updater.updatePlayerData();
      break;
    case 'lottery':
      updater.updateLotteryData();
      break;
    case 'summary':
      updater.generateDataSummary();
      break;
    case 'full':
    default:
      updater.runFullUpdate();
      break;
  }
}

export default DataUpdater; 