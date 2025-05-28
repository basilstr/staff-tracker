<script setup>
    import PromtYesNo from "../components/PromtYesNo.vue";
    import QrcodeVue from 'qrcode.vue'

    import {APP_CONSTANTS} from '../constants.js';

    import {computed, nextTick, ref, watch, onMounted, onUnmounted} from 'vue';
    import {useRouter} from 'vue-router'

    const router = useRouter()

    import {useCaseGetEmployee} from "../composables/usecases/emploee/useCaseGetEmployee";
    import {useCaseSaveEmployee} from "../composables/usecases/emploee/useCaseSaveEmployee";
    import {useCaseDeleteEmployee} from "../composables/usecases/emploee/useCaseDeleteEmployee";
    import {useCaseGetRanks} from "../composables/usecases/rank/useCaseGetRanks";
    import {useCaseGetInviteGroup} from "../composables/usecases/emploee/useCaseGetInviteGroup";
    import {useEmployeesStore} from "../composables/store/employeesStore.js";
    import {useRanksStore} from "../composables/store/ranksStore.js";
    import {logout} from "../firebase";
    import {storeToRefs} from "pinia";
    import {useCaseGetEmployees} from "../composables/usecases/employees/useCaseGetEmployees";

    const employeesStore = useEmployeesStore();
    const {employeesVisible: employees, employeeUser} = storeToRefs(employeesStore);
    const ranksStore = useRanksStore();
    const {ranks} = storeToRefs(ranksStore);

    const {loading: loadingEmployees, error: errorEmployees, authError: authEmployeesError, fetchEmployees: fetchEmployees, cancelRequest: cancelEmployeesRequest} = useCaseGetEmployees(employeesStore);
    const {employee: employee, loading: loadingGetEmployee, error: errorGetEmployee, authError: authGetError, fetchEmployee: fetchEmployee, cancelRequest: cancelGetRequestEmployee} = useCaseGetEmployee(employeesStore);
    const {loading: loadingPostEmployee, error: errorPostEmployee, authError: authPostError, saveEmployee: saveEmployee, cancelRequest: cancelSaveRequestEmployee} = useCaseSaveEmployee(employeesStore);
    const {loading: loadingDeleteEmployee, error: errorDeleteEmployee, authError: authDeleteError, deleteEmployee: deleteEmployee, cancelRequest: cancelDeleteRequest} = useCaseDeleteEmployee(employeesStore);
    const {loading: loadingRanks, error: errorRanks, authError: authRanksError, fetchRanks: fetchRanks, cancelRequest: cancelRequestRanks} = useCaseGetRanks(ranksStore);
    const {invite: invite, loading: loadingInvite, error: errorInvite, authError: authInviteError, fetchInvite: fetchInvite, cancelRequest: cancelRequestInvite} = useCaseGetInviteGroup(employeesStore);

    const editedEmployee = ref(null)
    const userRank = ref(0)
    const selfUser = ref(false)
    const isShowInvite = ref(null)
    const needSave = ref(false)
    const intentBack = ref(false)
    const intentBackShow = ref(false)
    const intentDelEmployee = ref(false)
    const countdown = ref('') // поле для таймеру зворотнього виклику
    const denyMessage = ref('') // інформування про заборону редагування

    const id = Number(router.currentRoute.value.params.id) || 0

    const cancelAllRequests = () => {
        cancelEmployeesRequest()
        cancelGetRequestEmployee()
        cancelSaveRequestEmployee()
        cancelDeleteRequest()
        cancelRequestRanks()
        cancelRequestInvite()
    }
    // ------------------------- Back --------------------------------------------
    const back = () => {
        if (needSave.value) {
            intentBackShow.value = true
        }
        intentBack.value = true
    }

    const backAction = computed(() => {
        return intentBack.value && !needSave.value
            && !loadingPostEmployee.value && !errorPostEmployee.value
            && !loadingDeleteEmployee.value && !errorDeleteEmployee.value
    })

    watch(backAction, () => {
        if (backAction.value) {
            cancelAllRequests()
            router.push('/employees')
        }
    })
    // ---------------------------------------------------------------------------

    const cloneEditedEmployee = () => {
        editedEmployee.value = JSON.parse(JSON.stringify(employeesStore.getEmployee(id)));

        selfUser.value = Number(localStorage.getItem("userId")) === editedEmployee.value.userId;
        isShowInvite.value = !editedEmployee.value.userId

        if (!selfUser.value && isShowInvite.value) { // самого себе не варто запрошувати в групу (бо ти вже тут є) або якщо вже користувач приєднаний
            fetchInvite(id);
        }

        // визначення rank користувача системи в даній групі
        userRank.value = employeeUser.value ? employeeUser.value.rank : APP_CONSTANTS.RANK_FORBIDDEN
        if (userRank.value < APP_CONSTANTS.RANK_ADMINISTRATOR) { // тільки адміни і вище мають право для редагування
            denyMessage.value = 'У Вас недостатньо прав для редагування користувача'
        }

        // так як при заповненні спрацюють watch-ери і встановлять те, що були зміни, то на наступній ітерації виставляємо змінну needSave
        nextTick(() => {
            needSave.value = false;
        });
    }

    watch(employees, () => {
        cloneEditedEmployee()
    }, {deep: true})

    watch(employee, () => {
        console.log('employee changed', employee.value.unitId)
        if (employeesStore.isEmptyEmployees(employee.value.unitId)) {
            fetchEmployees(employee.value.unitId)
        } else {
            cloneEditedEmployee()
        }
    }, {deep: true})

    watch(editedEmployee, () => {
        needSave.value = true
    }, {deep: true})

    watch(loadingInvite, () => {
        if (!loadingInvite.value) {
            startCountdown()
        }
    })

    const authError = computed(() => {
        return authGetError.value
            || authPostError.value
            || authDeleteError.value
            || authRanksError.value
            || authInviteError.value
            || authEmployeesError.value
    })

    const isEditUser = computed(() => {
        return editedEmployee.value
            && !loadingRanks.value && !errorRanks.value
            && !loadingPostEmployee.value && !errorPostEmployee.value
            && !loadingDeleteEmployee.value && !errorDeleteEmployee.value
    })

    const isLoading = computed(() => {
        return loadingGetEmployee.value || loadingRanks.value || loadingPostEmployee.value || loadingDeleteEmployee.value
    })

    const saveEnable = computed(() => {
        return needSave.value && editedEmployee.value.name.length > 0
    })

    const denyExit = () => {
        router.push('/employees')
    }

    const save = () => {
        if (!saveEnable.value) return
        saveEmployee(editedEmployee.value)
    }

    const exit = (isSave) => {
        intentBackShow.value = false
        if (isSave) {
            saveEmployee(editedEmployee.value)
        }
        intentBack.value = true
        needSave.value = false
    }

    const setRank = (rank) => {
        editedEmployee.value.rank = rank
    }

    const filterNumbers = () => {
        editedEmployee.value.sort = editedEmployee.value.sort.replace(/\D/g, '');
        if (editedEmployee.value.sort.length === 0) editedEmployee.value.sort = 0
        editedEmployee.value.sort = Number(editedEmployee.value.sort)
    };

    const cancelPost = () => {
        errorPostEmployee.value = null
        needSave.value = true;
    }

    const cancel = () => {
        intentBack.value = false
        intentBackShow.value = false
    }

    const deleteEmployeeConfirm = () => {
        intentDelEmployee.value = false
        needSave.value = false;
        deleteEmployee(editedEmployee.value.id, intentBack)
    }

    const delEmployee = () => {
        intentDelEmployee.value = true
    }

    const cancelDelEmployee = () => {
        intentDelEmployee.value = false
    }

    const cancelDeleteError = () => {
        errorDeleteEmployee.value = null
    }

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
                    fetchInvite(id)
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
        fetchRanks()
        fetchEmployee(id);
    });

    onUnmounted(() => clearInterval(timer));
