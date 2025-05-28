<script setup>
    defineProps({
        title: String,
        message: String,
        yesText: String,
        noText: String
    });

    const emit = defineEmits(['clickYes', 'clickNo', 'clickCancel'])
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
            <h2 class="text-xl font-semibold mb-4 whitespace-normal overflow-hidden">{{title}}</h2>
            <p class="mb-4">{{message}}</p>
            <div class="flex justify-end text-sm">
                <button v-if="yesText"
                        @click="emit('clickYes')" class="bg-green-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-green-900 text-white px-2 py-2 mr-6 rounded-lg">
                    {{yesText}}
                </button>
                <button v-if="noText" @click="emit('clickNo')" class="bg-blue-700 transition delay-50 duration-300 ease-in-out hover:scale-110 hover:bg-blue-900 text-white px-2 py-2 rounded-lg">
                    {{noText}}
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>
