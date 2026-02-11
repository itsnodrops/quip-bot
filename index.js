import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHS = {
    log: path.join(__dirname, 'logs', 'process.log'),
    data: path.join(__dirname, 'data', 'data.json'),
    env: path.join(__dirname, '.env'),
    proxies: path.join(__dirname, 'proxies.txt'),
};

// Ensure essential directories exist
['logs', 'data'].forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

async function clearLog() {
    if (fs.existsSync(PATHS.log)) {
        fs.writeFileSync(PATHS.log, '');
        console.log('Log file cleared.');
    } else {
        console.log('Log file does not exist.');
    }
}

async function clearData() {
    fs.writeFileSync(PATHS.data, '{}');
    console.log('Data file reset to {}.');
}

async function watchLog() {
    if (!fs.existsSync(PATHS.log)) {
        console.log('No log file found to watch.');
        return;
    }
    console.log(`Watching ${PATHS.log}... (Press Ctrl+C to stop)`);
    const { spawn } = await import('child_process');
    spawn('tail', ['-f', PATHS.log], { stdio: 'inherit' });
}

async function checkConfig() {
    console.log('--- Configuration Check ---');
    if (!fs.existsSync(PATHS.env)) {
        const exampleEnv = path.join(__dirname, '.env.example');
        if (fs.existsSync(exampleEnv)) {
            fs.copyFileSync(exampleEnv, PATHS.env);
            console.log('[OK] Created .env from .env.example');
        } else {
            console.log('[FAIL] .env missing and .env.example not found');
        }
    } else {
        console.log('[OK] .env exists');
    }
    if (!fs.existsSync(PATHS.proxies)) {
        fs.writeFileSync(PATHS.proxies, '');
        console.log('[OK] Created empty proxies.txt');
    } else {
        console.log('[OK] proxies.txt exists');
    }
    if (!fs.existsSync(PATHS.data)) {
        fs.writeFileSync(PATHS.data, '{}');
        console.log('[OK] Created empty data.json');
    } else {
        console.log('[OK] data.json exists');
    }
}

async function showAccounts() {
    if (!fs.existsSync(PATHS.data)) {
        console.log('No data file found.');
        return;
    }
    try {
        const content = fs.readFileSync(PATHS.data, 'utf8');
        const data = JSON.parse(content || '{}');
        const entries = Object.entries(data);
        if (entries.length === 0) {
            console.log('No accounts found in data.json');
            return;
        }
        const table = entries.map(([wallet, info]) => {
            const addr = wallet.length > 13
                ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
                : wallet;
            return {
                Address: addr,
                Points: info.points || 0,
                Registered: info.registered ? 'Yes' : 'No',
                LastCheckin: info.lastDailyCheckin || 'Never'
            };
        });
        console.table(table);
    } catch (error) {
        console.error('Error reading data.json:', error.message);
    }
}

async function runBot() {
    process.env.ETHERS_NO_LOGGING = '1';
    process.env.ETHERS_NO_RPC_DETECTION = '1';
    try {
        const { run } = await import('./src/app.js');
        if (typeof run === 'function') {
            await run();
        } else {
            console.error('Error: src/app.js does not export a "run" function.');
        }
    } catch (error) {
        console.error('Failed to run bot:', error.message);
    }
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case '--clear-log': await clearLog(); break;
    case '--clear-data': await clearData(); break;
    case '--check-log': await watchLog(); break;
    case '--check-config': await checkConfig(); break;
    case '--check-data': await showAccounts(); break;
    default: runBot().catch(console.error);
}
