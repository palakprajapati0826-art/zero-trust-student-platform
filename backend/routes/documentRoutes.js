const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Document = require("../models/Document");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* ================================
   UPLOAD FOLDER
================================ */

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ================================
   ALLOWED FILE TYPES
================================ */

const allowedTypes = {
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

/* ================================
   MULTER STORAGE
================================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const randomName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      extension;

    cb(null, randomName);
  },
});

/* ================================
   FILE VALIDATION
================================ */

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const expectedMimeType = allowedTypes[extension];

  if (!expectedMimeType) {
    return cb(
      new Error(
        "Invalid file type. Allowed formats: PDF, TXT, DOC, DOCX, XLS, XLSX, PPT and PPTX."
      )
    );
  }

  if (file.mimetype !== expectedMimeType) {
    return cb(
      new Error("File type and file extension do not match.")
    );
  }

  cb(null, true);
};

/* ================================
   MULTER CONFIGURATION
================================ */

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/* ================================
   TEST ROUTE
================================ */

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Document routes are working",
  });
});

/* ================================
   GET MY DOCUMENTS
================================ */

router.get("/", protect, async (req, res) => {
  try {
    const documents = await Document.find({
      student: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents: documents.map((document) => ({
        id: document._id,
        originalName: document.originalName,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        createdAt: document.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get documents error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve documents",
    });
  }
});

/* ================================
   DOWNLOAD DOCUMENT
================================ */

router.get("/:id/download", protect, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      student: req.user.userId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or access denied",
      });
    }

    const filePath = path.resolve(document.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Document file not found on server",
      });
    }

    res.download(filePath, document.originalName);
  } catch (error) {
    console.error("Download error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to download document",
    });
  }
});

/* ================================
   UPLOAD DOCUMENT
================================ */

router.post(
  "/upload",
  protect,
  upload.single("document"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid document",
        });
      }

      const document = await Document.create({
        student: req.user.userId,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      });

      res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        document: {
          id: document._id,
          originalName: document.originalName,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          createdAt: document.createdAt,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);

      // Delete uploaded file if database save fails
      if (req.file && req.file.path) {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (deleteError) {
          console.error(
            "Unable to delete uploaded file:",
            deleteError.message
          );
        }
      }

      res.status(500).json({
        success: false,
        message: "Unable to save uploaded document",
      });
    }
  }
);

/* ================================
   MULTER ERROR HANDLER
================================ */

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must be less than or equal to 5 MB.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }

  next();
});

module.exports = router;