<script setup>
    import PromtYesNo from "../components/PromtYesNo.vue";
    import GroupList from "../components/element/GroupList.vue";

    import {ref, watch, nextTick, computed, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {logout} from "../firebase";

    import {useUnitsStore} from "../composables/store/unitsStore.js";

    const unitsStore = useUnitsStore();
    const {units} = storeToRefs(unitsStore);

    import {useCaseGetUnits} from "../composables/usecases/unit/useCaseGetUnits";

    const {loading: loadingUnits, error: errorUnits, authError: authUnitsError, fetchUnits: fetchUnits, cancelRequest: cancelUnitsRequest} = useCaseGetUnits(unitsStore);

    import {useStatusesStore} from "../composables/store/statusesStore.js";
    import {storeToRefs} from "pinia";

    const statusesStore = useStatusesStore();
    const {statuses} = storeToRefs(statusesStore);

    const router = useRouter()

    const editedStatuses = ref([])
    const needSave = ref(false)
    const isModalVisible = ref(false)
    const isChangeAndSave = ref(false)
    const newUnit = ref(null)
    const currentUnit = ref(unitsStore.getCurrentUnitId())
    const editedUnits = ref([])

    const isErrorNewItemFullName = ref(false)
    const isErrorNewItemShortName = ref(false)

    import {useCaseGetStatuses} from "../composables/usecases/status/useCaseGetStatuses";

    const {loading: loadingFetch, error: errorFetch, authError: authFetchError, fetchStatuses: fetchStatuses, cancelRequest: cancelFetchRequest} = useCaseGetStatuses(statusesStore);

    import {useCaseSaveStatuses} from "../composables/usecases/status/useCaseSaveStatuses";

    const {loading: loadingPost, error: errorPost, authError: authPostError, saveStatuses: saveStatuses, cancelRequest: cancelPostRequest} = useCaseSaveStatuses(statusesStore);

    const newItem = ref({sort: '', fullName: "", shortName: "", group: false, textColor: "#000000", bgColor: "#ffffff"})

    onMounted(() => {
        if (unitsStore.isEmptyUnits()) {
            fetchUnits()
        } else {
            if (!statusesStore.isEmptyStatuses(currentUnit.value)) {
                cloneEditedStatuses()
            } else {
                fetchStatuses(currentUnit.value)
            }
        }
    })

    const isLoading = computed(() => loadingPost.value || loadingFetch.value);

    watch(units, () => {
        fetchStatuses(currentUnit.value)
    });

    watch(statuses, () => {
        cloneEditedStatuses()
    })

    const logoutAction = async () => {
        cancelFetchRequest()
        cancelPostRequest()
        cancelUnitsRequest()

        await logout();
        await router.push('/login');
    };

    const cloneEditedStatuses = () => {
        editedUnits.value = units.value.filter(item => item.edited)
        if (editedUnits.value.length) {
            if (!editedUnits.value.find(item => item.id === currentUnit.value)) {
                currentUnit.value = editedUnits.value[0].id
            }
        } else {
            currentUnit.value = 0
        }
        editedStatuses.value = JSON.parse(JSON.stringify(statuses.value));
        nextTick(() => {
            needSave.value = false;
        });
    }

    const authError = computed(() => authFetchError.value || authPostError.value || authUnitsError.value);
    const currentGroupName = computed(() => {
        return editedUnits.value.find(item => item.id === currentUnit.value)?.name
    });

    const addItem = () => {
        if (newItem.value.fullName.length === 0
            || newItem.value.shortName.length === 0) {
            return;
        }

        let sort = newItem.value.sort.length === 0 ? NaN : Number(newItem.value.sort)
        if (isNaN(sort)) {
            sort = 0
            editedStatuses.value.forEach(item => {
                if (sort <= item.sort) {
                    sort = item.sort + 1
                }
            })
        }

        editedStatuses.value.push({
            id: 0,
            sort: sort,
            fullName: newItem.value.fullName,
            shortName: newItem.value.shortName,
            group: newItem.value.group,
            textColor: newItem.value.textColor,
            bgColor: newItem.value.bgColor
        })

        editedStatuses.value.sort((a, b) => a.sort - b.sort)

        newItem.value.sort = '';
        newItem.value.fullName = "";
        newItem.value.shortName = "";
        newItem.value.group = false;
        newItem.value.textColor = "#000000";
        newItem.value.bgColor = "#ffffff";
    }

    const removeItem = (index) => {
        editedStatuses.value.splice(index, 1)
    }

    const save = () => {
        if (!saveEnable.value) return

        // якшо значення в новому полі є - додаємо (сортування є в addItem())
        if (newItem.value.fullName.length > 0
            && newItem.value.shortName.length > 0) {
            addItem()
        } else {
            // якшо значення в новому полі відсутнє - тільки сортуємо
            editedStatuses.value.sort((a, b) => a.sort - b.sort)
        }

        saveStatuses(currentUnit.value, editedStatuses.value)
    }

    // watch-ери
    watch(editedStatuses, () => {
        needSave.value = true;
    }, {deep: true});

    watch(newItem, () => {
        needSave.value = true;
    }, {deep: true});

    const back = () => {
        if (needSave.value) {
            isModalVisible.value = true
        } else {
            isModalVisible.value = false
            cancelFetchRequest()
            cancelPostRequest()
            router.push('/employees')
        }
    }

    const exit = (isSave) => {
        if (isSave) {
            save()
        }
        needSave.value = false;
        isModalVisible.value = false
        router.push('/employees')
    }

    const cancel = () => {
        isModalVisible.value = false
    }

    const filterNumbers = (index) => {
        editedStatuses.value[index].sort = editedStatuses.value[index].sort.replace(/\D/g, '');
        if (editedStatuses.value[index].sort.length === 0) editedStatuses.value[index].sort = 0
        editedStatuses.value[index].sort = Number(editedStatuses.value[index].sort)
    };

    const filterNewNumbers = () => {
        newItem.value.sort = newItem.value.sort.replace(/\D/g, '');
        if (newItem.value.sort.length === 0) newItem.value.sort = 0
        newItem.value.sort = Number(newItem.value.sort)
    };

    const validateFull = (index) => {
        editedStatuses.value[index].isErrorFullName = editedStatuses.value[index].fullName.length === 0
    };

    const validateShort = (index) => {
        editedStatuses.value[index].isErrorShortName = editedStatuses.value[index].shortName.length === 0
    };

    const validateNew = () => {
        isErrorNewItemFullName.value = newItem.value.fullName.length === 0 && newItem.value.shortName.length > 0
        isErrorNewItemShortName.value = newItem.value.shortName.length === 0 && newItem.value.fullName.length > 0
    };

    const saveEnable = computed(() => {
        let isError = false
        editedStatuses.value.forEach(item => {
            isError |= item.isErrorFullName
            isError |= item.isErrorShortName
        })
        isError |= isErrorNewItemFullName.value
        isError |= isErrorNewItemShortName.value

        return needSave.value && !isError
    })

    const cancelPostError = () => {
        errorPost.value = null
    };

    const repeatSaveRequest = () => {
        saveStatuses(currentUnit.value, editedStatuses.value)
    };

    const isUpdating = ref(false); // необхідно для уникнення рекурсивного виклику при поверненні опереднього значення 'currentUnit.value = oldValue'
    watch(currentUnit, (newValue, oldValue) => {
        if (isUpdating.value) {
            isUpdating.value = false;
            return;
        }

        if (needSave.value) {
            isChangeAndSave.value = true
            newUnit.value = newValue
            isUpdating.value = true;
            currentUnit.value = oldValue
        } else {
            isChangeAndSave.value = false
            fetchStatuses(currentUnit.value)
        }
    })

    const cancelChange = () => {
        isChangeAndSave.value = false
    }
    const saveAndChange = async () => {
        saveStatuses(currentUnit.value, editedStatuses.value)
        needSave.value = false
        currentUnit.value = newUnit.value
        fetchStatuses(currentUnit.value)
        isChangeAndSave.value = false
    }

    const notSaveAndChange = () => {
        needSave.value = false
        currentUnit.value = newUnit.value
        isChangeAndSave.value = false
        fetchStatuses(currentUnit.value)
    }
</script>

<template>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <button @click="back()" class="block text-sm/6 font-medium text-gray-900 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="lucide lucide-circle-arrow-left">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 12H8"/>
                <path d="m12 8-4 4 4 4"/>
            </svg>
        </button>

        <GroupList v-model:currentUnit="currentUnit" v-model:units="editedUnits"/>

        <div v-if="currentUnit && !loadingFetch && !errorFetch && !loadingPost && !errorPost">
            <div class="text-lg font-bold my-4">Статуси для групи "{{currentGroupName}}"</div>
            <table class="table-auto text-center">
                <thead>
                <tr class="text-xs">
                    <th>Пор.</th>
                    <th>Повна назва</th>
                    <th>Коротка</th>
                    <th>Груп.</th>
                    <th>Текст</th>
                    <th>Фон</th>
                    <th>&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in editedStatuses" :key="item.id">
                    <td v-if="!item.deletedAt" class="w-1/8"><input
                        class="w-3/4 text-center border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        v-model="item.sort" type="text"
                        @input="filterNumbers(index)"></td>
                    <td v-if="!item.deletedAt"><input
                        class="w-full border-1 p-1 m-1 rounded-lg focus:outline-none"
                        :class="{ 'focus:ring-1 focus:ring-blue-500': !(item.isErrorFullName ?? false),
                        'border-gray-300': !(item.isErrorFullName ?? false),
                        'border-red-500': item.isErrorFullName ?? false,
                        'focus:ring-1 focus:ring-red-500': item.isErrorFullName ?? false}"
                        v-model="item.fullName" type="text" maxlength="50"
                        @input="validateFull(index)"></td>
                    <td v-if="!item.deletedAt" class="w-1/6"><input
                        class="w-3/4 text-center border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-semibold"
                        :class="{ 'focus:ring-1 focus:ring-blue-500': !(item.isErrorShortName ?? false),
                        'border-gray-300': !(item.isErrorShortName ?? false),
                        'border-red-500': item.isErrorShortName ?? false,
                        'focus:ring-1 focus:ring-red-500': item.isErrorShortName ?? false}"
                        :style="{ color: item.textColor, backgroundColor: item.bgColor }"
                        v-model="item.shortName" type="text" maxlength="5"
                        @input="validateShort(index)"></td>
                    <td v-if="!item.deletedAt" class="w-1/8"><input class="w-3/4" v-model="item.group" type="checkbox">
                    </td>
                    <td v-if="!item.deletedAt" class="w-1/10">
                        <div class="relative inline-block">
                            <input type="color" v-model="item.textColor" :id="'text_color_' + item.id"
                                   class="w-full absolute inset-0 opacity-0 cursor-pointer">
                            <div class="w-6 h-6 rounded-full border border-gray-300"
                                 :style="{ backgroundColor: item.textColor }">
                                <label :for="'text_color_' + item.id"
                                       class="w-full h-full block cursor-pointer"></label>
                            </div>
                        </div>
                    </td>
                    <td v-if="!item.deletedAt" class="w-1/10">
                        <div class="relative inline-block">
                            <input type="color" v-model="item.bgColor" :id="'bg_color_' + item.id"
                                   class="w-full absolute inset-0 opacity-0 cursor-pointer">
                            <div class="w-6 h-6 rounded-full border border-gray-300"
                                 :style="{ backgroundColor: item.bgColor }">
                                <label :for="'bg_color_' + item.id" class="w-full h-full block cursor-pointer"></label>
                            </div>
                        </div>
                    </td>
                    <td v-if="!item.deletedAt">
                        <button @click="removeItem(index)" class="cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                                    fill="#1D1B20"/>
                            </svg>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td class="w-1/8"><input
                        class="w-3/4 text-center border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        v-model="newItem.sort" type="text"
                        @input="filterNewNumbers()"></td>
                    <td><input
                        class="w-full border-1 border-gray-300 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :class="{ 'focus:ring-1 focus:ring-blue-500': !isErrorNewItemFullName,
                        'border-gray-300': !isErrorNewItemFullName,
                        'border-red-500': isErrorNewItemFullName,
                        'focus:ring-1 focus:ring-red-500': isErrorNewItemFullName}"
                        v-model="newItem.fullName" type="text" maxlength="50" placeholder="Назва статусу"
                        @input="validateNew()"></td>
                    <td class="w-1/6"><input
                        class="w-3/4 text-center border-1 p-1 m-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                        :class="{ 'focus:ring-1 focus:ring-blue-500': !isErrorNewItemShortName,
                        'border-gray-300': !isErrorNewItemShortName,
                        'border-red-500': isErrorNewItemShortName,
                        'focus:ring-1 focus:ring-red-500': isErrorNewItemShortName}"
                        :style="{ color: newItem.textColor, backgroundColor: newItem.bgColor }"
                        v-model="newItem.shortName" type="text" maxlength="5"
                        @input="validateNew()"></td>
                    <td class="w-1/8"><input class="w-3/4" v-model="newItem.group" type="checkbox"></td>
                    <td class="w-1/10">
                        <div class="relative inline-block">
                            <input type="color" v-model="newItem.textColor" id="new_text_color"
                                   class="w-full absolute inset-0 opacity-0 cursor-pointer">
                            <div class="w-6 h-6 rounded-full border border-gray-300"
                                 :style="{ backgroundColor: newItem.textColor }">
                                <label for="new_bg_color" class="w-full h-full block cursor-pointer"></label>
                            </div>
                        </div>
                    </td>
                    <td class="w-1/10">
                        <div class="relative inline-block">
                            <input type="color" v-model="newItem.bgColor" id="new_bg_color"
                                   class="w-full absolute inset-0 opacity-0 cursor-pointer">
                            <div class="w-6 h-6 rounded-full border border-gray-300"
                                 :style="{ backgroundColor: newItem.bgColor }">
                                <label for="new_bg_color" class="w-full h-full block cursor-pointer"></label>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button @click="addItem()" class="cursor-pointer">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11 17H13V13H17V11H13V7H11V11H7V13H11V17ZM12 22C10.6167 22 9.31667 21.7417 8.1 21.225C6.88333 20.6917 5.825 19.975 4.925 19.075C4.025 18.175 3.30833 17.1167 2.775 15.9C2.25833 14.6833 2 13.3833 2 12C2 10.6167 2.25833 9.31667 2.775 8.1C3.30833 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31667 8.1 2.8C9.31667 2.26667 10.6167 2 12 2C13.3833 2 14.6833 2.26667 15.9 2.8C17.1167 3.31667 18.175 4.025 19.075 4.925C19.975 5.825 20.6833 6.88333 21.2 8.1C21.7333 9.31667 22 10.6167 22 12C22 13.3833 21.7333 14.6833 21.2 15.9C20.6833 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6917 15.9 21.225C14.6833 21.7417 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
                                    fill="#1D1B20"/>
                            </svg>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
            <button @click="save()"
                    class="w-full rounded-full p-2 text-white text-center text-lg font-bold my-6"
                    :class="{ 'bg-blue-700 hover:bg-blue-900': saveEnable, 'bg-gray-400': !saveEnable }">
                ЗБЕРЕГТИ
            </button>
        </div>
        <div v-if="loadingFetch || loadingPost">
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
    <div v-if="errorFetch">
        <PromtYesNo
            title="Помилка"
            :message="errorFetch"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="fetchStatuses()"
            @click-no="exit(false)"
            @click-cancel="exit(false)"
        />
    </div>
    <div v-if="errorPost">
        <PromtYesNo
            title="Помилка"
            :message="errorPost"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="repeatSaveRequest"
            @click-no="exit(false)"
            @click-cancel="repeatSaveRequest"
        />
    </div>
    <div v-if="errorUnits">
        <PromtYesNo
            title="Помилка"
            :message="errorUnits"
            yesText="Повторити"
            noText="Відмінити"
            @click-yes="fetchUnits"
            @click-no="exit(false)"
            @click-cancel="repeatSaveRequest"
        />
    </div>
    <div v-if="isModalVisible && saveEnable" class="modal-overlay">
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
    <div v-if="isChangeAndSave && saveEnable" class="modal-overlay">
        <PromtYesNo
            title="Попередження"
            message="У Вас є не збережені дані."
            yesText="Зберегти"
            noText="Не зберігати"
            @click-yes="saveAndChange"
            @click-no="notSaveAndChange"
            @click-cancel="cancelChange"
        />
    </div>
    <div v-if="isModalVisible && !saveEnable" class="modal-overlay">
        <PromtYesNo
            title="Попередження"
            message="У Вас є не збережені дані, але вони некоректні. Збереження не можливе."
            noText="Не зберігати"
            @click-no="exit(false)"
            @click-cancel="cancel()"
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
</template>

<style scoped>

</style>
