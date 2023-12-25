// import {v2 as cloudinary} from 'cloudinary';
          
const cloudinary = require('cloudinary').v2;


cloudinary.config({ 
  cloud_name: 'dyzlgrzos', 
  api_key: '568186373356526', 
  api_secret: 'vij3EYXmuuLPB-rNmc1xHPiDgQI' 
});

module.exports = cloudinary;