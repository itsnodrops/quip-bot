export default {
    // Enable debug mode - logs full request/response payloads to logs/process.log
    DEBUG: false,

    // Base URLs
    BASE_URL: 'https://quest.quip.network',

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
