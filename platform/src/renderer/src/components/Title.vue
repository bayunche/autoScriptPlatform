
<template>
    <div class="flex  items-center mb-5">
        <p class="text-xl font-bold mr-2">{{title}}</p>
    </div>
</template>

<script setup>

const props = defineProps({
    title: String
})

</script>
