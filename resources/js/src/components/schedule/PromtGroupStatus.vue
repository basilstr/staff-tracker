<script setup>
    import {computed} from 'vue';

    const props = defineProps({
        day: String,
        statusText: String,
    });

    const emit = defineEmits(['clickYes', 'clickNo', 'clickCancel'])
    const formatDay = computed(() => {
        const [y, m, d] = props.day.split('-')
        return {d:d,m:m,y:y}
    })
</script>

<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="p-6 bg-white rounded-lg shadow-lg w-80 relative">
            <div class="absolute top-2 right-2">
                <button @click="emit('clickCancel')" class="hover:bg-gray-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
                              fill="#1D1B20"/>
                    </svg>
                </button>
            </div>
            <h2 class="font-semibold mt-2">Групове встановлення статусу</h2>
            <p class="mt-2 break-words whitespace-normal w-full">
                Встановити статус
                <span class="font-semibold">"{{props.statusText}}"</span>&nbsp;
                <span class="font-semibold">{{formatDay.d}}.{{formatDay.m}}.{{formatDay.y}}</span>
                для всіх
            </p>
            <div class="flex justify-end mt-4">
                <button @click="emit('clickYes')" class="bg-green-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-green-900 text-white px-4 py-2 mr-6 rounded-lg">
                    Встановити
                </button>
                <button @click="emit('clickNo')" class="bg-blue-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-blue-900 text-white px-4 py-2 rounded-lg">
                    Відмінити
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>
