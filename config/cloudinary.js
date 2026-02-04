const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: './.env' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME || 'djrnozthb',
    api_key: process.env.CLOUDINARY_API_KEY || '442491965997121',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'Un_uuSC9OgXQkY9HOF_cqeMgoMI'
});

module.exports = cloudinary;
