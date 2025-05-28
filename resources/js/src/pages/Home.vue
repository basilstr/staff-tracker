<script setup>
    import {useRouter} from 'vue-router'
    const router = useRouter()

    if(localStorage.getItem('token')) {
        router.push('/employees')
    } else {
        router.push('/login')
    }
</script>

<template>
</template>

<style scoped>
</style>