class ConfigError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'ConfigError';
        this.code = code;
    }
}

module.exports = ConfigError;
