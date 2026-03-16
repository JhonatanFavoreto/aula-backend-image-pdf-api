import sharp from 'sharp';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = './uploads';

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `aluno_${req.params.id}_${Date.now()}${ext}`);
    }
})

export const upload = multer({ storage });

export async function processImage(filePath) {
    const process = sharp(fs.readFileSync(filePath))
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

    fs.writeFileSync(filePath, await process);
    return filePath.replace(/\\/g, '/');
}
export function deleteImage(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
