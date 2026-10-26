<template>
    <div class="page page--wide">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                               M9 5a2 2 0 002 2h2a2 2 0 002-2
                               M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </span>
                <div>
                    <h1 class="page-title">ประวัติค่าตอบแทน</h1>
                    <p class="page-sub">
                        ค้นหา ดู และจัดการข้อมูลการรักษาทั้งหมดในระบบ
                    </p>
                </div>
            </div>

            <div class="count-chip">
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                           M9 5a2 2 0 002 2h2a2 2 0 002-2
                           M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                ทั้งหมด
                <strong>{{ totalCount.toLocaleString() }}</strong>
                รายการ
            </div>
        </div>

        <!-- ── Filters ── -->
        <div class="card toolbar-card">
            <div class="filter-bar">
                <DateRangePicker
                    v-model="dateRange"
                    label="ช่วงวันที่"
                    class="filter-field filter-field--date"
                    @apply="onFilterChange"
                    @clear="onFilterChange"
                />

                <div class="filter-field filter-field--provider">
                    <label class="filter-label" for="records-provider"
                        >ผู้ให้บริการ</label
                    >
                    <select
                        id="records-provider"
                        v-model="providerFilter"
                        class="field-select"
                        :disabled="isProvidersLoading"
                        @change="onFilterChange"
                    >
                        <option value="">ทั้งหมด</option>
                        <option v-for="p in providers" :key="p" :value="p">
                            {{ p }}
                        </option>
                    </select>
                </div>

            </div>
        </div>

        <!-- ── Table Card ── -->
        <div class="card table-card">
            <div v-if="isLoading" class="table-loading">
                <span class="table-spinner" aria-hidden="true" />
                <p>กำลังโหลดข้อมูล…</p>
            </div>

            <div v-else-if="records.length === 0" class="empty-state">
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                               M9 5a2 2 0 002 2h2a2 2 0 002-2
                               M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                </span>
                <p class="empty-state__title">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>
                <p class="empty-state__text">
                    ลองปรับช่วงวันที่หรือผู้ให้บริการ แล้วค้นหาอีกครั้ง
                </p>
            </div>

            <template v-else>
                <div class="table-scroll">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>วันที่</th>
                                <th>HN</th>
                                <th>ชื่อ-นามสกุล</th>
                                <th>เพศ/อายุ</th>
                                <th>สิทธิ์</th>
                                <th>อาการ/หัตถการ</th>
                                <th>ผู้ให้บริการ</th>
                                <th class="num">ค่ารักษา</th>
                                <th class="num">ค่าตอบแทน</th>
                                <th class="center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in records" :key="row.id">
                                <td class="cell-date">
                                    {{ formatDate(row.visit_date) }}
                                </td>
                                <td class="cell-mono">
                                    {{ row.hn || "-" }}
                                </td>
                                <td>
                                    <p class="cell-strong">
                                        {{
                                            [row.first_name, row.last_name]
                                                .filter(Boolean)
                                                .join(" ") || "-"
                                        }}
                                    </p>
                                    <p v-if="row.cid" class="cell-sub mono">
                                        {{ row.cid }}
                                    </p>
                                </td>
                                <td class="cell-muted">
                                    <span v-if="row.gender || row.age">
                                        {{ row.gender || ""
                                        }}{{
                                            row.gender && row.age ? " / " : ""
                                        }}{{ row.age ? row.age + " ปี" : "" }}
                                    </span>
                                    <span v-else class="cell-faint">-</span>
                                </td>
                                <td>
                                    <span
                                        v-if="row.rights"
                                        class="chip chip--soft"
                                    >
                                        {{ row.rights }}
                                    </span>
                                    <span v-else class="cell-faint">-</span>
                                </td>
                                <td>
                                    <p
                                        v-if="row.symptoms"
                                        class="row-line cell-muted"
                                    >
                                        {{ row.symptoms }}
                                    </p>
                                    <p
                                        v-if="row.procedure"
                                        class="row-line cell-sub"
                                    >
                                        {{ row.procedure }}
                                    </p>
                                    <span
                                        v-if="!row.symptoms && !row.procedure"
                                        class="cell-faint"
                                        >-</span
                                    >
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
                                <td class="center">
                                    <button
                                        type="button"
                                        class="row-action"
                                        title="ลบรายการนี้"
                                        :aria-label="`ลบรายการ ${row.hn || ''}`"
                                        @click="confirmDelete(row)"
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
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                                                   L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- ── Pagination ── -->
                <div v-if="totalCount > 0" class="pagination">
                    <p class="pagination__info">
                        แสดง <strong>{{ pageStart }}</strong> –
                        <strong>{{ pageEnd }}</strong> จาก
                        <strong>{{ totalCount.toLocaleString() }}</strong>
                        รายการ
                    </p>

                    <div class="pagination__controls">
                        <button
                            type="button"
                            class="page-btn"
                            :disabled="currentPage === 1"
                            title="หน้าแรก"
                            @click="goToPage(1)"
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
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            class="page-btn"
                            :disabled="currentPage === 1"
                            title="หน้าก่อนหน้า"
                            @click="goToPage(currentPage - 1)"
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
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <template v-for="p in pageButtons" :key="p">
                            <span v-if="p === '…'" class="page-ellipsis"
                                >…</span
                            >
                            <button
                                v-else
                                type="button"
                                class="page-btn"
                                :class="{ 'is-active': p === currentPage }"
                                @click="goToPage(p)"
                            >
                                {{ p }}
                            </button>
                        </template>

                        <button
                            type="button"
                            class="page-btn"
                            :disabled="currentPage === totalPages"
                            title="หน้าถัดไป"
                            @click="goToPage(currentPage + 1)"
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
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
            </div>
                </div>
            </template>
        </div>

        <!-- ── Delete confirmation modal ── -->
        <Transition name="modal">
            <div
                v-if="deleteTarget"
                class="modal-overlay"
                @click.self="cancelDelete"
            >
                <div
                    class="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-title"
                >
                    <header class="modal__header">
                        <span id="delete-title" class="modal__title">
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
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
                                       1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
                                       0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            ยืนยันการลบ
                        </span>
                        <button
                            type="button"
                            class="modal__close"
                            aria-label="ปิด"
                            @click="cancelDelete"
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
                        </button>
                    </header>

                    <div class="modal__body">
                        <span class="modal__icon">
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                                       a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
                                       a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </span>
                        <p class="delete-question">
                            คุณต้องการลบรายการนี้ใช่หรือไม่?
                        </p>
                        <p class="delete-target">{{ deleteTarget.label }}</p>
                        <p class="delete-warning">
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้
                        </p>
                    </div>

                    <footer class="modal__footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            :disabled="isDeleting"
                            @click="cancelDelete"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            class="btn btn-danger"
                            :disabled="isDeleting"
                            @click="executeDelete"
                        >
                            <svg
                                v-if="isDeleting"
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
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            {{ isDeleting ? "กำลังลบ…" : "ลบรายการ" }}
                        </button>
                    </footer>
                </div>
            </div>
        </Transition>

        <!-- ── Toast notification ── -->
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
                    stroke-width="2.5"
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                {{ toast.message }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/lib/supabase";
import { formatDate, formatCurrency } from "@/utils/format";
import { todayISO } from "@/utils/dateRange";
import DateRangePicker from "@/components/DateRangePicker.vue";

// ── Constants ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

// ── State ───────────────────────────────────────────────────────────────────
const records = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);

