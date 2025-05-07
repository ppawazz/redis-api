const { getDataFromDB } = require('../services/dbService');
const { getCache, setCache } = require('../services/cacheService');

async function getData(req, res) {
  try {
    const cacheKey = 'all-data';
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('Cache hit');
      return res.json(JSON.parse(cached));
    }
    console.log('Cache miss');
    const data = await getDataFromDB();
    await setCache(cacheKey, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    console.error('Error in Redis API getData:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
module.exports = { getData };