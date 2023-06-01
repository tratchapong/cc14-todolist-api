const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.upload = async (filePath, publicId) => {
  const option = {
    unique_filename: false,
    use_filename: true,
    overwrite: true
  };

  if (publicId) {
    option.public_id = publicId;
  }

  const result = await cloudinary.uploader.upload(filePath, option);
  // return result;
  return result.secure_url;
};

exports.getPublicId = url => {
  const splitSlash = url.split('/');
  return splitSlash[splitSlash.length - 1].split('.')[0];
};