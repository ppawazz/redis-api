const { getDataFromDB, createDataInDB, deleteAllDataFromDB, countDataFromDB } = require('../services/dbService');
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

async function createData(req, res) {
    try {
        const count = parseInt(req.params.count) || 10; 
        
        if (count <= 0 || count > 5000) {
            return res.status(400).json({ message: 'Count must be between 1 and 5000' });
        }
        
        const createdData = await createDataInDB(count);

        await setCache('all-data', ''); 
        
        res.status(201).json({
            message: `Successfully created ${count} new products`,
            count: createdData.length,
            data: createdData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteAllData(req, res) {
    try {
        const result = await deleteAllDataFromDB();

        await setCache('all-data', '');

        res.json({
            message: 'All products have been deleted',
            count: result.rowCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function countData(req, res) {
    try {
        const count = await countDataFromDB();
        res.json({
            message: 'Products count retrieved successfully',
            count: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { getData, createData, deleteAllData, countData };