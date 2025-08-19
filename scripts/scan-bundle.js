// scripts/scan-bundle.js
import fs from "fs";
import path from "path";

const wwwDir = path.resolve("www/assets");

// lấy file JS trong assets
const files = fs.readdirSync(wwwDir).filter(f => f.endsWith(".js"));

for (const file of files) {
  const filePath = path.join(wwwDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  console.log(`\n🔍 Đang kiểm tra file: ${file}`);

  // tìm tất cả đoạn code có "te"
  const regex = /\bte\b/g;
  let match;
  let count = 0;

  while ((match = regex.exec(content)) !== null) {
    count++;
    // lấy 50 ký tự quanh từ "te"
    const snippet = content.substring(
      Math.max(0, match.index - 50),
      Math.min(content.length, match.index + 50)
    );
    console.log(`👉 [${count}] Gặp "te" tại index ${match.index}: ...${snippet}...`);
  }

  if (count === 0) {
    console.log("✅ Không thấy 'te' trong file này.");
  } else {
    console.log(`⚠️ Tổng cộng ${count} lần 'te' trong ${file}`);
  }
}
