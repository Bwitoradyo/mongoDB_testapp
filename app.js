const MongoClient = require("mongodb").MongoClient;

const dbhost = "mongodb://localhost:27017/testing",
    myCollection = "chapter2";



const seedData = (db, callback) => {
    db.collection(myCollection).find({}, {}, {})
        .toArray(
          (err, docs) => {
                if (docs.length <= 0) {
                    console.log('No data. Seeding...');

                    // count each record as its inserted
                    const ihandler = (err, recs) => {
                        if (err) throw err;
                        inserted++;
                    }

                    const toinsert = 2,
                        inserted = 0;

                    // perform a MongoDB insert for each record
                    db.collection(myCollection).insert({
                        'Title': 'Snow Crash',
                        'Author': 'Neal Stephenson'
                    }, ihandler);
                    db.collection(myCollection).insert({
                        'Title': 'Neuromancer',
                        'Author': 'William Gibson'
                    }, ihandler);

                    // wait for the 2 records above to be finished // inserting
                    const sync = setInterval(() => {
                        if(inserted === toinsert) {
                            clearInterval(sync);
                            callback(db);
                        }
                    }, 50);
                    return;
                }
                callback(db);
                return;
            }
        );
}

const showDocs = (db) => {
    console.log("Listing books:");
    const options = {
        sort: [['Title',1]]
    };

    // find and return an array of all records in the collection
    db.collection(myCollection).find({}, {}, options)
        .toArray(
          (err, docs) => {
          if (err) throw err;

          // for each item in the collection, print the title and author
          for(var d = 0; d < docs.length; d++) {
          console.log(docs[d].Title + '; ' + docs[d].Author);
          }

          db.close();
          }
    );
}

MongoClient.connect(dbhost, (err, db) => {
  if(err) throw err;

  //once connected, execute the seedData function to start the app
  seedData(db, showDocs);
});




































