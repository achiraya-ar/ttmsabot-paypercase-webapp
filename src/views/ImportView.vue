<template>
    <div class="page">
        <div class="page-head">
            <div class="page-head__main">
                <span class="page-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </span>
                <div>
                    <h1 class="page-title">นำเข้าข้อมูล</h1>
                    <p class="page-sub">
                        อัปโหลดไฟล์ CSV จากโปรแกรม PayPerCase
                        แล้วตรวจสอบก่อนบันทึกเข้าสู่ระบบ
                    </p>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════
             STEP 1 — Upload zone
        ══════════════════════════════════════════════════════ -->
        <template v-if="step === 'upload'">
            <div
                class="dropzone"
                :class="{ 'is-dragging': isDragging }"
                role="button"
                tabindex="0"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="fileInputEl?.click()"
                @keydown.enter.prevent="fileInputEl?.click()"
                @keydown.space.prevent="fileInputEl?.click()"
            >
                <span class="dropzone__icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.7"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </span>

                <p class="dropzone__title">
                    {{
                        isDragging
                            ? "ปล่อยไฟล์ได้เลย!"
                            : "ลากไฟล์ CSV มาวางที่นี่"
                    }}
                </p>
                <p class="dropzone__hint">หรือคลิกเพื่อเลือกไฟล์จากเครื่อง</p>

                <span class="chip chip--soft dropzone__chip">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                               a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    รองรับเฉพาะไฟล์ .csv
                </span>

                <input
                    ref="fileInputEl"
                    type="file"
                    accept=".csv"
                    class="hidden"
                    @change="handleFileSelect"
                />
            </div>

            <div class="info-grid">
                <div
                    v-for="info in infoCards"
                    :key="info.title"
                    class="info-card"
                >
                    <span class="info-card__icon" v-html="info.icon" />
                    <div>
                        <p class="info-card__title">{{ info.title }}</p>
                        <p class="info-card__desc">{{ info.desc }}</p>
                    </div>
                </div>
            </div>
        </template>

        <!-- ══════════════════════════════════════════════════════
             STEP 2 — Preview
        ══════════════════════════════════════════════════════ -->
        <template v-if="step === 'preview'">
            <div class="card preview-card">
                <div class="file-row">
                    <span class="file-row__icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                                   a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </span>
                    <div class="file-row__info">
                        <p class="file-row__name">{{ fileName }}</p>
                        <p class="file-row__meta">
                            ทั้งหมด {{ totalRowsInFile }} แถว (รวมแถวที่กรองออก)
                        </p>
                    </div>
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm file-row__action"
                        @click="resetImport"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        เปลี่ยนไฟล์
                    </button>
                </div>

                <div class="stat-grid">
                    <div class="stat stat--success">
                        <p class="stat__value">{{ importRows.length }}</p>
                        <p class="stat__label">แถวที่นำเข้าได้</p>
                    </div>
                    <div class="stat stat--warning">
                        <p class="stat__value">{{ filteredCount }}</p>
                        <p class="stat__label">กรองออก (ยอด ≤ 0)</p>
                    </div>
                    <div
                        class="stat stat--primary"
                        :class="{ 'is-warning': missingColumns.length }"
                    >
                        <p class="stat__value">
                            {{
                                missingColumns.length
                                    ? missingColumns.length
                                    : "✓"
                            }}
                        </p>
                        <p class="stat__label">
                            {{
                                missingColumns.length
                                    ? "คอลัมน์ขาด"
                                    : "คอลัมน์ครบ"
                            }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="missingColumns.length"
                    class="alert alert--warning import-alert"
                >
                    <p class="import-alert__title">
                        ไม่พบคอลัมน์ต่อไปนี้ในไฟล์ CSV (จะบันทึกเป็นค่าว่าง)
                    </p>
                    <div class="import-alert__chips">
                        <span
                            v-for="col in missingColumns"
                            :key="col"
                            class="chip chip--warning"
                            >{{ col }}</span
                        >
                    </div>
                </div>

                <div
                    v-if="requiredMissing.length"
                    class="alert alert--error import-alert"
                >
                    <p class="import-alert__title">
                        ไม่สามารถนำเข้าได้ — ไม่พบคอลัมน์ที่จำเป็น
                    </p>
                    <div class="import-alert__chips">
                        <span
                            v-for="col in requiredMissing"
                            :key="col"
                            class="chip chip--danger"
                        >
                            {{ col }}
                        </span>
                    </div>
                    <p class="import-alert__hint">
                        กรุณาตรวจสอบว่าไฟล์ CSV มีคอลัมน์
                        <strong>visit_date</strong> หรือ
                        <strong>วันที่</strong> และ <strong>HN</strong> หรือ
                        <strong>เลขที่ผู้ป่วย</strong>
                    </p>
                </div>
            </div>

            <div class="card table-card">
                <div class="card__head">
                    <h3 class="card__title">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        ตัวอย่างข้อมูล
                    </h3>
                    <span class="card__meta">
                        {{ Math.min(10, importRows.length) }} แถวแรก จากทั้งหมด
                        {{ importRows.length }} แถว
                    </span>
                </div>

                <div class="table-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>วันที่</th>
                                <th>HN</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>สิทธิ์</th>
                                <th>ผู้ให้บริการ</th>
                                <th class="num">ค่าบริการรวม</th>
                                <th class="num">ค่าตอบแทน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(row, idx) in importRows.slice(0, 10)"
                                :key="idx"
                            >
                                <td class="cell-faint">{{ idx + 1 }}</td>
                                <td class="cell-date">
                                    {{ formatDate(row.visit_date) }}
                                </td>
                                <td class="cell-mono">
                                    {{ row.hn || "-" }}
                                </td>
                                <td class="cell-strong">
                                    {{
                                        [row.first_name, row.last_name]
                                            .filter(Boolean)
                                            .join(" ") || "-"
                                    }}
                                </td>
                                <td class="cell-muted">
                                    {{ row.rights || "-" }}
                                </td>
                                <td class="cell-muted">
                                    {{ row.therapist || "-" }}
                                </td>
                                <td class="num cell-muted">
                                    {{ formatCurrency(row.total_revenue) }}
                                </td>
                                <td class="num cell-strong">
                                    {{ formatCurrency(row.payout_amount) }}
                                </td>
                            </tr>

                            <tr v-if="importRows.length === 0">
                                <td colspan="8" class="table-empty">
                                    ไม่มีข้อมูลที่นำเข้าได้ (ทุกแถวถูกกรองออก)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="action-bar">
                <p class="action-bar__text">
                    พร้อมบันทึก
                    <strong>{{ importRows.length }}</strong> แถว
                </p>

                <div class="toolbar-actions">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="resetImport"
                    >
                        ยกเลิก
                    </button>

                    <button
                        type="button"
                        class="btn btn-primary"
                        :disabled="
                            isImporting ||
                            importRows.length === 0 ||
                            requiredMissing.length > 0
                        "
                        @click="doImport"
                    >
                        <svg
                            v-if="!isImporting"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                        </svg>
                        <svg
                            v-else
                            class="animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z
                                   m2 5.291A7.962 7.962 0 014 12H0
                                   c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {{
                            isImporting
                                ? `กำลังบันทึก… ${importProgress}%`
                                : `บันทึกข้อมูล ${importRows.length} แถว`
                        }}
                    </button>
                </div>
            </div>
        </template>

        <!-- ══════════════════════════════════════════════════════
             STEP 3 — Success
        ══════════════════════════════════════════════════════ -->
        <template v-if="step === 'success'">
            <div class="card success-card">
                <span class="success-card__icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2.4"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </span>
                <h2 class="success-card__title">นำเข้าข้อมูลสำเร็จ!</h2>
                <p class="success-card__text">
                    บันทึกข้อมูลเรียบร้อยแล้วทั้งหมด
                    <strong>{{ importedCount }}</strong> แถว
                </p>
                <div class="success-card__actions">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="resetImport"
                    >
                        นำเข้าไฟล์อื่น
                    </button>
                    <RouterLink
                        :to="{
                            path: '/records',
                            query: {
                                from: new Date().toISOString().split('T')[0],
                                to: new Date().toISOString().split('T')[0],
                            },
                        }"
                        class="btn btn-primary"
                    >
                        ดูประวัติค่าตอบแทน
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </RouterLink>
                </div>
            </div>
        </template>

        <!-- ── Error toast ── -->
        <Transition name="toast">
            <div
                v-if="errorToast"
                class="toast toast--error"
                role="alert"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                {{ errorToast }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import {
    formatDate,
    formatCurrency,
    parseCsvDate,
    parseCsvNumber,
} from "@/utils/format";

/* ─────────────────────────────────────────────────────────
   State
───────────────────────────────────────────────────────── */
const step = ref("upload"); // 'upload' | 'preview' | 'success'
const isDragging = ref(false);
const fileInputEl = ref(null);
const fileName = ref("");
const totalRowsInFile = ref(0);
const filteredCount = ref(0);
const importRows = ref([]); // cleaned, ready-to-import rows
const isImporting = ref(false);
const importProgress = ref(0);
const importedCount = ref(0);
const errorToast = ref("");
const columnMapping = ref({}); // dbCol -> csvHeader

/* ─────────────────────────────────────────────────────────
   Column mapping configuration
   Each DB column maps to a list of possible CSV header
   names (checked case-insensitively, with spaces/_ flexible)
───────────────────────────────────────────────────────── */
const COLUMN_ALIASES = {
    visit_date: [
        "visit_date",
        "visitdate",
        "visit date",
        "วันที่",
        "วันที่เข้ารับบริการ",
        "วันที่รักษา",
        "วันรักษา",
        "date",
    ],
    hn: [
        "hn",
        "HN",
        "hospital number",
        "เลขที่ผู้ป่วย",
        "hn number",
        "patient hn",
        "เลข hn",
        "h/n",
    ],
    cid: [
        "cid",
        "CID",
        "เลขบัตรประชาชน",
        "เลขบัตร",
        "บัตรประชาชน",
        "national id",
        "citizen id",
        "pid",
        "เลข cid",
    ],
    first_name: [
        "first_name",
        "firstname",
        "first name",
        "fname",
        "ชื่อ",
        "ชื่อจริง",
        "ชื่อผู้ป่วย",
    ],
    last_name: [
        "last_name",
        "lastname",
        "last name",
        "lname",
        "surname",
        "นามสกุล",
    ],
    gender: ["gender", "เพศ", "sex"],
    age: ["age", "อายุ"],
    rights: [
        "rights",
        "สิทธิ์",
        "สิทธิ",
        "สิทธิการรักษา",
        "สิทธิ์การรักษา",
        "right",
        "coverage",
        "สิทธิ์ผู้ป่วย",
    ],
    symptoms: [
        "symptoms",
        "อาการ",
        "อาการสำคัญ",
        "diagnosis",
        "การวินิจฉัย",
        "dx",
        "chief complaint",
        "cc",
        "icd",
        "การวินิจฉัยโรค",
    ],
    procedure: [
        "procedure",
        "หัตถการ",
        "การทำหัตถการ",
        "treatment",
        "การรักษา",
        "proc",
        "รายการหัตถการ",
    ],
    therapist: [
        "therapist",
        "ผู้ให้บริการ",
        "นักกายภาพบำบัด",
        "pt name",
        "physiotherapist",
        "ผู้รักษา",
        "เจ้าหน้าที่",
        "pt",
        "ชื่อนักกายภาพ",
        "นักกายภาพบำบัดผู้รักษา",
    ],
    total_revenue: [
        "total_revenue",
        "total revenue",
        "ค่าบริการรวม",
        "revenue",
        "รายได้รวม",
        "total",
        "ยอดรวม",
        "ค่ารักษา",
        "รายได้",
    ],
    payout_amount: [
        "payout_amount",
        "payout amount",
        "ยอดเงิน",
        "เงินปันผล",
        "ค่าตอบแทน",
        "payout",
        "เงิน",
        "ยอดจ่าย",
        "ค่าตอบแทนนักกายภาพ",
        "เงินตอบแทน",
        "จำนวนเงิน",
    ],
};

const REQUIRED_COLS = ["visit_date", "hn"];
const OPTIONAL_COLS = [
    "cid",
    "first_name",
    "last_name",
    "gender",
    "age",
    "rights",
    "symptoms",
    "procedure",
    "therapist",
    "total_revenue",
    "payout_amount",
];

/* computed: which DB columns could not be auto-detected */
const missingColumns = computed(() =>
    OPTIONAL_COLS.filter((c) => !columnMapping.value[c]),
);

const requiredMissing = computed(() =>
    REQUIRED_COLS.filter((c) => !columnMapping.value[c]),
);

/* ─────────────────────────────────────────────────────────
   Info cards (shown on upload step)
───────────────────────────────────────────────────────── */
const infoCards = [
    {
        title: "ตรวจสอบอัตโนมัติ",
        desc: "กรองแถวที่ได้รับเงิน 0 บาทออกก่อนนำเข้า",
        icon: `<svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
           </svg>`,
    },
    {
        title: "Upsert อัจฉริยะ",
        desc: "บันทึกทับข้อมูลเก่าโดยอัตโนมัติ (visit_date + HN)",
        icon: `<svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9
                  m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
           </svg>`,
    },
    {
        title: "ดูตัวอย่างก่อนบันทึก",
        desc: "แสดง Preview ข้อมูลเพื่อตรวจสอบก่อนยืนยัน",
        icon: `<svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.478 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.064 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"/>
           </svg>`,
    },
];

/* ─────────────────────────────────────────────────────────
   File handling
───────────────────────────────────────────────────────── */
function handleDrop(e) {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // reset input so same file can be re-selected
    if (fileInputEl.value) fileInputEl.value.value = "";
}

function processFile(file) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
        showError("กรุณาเลือกไฟล์ .csv เท่านั้น");
        return;
    }
    fileName.value = file.name;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8",
        complete(result) {
            buildPreview(result.data, result.meta.fields ?? []);
        },
        error(err) {
            showError("ไม่สามารถอ่านไฟล์ได้: " + err.message);
        },
    });
}