// Read optional query params for initial date range (fallback to today)
const route = useRoute();
const todayStr = todayISO();
const dateFrom = ref(route.query.from ? String(route.query.from) : todayStr);
const dateTo = ref(route.query.to ? String(route.query.to) : todayStr);

const dateRange = computed({
    get: () => ({ from: dateFrom.value, to: dateTo.value }),
    set: (range) => {
        dateFrom.value = range?.from || "";
        dateTo.value = range?.to || "";
    },
});

// Provider filter + provider list for dropdown
const providerFilter = ref("");
const providers = ref([]);
const isProvidersLoading = ref(false);

/**
 * Load provider list for dropdown (distinct therapists)
 */
async function loadProviders() {
    isProvidersLoading.value = true;
    try {
        const { data, error } = await supabase
            .from("patient_record")
            .select("therapist")
            .not("therapist", "is", null)
            .limit(1000);
        if (error) throw error;
        const set = new Set();
        (data || []).forEach((r) => {
            if (r.therapist && r.therapist.toString().trim()) {
                set.add(r.therapist.toString().trim());
            }
        });
        providers.value = [...set].sort((a, b) => a.localeCompare(b));
    } catch (err) {
        // silently ignore; providers is optional
    } finally {
        isProvidersLoading.value = false;
    }
}

