const { getDataFromDB } = require('../services/dbService');
const { getCache, setCache } = require('../services/cacheService');

async function getData(req, res) {
    try {
        const cacheKey = 'all-data';
        const cachedData = await getCache(cacheKey);

    if (cachedData) {
        console.log('Cache hit');
        return res.json(JSON.parse(cachedData));
    }

        console.log('Cache miss');
        const data = await getDataFromDB();
        await setCache(cacheKey, JSON.stringify(data));
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getData };
