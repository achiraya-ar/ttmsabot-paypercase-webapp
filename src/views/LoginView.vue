<template>
    <div class="login">
        <aside class="login__brand">
            <div class="login__aurora login__aurora--one" aria-hidden="true" />
            <div class="login__aurora login__aurora--two" aria-hidden="true" />
            <div class="login__grid" aria-hidden="true" />

            <header class="login__brand-top">
                <LogoIcon :size="44" class="login__brand-mark" />
                <div class="login__brand-titles">
                    <span class="login__brand-name">PayPerCase</span>
                    <span class="login__brand-sub"
                        >ระบบจัดการค่าตอบแทนพนักงานนวดแผนไทย</span
                    >
                </div>
            </header>

            <div class="login__stage">
                <h1 class="login__headline">
                    ค่าตอบแทน<br />
                    <span>ที่ตรวจสอบได้</span>
                </h1>

                <div class="login__art" aria-hidden="true">
                    <img
                        src="/login-money.svg"
                        alt=""
                        class="login__art-illustration"
                    />
                </div>
            </div>

            <p class="login__brand-foot">
                © {{ year }} rxdevman · PayPerCase
            </p>
        </aside>

        <main class="login__main">
            <div class="login__card-wrap">
                <div class="login__mobile-brand">
                    <LogoIcon :size="42" />
                    <div>
                        <strong>PayPerCase</strong>
                        <span>ระบบจัดการค่าตอบแทนพนักงานนวดแผนไทย</span>
                    </div>
                </div>

                <section class="login__card" :aria-busy="isLoading">
                    <div class="login__window-bar" aria-hidden="true">
                        <span class="login__window-dots">
                            <i></i><i></i><i></i>
                        </span>
                        <span class="login__window-title">PayPerCase Web</span>
                    </div>

                    <header class="login__card-head">
                        <div>
                            <h2 class="login__card-title">เข้าสู่ระบบ</h2>
                        </div>
                    </header>

                    <form class="login__form" novalidate @submit.prevent="handleLogin">
                        <label class="login__field">
                            <span>รหัสผ่าน</span>
                            <span class="login__password">
                                <input
                                    v-model="password"
                                    class="login__input"
                                    :type="showPassword ? 'text' : 'password'"
                                    placeholder="กรอกรหัสผ่าน"
                                    autocomplete="current-password"
                                    :disabled="isLoading"
                                    @input="errorMessage = ''"
                                />
                                <button
                                    type="button"
                                    class="login__eye"
                                    :aria-label="
                                        showPassword
                                            ? 'ซ่อนรหัสผ่าน'
                                            : 'แสดงรหัสผ่าน'
                                    "
                                    :title="
                                        showPassword
                                            ? 'ซ่อนรหัสผ่าน'
                                            : 'แสดงรหัสผ่าน'
                                    "
                                    tabindex="-1"
                                    @click="showPassword = !showPassword"
                                >
                                    <svg
                                        v-if="showPassword"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19
                           c-4.478 0-8.268-2.943-9.543-7
                           a9.97 9.97 0 011.563-3.029
                           m5.858.908a3 3 0 114.243 4.243
                           M9.878 9.878l4.242 4.242
                           M9.88 9.88l-3.29-3.29
                           m7.532 7.532l3.29 3.29
                           M3 3l3.59 3.59
                           m0 0A9.953 9.953 0 0112 5
                           c4.478 0 8.268 2.943 9.543 7
                           a10.025 10.025 0 01-4.132 5.411
                           m0 0L21 21"
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5
                           c4.478 0 8.268 2.943 9.542 7
                           -1.274 4.057-5.064 7-9.542 7
                           -4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </label>

                        <Transition name="notice">
                            <p v-if="errorMessage" class="login__error" role="alert">
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
                                <span>{{ errorMessage }}</span>
                            </p>
                        </Transition>

                        <button
                            type="submit"
                            class="login__submit"
                            :class="{ 'is-busy': isLoading }"
                            :disabled="isLoading || !password.trim()"
                        >
                            <svg
                                v-if="isLoading"
                                class="login__spinner"
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
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                            <span>{{
                                isLoading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"
                            }}</span>
                        </button>
                    </form>
                </section>

            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LogoIcon from "@/components/LogoIcon.vue";

const router = useRouter();
const authStore = useAuthStore();

const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const year = new Date().getFullYear();

