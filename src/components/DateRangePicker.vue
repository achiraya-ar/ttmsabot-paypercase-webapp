<template>
    <div class="date-range" ref="rootEl" @keydown.esc.stop="closePicker">
        <span class="date-range__label">{{ label }}</span>

        <button
            type="button"
            class="date-range__trigger"
            :class="{ 'is-empty': !hasRange, 'is-open': open }"
            :aria-label="`${label}: ${displayText}`"
            :aria-expanded="open"
            aria-haspopup="dialog"
            @click="togglePicker"
        >
            <svg
                class="date-range__icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
            >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 10h18M8 3v4M16 3v4"
                />
            </svg>
            <span class="date-range__value">{{ displayText }}</span>
            <svg
                class="date-range__chevron"
                :class="{ 'is-open': open }"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 9l6 6 6-6"
                />
            </svg>
        </button>

        <Transition name="date-pop">
            <div
                v-if="open"
                ref="popoverEl"
                class="date-range__popover"
                role="dialog"
                aria-modal="false"
                :aria-label="`เลือก${label}`"
                tabindex="-1"
            >
                <div class="date-range__header">
                    <button
                        type="button"
                        class="date-range__nav"
                        aria-label="เดือนก่อนหน้า"
                        @click="shiftMonth(-1)"
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

                    <strong class="date-range__month">{{ monthLabel }}</strong>

                    <button
                        type="button"
                        class="date-range__nav"
                        aria-label="เดือนถัดไป"
                        @click="shiftMonth(1)"
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

                <div class="date-range__weekdays" aria-hidden="true">
                    <span v-for="day in weekdays" :key="day">{{ day }}</span>
                </div>

                <div class="date-range__days" @mouseleave="hoverDate = ''">
                    <template v-for="cell in days" :key="cell.key">
                        <span
                            v-if="!cell.date"
                            class="date-range__day is-blank"
                            aria-hidden="true"
                        />
                        <button
                            v-else
                            type="button"
                            class="date-range__day"
                            :class="dayClass(cell)"
                            :aria-label="formatDate(cell.date)"
                            :title="formatDate(cell.date)"
                            @click="selectDay(cell.date)"
                            @mouseenter="hoverDate = cell.date"
                        >
                            {{ cell.day }}
                        </button>
                    </template>
                </div>

                <div class="date-range__presets">
                    <button
                        v-for="preset in presets"
                        :key="preset.label"
                        type="button"
                        class="date-range__preset"
                        @click="applyPreset(preset)"
                    >
                        {{ preset.label }}
                    </button>
                </div>

                <div class="date-range__footer">
                    <button
                        type="button"
                        class="date-range__clear"
                        @click="clearRange"
                    >
                        ล้าง
                    </button>

                    <div class="date-range__actions">
                        <button
                            type="button"
                            class="date-range__action date-range__action--ghost"
                            @click="closePicker"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            class="date-range__action date-range__action--primary"
                            :disabled="!draftFrom || !draftTo"
                            @click="applyDraft"
                        >
                            ใช้ช่วงนี้
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
} from "vue";
import { formatDate } from "@/utils/format";
import { parseISODate, toISODate, todayISO } from "@/utils/dateRange";

const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({ from: "", to: "" }),
    },
    label: {
        type: String,
        default: "ช่วงวันที่",
    },
});

const emit = defineEmits(["update:modelValue", "apply", "clear"]);

const weekdays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const open = ref(false);
const rootEl = ref(null);
const popoverEl = ref(null);
const viewDate = ref(startOfMonth(new Date()));
const draftFrom = ref("");
const draftTo = ref("");
const hoverDate = ref("");

const presets = [
    {
        label: "วันนี้",
        range: () => ({ from: todayISO(), to: todayISO() }),
    },
    {
        label: "เดือนนี้",
        range: () => ({ from: startOfMonthISO(), to: todayISO() }),
    },
    { label: "เดือนที่แล้ว", range: lastMonthRange },
    { label: "3 เดือน", range: lastThreeMonthsRange },
    {
        label: "ปีนี้",
        range: () => ({
            from: `${new Date().getFullYear()}-01-01`,
            to: todayISO(),
        }),
    },
];

const hasRange = computed(
    () => Boolean(props.modelValue?.from && props.modelValue?.to),
);

const displayText = computed(() => {
    const from = props.modelValue?.from;
    const to = props.modelValue?.to;
    if (!from || !to) return "เลือกช่วงวันที่";
    return from === to
        ? formatDate(from)
        : `${formatDate(from)} – ${formatDate(to)}`;
});

