<template>
    <div class="page">
        <div class="page-head">
            <div class="page-head__main">
                <span class="page-icon page-icon--export">
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
                <div>
                    <h1 class="page-title">ส่งออกรายงาน</h1>
                    <p class="page-sub">
                        กรองช่วงวันที่ แล้วส่งออกเป็น CSV เพื่อคำนวณเงินหรือสำรองข้อมูล
                    </p>
                </div>
            </div>
        </div>

        <!-- ── Filter card ── -->
        <div class="card toolbar-card">
            <div class="filter-bar">
                <DateRangePicker
                    v-model="dateRange"
                    label="ช่วงวันที่"
                    class="filter-field filter-field--date"
                />

                <button
                    type="button"
                    class="btn btn-primary load-btn"
                    :disabled="isLoading || !dateFrom || !dateTo"
                    @click="loadData"
                >
                    <svg
                        v-if="isLoading"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1
                               m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    {{ isLoading ? "กำลังโหลด…" : "โหลดข้อมูล" }}
                </button>
            </div>

            <div
                v-if="loadError"
                class="alert alert--error load-error"
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
                {{ loadError }}
            </div>
        </div>

        <!-- ── Results (shown after loading) ── -->
        <template v-if="records.length > 0">
            <div class="stat-grid stat-grid--4">
                <div class="stat">
                    <p class="stat__value">{{ records.length }}</p>
                    <p class="stat__label">เคสทั้งหมด</p>
                </div>
                <div class="stat">
                    <p class="stat__value">{{ uniqueTherapists }}</p>
                    <p class="stat__label">ผู้ให้บริการ</p>
                </div>
                <div class="stat stat--primary">
                    <p class="stat__value stat__value--money">
                        {{ formatCurrency(totalPayout) }}
                    </p>
                    <p class="stat__label">ค่าตอบแทนรวม (฿)</p>
                </div>
                <div class="stat">
                    <p class="stat__value stat__value--money">
                        {{ formatCurrency(totalRevenue) }}
                    </p>
                    <p class="stat__label">รายได้รวม (฿)</p>
                </div>
            </div>

            <!-- ── Export buttons ── -->
            <div class="export-actions">
                <button
                    type="button"
                    class="btn btn-ghost"
                    @click="exportRawData"
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
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                               a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    ส่งออก CSV — ข้อมูลดิบ ({{ records.length }} แถว)
                </button>

                <button
                    type="button"
                    class="btn btn-export"
                    @click="exportSummary"
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
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                               a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    ส่งออก CSV — สรุปรายเดือน
                </button>
            </div>

            <!-- ── Monthly Summary Table ── -->
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        สรุปรายเดือน แยกตามผู้ให้บริการ
                    </h3>
                    <span class="card__meta">{{ summary.length }} รายการ</span>
                </div>

                <div class="table-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>เดือน</th>
                                <th>ผู้ให้บริการ</th>
                                <th class="center">จำนวนเคส</th>
                                <th class="num">ค่าบริการรวม (฿)</th>
                                <th class="num">ค่าตอบแทน (฿)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template
                                v-for="group in summaryByMonth"
                                :key="group.month"
                            >
                                <tr class="month-row">
                                    <td colspan="5">
                                        {{ formatMonthYear(group.month) }}
                                        &nbsp;·&nbsp;
                                        {{ group.rows.length }} ผู้ให้บริการ
                                        &nbsp;·&nbsp; {{ group.totalCases }} เคส
                                    </td>
                                </tr>
                                <tr
                                    v-for="row in group.rows"
                                    :key="row.therapist"
                                >
                                    <td class="cell-faint">—</td>
                                    <td class="cell-strong">
                                        {{ row.therapist }}
                                    </td>
                                    <td class="center">
                                        <span class="chip chip--soft">
                                            {{ row.total_cases }}
                                        </span>
                                    </td>
                                    <td class="num cell-muted">
                                        {{ formatCurrency(row.total_revenue) }}
                                    </td>
                                    <td class="num cell-strong">
                                        {{ formatCurrency(row.total_payout) }}
                                    </td>
                                </tr>
                                <tr class="subtotal-row">
                                    <td></td>
                                    <td>
                                        รวม {{ formatMonthYear(group.month) }}
                                    </td>
                                    <td class="center">
                                        {{ group.totalCases }}
                                    </td>
                                    <td class="num">
                                        {{ formatCurrency(group.totalRevenue) }}
                                    </td>
                                    <td class="num">
                                        {{ formatCurrency(group.totalPayout) }}
                                    </td>
                                </tr>
                            </template>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td></td>
                                <td>รวมทั้งหมด</td>
                                <td class="center">{{ records.length }}</td>
                                <td class="num">
                                    {{ formatCurrency(totalRevenue) }}
                                </td>
                                <td class="num">
                                    {{ formatCurrency(totalPayout) }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </template>

        <!-- ── Empty state (after load attempt with 0 results) ── -->
        <div
            v-else-if="hasLoaded && records.length === 0"
            class="card empty-state"
        >
            <span class="empty-state__icon">
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
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                           a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            </span>
            <p class="empty-state__title">
                ไม่พบข้อมูลในช่วงวันที่ที่เลือก
            </p>
            <p class="empty-state__text">
                ลองเปลี่ยนช่วงวันที่แล้วโหลดใหม่อีกครั้ง
            </p>
        </div>

        <!-- ── Toast ── -->
        <Transition name="toast">
            <div
                v-if="toast.show"
                class="toast"
                :class="
                    toast.type === 'success'
                        ? 'toast--success'
                        : 'toast--error'
                "
                role="status"
            >
                <svg
                    v-if="toast.type === 'success'"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <svg
                    v-else
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
                {{ toast.message }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatMonthYear } from "@/utils/format";
import { startOfMonthISO, todayISO } from "@/utils/dateRange";
import DateRangePicker from "@/components/DateRangePicker.vue";

// ── State ────────────────────────────────────────────────────────────────────
const records = ref([]);
const isLoading = ref(false);
const hasLoaded = ref(false);
const loadError = ref("");
const toast = ref({ show: false, type: "success", message: "" });

// Default range: first day of current month → today
const dateFrom = ref(startOfMonthISO());
const dateTo = ref(todayISO());

const dateRange = computed({
    get: () => ({ from: dateFrom.value, to: dateTo.value }),
    set: (range) => {
        dateFrom.value = range?.from || "";
        dateTo.value = range?.to || "";
    },
});

// ── Data loading ──────────────────────────────────────────────────────────────
async function loadData() {
    if (!dateFrom.value || !dateTo.value) return;
    isLoading.value = true;
    loadError.value = "";
    records.value = [];

    try {
        // Fetch ALL rows in range (no pagination — for export we need everything)
        let allRows = [];
        const PAGE = 1000;
        let from = 0;

        while (true) {
            const { data, error } = await supabase
                .from("patient_record")
                .select("*")
                .gte("visit_date", dateFrom.value)
                .lte("visit_date", dateTo.value)
                .order("visit_date", { ascending: true })
                .order("therapist", { ascending: true })
                .range(from, from + PAGE - 1);

            if (error) throw error;
            allRows = allRows.concat(data || []);
            if (!data || data.length < PAGE) break;
            from += PAGE;
        }

        records.value = allRows;
        hasLoaded.value = true;
    } catch (err) {
        loadError.value = "โหลดข้อมูลไม่สำเร็จ: " + err.message;
    } finally {
        isLoading.value = false;
    }
}

// ── Computed stats ────────────────────────────────────────────────────────────
const totalPayout = computed(() =>
    records.value.reduce((s, r) => s + (Number(r.payout_amount) || 0), 0),
);
const totalRevenue = computed(() =>
    records.value.reduce((s, r) => s + (Number(r.total_revenue) || 0), 0),
);
const uniqueTherapists = computed(
    () => new Set(records.value.map((r) => r.therapist || "ไม่ระบุ")).size,
);

// ── Summary pivot: group by month → therapist ─────────────────────────────────
const summary = computed(() => {
    const map = new Map();
    for (const r of records.value) {
        const d = new Date(r.visit_date + "T00:00:00");
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const therapist = (r.therapist || "ไม่ระบุ").trim();
        const key = `${monthKey}::${therapist}`;

        if (!map.has(key)) {
            map.set(key, {
                month: monthKey,
                therapist,
                total_cases: 0,
                total_payout: 0,
                total_revenue: 0,
            });
        }
        const entry = map.get(key);
        entry.total_cases++;
        entry.total_payout += Number(r.payout_amount) || 0;
        entry.total_revenue += Number(r.total_revenue) || 0;
    }
    return [...map.values()].sort(
        (a, b) =>
            a.month.localeCompare(b.month) ||
            a.therapist.localeCompare(b.therapist),
    );
});

// Group summary rows by month (for display)
const summaryByMonth = computed(() => {
    const groups = new Map();
    for (const row of summary.value) {
        if (!groups.has(row.month)) {
            groups.set(row.month, {
                month: row.month,
                rows: [],
                totalCases: 0,
                totalPayout: 0,
                totalRevenue: 0,
            });
        }
        const g = groups.get(row.month);
        g.rows.push(row);
        g.totalCases += row.total_cases;
        g.totalPayout += row.total_payout;
        g.totalRevenue += row.total_revenue;
    }
    return [...groups.values()];
});

// ── Excel exports ─────────────────────────────────────────────────────────────
function exportRawData() {
    if (!records.value.length) return;

    // Helper: format date as DD/MM/YYYY (Gregorian) for CSV
    const formatCsvDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr + "T00:00:00");
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear(); // Gregorian year as requested (e.g., 2026)
        return `${day}/${month}/${year}`;
    };

    // Helper: escape CSV values
    const csvEscape = (v) => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        // If contains quote, comma, newline -> wrap in quotes and escape quotes
        if (/[",\n\r]/.test(s)) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    try {
        const rows = records.value.map((r) => ({
            วันที่: formatCsvDate(r.visit_date),
            HN: r.hn ?? "",
            CID: r.cid ?? "",
            ชื่อ: r.first_name ?? "",
            นามสกุล: r.last_name ?? "",
            เพศ: r.gender ?? "",
            อายุ: r.age ?? "",
            สิทธิ์: r.rights ?? "",
            "อาการ/การวินิจฉัย": r.symptoms ?? "",
            หัตถการ: r.procedure ?? "",
            ผู้ให้บริการ: r.therapist ?? "",
            "ค่าบริการรวม (฿)": r.total_revenue ?? "",
            "ค่าตอบแทน (฿)": r.payout_amount ?? "",
        }));

        if (!rows.length) return;

        // Build CSV header (preserve order)
        const headers = Object.keys(rows[0]);
        const lines = [];
        // Add BOM to support Excel/Thai characters
        // But BOM is added when creating Blob below
        lines.push(headers.map(csvEscape).join(","));

        for (const row of rows) {
            const line = headers.map((h) => csvEscape(row[h])).join(",");
            lines.push(line);
        }

        const csvContent = "\uFEFF" + lines.join("\r\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const filename = `patient_raw_${dateFrom.value}_${dateTo.value}.csv`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);

        showToast("success", `ส่งออกไฟล์ "${filename}" สำเร็จ`);
    } catch (err) {
        showToast(
            "error",
            "ส่งออกไม่สำเร็จ: " + (err && err.message ? err.message : err),
        );
    }
}

function exportSummary() {
    if (!summary.value.length) return;

    const csvEscape = (v) => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        if (/[",\n\r]/.test(s)) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    try {
        const rows = summary.value.map((s) => ({
            เดือน: formatMonthYear(s.month),
            ผู้ให้บริการ: s.therapist,
            จำนวนเคส: s.total_cases,
            "ค่าบริการรวม (฿)": s.total_revenue,
            "ค่าตอบแทน (฿)": s.total_payout,
        }));

        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const lines = [];
        lines.push(headers.map(csvEscape).join(","));

        for (const row of rows) {
            const line = headers.map((h) => csvEscape(row[h])).join(",");
            lines.push(line);
        }

        const csvContent = "\uFEFF" + lines.join("\r\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const filename = `summary_${dateFrom.value}_${dateTo.value}.csv`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);

        showToast("success", `ส่งออกไฟล์ "${filename}" สำเร็จ`);
    } catch (err) {
        showToast(
            "error",
            "ส่งออกไม่สำเร็จ: " + (err && err.message ? err.message : err),
        );
    }
}

// ── Toast helper ──────────────────────────────────────────────────────────────
function showToast(type, message) {
    toast.value = { show: true, type, message };
    setTimeout(() => {
        toast.value.show = false;
    }, 4000);
}
</script>

<style scoped>
.filter-field--date {
    width: 280px;
}

.load-btn {
    margin-left: auto;
}

.load-error {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 12px;
}

.load-error svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
}

.stat__value--money {
    font-size: 17px;
    letter-spacing: -0.3px;
}

.export-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
}

@media (max-width: 700px) {
    .filter-field--date {
        flex: 1 1 100%;
        width: 100%;
    }

    .load-btn {
        margin-left: 0;
        width: 100%;
    }

    .export-actions .btn {
        flex: 1 1 100%;
    }
}
</style>