/* ─────────────────────────────────────────────────────────
   Column auto-detection
───────────────────────────────────────────────────────── */
function detectColumns(headers) {
    const map = {};
    const normalise = (s) =>
        String(s)
            .toLowerCase()
            .replace(/[\s_\-]/g, "");

    for (const [dbCol, aliases] of Object.entries(COLUMN_ALIASES)) {
        for (const alias of aliases) {
            const found = headers.find(
                (h) => normalise(h) === normalise(alias),
            );
            if (found) {
                map[dbCol] = found;
                break;
            }
        }
    }
    return map;
}

/* ─────────────────────────────────────────────────────────
   Build preview data from parsed CSV
───────────────────────────────────────────────────────── */
function buildPreview(rows, headers) {
    columnMapping.value = detectColumns(headers);

    const mapped = rows.map((row) => transformRow(row, columnMapping.value));
    totalRowsInFile.value = mapped.length;

    // Filter out zero / null payout rows
    const valid = mapped.filter((r) => {
        const p = r.payout_amount;
        return p !== null && p !== undefined && Number(p) > 0;
    });

    filteredCount.value = mapped.length - valid.length;
    importRows.value = valid;
    step.value = "preview";
}

/* ─────────────────────────────────────────────────────────
   Transform a single CSV row -> DB record shape
───────────────────────────────────────────────────────── */
function transformRow(row, mapping) {
    const record = {};

    for (const [dbCol, csvHeader] of Object.entries(mapping)) {
        if (!csvHeader) continue;
        const raw = row[csvHeader];

        if (dbCol === "visit_date") {
            record[dbCol] = parseCsvDate(raw);
        } else if (dbCol === "age") {
            const n = parseInt(String(raw ?? "").trim(), 10);
            record[dbCol] = isNaN(n) ? null : n;
        } else if (dbCol === "total_revenue" || dbCol === "payout_amount") {
            record[dbCol] = parseCsvNumber(raw);
        } else {
            const s = String(raw ?? "").trim();
            record[dbCol] = s === "" ? null : s;
        }
    }

    return record;
}

