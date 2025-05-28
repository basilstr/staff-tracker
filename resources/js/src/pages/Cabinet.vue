<script setup>
    import PromtYesNo from "../components/PromtYesNo.vue";
    import QrcodeVue from 'qrcode.vue'

    import {computed, ref, watch, onMounted, onUnmounted} from 'vue';
    import {useRouter} from 'vue-router'

    const router = useRouter()

    import {useCaseSaveUser} from "../composables/usecases/user/useCaseSaveUser";
    import {useCaseDeleteUser} from "../composables/usecases/user/useCaseDeleteUser";
    import {useCaseGetInviteUser} from "../composables/usecases/user/useCaseGetInviteUser";

    const {loading: loadingPostUser, error: errorPostUser, authError: authPostError, saveUser: saveUser, cancelRequest: cancelSaveRequesUser} = useCaseSaveUser();
    const {loading: loadingDeleteUser, error: errorDeleteUser, authError: authDeleteError, deleteUser: deleteUser, cancelRequest: cancelDeleteRequest} = useCaseDeleteUser();
    const {invite: invite, loading: loadingInvite, error: errorInvite, authError: authInviteError, fetchInvite: fetchInvite, cancelRequest: cancelRequestInvite} = useCaseGetInviteUser();

    const userEmail = ref(localStorage.getItem('userEmail'))
    const userName = ref(localStorage.getItem('userName'))
    const userPassword = ref('')
    const savedUser = ref(true)
    const intentBack = ref(false)
    const intentBackShow = ref(false)
    const intentDelUser = ref(false)
    const countdown = ref('') // поле для таймеру зворотнього виклику

    const cancelAllRequests = () => {
        cancelSaveRequesUser()
        cancelDeleteRequest()
        cancelRequestInvite()
    }
    // ------------------------- Back --------------------------------------------
    const back = () => {
        if (!savedUser.value) {
            intentBackShow.value = true
        }
        intentBack.value = true
    }
    const backAction = computed(() => {
        return intentBack.value && savedUser.value
            && !loadingPostUser.value && !errorPostUser.value
            && !loadingDeleteUser.value && !errorDeleteUser.value
    })
    watch(backAction, () => {
        if (backAction.value) {
            cancelAllRequests()
            router.push('/employees')
        }
    })

    // ---------------------------------------------------------------------------
    const isEditUser = computed(() => {
        return !loadingPostUser.value && !errorPostUser.value
            && !loadingDeleteUser.value && !errorDeleteUser.value
    })

    const isLoading = computed(() => {
        return loadingPostUser.value || loadingDeleteUser.value
    })

    const saveEnable = computed(() => {
        return !savedUser.value && userName.value.length > 0
    })

    const save = () => {
        if (!saveEnable.value) return
        saveUser(userName.value, userPassword.value, savedUser)
    }

    const exit = (isSave) => {
        intentBackShow.value = false
        if (isSave) {
            saveUser(userName.value, userPassword.value, savedUser)
        }
        intentBack.value = true
        savedUser.value = true
    }

    watch(userName, () => {
        savedUser.value = false;
    });
    watch(userPassword, () => {
        savedUser.value = false;
    });

    const cancelPost = () => {
        errorPostUser.value = null
        savedUser.value = false;
    }

    const cancel = () => {
        intentBackShow.value = false
    }

    const deleteUserConfirm = () => {
        intentDelUser.value = false
        savedUser.value = true;
        deleteUser(intentBack)
    }

    const delUser = () => {
        intentDelUser.value = true
    }

    const cancelDelUser = () => {
        intentDelUser.value = false
    }

    const cancelDeleteError = () => {
        errorDeleteUser.value = null
    }

    watch(loadingInvite, () => {
        if (!loadingInvite.value) {
            startCountdown()
        }
    })

    // INVITE
    let timer
    const startCountdown = () => {
        timer = setInterval(() => {
            if (!loadingInvite.value && !errorInvite.value) {
                const seconds = Math.floor(((new Date(invite.value.expiredAt)).getTime() - (new Date()).getTime()) / 1000)
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                let res = ''
                if (hours > 0) {
                    res += `${String(hours)} год.`
                } else {
                    if (minutes > 0) {
                        res += `${String(minutes)} хв.`
                    } else {
                        res += `${String(secs)} сек.`
                    }
                }

                if (seconds <= 0) {
                    fetchInvite()
                    countdown.value = 0
                    clearInterval(timer)
                } else {
                    if (countdown.value !== res) countdown.value = res
                }
            }
        }, 1000);
    };

    const logoutAction = async () => {
        await logout();
        await router.push('/login');
    };

    onMounted(() => {
        fetchInvite()
    });
    onUnmounted(() => clearInterval(timer));
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="flex items-center justify-between">
            <button @click="back()" class="block text-sm/6 font-medium text-gray-900 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="lucide lucide-circle-arrow-left">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 12H8"/>
                    <path d="m12 8-4 4 4 4"/>
                </svg>
            </button>
            <div v-if="isEditUser" class="flex text-sm text-center">
                <button @click="delUser()" id="del-user"
                        class="block text-sm/6 font-medium text-gray-900 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         class="lucide lucide-trash-2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                </button>
            </div>
        </div>
        <div v-if="isEditUser" class="mt-4">
            <div>
                <div class="my-2 flex border-b-1 border-gray-300">
                    <div class="text-sm/6 font-medium text-gray-900">Email:</div>
                    <div class="ml-2 italic">{{userEmail}}</div>
                </div>
            </div>
            <div>
                <label for="name" class="block text-sm/6 font-medium text-gray-900">Ім'я</label>
                <div class="mt-2">
                    <input v-model="userName" type="text" id="name" maxlength="255"
                           class="w-full border-1 border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           :class="{ 'focus:ring-1 focus:ring-blue-500': userName,
                        'border-gray-300': userName,
                        'border-red-500': !userName,
                        'focus:ring-1 focus:ring-red-500': !userName}"
                    />
                    <div class="ml-2 text-xs"
                         :class="{'text-red-400/0': userName, 'text-red-400/100': !userName}">Ім'я не може бути порожнім
                    </div>
                </div>
            </div>
            <div>
                <label for="password" class="block text-sm/6 font-medium text-gray-900">Пароль</label>
                <div class="mt-2">
                    <input v-model="userPassword" type="password" id="password" maxlength="255"
                           class="w-full border-1 border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
            </div>

            <button @click="save()"
                    class="w-full rounded-full p-2 text-white text-center text-lg font-bold my-6"
                    :class="{ 'bg-blue-700 hover:bg-blue-900': saveEnable, 'bg-gray-400': !saveEnable }">
                ЗБЕРЕГТИ
            </button>
            <div v-if="!loadingInvite && !errorInvite && countdown">
                <div class="flex items-center justify-center">
                    <div class="text-center">
                        <p class="text-lg font-medium">Запрошення в систему</p>
                        <qrcode-vue class="mx-auto w-1/2 mt-2" :size="200" :value="invite.invite"/>
                        <p>термін закінчиться через: {{countdown}}</p>
                    </div>
                </div>
            </div>
            <div v-if="loadingInvite">
                <div class="text-center">
                    <div role="status">
                        <svg aria-hidden="true" class="inline w-8 h-8 text-gray-300 animate-spin fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isLoading">
        <div class="text-center">
            <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-300 animate-spin fill-blue-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
    <div v-if="errorPostUser">
        <PromtYesNo
            title="Помилка"
            :message="errorPostUser"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="save()"
            @click-no="cancelPost()"
            @click-cancel="cancelPost()"
        />
    </div>
    <div v-if="intentBackShow && saveEnable" class="modal-overlay">
        <PromtYesNo
            title="Попередження"
            message="У Вас є не збережені дані."
            yesText="Зберегти та вийти"
            noText="Не зберігати"
            @click-yes="exit(true)"
            @click-no="exit(false)"
            @click-cancel="cancel()"
        />
    </div>
    <div v-if="intentBackShow && !saveEnable" class="modal-overlay">
        <PromtYesNo
            title="Попередження"
            message="У Вас є не збережені дані але вони некоректні. Збереження не можливе."
            noText="Не зберігати"
            @click-no="exit(false)"
            @click-cancel="cancel()"
        />
    </div>
    <div v-if="intentDelUser" class="modal-overlay">
        <PromtYesNo
            title="Попередження"
            message="При видаленні користувача всі повязані із ним дані теж будуть видалені. Відновлення даних буде неможливим. Ви впевнені у видаленні?"
            yesText="Так, видалити"
            noText="Відмінити"
            @click-yes="deleteUserConfirm()"
            @click-no="cancelDelUser()"
            @click-cancel="cancelDelUser()"
        />
    </div>
    <div v-if="errorDeleteUser" class="modal-overlay">
        <PromtYesNo
            title="Помилка"
            :message="errorDeleteUser"
            yesText="Повторити"
            noText="Відміна"
            @click-yes="deleteUser()"
            @click-no="cancelDeleteError()"
            @click-cancel="cancelDeleteError()"
        />
    </div>
    <div v-if="authPostError || authDeleteError || authInviteError">
        <PromtYesNo
            title="Помилка"
            message="Облікові дані невірні"
            yesText="OK"
            @click-yes="logoutAction"
            @click-cancel="logoutAction"
        />
    </div>
</template>

<style scoped>

</style>