const deleteTarget = ref(null); // { id, label }
const isDeleting = ref(false);

const toast = ref({ show: false, type: "success", message: "" });

// ── Computed ─────────────────────────────────────────────────────────────────
const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)),
);

const pageStart = computed(() =>
    totalCount.value === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1,
);
const pageEnd = computed(() =>
    Math.min(currentPage.value * PAGE_SIZE, totalCount.value),
);

/** Generates page-number buttons with ellipsis shortening */
const pageButtons = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set([1, total, cur]);
    if (cur > 1) pages.add(cur - 1);
    if (cur < total) pages.add(cur + 1);

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
        result.push(sorted[i]);
    }
    return result;
});

// ── Data fetching ────────────────────────────────────────────────────────────
async function fetchRecords() {
    isLoading.value = true;
    try {
        let query = supabase
            .from("patient_record")
            .select("*", { count: "exact" })
            .order("visit_date", { ascending: false })
            .order("created_at", { ascending: false });

        if (dateFrom.value) query = query.gte("visit_date", dateFrom.value);
        if (dateTo.value) query = query.lte("visit_date", dateTo.value);
        // Apply provider filter when set
        if (providerFilter.value)
            query = query.eq("therapist", providerFilter.value);

        query = query.range(
            (currentPage.value - 1) * PAGE_SIZE,
            currentPage.value * PAGE_SIZE - 1,
        );

        const { data, count, error } = await query;
        if (error) throw error;

        records.value = data ?? [];
        totalCount.value = count ?? 0;
    } catch (err) {
        showToast("error", "โหลดข้อมูลไม่สำเร็จ: " + err.message);
    } finally {
        isLoading.value = false;
    }
}

// ── Filter handlers ──────────────────────────────────────────────────────────

function onFilterChange() {
    currentPage.value = 1;
    fetchRecords();
}

function goToPage(p) {
    if (p < 1 || p > totalPages.value || p === currentPage.value) return;
    currentPage.value = p;
    fetchRecords();
}

// ── Delete logic ──────────────────────────────────────────────────────────────
function confirmDelete(row) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(" ");
    const date = formatDate(row.visit_date);
    deleteTarget.value = {
        id: row.id,
        label: `${date}  •  HN: ${row.hn || "-"}  •  ${name || "ไม่ระบุชื่อ"}`,
    };
}

function cancelDelete() {
    if (isDeleting.value) return;
    deleteTarget.value = null;
}

async function executeDelete() {
    if (!deleteTarget.value || isDeleting.value) return;
    isDeleting.value = true;
    try {
        const { error } = await supabase
            .from("patient_record")
            .delete()
            .eq("id", deleteTarget.value.id);

        if (error) throw error;

        deleteTarget.value = null;
        showToast("success", "ลบรายการเรียบร้อยแล้ว");

        // If we just deleted the last item on this page, go back one page
        if (records.value.length === 1 && currentPage.value > 1) {
            currentPage.value -= 1;
        }
        await fetchRecords();
    } catch (err) {
        showToast("error", "ลบไม่สำเร็จ: " + err.message);
    } finally {
        isDeleting.value = false;
    }
}

// ── Toast helper ──────────────────────────────────────────────────────────────
function showToast(type, message) {
    toast.value = { show: true, type, message };
    setTimeout(() => {
        toast.value.show = false;
    }, 4000);
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
    await loadProviders();
    fetchRecords();
});
</script>

<style scoped>
.filter-field--date {
    width: 270px;
}

.filter-field--provider {
    width: 240px;
}

.filter-field--provider .field-select {
    width: 100%;
    min-width: 0;
}

.table-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 70px 20px;
    font-size: 11.5px;
    color: var(--text-muted);
}

.table-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--border-light);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: records-spin 0.8s linear infinite;
}

.row-line {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-question {
    text-align: center;
    font-size: 12px;
    color: var(--text-muted);
}

.delete-target {
    margin-top: 4px;
    padding: 8px 10px;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    background: var(--bg-surface-soft);
    text-align: center;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-primary);
}

.delete-warning {
    margin-top: 10px;
    text-align: center;
    font-size: 11px;
    color: var(--error);
}

@keyframes records-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 700px) {
    .filter-field--date {
        flex: 1 1 100%;
        width: 100%;
    }

    .filter-field--provider {
        flex: 0 0 100%;
        width: 100%;
    }

}

@media (max-width: 640px) {
    .pagination {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