const monthLabel = computed(() =>
    new Intl.DateTimeFormat("th-TH", {
        month: "long",
        year: "numeric",
    }).format(viewDate.value),
);

const days = computed(() => {
    const year = viewDate.value.getFullYear();
    const month = viewDate.value.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push({ key: `blank-start-${i}`, date: "", day: "" });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = toISODate(new Date(year, month, day));
        cells.push({ key: date, date, day });
    }
    while (cells.length < 42) {
        cells.push({ key: `blank-end-${cells.length}`, date: "", day: "" });
    }
    return cells;
});

const effectiveEnd = computed(() => {
    if (draftTo.value) return draftTo.value;
    if (draftFrom.value && hoverDate.value > draftFrom.value) {
        return hoverDate.value;
    }
    return "";
});

function startOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfMonthISO(date = new Date()) {
    return toISODate(startOfMonth(date));
}

function lastMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: toISODate(start), to: toISODate(end) };
}

function lastThreeMonthsRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return { from: toISODate(start), to: todayISO() };
}

function shiftMonth(delta) {
    const next = new Date(viewDate.value);
    next.setMonth(next.getMonth() + delta);
    viewDate.value = startOfMonth(next);
}

function togglePicker() {
    if (open.value) {
        closePicker();
    } else {
        openPicker();
    }
}

function openPicker() {
    draftFrom.value = props.modelValue?.from || "";
    draftTo.value = props.modelValue?.to || "";
    hoverDate.value = "";
    const base = parseISODate(draftFrom.value) || new Date();
    viewDate.value = startOfMonth(base);
    open.value = true;
    nextTick(() => popoverEl.value?.focus());
}

function closePicker() {
    open.value = false;
    hoverDate.value = "";
}

function selectDay(date) {
    if (!draftFrom.value || draftTo.value) {
        draftFrom.value = date;
        draftTo.value = "";
        hoverDate.value = "";
        return;
    }

    if (date < draftFrom.value) {
        draftTo.value = draftFrom.value;
        draftFrom.value = date;
    } else {
        draftTo.value = date;
    }
    hoverDate.value = "";
}

function dayClass(cell) {
    if (!cell.date) return {};
    const start = draftFrom.value;
    const end = draftTo.value || effectiveEnd.value;
    const isInRange = start && end && cell.date > start && cell.date < end;

    return {
        "is-today": cell.date === todayISO(),
        "is-start": cell.date === start,
        "is-end": Boolean(end && cell.date === end && end !== start),
        "is-in-range": Boolean(isInRange),
    };
}

function applyDraft() {
    if (!draftFrom.value || !draftTo.value) return;
    emitRange({ from: draftFrom.value, to: draftTo.value });
}

function applyPreset(preset) {
    emitRange(preset.range());
}

function emitRange(range) {
    emit("update:modelValue", range);
    emit("apply", range);
    closePicker();
}

function clearRange() {
    const range = { from: "", to: "" };
    emit("update:modelValue", range);
    emit("clear", range);
    closePicker();
}

function onDocumentPointerDown(event) {
    if (!open.value) return;
    if (rootEl.value && !rootEl.value.contains(event.target)) {
        closePicker();
    }
}

onMounted(() => {
    document.addEventListener("mousedown", onDocumentPointerDown);
});

onBeforeUnmount(() => {
    document.removeEventListener("mousedown", onDocumentPointerDown);
});
</script>

<style scoped>
.date-range {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.date-range__label {
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-gray);
    white-space: nowrap;
}

.date-range__trigger {
    display: flex;
    align-items: center;
    gap: 7px;
    width: 100%;
    height: 36px;
    padding: 0 11px;
    border: 1px solid var(--border-input);
    border-radius: var(--radius);
    background: var(--bg-surface);
    color: var(--text-primary);
    font-family: var(--font);
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
    transition:
        border-color var(--transition),
        box-shadow var(--transition),
        background var(--transition);
}

.date-range__trigger:hover {
    border-color: var(--secondary);
}

.date-range__trigger.is-open,
.date-range__trigger:focus-visible {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 29, 149, 0.11);
}

.date-range__icon {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    color: var(--primary);
}

.date-range__value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}

.date-range__trigger.is-empty .date-range__value {
    color: var(--text-gray);
}

.date-range__chevron {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: var(--text-gray);
    transition: transform var(--transition);
}

