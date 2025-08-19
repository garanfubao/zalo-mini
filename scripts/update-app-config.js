// scripts/update-app-config.js
import fs from "fs";
import path from "path";

const wwwDir = path.resolve("www");
const assetsDir = path.join(wwwDir, "assets");
const configPath = path.resolve("app-config.json");
const wwwConfigPath = path.join(wwwDir, "app-config.json");
const indexHtmlPath = path.join(wwwDir, "index.html");

function updateAppConfig() {
  if (!fs.existsSync(assetsDir)) {
    console.error("❌ Thư mục assets không tồn tại. Hãy build trước (pnpm build).");
    process.exit(1);
  }

  // 1. Liệt kê tất cả file trong assets
  const files = fs.readdirSync(assetsDir);
  console.log("📂 Files in www/assets/:", files);

  // 2. Tìm file index-xxxx.js và index-xxxx.css
  const jsFile = files.find(f => /^index-.*\.js$/.test(f));
  const cssFile = files.find(f => /^index-.*\.css$/.test(f));

  if (!jsFile || !cssFile) {
    console.error("❌ Không tìm thấy file index-xxx.js hoặc index-xxx.css trong assets/");
    process.exit(1);
  }

  // Lấy hash để in log
  const jsHash = jsFile.replace(/^index-(.*)\.js$/, "$1");
  const cssHash = cssFile.replace(/^index-(.*)\.css$/, "$1");

  // 3. Cập nhật app-config.json
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  config.listSyncJS = [`./assets/${jsFile}`];
  config.listCSS = [`./assets/${cssFile}`];

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  fs.writeFileSync(wwwConfigPath, JSON.stringify(config, null, 2));

  // 4. Xoá index.html trong www
  if (fs.existsSync(indexHtmlPath)) {
    fs.unlinkSync(indexHtmlPath);
    console.log("🗑️ Đã xoá www/index.html");
  }

  // 5. Xoá tất cả file .map trong assets
  const mapFiles = files.filter(f => f.endsWith(".map"));
  for (const mf of mapFiles) {
    fs.unlinkSync(path.join(assetsDir, mf));
    console.log("🗑️ Đã xoá:", mf);
  }

  console.log("✅ app-config.json đã được cập nhật & copy sang www/");
  console.log("🔗 listSyncJS:", config.listSyncJS);
  console.log("🎨 listCSS:", config.listCSS);
  console.log("🔑 Current JS hash:", jsHash);
  console.log("🎨 Current CSS hash:", cssHash);
}

updateAppConfig();