</script>

<template>
    <div v-if="denyMessage">
        <PromtYesNo
            title="Помилка"
            :message="denyMessage"
            yesText="OK"
            @click-yes="denyExit"
            @click-cancel="denyExit"
        />
    </div>
    <div v-else>
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
                <div v-if="!selfUser">
                    <div v-if="isEditUser" class="flex text-sm text-center">
                        <button @click="delEmployee"
                                class="block text-sm/6 font-medium text-gray-900 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none"
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
            </div>
            <div v-if="isEditUser" class="mt-4">
                <div>
                    <label for="name" class="block text-sm/6 font-medium text-gray-900">Ім'я</label>
                    <div class="mt-2">
                        <input v-model="editedEmployee.name" type="text" id="name" maxlength="255"
                               class="w-full border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               :class="{ 'focus:ring-1 focus:ring-blue-500': editedEmployee.name,
                        'border-gray-300': editedEmployee.name,
                        'border-red-500': !editedEmployee.name,
                        'focus:ring-1 focus:ring-red-500': !editedEmployee.name}"
                               :style="{ color: editedEmployee.textColor, backgroundColor: editedEmployee.bgColor }"
                        />
                    </div>
                </div>
                <div class="mt-4">
                    <label for="note" class="block text-sm/6 font-medium text-gray-900">Примітка</label>
                    <div class="mt-2">
          <textarea v-model="editedEmployee.note"
                    id="note"
                    name="note"
                    rows="4"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"></textarea>
                    </div>
                </div>
                <label for="setting" class="block text-sm/6 font-medium text-gray-900 mt-4">Налаштування:</label>
                <div id="setting">
                    <div class="flex justify-between items-stretch md:items-center w-full">
                        <div class="flex items-center flex-1 justify-center">
                            <div class="relative inline-block mr-1">
                                <input type="color" v-model="editedEmployee.textColor" id="textColor"
                                       class="w-full absolute inset-0 opacity-0 cursor-pointer">
                                <div class="w-6 h-6 rounded-full border border-gray-300"
                                     :style="{ backgroundColor: editedEmployee.textColor }">
                                    <label for="textColor" class="w-full h-full block cursor-pointer"></label>
                                </div>
                            </div>
                            - текст
                        </div>
                        <div class="flex items-center flex-1 justify-center">
                            <div class="relative inline-block mr-1">
                                <input type="color" v-model="editedEmployee.bgColor" id="bgColor"
                                       class="w-full absolute inset-0 opacity-0 cursor-pointer">
                                <div class="w-6 h-6 rounded-full border border-gray-300"
                                     :style="{ backgroundColor: editedEmployee.bgColor }">
                                    <label for="bgColor" class="w-full h-full block cursor-pointer"></label>
                                </div>
                            </div>
                            - фон
                        </div>
                        <div class="flex items-center flex-1 justify-center">
                            <input v-model="editedEmployee.sort" type="text"
                                   class="w-1/4 text-center border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   @input="filterNumbers()"/>
                            - сортув.
                        </div>
                    </div>
                </div>
                <div v-if="!selfUser">
                    <label for="rank" class="block text-sm/6 font-medium text-gray-900 mt-4">Права редагування:</label>
                    <div id="rank">
                        <div v-for="rank in ranks" :key="rank.id">
                            <div @click="setRank(rank.id)" v-if="rank.id <= userRank" class="flex cursor-pointer my-2">
                                <svg class="w-6 h-6 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     :class="{
                                'text-red-600': rank.id === 10 && editedEmployee.rank === 10,
                                'text-stone-300': (rank.id === 10 && editedEmployee.rank > 10) || (editedEmployee.rank < rank.id && rank.id > 10),
                                'text-green-600': editedEmployee.rank >= rank.id && rank.id > 10,
                                }"
                                     fill="currentColor" viewBox="0 0 22 20">
                                    <path
                                        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                                </svg>
                                <span class="text-gray-900">{{ rank.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <label class="inline-flex items-center cursor-pointer mt-6">
                    <input v-model="editedEmployee.hidden" type="checkbox" value="" class="sr-only peer" checked>
                    <div class="relative w-9 h-5 bg-gray-300 peer-focus:outline-none
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
                after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-800">не в списку групи</span>
                </label>
                <div class="block text-sm/6 text-gray-900 italic">параметр "Не в списку групи" дозволяє користувачу мати встановлені права на групу але не бути її учасником</div>

                <button @click="save()"
                        class="w-full rounded-full p-2 text-white text-center text-lg font-bold my-6"
                        :class="{ 'bg-blue-700 hover:bg-blue-900': saveEnable, 'bg-gray-400': !saveEnable }">
                    ЗБЕРЕГТИ
                </button>
                <div v-if="isShowInvite">
                    <div v-if="!loadingInvite && !errorInvite && countdown">
                        <div class="flex items-center justify-center">
                            <div class="text-center">
                                <p class="text-lg font-medium">Запрошення в групу</p>
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
        <div v-if="errorPostEmployee">
            <PromtYesNo
                title="Помилка"
                :message="errorPostEmployee"
                yesText="Повторити"
                noText="Відмінити"
                @click-yes="save()"
                @click-no="cancelPost()"
                @click-cancel="cancelPost()"
            />
        </div>
        <div v-if="errorRanks">
            <PromtYesNo
                title="Помилка"
                :message="errorRanks"
                yesText="Повторити"
                noText="Вихід"
                @click-yes="fetchRanks"
                @click-no="exit(false)"
                @click-cancel="exit(false)"
            />
        </div>
        <div v-if="errorGetEmployee">
            <PromtYesNo
                title="Помилка"
                :message="errorGetEmployee"
                yesText="Повторити"
                noText="Вихід"
                @click-yes="fetchEmployee(id)"
                @click-no="exit(false)"
                @click-cancel="exit(false)"
            />
        </div>
        <div v-if="errorEmployees">
            <PromtYesNo
                title="Помилка"
                :message="errorEmployees"
                yesText="Повторити"
                noText="Вихід"
                @click-yes="fetchEmployees"
                @click-no="exit(false)"
                @click-cancel="exit(false)"
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
        <div v-if="intentDelEmployee" class="modal-overlay">
            <PromtYesNo
                title="Попередження"
                message="При видаленні користувача всі повязані із ним дані теж будуть видалені. Відновлення даних буде неможливим. Ви впевнені у видаленні?"
                yesText="Так, видалити"
                noText="Відмінити"
                @click-yes="deleteEmployeeConfirm()"
                @click-no="cancelDelEmployee()"
                @click-cancel="cancelDelEmployee()"
            />
        </div>
        <div v-if="errorDeleteEmployee" class="modal-overlay">
            <PromtYesNo
                title="Помилка"
                :message="errorDeleteEmployee"
                yesText="Повторити"
                noText="Відміна"
                @click-yes="deleteEmployee()"
                @click-no="cancelDeleteError()"
                @click-cancel="cancelDeleteError()"
            />
        </div>
        <div v-if="authError">
            <PromtYesNo
                title="Помилка"
                message="Облікові дані невірні"
                yesText="OK"
                @click-yes="logoutAction"
                @click-cancel="logoutAction"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