/* ─────────────────────────────────────────────────────────
   Upsert to Supabase in batches of 100
───────────────────────────────────────────────────────── */
async function doImport() {
    if (isImporting.value || importRows.value.length === 0) return;

    isImporting.value = true;
    importProgress.value = 0;

    const BATCH = 100;
    const rows = importRows.value;
    let done = 0;

    try {
        for (let i = 0; i < rows.length; i += BATCH) {
            const batch = rows.slice(i, i + BATCH);

            const { error } = await supabase
                .from("patient_record")
                .upsert(batch, { onConflict: "visit_date,hn" });

            if (error) throw error;

            done += batch.length;
            importProgress.value = Math.round((done / rows.length) * 100);
        }

        importedCount.value = done;
        step.value = "success";
    } catch (err) {
        showError("เกิดข้อผิดพลาดขณะบันทึกข้อมูล: " + err.message);
    } finally {
        isImporting.value = false;
    }
}

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function resetImport() {
    step.value = "upload";
    fileName.value = "";
    importRows.value = [];
    filteredCount.value = 0;
    totalRowsInFile.value = 0;
    columnMapping.value = {};
    importProgress.value = 0;
    importedCount.value = 0;
    isDragging.value = false;
}

function showError(msg) {
    errorToast.value = msg;
    setTimeout(() => {
        errorToast.value = "";
    }, 6000);
}
</script>

