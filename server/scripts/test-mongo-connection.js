const { MongoClient } = require('mongodb');

async function testMongoConnection() {
  try {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    console.log('Connected to MongoDB successfully!');
    
    const db = client.db('DMS');
    const collections = await db.listCollections().toArray();
    
    console.log(`Found ${collections.length} collections`);
    
    if (collections.length > 0) {
      console.log('Collections:', collections.map(c => c.name).join(', '));
      
      // Sample some data from the first collection
      const firstCollection = collections[0].name;
      const sampleDocs = await db.collection(firstCollection)
        .find({})
        .limit(3)
        .toArray();
      
      console.log(`Sample from ${firstCollection} (${sampleDocs.length} documents):`);
      console.log(JSON.stringify(sampleDocs, null, 2));
    } else {
      console.log('No collections found in the database');
    }
    
    await client.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('MongoDB connection error:');
    console.error(err);
  }
}

testMongoConnection(); 