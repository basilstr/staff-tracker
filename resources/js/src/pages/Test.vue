<template>
    <div class="scroll-container"
         ref="scrollContainer"
         @mousedown="startDrag"
         @mousemove="onDrag"
         @mouseup="stopDrag"
         @mouseleave="stopDrag">
        <div class="scroll-content" ref="scrollContent">
            <div class="item"
                 v-for="item in items"
                 :key="item.id"
                 :id="'item-' + item.id"
                 @click="handleClick">
                {{ item.text }}
            </div>
        </div>
    </div>
    <button @click="clickUnits">clickUnits</button>
</template>

<script>
    export default {
        beforeRouteLeave(to, from, next) {
            if (true) {
                if (confirm("У вас є незбережені зміни. Бажаєте зберегти перед виходом?")) {
                    this.saveChanges();
                } else {
                    next(false); // блокує перехід
                }
            } else {
                next(); // дозволяє перехід
            }
        },
        data() {
            return {
                hasUnsavedChanges: true
            };
        },
        methods: {
            saveChanges() {
                console.log("Дані збережено!");
                this.hasUnsavedChanges = false;
            }
        }
    };
</script>
<script setup>
    import {useRouter} from "vue-router";

    const router = useRouter()

    const clickUnits = () => {
        router.push('/units')
    }
    import { ref, onMounted, nextTick } from 'vue';

    const scrollContainer = ref(null);
    const scrollContent = ref(null);
    const items = ref([]);
    const isDragging = ref(false);
    const startX = ref(0);
    const scrollLeft = ref(0);
    const isClick = ref(false);

    // Функція для отримання нових елементів
    const fetchItems = async (side) => {
        const newItems = [];
        for (let i = 0; i < 5; i++) {
            const id = side === 'left' ? `L-${Date.now()}-${i}` : `R-${Date.now()}-${i}`;
            newItems.push({ id, text: `Елемент ${id}` });
        }

        if (side === 'left') {
            const prevScrollWidth = scrollContent.value.scrollWidth;
            items.value = [...newItems, ...items.value];

            await nextTick(); // Чекаємо, поки DOM оновиться

            const newScrollWidth = scrollContent.value.scrollWidth;
            const scrollDiff = newScrollWidth - prevScrollWidth;
            scrollContainer.value.scrollLeft += scrollDiff; // Зміщуємо прокрутку, щоб зберегти позицію
        } else {
            items.value = [...items.value, ...newItems];
        }
    };

    const startDrag = (event) => {
        isDragging.value = true;
        isClick.value = true;
        startX.value = event.pageX - scrollContainer.value.offsetLeft;
        scrollLeft.value = scrollContainer.value.scrollLeft;
    };

    const onDrag = (event) => {
        if (!isDragging.value) return;
        const x = event.pageX - scrollContainer.value.offsetLeft;
        const walk = (x - startX.value) * -1;
        scrollContainer.value.scrollLeft = scrollLeft.value + walk;

        if (Math.abs(walk) > 5) {
            isClick.value = false;
        }
    };

    const stopDrag = () => {
        isDragging.value = false;
    };

    const handleClick = (event) => {
        if (!isClick.value) return;
        alert("Натиснуто на: " + event.target.id);
    };

    // Автопідвантаження при прокручуванні
    const checkScroll = () => {
        if (!scrollContainer.value) return;

        const { scrollLeft, scrollWidth, offsetWidth } = scrollContainer.value;

        if (scrollLeft <= 10) {
            fetchItems('left');
        } else if (scrollLeft + offsetWidth >= scrollWidth - 10) {
            fetchItems('right');
        }
    };

    onMounted(() => {
        fetchItems('right'); // Початкове завантаження даних
        scrollContainer.value.addEventListener('scroll', checkScroll); // Стежимо за скролом
    });
</script>

<style>
    .scroll-container {
        width: 500px;
        overflow: hidden;
        white-space: nowrap;
        display: flex;
        cursor: grab;
        background: #f5f5f5;
        border: 2px solid #ddd;
        padding: 10px;
        user-select: none;
        position: relative;
    }
    .scroll-container:active {
        cursor: grabbing;
    }
    .scroll-content {
        display: flex;
        gap: 10px;
    }
    .item {
        min-width: 150px;
        background: lightblue;
        padding: 20px;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
    }
    .item:active {
        background: lightskyblue;
    }
</style>
