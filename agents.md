

# 📄 agents.md: PayPerCase WebApp Development Plan (Vue.js Edition)

## 🎨 UI & Theme Specification (PayPerCase Violet & Peach Palette)
การออกแบบใช้ **Tailwind CSS** ร่วมกับ **Vue 3 (Composition API)** และยึด design token
ชุดเดียวกับโปรแกรม **PayPerCase** (Desktop) เพื่อให้ทั้งสองโปรแกรมดูเป็นผลิตภัณฑ์เดียวกัน:
* **Main Background:** `#F7F5FC` (Violet Mist) - พื้นหลังหลัก
* **Surface / Cards:** `#FFFFFF` - พื้นหลังตารางและส่วนกรอกข้อมูล
* **Primary Action:** `#4C1D95` (PayPerCase Violet) - ปุ่มหลัก (Import/Export/Login)
* **Primary Soft:** `#EDE9FE` / `#F5F1FF` - พื้นหลังรอง, hover state, nav pill
* **Accent:** `#FFAB91` (Peach) - ไฮไลต์, งานส่งออก, จุดที่ต้องระวัง
* **Primary Text:** `#1F1633` (Deep Berry) - ตัวอักษรหลัก
* **Font:** `Inter` + `IBM Plex Sans Thai` (fallback Tahoma) - ขนาดฐาน 13px
* **Shape:** ปุ่มเป็น pill (`9999px`), การ์ดมุมโค้ง 16px, เงานุ่มโทนม่วง
* **Icons / Brand:** ใช้ `public/app-icon.svg` เดียวกับโปรแกรม Desktop

---

## 🤖 Agent Roles & Responsibilities

### 1. Auth & Guard Agent (The Gatekeeper)
* **Framework:** Vue Router + Pinia (State Management)
* **Responsibility:**
    * สร้างหน้า **Login View** โดยตรวจสอบรหัสผ่านจาก `app_settings` (คอลัมน์ `setting_value`) ใน Supabase
    * ใช้ **Navigation Guards** (`router.beforeEach`) เพื่อป้องกันการเข้าถึงหน้าจัดการข้อมูลหากไม่ได้ Login
    * จัดการ Session ล็อกอินให้คงอยู่ตลอดการใช้งานใน Browser tab นั้น

### 2. CSV & Ingestion Agent (The Translator)
* **Framework:** `PapaParse` + Vue 3 Ref API
* **Responsibility:**
    * จัดการระบบ **Drag & Drop** ไฟล์ CSV ที่ส่งออกมาจากโปรแกรม **PayPerCase** (Desktop)
    * **Data Cleaning:** ตรวจสอบว่าในไฟล์ไม่มีเคสที่ "ไม่ได้รับเงิน" (0 บาท) หลุดเข้ามา
    * แสดงหน้า **Preview Table** ก่อนกดยืนยัน เพื่อให้พนักงานรีเช็ค HN และยอดเงิน 20/125

### 3. Database & Sync Agent (The Archivist)
* **Framework:** `@supabase/supabase-js`
* **Responsibility:**
    * จัดการระบบ **Upsert** เข้าตาราง `patient_Record` โดยใช้ `onConflict: 'visit_date, hn'` เพื่อบันทึกทับข้อมูลเก่าทันที
    * จัดการ Query ข้อมูลมาแสดงผลในหน้าตาราง (List View)
    * จัดการฟังก์ชัน **Delete** (ลบแถวที่เลือก) เมื่อพนักงานต้องการยกเลิกเคสในระบบ

### 4. Report & Export Agent (The Auditor)
* **Framework:** `xlsx` (SheetJS) หรือ `csv-export`
* **Responsibility:**
    * **Monthly Summary:** ประมวลผล Pivot ข้อมูลสรุปยอดเงินปันผลแยกตามรายชื่อ `therapist`
    * **Full Data Export:** ฟังก์ชันส่งออกข้อมูลดิบทั้งหมด (Raw Data) ทุก Column จาก Supabase ออกมาเป็นไฟล์ Excel
    * รองรับการกรองช่วงวันที่ (Date Range) ก่อนทำการส่งออก

### 5. Frontend Architect Agent (The Layout Master)
* **Framework:** Vue 3 + Tailwind CSS
* **Responsibility:**
    * สร้าง **Main Layout** แบบ **Top Bar** (brand + nav pill + user chip) ให้ตรงกับ `AppMenuBar` ของโปรแกรม Desktop และมี **Content Area** พื้นหลังม่วงอ่อนพร้อม gradient นุ่ม ๆ
    * คุม Font ทั้งระบบเป็น **Inter + IBM Plex Sans Thai** ขนาด 13px และสีตัวอักษรเป็น **Deep Berry** เพื่อให้อ่านง่าย
    * ใช้ชุดคลาสกลางใน `src/style.css` (`btn`, `card`, `data-table`, `field-input`, `modal`) เพื่อให้ UI สอดคล้องกันทุกหน้า
    * จัดการหน้าจอให้เป็น **Responsive Design** รองรับทั้งจอคอมพิวเตอร์, Tablet และมือถือ

---

## 🏗️ Database Schema: `patient_Record` (Supabase)
```sql
create table patient_record (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  visit_date date not null,
  hn text not null,
  cid text(13),
  first_name text,
  last_name text,
  gender text,
  age int,
  rights text,
  symptoms text,
  procedure text,
  therapist text,
  total_revenue numeric,
  payout_amount numeric,
  -- Composite Unique Key สำหรับการ Upsert (บันทึกทับ)
  unique(visit_date, hn)
);
```

---

## 🔄 Workflow Summary
1.  **Login:** พนักงานเข้าสู่ระบบผ่านรหัสใน `app_settings`
2.  **Import:** ลากไฟล์ CSV จากโปรแกรม **PayPerCase** มาวาง -> ตรวจสอบหน้าจอ Preview -> กดบันทึก (Upsert)
3.  **Manage:** ดูประวัติการรักษาในหน้าตาราง, ค้นหาด้วย HN/CID, หรือลบข้อมูลที่ผิดพลาด
4.  **Export:** สิ้นเดือนกดปุ่ม **Export** เพื่อดึงข้อมูลทั้งหมดไปคำนวณเงินหรือสำรองข้อมูล

---
