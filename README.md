# Backend Skill Checkpoint - Express Server

โปรเจกต์นี้เป็นระบบ Backend พื้นฐานด้วย **Express.js** + **PostgreSQL** พร้อมระบบโหวตคำถาม/คำตอบ, เอกสาร API ด้วย **Swagger**, และ Deploy ขึ้น **Vercel** เพื่อใช้งานได้บน Cloud

---

## ฟีเจอร์หลัก

- **Questions API**
  - สร้าง, อ่าน, แก้ไข, และลบคำถาม
  - ค้นหาคำถามตามหัวข้อและหมวดหมู่
- **Answers API**
  - เพิ่มคำตอบให้คำถาม
  - อ่านคำตอบของแต่ละคำถาม
  - ลบคำตอบทั้งหมดของคำถาม
- **Vote API**
  - โหวตเห็นด้วย / ไม่เห็นด้วยกับคำถามหรือคำตอบ
  - แสดงผลรวมคะแนนโหวต (+ / -)
- **Swagger Documentation**
  - เอกสาร API พร้อมตัวอย่าง Request/Response  
  - ใช้งานผ่าน `/docs` บนเว็บ
- **Deploy บน Vercel**
  - Serverless Function ผ่าน `api/index.mjs`
  - รองรับ Environment Variables (`DATABASE_URL`, `API_URL`)

---

## โครงสร้างโปรเจกต์

project/
├─ api/
│ └─ index.mjs # Vercel serverless entrypoint
├─ app.mjs # Express app หลัก (export default app)
├─ app/
│ ├─ questionRouter.mjs # Routes สำหรับคำถาม
│ ├─ answerRouter.mjs # Routes สำหรับคำตอบ
│ ├─ voteRouter.mjs # Routes สำหรับโหวต
│ ├─ scoreRouter.mjs # Routes สำหรับคะแนนรวม
│ └─ swagger.mjs # ตั้งค่า Swagger UI และ JSDoc
├─ utils/
│ └─ db.mjs # PostgreSQL Connection Pool
├─ vercel.json # ตั้งค่า Vercel Routing
├─ package.json
└─ README.md
