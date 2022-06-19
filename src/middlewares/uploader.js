const multer = require("multer");

const filenameImage = (req, file, next) => {
    let lastIndexof = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(lastIndexof);
    next(null, `img-${Date.now()}${ext}`);
  };

  const filenameCurriculum = (req, file, next) => {
    let lastIndexof = file.originalname.lastIndexOf(".");
    let ext = file.originalname.substring(lastIndexof);
    next(null, `cv-${Date.now()}${ext}`);
  };
  
  const destination = (req, file, next) => {
    next(null, `${__dirname}/../uploads`);
  };
  
  const postImageDestination = (req, file, next) => {
    next(null, `${__dirname}/../uploads/post-images`);
  };

  const curriculumFileDestination = (req, file, next) => {
    next(null, `${__dirname}/../uploads/curriculums`);
  };

  const uploadPostImage = multer({
    storage: multer.diskStorage({ destination: postImageDestination, filename: filenameImage }),
  });

  const uploadCurriculum = multer({
    storage: multer.diskStorage({ destination: curriculumFileDestination, filename: filenameCurriculum }),
  });

  const upload = multer({
    storage: multer.diskStorage({ destination, filename: filenameImage }),
  });

module.exports = {
  upload: upload,
  uploadPostImage: uploadPostImage,
  uploadCurriculum: uploadCurriculum
};