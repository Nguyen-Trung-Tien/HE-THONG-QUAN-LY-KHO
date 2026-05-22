const db = require("../models");
const fs = require("fs");
const path = require("path");

const checkConnection = async (req, res) => {
  try {
    await db.sequelize.authenticate();
    return res.status(200).json({
      success: true,
      message: "Kết nối cơ sở dữ liệu ổn định",
      database: db.sequelize.config.database,
      dialect: db.sequelize.options.dialect,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi kết nối cơ sở dữ liệu",
      error: error.message,
    });
  }
};

const exportSQL = async (req, res) => {
  try {
    // Basic SQL Export logic using Sequelize
    const tables = await db.sequelize.getQueryInterface().showAllTables();
    let sqlDump = `-- Smart WMS SQL Dump\n-- Date: ${new Date().toISOString()}\n\n`;
    sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    for (const table of tables) {
      if (table === "SequelizeMeta" || table === "SequelizeData") continue;

      // Structure (Very simplified, just for data portability)
      const [results] = await db.sequelize.query(`SELECT * FROM ${table}`);
      
      if (results.length > 0) {
        sqlDump += `-- Dumping data for table ${table}\n`;
        const columns = Object.keys(results[0]).map(c => `\`${c}\``).join(", ");
        
        for (const row of results) {
          const values = Object.values(row).map(v => {
            if (v === null) return "NULL";
            if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
            if (v instanceof Date) return `'${v.toISOString()}'`;
            return v;
          }).join(", ");
          
          sqlDump += `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
        }
        sqlDump += `\n`;
      }
    }

    sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;

    const fileName = `backup_${Date.now()}.sql`;
    const filePath = path.join(__dirname, "../../public", fileName);
    
    fs.writeFileSync(filePath, sqlDump);

    return res.download(filePath, fileName, (err) => {
      if (err) console.error(err);
      // Delete file after download
      setTimeout(() => fs.unlinkSync(filePath), 60000);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi xuất SQL", error: error.message });
  }
};

const createBackup = async (req, res) => {
    try {
        const backupDir = path.join(__dirname, "../../backups");
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const tables = await db.sequelize.getQueryInterface().showAllTables();
        const backupData = {};

        for (const table of tables) {
            const [results] = await db.sequelize.query(`SELECT * FROM ${table}`);
            backupData[table] = results;
        }

        const fileName = `full_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filePath = path.join(backupDir, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

        return res.status(200).json({
            success: true,
            message: "Đã tạo bản sao lưu dữ liệu JSON thành công",
            fileName: fileName,
            size: (fs.statSync(filePath).size / 1024).toFixed(2) + " KB"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Lỗi tạo bản sao lưu" });
    }
}

module.exports = {
  checkConnection,
  exportSQL,
  createBackup
};
