// NBA Data Service - Centralized data management
// This service will handle data fetching, caching, and updates

class NBADataService {
  constructor() {
    this.baseUrl = 'https://stats.nba.com/stats';
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  // NBA Stats API Headers (required for official API)
  getHeaders() {
    return {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Referer': 'https://stats.nba.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
    };
  }

  // Get current season player stats
  async getCurrentSeasonStats(season = '2023-24') {
    const cacheKey = `currentStats_${season}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const url = `${this.baseUrl}/leaguedashplayerstats`;
      const params = new URLSearchParams({
        Season: season,
        SeasonType: 'Regular Season',
        PerMode: 'PerGame',
        MeasureType: 'Base',
        PlusMinus: 'N',
        PaceAdjust: 'N',
        Rank: 'Y',
        LeagueID: '00',
        Conference: '',
        Division: '',
        GameScope: '',
        PlayerExperience: '',
        PlayerPosition: '',
        StarterBench: '',
        DraftYear: '',
        DraftPick: '',
        College: '',
        Country: '',
        Height: '',
        Weight: '',
        TwoWay: '0',
        Active: '1'
      });

      const response = await fetch(`${url}?${params}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const processedData = this.processPlayerStats(data);
      
      this.setCache(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching current season stats:', error);
      return this.getFallbackData();
    }
  }

  // Get historical player stats
  async getHistoricalStats(season) {
    const cacheKey = `historicalStats_${season}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      const url = `${this.baseUrl}/leaguedashplayerstats`;
      const params = new URLSearchParams({
        Season: season,
        SeasonType: 'Regular Season',
        PerMode: 'PerGame',
        MeasureType: 'Base',
        PlusMinus: 'N',
        PaceAdjust: 'N',
        Rank: 'Y',
        LeagueID: '00'
      });

      const response = await fetch(`${url}?${params}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const processedData = this.processPlayerStats(data);
      
      this.setCache(cacheKey, processedData);
      return processedData;
    } catch (error) {
      console.error('Error fetching historical stats:', error);
      return this.getFallbackData();
    }
  }

