<template>
  <div>
    <h1 class="text-2xl font-bold mb-4 text-slate-700">{{ header }}</h1>
  </div>
</template>

<script setup>
const props = defineProps({
  header: {
    type: String,
    required: true
  }
})
</script>
