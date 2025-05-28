<script setup>
    import {onMounted, ref} from 'vue';
    import jsQR from 'jsqr';
    import {useRouter} from 'vue-router'
    import {onUnmounted} from "@vue/runtime-core";

    const router = useRouter()

    let stream = null;
    const video = ref(null);
    const canvas = ref(null);
    const isCameraPresent = ref(true);  // Чи існують камери

    // Запуск камери
    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
            video.value.srcObject = stream
            scanQRCode(); // Запускаємо сканування після підключення камери
        } catch (error) {
            isCameraPresent.value = false
            stopCamera()
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop()
                stream.removeTrack(track);
            });
            stream = null;
        }
    };

    const inviteFormatter = () => `${import.meta.env.VITE_API_BASE_URL}/login/`;
    // Функція для сканування QR-коду
    const scanQRCode = () => {
        const context = canvas.value.getContext('2d');

        const scan = () => {
            if (video.value && video.value.readyState === video.value.HAVE_ENOUGH_DATA) {
                canvas.value.width = video.value.videoWidth;
                canvas.value.height = video.value.videoHeight;
                context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
                const imageData = context.getImageData(0, 0, canvas.value.width, canvas.value.height);
                const code = jsQR(imageData.data, canvas.value.width, canvas.value.height);

                if (code) {
                    if (code.data.startsWith(inviteFormatter())) {
                        const token = code.data.slice(inviteFormatter().length); // Витягуємо все, що йде після префікса
                        if (token) {
                            router.push(`/invite/${token}`)
                            stopCamera()
                            return
                        }
                    }
                }
            }
            requestAnimationFrame(scan); // Запускаємо сканування в циклі
        };
        scan();
    };

    const back = () => {
        router.push("/employees")
    }

    onMounted(() => startCamera());
    onUnmounted(() => stopCamera());

</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="flex items-center justify-between">
            <button @click="back()" class="block text-sm/6 font-medium text-gray-900 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 12H8"/>
                    <path d="m12 8-4 4 4 4"/>
                </svg>
            </button>
        </div>

        <div v-if="isCameraPresent" class="text-center my-2 text-sm/6 font-medium text-gray-900">Сканування QR-коду
        </div>
        <div v-if="isCameraPresent">
            <video ref="video" autoplay></video>
            <canvas ref="canvas" style="display: none;"></canvas>
        </div>
        <div v-if="!isCameraPresent" class="text-center my-2 font-medium text-gray-900">
            У Вас відсутні камери для сканування QR коду
        </div>
    </div>
</template>

<style scoped>
    video {
        width: 100%;
        max-width: 600px;
        border: 1px solid #000;
    }
</style>