async function handleLogin() {
    const pw = password.value.trim();
    if (!pw || isLoading.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        await authStore.login(pw);
        router.push({ name: "import" });
    } catch (err) {
        errorMessage.value = err.message;
        password.value = "";
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.login {
    display: grid;
    grid-template-columns: minmax(390px, 0.92fr) minmax(500px, 1.08fr);
    min-height: 100vh;
    background: var(--bg-surface);
}

/* ── Brand panel ───────────────────────────────────────────────────────── */
.login__brand {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 44px 42px 30px;
    background:
        radial-gradient(
            circle at 92% 8%,
            rgba(124, 58, 237, 0.11),
            transparent 34%
        ),
        radial-gradient(
            circle at 8% 94%,
            rgba(255, 171, 145, 0.2),
            transparent 40%
        ),
        linear-gradient(165deg, #f6f1ff 0%, #fdf6ef 58%, #ffffff 100%);
    border-right: 1px solid var(--border);
}

.login__aurora {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(64px);
}

.login__aurora--one {
    top: -22%;
    right: -18%;
    width: 66%;
    aspect-ratio: 1;
    background: rgba(124, 58, 237, 0.14);
    animation: login-drift 22s ease-in-out infinite alternate;
}

.login__aurora--two {
    bottom: -28%;
    left: -20%;
    width: 70%;
    aspect-ratio: 1;
    background: rgba(255, 171, 145, 0.2);
    animation: login-drift 28s ease-in-out infinite alternate-reverse;
}

.login__grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(76, 29, 149, 0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(76, 29, 149, 0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    -webkit-mask-image: radial-gradient(
        ellipse at 50% 45%,
        #000 5%,
        transparent 72%
    );
    mask-image: radial-gradient(
        ellipse at 50% 45%,
        #000 5%,
        transparent 72%
    );
    pointer-events: none;
}

.login__brand-top {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
}

.login__brand-mark {
    box-shadow: 0 12px 26px rgba(49, 16, 85, 0.16);
}

.login__brand-titles {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.login__brand-name {
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: var(--text-primary);
}

.login__brand-sub {
    font-size: 11.5px;
    color: var(--text-muted);
}

.login__stage {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin: 16px 0;
    animation: login-rise 0.6s ease both;
}

.login__headline {
    margin: 0;
    text-align: center;
    font-size: clamp(30px, 3vw, 36px);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.8px;
    color: var(--text-primary);
}

.login__headline span {
    background: linear-gradient(100deg, #4c1d95 10%, #7c3aed 48%, #f08a6b);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.login__art {
    position: relative;
    width: min(100%, 520px);
    margin-top: 2px;
    animation: login-float 9s ease-in-out infinite;
}

.login__art-illustration {
    display: block;
    width: 100%;
    height: auto;
    filter: drop-shadow(0 18px 32px rgba(49, 16, 85, 0.08));
}

.login__brand-foot {
    position: relative;
    z-index: 2;
    font-size: 10.5px;
    color: var(--text-gray);
}

/* ── Form panel ────────────────────────────────────────────────────────── */
.login__main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 0;
    min-height: 100vh;
    overflow-y: auto;
    padding: 64px 40px 40px;
    background:
        radial-gradient(
            620px 460px at 86% 10%,
            rgba(124, 58, 237, 0.05),
            transparent 62%
        ),
        radial-gradient(
            480px 380px at 12% 94%,
            rgba(255, 171, 145, 0.08),
            transparent 65%
        ),
        var(--bg-surface-soft);
}

.login__card-wrap {
    width: 100%;
    max-width: 440px;
    min-width: 0;
    animation: login-rise 0.55s ease both;
}

.login__mobile-brand {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 11px;
    max-width: 100%;
    margin-bottom: 22px;
}

.login__mobile-brand div {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.25;
}

.login__mobile-brand strong {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.login__mobile-brand span {
    font-size: 10.5px;
    color: var(--text-muted);
}

.login__card {
    --card-pad: 30px;
    position: relative;
    overflow: hidden;
    padding: var(--card-pad);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
    box-shadow: var(--shadow-lg);
}

/* ── macOS-style window bar ────────────────────────────────────────────── */
.login__window-bar {
    position: relative;
    display: flex;
    align-items: center;
    margin:
        calc(var(--card-pad) * -1) calc(var(--card-pad) * -1) 24px;
    padding: 11px 14px;
    border-bottom: 1px solid var(--border-light);
    background: linear-gradient(180deg, #fbfaff 0%, #f7f4ff 100%);
}

.login__window-dots {
    display: inline-flex;
    gap: 6px;
}

.login__window-dots i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.12);
}

.login__window-dots i:nth-child(1) {
    background: #ff5f57;
}

.login__window-dots i:nth-child(2) {
    background: #febc2e;
}

.login__window-dots i:nth-child(3) {
    background: #28c840;
}

.login__window-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: var(--text-gray);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
}

.login__card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 22px;
}

.login__card-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.5px;
    color: var(--text-primary);
}

.login__form {
    display: grid;
    gap: 15px;
}

.login__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-secondary);
}

