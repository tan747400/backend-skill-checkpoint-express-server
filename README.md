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

## ⚙️ การติดตั้งและรันในเครื่อง (Local)

1. Clone โปรเจกต์  
   ```bash
   git clone git@github.com:tan747400/backend-skill-checkpoint-express-server.git
   cd <repo-name>

2. ติดตั้ง dependencies

npm install


3. สร้างไฟล์ .env สำหรับ Local

DATABASE_URL=postgresql://postgres:16050@localhost:5432/quora
API_URL=http://localhost:4000


4. รันเซิร์ฟเวอร์

npm run start 

5. เปิดในเบราว์เซอร์(เพื่อทดสอบ ยิงAPIโดยใช้ POSTMAN)

http://localhost:4000/test


🌐 Deploy บน Vercel

Push โค้ดขึ้น GitHub

สร้าง New Project บน Vercel

ตั้งค่า Environment Variables:

DATABASE_URL → PostgreSQL connection string

API_URL → URL ของโปรเจกต์บน Vercel

กด Deploy

📌 Endpoint หลัก
Method	Endpoint	คำอธิบาย
GET	/questions	แสดงคำถามทั้งหมด
POST	/questions	สร้างคำถามใหม่
GET	/questions/:questionId	แสดงคำถามตาม ID
PUT	/questions/:questionId	แก้ไขคำถามตาม ID
DELETE	/questions/:questionId	ลบคำถามตาม ID
GET	/questions/:questionId/answers	แสดงคำตอบของคำถาม
POST	/questions/:questionId/answers	เพิ่มคำตอบให้คำถาม
DELETE	/questions/:questionId/answers	ลบคำตอบทั้งหมดของคำถาม
POST	/questions/:questionId/vote	โหวตเห็นด้วย/ไม่เห็นด้วยคำถาม
GET	/questions/:questionId/score	แสดงคะแนนรวมของคำถาม
POST	/answers/:answerId/vote	โหวตเห็นด้วย/ไม่เห็นด้วยคำตอบ
GET	/answers/:answerId/score	แสดงคะแนนรวมของคำตอบ
📝 Swagger Docs

เปิดใช้งานได้ที่

http://localhost:4000/docs
https://<your-vercel-project>.vercel.app/docs

📦 เทคโนโลยีที่ใช้

Backend: Express.js

Database: PostgreSQL

Documentation: Swagger (swagger-ui-express + swagger-jsdoc)

Deployment: Vercel Serverless

👨‍💻 ผู้พัฒนา

ชื่อ: Tan

GitHub: https://github.com/tan747400

Email: thanisorn.sir@gmail.com