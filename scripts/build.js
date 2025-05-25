const fs = require("fs-extra");
const path = require("path");

const srcDir = path.join(__dirname, "../frontend/dist");
const destDir = path.join(__dirname, "../extension");

try {
    if (!fs.existsSync(srcDir)) {
        throw new Error(`Source directory not found: ${srcDir}`);
    }

    fs.copySync(srcDir, destDir);
    console.log("Frontend build copied to extension folder successfully");
} catch (error) {
    console.error("Build copy failed:", error.message);
    process.exit(1);
}