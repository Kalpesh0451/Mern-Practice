
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");

// Upload directory
const uploadDirectory = path.join(
    __dirname,
    "../uploads/students"
);

// Create directory automatically
fs.mkdirSync(uploadDirectory, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        cb(null, `${randomUUID()}${extension}`);
    },
});

// File validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (
        allowedTypes.includes(file.mimetype) &&
        allowedExtensions.includes(extension)
    ) {
        return cb(null, true);
    }

    cb(
        new Error(
            "Only JPG, JPEG, PNG and WebP images are allowed"
        )
    );
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
    },
});

module.exports = upload;