<style scoped>
/* ── Drop zone ─────────────────────────────────────────────────────────── */
.dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 310px;
    padding: 44px 24px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    border: 2px dashed var(--border-input);
    border-radius: var(--radius-lg);
    background:
        radial-gradient(
            520px 300px at 80% 0%,
            rgba(124, 58, 237, 0.05),
            transparent 65%
        ),
        radial-gradient(
            460px 280px at 10% 100%,
            rgba(255, 171, 145, 0.08),
            transparent 65%
        ),
        var(--bg-surface);
    box-shadow: var(--shadow);
    transition:
        border-color 0.18s ease,
        background 0.18s ease,
        box-shadow 0.18s ease,
        transform 0.18s ease;
}

.dropzone:hover,
.dropzone.is-dragging {
    border-color: var(--primary);
    background: var(--primary-soft-2);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
}

.dropzone__icon {
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    margin-bottom: 7px;
    border-radius: 18px;
    background: var(--primary-soft);
    color: var(--primary);
    transition: transform 0.18s ease;
}

.dropzone.is-dragging .dropzone__icon {
    transform: translateY(-3px) scale(1.04);
}

.dropzone__icon svg {
    width: 28px;
    height: 28px;
}

.dropzone__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.dropzone__hint {
    font-size: 11.5px;
    color: var(--text-muted);
}