.login__input {
    width: 100%;
    height: 42px;
    padding: 0 13px;
    border: 1px solid var(--border-input);
    border-radius: var(--radius);
    background: var(--bg-surface);
    color: var(--text-primary);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 400;
    outline: none;
    transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;
}

.login__input::placeholder {
    color: var(--text-gray);
}

.login__input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(76, 29, 149, 0.12);
}

.login__input:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.login__password {
    position: relative;
    display: block;
}

.login__password .login__input {
    padding-right: 44px;
}

.login__eye {
    position: absolute;
    top: 50%;
    right: 8px;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--text-gray);
    cursor: pointer;
    transform: translateY(-50%);
    transition:
        background 0.15s ease,
        color 0.15s ease;
}

.login__eye:hover {
    background: var(--primary-soft-2);
    color: var(--primary);
}

.login__eye svg {
    width: 16px;
    height: 16px;
}

.login__error {
    display: flex;
    align-items: flex-start;
    gap: 7px;
    padding: 9px 11px;
    border: 1px solid #f7b6b0;
    border-radius: 8px;
    background: var(--error-soft);
    color: var(--error);
    font-size: 11.5px;
    line-height: 1.45;
}

.login__error svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    margin-top: 1px;
}

.login__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 44px;
    margin-top: 2px;
    border: none;
    border-radius: 9999px;
    background: var(--primary);
    color: #fff;
    font-family: var(--font);
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(76, 29, 149, 0.2);
    transition:
        background 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.15s ease,
        opacity 0.15s ease;
}

.login__submit svg {
    width: 16px;
    height: 16px;
}

.login__submit:hover:not(:disabled) {
    background: var(--primary-hover);
    box-shadow: 0 12px 28px rgba(76, 29, 149, 0.26);
}

.login__submit:active:not(:disabled) {
    transform: translateY(1px);
}

.login__submit:disabled {
    background: #ddd6ee;
    color: #6f6685;
    box-shadow: none;
    cursor: not-allowed;
}

.login__submit.is-busy {
    cursor: progress;
}

.login__spinner {
    animation: login-spin 0.8s linear infinite;
}

.notice-enter-active,
.notice-leave-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}

.notice-enter-from,
.notice-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

@keyframes login-rise {
    from {
        opacity: 0;
        transform: translateY(14px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes login-drift {
    to {
        transform: translate3d(26px, 22px, 0) scale(1.06);
    }
}

@keyframes login-float {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-7px);
    }
}

@keyframes login-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-height: 760px) {
    .login__main {
        padding: 60px 32px 28px;
    }

    .login__art {
        width: min(100%, 410px);
    }

    .login__headline {
        font-size: 30px;
    }

    .login__card {
        --card-pad: 26px;
    }
}

@media (max-width: 1000px) {
    .login {
        grid-template-columns: minmax(0, 1fr);
    }

    .login__brand {
        display: none;
    }

    .login__main {
        padding: 56px 24px 24px;
    }

    .login__mobile-brand {
        display: flex;
    }
}

@media (max-width: 700px) {
    .login__card {
        --card-pad: 24px;
        border-radius: 14px;
    }

    .login__card-title {
        font-size: 22px;
    }

    .login__window-bar {
        margin-bottom: 20px;
        padding: 10px 12px;
    }
}

@media (max-width: 380px) {
    .login__window-title {
        display: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .login__stage,
    .login__card-wrap,
    .login__aurora,
    .login__art {
        animation: none;
    }

    .notice-enter-active,
    .notice-leave-active {
        transition: none;
    }
}
</style>
