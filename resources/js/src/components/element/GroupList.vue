<script setup>
    import {computed} from "@vue/reactivity";

    const props = defineProps({
        edited: Boolean,
    });

    const currentUnit = defineModel('currentUnit')
    const units = defineModel('units')

    const isCurrentUnit = (id) => {
        return currentUnit.value === id;
    }
    const isShowUnits = computed(() => {
        return units.value.length && currentUnit.value !== null
    })
    const isShowNoUnitsMsg = computed(() => {
        return !units.value.length && currentUnit.value !== null
    })
    const isLoading = computed(() => {
        return currentUnit.value === null
    })

    // кількість груп які можна відображати як ТАВи
    const unitByTab = () => {
        let len = 0
        units.value.forEach((item) => {
            len += item.name.length
        })
        if(units.value.length > 3) return false
        if(units.value.length > 2 && len > 12) return false
        if(units.value.length > 1 && len > 16) return false

        return true
    }
    const isShowUnitsByTab = computed(() => {
        return units.value.length > 1 && unitByTab()
    })
    const isShowUnitsBySelect = computed(() => {
        return units.value.length > 1 && !unitByTab()
    })

    const changeUnit = (id) => {
        currentUnit.value = id
    }
</script>

<template>
    <div class="mt-3 mx-15">
        <div v-if="isShowUnits">
            <div v-if="isShowUnitsByTab" class="border-b-2 border-gray-300">
                <div class="text-sm font-medium text-center">
                    <ul class="flex flex-wrap -mb-px">
                        <li v-for="(item) in units" :key="item.id" class="me-2">
                            <a href="#" @click="changeUnit(item.id)"
                               :class="isCurrentUnit(item.id) ? 'inline-block p-4 border-b-2 border-gray-300 active text-gray-900 border-gray-900' : 'inline-block p-4 text-gray-300 border-b-2 border-transparent hover:text-gray-400 hover:border-gray-400'">
                                {{item.name}}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="isShowUnitsBySelect">
                <select v-model="currentUnit"
                        class="border border-gray-300 text-sm rounded-lg w-full p-2.5">
                    <option v-for="(item) in units" :key="item.id" :value="item.id"> {{item.name}}</option>
                </select>
            </div>
            <div v-if="!isShowUnitsBySelect && !isShowUnitsByTab" class="border-b-2 border-gray-300 text-sm font-medium text-center">
                {{units[0].name}}
            </div>
        </div>
        <div v-if="isShowNoUnitsMsg" class="text-center font-medium ">
            У Вас відсутні групи. Створіть групу (меню "Групи") та додайте до неї користувачів.
        </div>
        <div v-if="isLoading">
            <div class="text-center">
                <div role="status">
                    <svg aria-hidden="true" class="inline w-8 h-8 text-gray-300 animate-spin fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

</style>