.dropzone__chip {
    margin-top: 12px;
}

.dropzone__chip svg {
    width: 12px;
    height: 12px;
}

/* ── Info cards ────────────────────────────────────────────────────────── */
.info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
}

.info-card {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 13px 14px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-surface);
    box-shadow: var(--shadow);
}

.info-card__icon {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 9px;
    background: var(--primary-soft-2);
    color: var(--primary);
}

.info-card__icon :deep(svg) {
    width: 15px;
    height: 15px;
}

.info-card__title {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-primary);
}

.info-card__desc {
    margin-top: 2px;
    font-size: 10.5px;
    line-height: 1.55;
    color: var(--text-muted);
}

/* ── Preview ───────────────────────────────────────────────────────────── */
.preview-card {
    padding: 16px;
    margin-bottom: 14px;
}

.file-row {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
}

.file-row__icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--primary-soft-2);
    color: var(--primary);
}

.file-row__icon svg {
    width: 20px;
    height: 20px;
}

.file-row__info {
    min-width: 0;
}

.file-row__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.file-row__meta {
    margin-top: 1px;
    font-size: 10.5px;
    color: var(--text-gray);
}

.file-row__action {
    margin-left: auto;
    flex-shrink: 0;
}

.import-alert {
    margin-top: 12px;
}

.import-alert__title {
    font-size: 11.5px;
    font-weight: 600;
}

.import-alert__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 7px;
}

.import-alert__hint {
    margin-top: 8px;
    font-size: 11px;
    line-height: 1.6;
}

.table-empty {
    padding: 32px 16px !important;
    text-align: center;
    font-size: 11.5px;
    color: var(--text-gray);
}

/* ── Action bar ────────────────────────────────────────────────────────── */
.action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-top: 14px;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg-surface);
    box-shadow: var(--shadow);
}

.action-bar__text {
    font-size: 11.5px;
    color: var(--text-muted);
}

.action-bar__text strong {
    font-weight: 700;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

/* ── Success ───────────────────────────────────────────────────────────── */
.success-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 52px 28px;
    text-align: center;
}

.success-card__icon {
    display: grid;
    place-items: center;
    width: 62px;
    height: 62px;
    margin-bottom: 14px;
    border: 1px solid #a7f3d0;
    border-radius: 9999px;
    background: var(--success-soft);
    color: var(--success);
}

.success-card__icon svg {
    width: 30px;
    height: 30px;
}

.success-card__title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: var(--text-primary);
}

.success-card__text {
    margin-top: 5px;
    font-size: 12px;
    color: var(--text-muted);
}

.success-card__text strong {
    font-weight: 700;
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
}

.success-card__actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 22px;
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 820px) {
    .info-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .dropzone {
        min-height: 250px;
        padding: 34px 18px;
    }

    .file-row {
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .file-row__action {
        margin-left: 0;
        width: 100%;
    }

    .action-bar {
        flex-direction: column;
        align-items: stretch;
    }

    .action-bar .toolbar-actions {
        justify-content: flex-end;
    }

    .success-card {
        padding: 38px 20px;
    }
}
</style>
