# NBA Data Architecture

## Overview

This document outlines the data architecture for the NBA Analytics website, including data sources, storage, and update mechanisms.

## Data Sources

### Primary: NBA Official API
- **URL**: https://stats.nba.com/stats/
- **Data**: Player statistics, team data, historical records
- **Rate Limits**: Moderate (requires proper headers)
- **Cost**: Free
- **Reliability**: High (official source)

### Secondary: Basketball Reference
- **URL**: https://www.basketball-reference.com/
- **Data**: Historical data, advanced metrics
- **Rate Limits**: Strict (requires subscription for API)
- **Cost**: Free for scraping, paid for API
- **Reliability**: High

### Alternative: Balldontlie API
- **URL**: https://www.balldontlie.io/
- **Data**: Current season stats, basic player info
- **Rate Limits**: None
- **Cost**: Free
- **Reliability**: Medium (community-maintained)

## Data Structure

### Player Data Format
```json
{
  "name": "Nikola Jokić",
  "team": "Denver Nuggets",
  "playerId": "203999",
  "position": "C",
  "gamesPlayed": 79,
  "pointsPerGame": 26.4,
  "totalPoints": 2086,
  "reboundsPerGame": 12.4,
  "totalRebounds": 980,
  "assistsPerGame": 9.0,
  "totalAssists": 711,
  "stealsPerGame": 1.4,
  "blocksPerGame": 0.9,
  "fieldGoalPercentage": 58.3,
  "threePointPercentage": 35.9,
  "freeThrowPercentage": 81.7,
  "minutesPerGame": 34.6,
  "age": 29,
  "salary": 47000000,
  "valueRating": 9.8,
  "efficiencyRating": 32.8
}
```

### Lottery Data Format
```json
{
  "year": 2023,
  "preLottery": [
    {
      "slot": 1,
      "team": "Detroit Pistons",
      "record": "17-65",
      "probability": 14.0
    }
  ],
  "postLottery": [
    {
      "pick": 1,
      "team": "San Antonio Spurs",
      "preSlot": 3,
      "probability": 14.0
    }
  ],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## File Organization

```
src/
├── data/
│   ├── nbaDataService.js     # Data fetching service
│   ├── playerData.json       # Current player data
│   ├── lotteryData.json      # Lottery data
│   └── dataSummary.json      # Data metadata
├── scripts/
│   └── updateData.js         # Data update script
└── .github/workflows/
    └── update-data.yml       # Automated updates
```

## Data Update Process

### Automated Updates (Recommended)
1. **GitHub Actions**: Runs daily at 6 AM UTC
2. **Triggers**: Schedule + manual dispatch
3. **Process**: Fetches → Processes → Commits → Deploys

### Manual Updates
```bash
# Update all data
node scripts/updateData.js full

# Update only player data
node scripts/updateData.js players

# Update only lottery data
node scripts/updateData.js lottery

# Generate data summary
node scripts/updateData.js summary
```

## Data Service Usage

### In React Components
```javascript
import nbaDataService from './data/nbaDataService.js';

// Get current season stats
const stats = await nbaDataService.getCurrentSeasonStats('2023-24');

// Get historical stats
const historical = await nbaDataService.getHistoricalStats('2022-23');

// Get player salaries
const salaries = await nbaDataService.getPlayerSalaries('2023-24');
```

### Caching
- **Duration**: 24 hours
- **Storage**: In-memory Map
- **Invalidation**: Automatic after expiry

## Data Quality & Validation

### Validation Rules
1. **Player Names**: Must be real NBA players
2. **Statistics**: Must be within realistic ranges
3. **Teams**: Must be current NBA teams
4. **Salaries**: Must match official contracts

### Error Handling
- **API Failures**: Fallback to cached data
- **Data Corruption**: Re-fetch from source
- **Rate Limits**: Exponential backoff

## Future Enhancements

### Additional Data Sources
- **Spotrac API**: Salary data
- **ESPN API**: News and analysis
- **Basketball Reference**: Advanced metrics

### Data Expansion
- **Trade Data**: Historical trades and grades
- **Draft Data**: Draft picks and analysis
- **Advanced Stats**: PER, VORP, BPM, etc.
- **Injury Data**: Player availability
- **Team Data**: Roster changes, coaching

### Performance Optimizations
- **Database**: Move from JSON to SQLite/PostgreSQL
- **CDN**: Cache static data files
- **Compression**: Gzip data files
- **Incremental Updates**: Only update changed data

## Monitoring & Alerts

### Health Checks
- **Data Freshness**: Alert if data > 48 hours old
- **API Status**: Monitor NBA API availability
- **Data Quality**: Validate statistics ranges
- **Update Success**: Track successful updates

### Metrics
- **Update Frequency**: Daily success rate
- **Data Volume**: Number of players/records
- **API Response Time**: Performance monitoring
- **Error Rates**: Failed update attempts

## Security Considerations

### API Access
- **Rate Limiting**: Respect API limits
- **Headers**: Use proper User-Agent
- **Caching**: Reduce API calls
- **Fallbacks**: Handle API failures gracefully

### Data Privacy
- **No PII**: Don't store personal information
- **Public Data**: Only use publicly available stats
- **Compliance**: Follow NBA terms of service

## Troubleshooting

### Common Issues
1. **CORS Errors**: NBA API requires proper headers
2. **Rate Limiting**: Implement exponential backoff
3. **Data Format Changes**: Monitor API response structure
4. **Network Issues**: Retry with backoff strategy

### Debug Commands
```bash
# Test API connectivity
curl -H "User-Agent: Mozilla/5.0..." https://stats.nba.com/stats/leaguedashplayerstats

# Check data freshness
node -e "console.log(require('./src/data/dataSummary.json').lastUpdate)"

# Validate data structure
node scripts/validateData.js
```

## Contributing

### Adding New Data Sources
1. Implement in `nbaDataService.js`
2. Add error handling
3. Update documentation
4. Add tests

### Data Format Changes
1. Update service layer
2. Migrate existing data
3. Update components
4. Test thoroughly 