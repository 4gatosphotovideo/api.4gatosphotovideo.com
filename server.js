'use strict';

const express = require('express');
const {Datastore} = require('@google-cloud/datastore');


const app = express();
app.use(express.json());
app.enable('trust proxy');
const datastore = new Datastore();
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


const getImages = () => {
  const query = datastore.createQuery('images');
  return datastore.runQuery(query);
};


app.get('/images', async (req, res, next) => {
  try {
    const [entities] = await getImages();
    const images = entities.map(
      entity => `tags: ${entity.tags}, url: ${entity.url}`
    );
    res
      .status(200)
      .json(entities);
  } catch (error) {
    next(error);
  }
  
});
