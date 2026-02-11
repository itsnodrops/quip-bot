# Quip Network Bot

Automated daily check-in bot for [Quip Network Airdrop](https://quest.quip.network/airdrop?referral_code=VU9Q3IBM) with support for multi-account, proxy rotation, and concurrent processing.

> **WARNING** \
> **Code Obfuscation Notice**: This script will be obfuscated to prevent unauthorized code redistribution. The full source code will be shared publicly after the event ends.

## Features

- **Wallet Authentication** - SIWE (Sign-In with Ethereum) login with automatic session management
- **Daily Check-in** - Automated daily quest completion for points
- **Multi-Account** - Process multiple accounts concurrently
- **Pool-Based Concurrency** - Proxies immediately reassigned when idle for max efficiency
- **Proxy Support** - HTTP, HTTPS, SOCKS4, and SOCKS5 proxies with rotation
- **TUI Dashboard** - Real-time monitoring of all account activities
- **Smart Delays** - Random delays between accounts to avoid rate limiting
- **Loop Mode** - Schedule automatic reruns at specified intervals
- **Points Tracking** - Persistent points tracking across restarts
- **Dynamic Fingerprinting** - Client hints auto-generated from each account's user agent

## Requirements

- **[Quip Network Airdrop](https://quest.quip.network/airdrop?referral_code=VU9Q3IBM)** accounts
- **Node.js** v18 or higher
- **npm** (Node Package Manager)
- **Private Keys** - Ethereum wallet private keys
- **Proxies** (Optional but recommended for multiple accounts)

## Quick Start

### 1. Clone or Download the Repository

```bash
git clone https://github.com/itsnodrops/quip-bot.git
cd quip-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Accounts

Create a `.env` file with your private keys:

```env
# Private Keys (numbered format)
PK_1=your_private_key_1
PK_2=your_private_key_2
PK_3=your_private_key_3
```

### 4. Add Proxies (Optional)

Edit `proxies.txt` to add your proxies (one per line):

```
http://user:pass@proxy1.com:8080
socks5://user:pass@proxy2.com:1080
socks4://proxy3.com:1080
```

**Supported formats:**
- HTTP: `http://user:pass@host:port` or `http://host:port`
- HTTPS: `https://user:pass@host:port` or `https://host:port`
- SOCKS5: `socks5://user:pass@host:port` or `socks5://host:port`
- SOCKS4: `socks4://user:pass@host:port` or `socks4://host:port`

### 5. Run the Bot

```bash
npm start
```

## How It Works

### Processing Flow

1. **Registration** - Visits airdrop page with referral code for new accounts
2. **Authentication** - SIWE message signing + NextAuth cookie-based login
3. **Daily Check-in** - Completes the daily quest and waits for server confirmation
4. **Points** - Fetches and saves current points balance
5. **Loop** - Waits until next scheduled run (if enabled)

### Pool-Based Concurrency

The bot uses a **proxy pool** for maximum efficiency:
- **10 proxies, 50 accounts** -> 10 accounts run concurrently
- When one account finishes, its proxy is **immediately** reassigned
- Random delays between account completions

## Configuration

Edit `config.js` to customize bot behavior:

```javascript
export default {
    // Enable debug mode - logs full request/response to logs/process.log
    DEBUG: false,

    // Delays (milliseconds)
    DELAYS: {
        BETWEEN_ACCOUNTS_MS: 15000,
        BETWEEN_TASKS_MS: 5000,
        BETWEEN_OPERATIONS_MS: 3000,
    },

    // Loop mode
    ENABLE_LOOP: false,
    LOOP_TIME: '24:00:00', // HH:MM:SS format
};
```

## Data Storage

| Path | Purpose |
|------|---------|
| `.env` / `pk.txt` | Private keys |
| `proxies.txt` | Proxy list |
| `config.js` | Bot configuration |
| `logs/process.log` | Activity logs |
| `data/data.json` | Account data, points, user agents (gitignored) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No accounts loaded | Check `.env` for `PK_1`, `PK_2`, etc. or create `pk.txt` |
| Proxy connection failed | Verify proxy format includes protocol (`http://`, `socks5://`, etc.) |
| Login 401 error | Enable `DEBUG: true` in config.js and check `logs/process.log` |
| Already checked in | Bot skips if daily check-in was already completed today |
| All proxies blocked | Add more proxies or wait for cooldown |

## Utility Scripts

Manage bot data and logs easily with these npm scripts:

```bash
npm start              # Run the bot
npm run clear-log      # Clear log file
npm run clear-data     # Reset account data
npm run check-config   # Check configuration status
npm run check-data     # Show accounts summary table
npm run check-log      # Watch log file in real-time
```

## Notes

- **Daily Check-in**: Resets every 24 hours
- **Social Tasks**: Follow X, Join Discord, Join Telegram, and Engage with Trailer Video must be completed manually in the browser
- **Concurrency**: Based on proxy count (1 account at a time without proxies)
- **User Agents**: Randomly generated per account and persisted across restarts
- **Client Hints**: `sec-ch-ua`, `sec-ch-ua-mobile`, and `sec-ch-ua-platform` headers are dynamically derived from each account's user agent
- **Data Persistence**: Account data stored locally, never shared or uploaded

## Contribution

Feel free to open pull requests, report bugs, or suggest features. Contributions are always welcome!

## Disclaimer

This tool is for educational and testing purposes only on the [Quip Network Airdrop](https://quest.quip.network/airdrop?referral_code=VU9Q3IBM). Use at your own risk. The authors are not responsible for any consequences resulting from the use of this software.

## License

This project is licensed under the [MIT License](https://github.com/itsnodrops/quip-bot/blob/main/LICENSE).
