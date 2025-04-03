const NodeCache = require('node-cache');

// Create a new cache instance with default TTL of 1 hour
const cache = new NodeCache({
    stdTTL: 3600, // Time to live in seconds (1 hour)
    checkperiod: 600, // Check for expired keys every 10 minutes
    useClones: false // Disable cloning of cached values for better performance
});

// Cache middleware function
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Create a unique key for this request
        const key = `${req.originalUrl || req.url}`;

        // Try to get the cached response
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            return res.json(cachedResponse);
        }

        // If not cached, override the res.json method to cache the response
        const originalJson = res.json;
        res.json = (body) => {
            cache.set(key, body, duration);
            return originalJson.call(res, body);
        };

        next();
    };
};

// Function to clear cache for a specific key
const clearCache = (key) => {
    cache.del(key);
};

// Function to clear all cache
const clearAllCache = () => {
    cache.flushAll();
};

module.exports = {
    cache,
    cacheMiddleware,
    clearCache,
    clearAllCache
}; 