  // Get player salary data
  async getPlayerSalaries(season = '2023-24') {
    const cacheKey = `salaries_${season}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    try {
      // Note: NBA API doesn't provide salary data directly
      // We'll need to use a different source or combine with other APIs
      const salaryData = await this.getSalaryDataFromAlternativeSource(season);
      this.setCache(cacheKey, salaryData);
      return salaryData;
    } catch (error) {
      console.error('Error fetching salary data:', error);
      return {};
    }
  }

  // Process raw NBA API data into our format
  processPlayerStats(rawData) {
    if (!rawData.resultSets || !rawData.resultSets[0]) {
      return [];
    }

    const { headers, rowSet } = rawData.resultSets[0];
    const players = [];

    rowSet.forEach(row => {
      const player = {};
      headers.forEach((header, index) => {
        player[this.normalizeHeader(header)] = row[index];
      });
      players.push(this.transformPlayerData(player));
    });

    return players;
  }

  // Normalize API headers to our format
  normalizeHeader(header) {
    const headerMap = {
      'PLAYER_NAME': 'name',
      'TEAM_NAME': 'team',
      'PLAYER_ID': 'playerId',
      'GP': 'gamesPlayed',
      'PTS': 'pointsPerGame',
      'REB': 'reboundsPerGame',
      'AST': 'assistsPerGame',
      'STL': 'stealsPerGame',
      'BLK': 'blocksPerGame',
      'FG_PCT': 'fieldGoalPercentage',
      'FG3_PCT': 'threePointPercentage',
      'FT_PCT': 'freeThrowPercentage',
      'MIN': 'minutesPerGame',
      'AGE': 'age',
      'POSITION': 'position'
    };
    return headerMap[header] || header.toLowerCase();
  }

  // Transform player data to our format
  transformPlayerData(player) {
    return {
      name: player.name,
      team: player.team,
      playerId: player.playerId,
      position: player.position,
      gamesPlayed: parseInt(player.gamesPlayed) || 0,
      pointsPerGame: parseFloat(player.pointsPerGame) || 0,
      totalPoints: Math.round((parseFloat(player.pointsPerGame) || 0) * (parseInt(player.gamesPlayed) || 0)),
      reboundsPerGame: parseFloat(player.reboundsPerGame) || 0,
      totalRebounds: Math.round((parseFloat(player.reboundsPerGame) || 0) * (parseInt(player.gamesPlayed) || 0)),
      assistsPerGame: parseFloat(player.assistsPerGame) || 0,
      totalAssists: Math.round((parseFloat(player.assistsPerGame) || 0) * (parseInt(player.gamesPlayed) || 0)),
      stealsPerGame: parseFloat(player.stealsPerGame) || 0,
      blocksPerGame: parseFloat(player.blocksPerGame) || 0,
      fieldGoalPercentage: parseFloat(player.fieldGoalPercentage) || 0,
      threePointPercentage: parseFloat(player.threePointPercentage) || 0,
      freeThrowPercentage: parseFloat(player.freeThrowPercentage) || 0,
      minutesPerGame: parseFloat(player.minutesPerGame) || 0,
      age: parseInt(player.age) || 0,
      // Calculate derived metrics
      valueRating: this.calculateValueRating(player),
      efficiencyRating: this.calculateEfficiencyRating(player)
    };
  }

  // Calculate value rating (production vs salary)
  calculateValueRating(player) {
    const production = (player.pointsPerGame * 1.5) + (player.reboundsPerGame * 1.2) + (player.assistsPerGame * 1.8);
    const efficiency = (player.fieldGoalPercentage * 0.3) + (player.threePointPercentage * 0.2) + (player.freeThrowPercentage * 0.1);
    const gamesFactor = Math.min(player.gamesPlayed / 82, 1); // Normalize to full season
    
    return Math.round((production + efficiency) * gamesFactor * 10) / 10;
  }

  // Calculate efficiency rating
  calculateEfficiencyRating(player) {
    const shootingEfficiency = (player.fieldGoalPercentage * 0.4) + (player.threePointPercentage * 0.3) + (player.freeThrowPercentage * 0.3);
    const productionEfficiency = (player.pointsPerGame * 0.4) + (player.reboundsPerGame * 0.3) + (player.assistsPerGame * 0.3);
    
    return Math.round((shootingEfficiency + productionEfficiency) * 10) / 10;
  }

  // Cache management
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return (Date.now() - cached.timestamp) < this.cacheExpiry;
  }

  // Fallback data when API fails
  getFallbackData() {
    console.warn('Using fallback data - API unavailable');
    return [];
  }

  // Alternative salary data source (placeholder)
  async getSalaryDataFromAlternativeSource(season) {
    // This would integrate with a salary database like Spotrac API
    // For now, return empty object
    return {};
  }

  // Get all available seasons
  getAvailableSeasons() {
    const currentYear = new Date().getFullYear();
    const seasons = [];
    for (let year = 1990; year <= currentYear; year++) {
      seasons.push(`${year}-${(year + 1).toString().slice(-2)}`);
    }
    return seasons.reverse();
  }

  // Update all data (for daily updates)
  async updateAllData() {
    const seasons = this.getAvailableSeasons();
    const updates = [];

    for (const season of seasons) {
      try {
        const stats = await this.getCurrentSeasonStats(season);
        const salaries = await this.getPlayerSalaries(season);
        
        // Merge salary data with stats
        const mergedData = stats.map(player => ({
          ...player,
          salary: salaries[player.playerId] || 0
        }));

        updates.push({
          season,
          data: mergedData,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error updating data for ${season}:`, error);
      }
    }

    return updates;
  }
}

// Export singleton instance
export const nbaDataService = new NBADataService();
export default nbaDataService; 