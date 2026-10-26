<template>
    <img
        :src="iconSrc"
        :width="size"
        :height="size"
        alt="PayPerCase"
        class="ppc-logo"
        v-bind="$attrs"
    />
</template>

<script setup>
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

defineProps({
    size: {
        type: [String, Number],
        default: 40,
    },
});

const iconSrc = computed(() => `${import.meta.env.BASE_URL}app-icon.svg`);
</script>

<style scoped>
.ppc-logo {
    display: block;
    flex-shrink: 0;
    border-radius: 9px;
    object-fit: contain;
}
</style>
