<template lang="pug">
  .router-test
    h2 Router Test
    button.button.positive-button(v-on:click="testRouter()") Test Router
</template>

<script>
  export default {
    name: 'router-test',
    data () {
      return {
      }
    },
    methods: {
      testRouter: function () {
        this.$router.push({path: '/'})
      }
    },
    mounted: function () {
    }
  }
</script>