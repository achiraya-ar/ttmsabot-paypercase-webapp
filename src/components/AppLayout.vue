<template>
    <div class="app-shell">
        <header class="top-bar">
            <RouterLink to="/import" class="top-bar__brand">
                <LogoIcon :size="32" />
                <span class="top-bar__titles">
                    <span class="top-bar__name-row">
                        <span class="top-bar__name">PayPerCase</span>
                        <span class="top-bar__badge">WEB</span>
                    </span>
                    <span class="top-bar__sub"
                        >ระบบจัดการค่าตอบแทนพนักงานนวดแผนไทย</span
                    >
                </span>
            </RouterLink>

            <nav class="top-bar__nav" aria-label="เมนูหลัก">
                <RouterLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    class="nav-pill"
                    :class="{ active: isActive(item.to) }"
                >
                    <span
                        class="nav-pill__icon"
                        v-html="item.icon"
                        aria-hidden="true"
                    />
                    <span>{{ item.label }}</span>
                </RouterLink>
            </nav>

            <div class="top-bar__right">
                <button
                    type="button"
                    class="top-bar__logout"
                    title="ออกจากระบบ"
                    aria-label="ออกจากระบบ"
                    @click="handleLogout"
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
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                </button>
            </div>
        </header>

        <main class="workspace">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LogoIcon from "./LogoIcon.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

function isActive(path) {
    return route.path === path || route.path.startsWith(path + "/");
}

async function handleLogout() {
    authStore.logout();
    await router.push({ name: "login" });
}

const navItems = [
    {
        to: "/import",
        label: "นำเข้าข้อมูล",
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>`,
    },
    {
        to: "/records",
        label: "ประวัติค่าตอบแทน",
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                 M9 5a2 2 0 002 2h2a2 2 0 002-2
                 M9 5a2 2 0 012-2h2a2 2 0 012 2
                 m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
      </svg>`,
    },
    {
        to: "/export",
        label: "ส่งออกรายงาน",
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0
                 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0
                 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
    },
];
</script>

<style scoped>
.app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: var(--bg-main);
}

/* ── Top bar (mirrors the desktop program's AppMenuBar) ────────────────── */
.top-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    height: 58px;
    padding: 0 18px;
    flex-shrink: 0;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 50;
}

.top-bar__brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px 7px;
    border: 1px solid transparent;
    border-radius: 10px;
    color: inherit;
    text-decoration: none;
    transition:
        background 0.15s,
        border-color 0.15s;
}

.top-bar__brand:hover {
    border-color: var(--border);
    background: var(--primary-soft-2);
}

.top-bar__titles {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    min-width: 0;
}

.top-bar__name-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.top-bar__name {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.25px;
    color: var(--text-primary);
}

.top-bar__badge {
    padding: 1px 6px;
    border: 1px solid var(--border);
    border-radius: 9999px;
    background: var(--primary-soft-2);
    color: var(--primary);
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.6;
}

.top-bar__sub {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 10.5px;
    color: var(--text-gray);
}

/* ── Nav pills ─────────────────────────────────────────────────────────── */
.top-bar__nav {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 4px;
    flex-shrink: 0;
    border: 1px solid var(--border);
    border-radius: 9999px;
    background: var(--primary-soft-2);
}

.nav-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 13px;
    border-radius: 9999px;
    color: var(--text-muted);
    font-size: 11.5px;
    font-weight: 500;
    white-space: nowrap;
    text-decoration: none;
    transition:
        background 0.15s,
        color 0.15s,
        box-shadow 0.15s;
}

.nav-pill:hover {
    background: rgba(255, 255, 255, 0.75);
    color: var(--primary);
}

.nav-pill.active {
    background: var(--bg-surface);
    color: var(--primary);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(49, 16, 85, 0.13);
}

.nav-pill__icon {
    display: inline-flex;
    width: 14px;
    height: 14px;
}

.nav-pill__icon :deep(svg) {
    width: 14px;
    height: 14px;
}

/* ── Logout ────────────────────────────────────────────────────────────── */
.top-bar__right {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.top-bar__logout {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-surface-soft);
    color: var(--text-muted);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
}

.top-bar__logout:hover {
    background: var(--error-soft);
    border-color: #f7b6b0;
    color: var(--error);
}

.top-bar__logout svg {
    width: 16px;
    height: 16px;
}

/* ── Workspace ─────────────────────────────────────────────────────────── */
.workspace {
    flex: 1;
    min-height: 0;
    background:
        radial-gradient(
            900px 520px at 94% -12%,
            rgba(124, 58, 237, 0.07),
            transparent 60%
        ),
        radial-gradient(
            640px 420px at 2% 108%,
            rgba(255, 171, 145, 0.09),
            transparent 62%
        ),
        var(--bg-main);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 940px) {
    .top-bar {
        height: auto;
        flex-wrap: wrap;
        gap: 8px 12px;
        padding: 10px 14px;
    }

    .top-bar__brand {
        order: 1;
    }

    .top-bar__right {
        order: 2;
    }

    .top-bar__nav {
        order: 3;
        width: 100%;
        overflow-x: auto;
        justify-content: flex-start;
        border-radius: 9999px;
    }
}

@media (max-width: 640px) {
    .top-bar__sub {
        display: none;
    }

    .nav-pill {
        flex: 1;
        justify-content: center;
        padding: 7px 10px;
        font-size: 11px;
    }
}
</style>
