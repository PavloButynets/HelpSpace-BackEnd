import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";
import {awsCredentials} from "../config/envConfig";


const s3Client = new S3Client({
  region: awsCredentials.region ,
  credentials: {
    accessKeyId: awsCredentials.accessKeyId ,
    secretAccessKey: awsCredentials.secretAccessKey,
  },
});


const generateUniqueName = (originalName: string) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
};

const eventStorage = multerS3({
  s3: s3Client,
  bucket: awsCredentials.bucketName,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueName = generateUniqueName(file.originalname);
    const filePath = `events/${uniqueName}`;
    cb(null, filePath);
  },
});

const profileStorage = multerS3({
  s3: s3Client,
  bucket: awsCredentials.bucketName,
  acl: "public-read",
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueName = generateUniqueName(file.originalname);
    const filePath = `profiles/${uniqueName}`;
    cb(null, filePath);
  },
});

const eventUpload = multer({
  storage: eventStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимий тип файлу. Дозволені типи: JPEG, PNG, JPG, WEBP'));
    }
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимий тип файлу. Дозволені типи: JPEG, PNG, JPG, WEBP'));
    }
  }
});

export { eventUpload, profileUpload, s3Client };