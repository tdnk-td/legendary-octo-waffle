# Warframe Standing Exchange

A web application that helps Warframe players make informed decisions about syndicate arcane purchases by displaying real-time market prices and comparisons.

## Features

- Real-time price tracking from warframe.market
- Organized display of arcanes by syndicate
- Collapsible syndicate sections for better organization
- Visual price indicators (high/medium/low) for quick comparison
- Displays individual prices and averages for rank 5 arcanes
- Shows prices from active in-game sellers only
- Automatic image fetching for arcanes

## Supported Syndicates

- The Quills
- Cavia
- The Holdfasts
- The Hex
- Cephalon Simaris

## Technical Details

- Uses warframe.market API for real-time price data
- Implements CORS proxy for API access
- Responsive design with dynamic price highlighting
- Automatic price updates (commented functionality available)

## Usage

Simply open the `index.html` file in a web browser. The application will automatically:
1. Fetch current market data for all supported arcanes
2. Display prices from active sellers
3. Calculate and show average prices
4. Highlight the best value arcanes

## Screenshots
![Arcane List Overview](https://github.com/tdnk-td/legendary-octo-waffle/blob/main/images/arcane.png)

## Development

To modify the supported arcanes, edit the `syndicateArcanes` object in `script.js`. The application uses vanilla JavaScript and doesn't require any build process or dependencies.

## API Integration

The application integrates with:
- warframe.market API v1
- Uses corsproxy.io for CORS handling

## Notes

- Prices are filtered to show only rank 5 arcanes from in-game sellers
- Top 4 lowest prices are displayed for each arcane
- Images fallback to a default if unavailable from the API