.date-range__chevron.is-open {
    transform: rotate(180deg);
}

/* ── Popover ───────────────────────────────────────────────────────────── */
.date-range__popover {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 8000;
    width: 340px;
    max-width: calc(100vw - 32px);
    max-height: min(520px, calc(100vh - 120px));
    overflow-y: auto;
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--bg-surface);
    box-shadow:
        var(--shadow-lg),
        0 20px 48px rgba(49, 16, 85, 0.16);
    outline: none;
}

.date-range__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
}

.date-range__month {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
}

.date-range__nav {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-surface);
    color: var(--text-muted);
    cursor: pointer;
    transition:
        background var(--transition),
        color var(--transition),
        border-color var(--transition);
}

.date-range__nav:hover {
    background: var(--primary-soft-2);
    border-color: var(--secondary);
    color: var(--primary);
}

.date-range__nav svg {
    width: 14px;
    height: 14px;
}

.date-range__weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
    margin-bottom: 3px;
}

.date-range__weekdays span {
    padding: 4px 0;
    text-align: center;
    font-size: 9.5px;
    font-weight: 600;
    color: var(--text-gray);
}

.date-range__days {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
}

.date-range__day {
    display: grid;
    place-items: center;
    height: 34px;
    padding: 0;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: var(--text-secondary);
    font-family: var(--font);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition:
        background var(--transition),
        color var(--transition),
        box-shadow var(--transition);
}

.date-range__day:hover:not(.is-blank) {
    background: var(--primary-soft-2);
    color: var(--primary);
}

.date-range__day.is-blank {
    pointer-events: none;
}

.date-range__day.is-in-range {
    border-radius: 0;
    background: var(--primary-soft-2);
    color: var(--primary);
}

.date-range__day.is-start,
.date-range__day.is-end {
    border-radius: 9px;
    background: var(--primary);
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 3px 10px rgba(76, 29, 149, 0.22);
}

.date-range__day.is-today:not(.is-start):not(.is-end) {
    color: var(--primary);
    font-weight: 700;
    box-shadow: inset 0 0 0 1px var(--secondary);
}

.date-range__presets {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--border-light);
}

.date-range__preset {
    height: 28px;
    padding: 0 10px;
    border: 1px solid var(--border);
    border-radius: 9999px;
    background: var(--bg-surface-soft);
    color: var(--text-secondary);
    font-family: var(--font);
    font-size: 11px;
    cursor: pointer;
    transition:
        background var(--transition),
        border-color var(--transition),
        color var(--transition);
}

.date-range__preset:hover {
    background: var(--primary-soft);
    border-color: var(--secondary);
    color: var(--primary);
}

.date-range__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid var(--border-light);
}

.date-range__clear {
    padding: 4px 2px;
    border: none;
    background: transparent;
    color: var(--text-gray);
    font-family: var(--font);
    font-size: 11px;
    cursor: pointer;
    transition: color var(--transition);
}

.date-range__clear:hover {
    color: var(--error);
}

.date-range__actions {
    display: flex;
    gap: 6px;
}

.date-range__action {
    height: 30px;
    padding: 0 12px;
    border-radius: 9999px;
    font-family: var(--font);
    font-size: 11.5px;
    font-weight: 500;
    cursor: pointer;
    transition:
        background var(--transition),
        color var(--transition),
        border-color var(--transition),
        box-shadow var(--transition);
}

.date-range__action--ghost {
    border: 1px solid var(--border);
    background: var(--bg-surface);
    color: var(--text-secondary);
}

.date-range__action--ghost:hover {
    background: var(--primary-soft-2);
    border-color: var(--secondary);
    color: var(--primary);
}

.date-range__action--primary {
    border: none;
    background: var(--primary);
    color: #ffffff;
    box-shadow: 0 4px 10px rgba(76, 29, 149, 0.2);
}

.date-range__action--primary:hover:not(:disabled) {
    background: var(--primary-hover);
}

.date-range__action--primary:disabled {
    background: #ddd6ee;
    color: #6f6685;
    box-shadow: none;
    cursor: not-allowed;
}

/* ── Animation ─────────────────────────────────────────────────────────── */
.date-pop-enter-active,
.date-pop-leave-active {
    transition:
        opacity 0.16s ease,
        transform 0.16s ease;
}

.date-pop-enter-from,
.date-pop-leave-to {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
    .date-pop-enter-active,
    .date-pop-leave-active {
        transition: none;
    }
}
</style>
