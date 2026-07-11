import { v2 as cloudinary } from 'cloudinary';

if (
  !process.env.CLOUDINARY_URL &&
  !(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
) {
  console.warn('Cloudinary is not configured — set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET) in .env');
}

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export default cloudinary;
