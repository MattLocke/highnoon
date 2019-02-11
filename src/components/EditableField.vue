<template lang="pug">
  .editable-field
    b-field(v-if="isEditable")
      b-input(v-model="newValue")
      eva-icon(name="save" fill="white" @click="handleSave")
      eva-icon(name="close-circle" fill="white" @click="handleDisableEditing")
    div(v-else)
      p.is-inline {{ value }}
      eva-icon(name="edit" fill="white" @click="handleEnableEditing")
</template>

<script>
export default {
  name: 'editableField',
  props: {
    initialValue: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      value: this.initialValue,
      isEditable: false
    }
  },
  methods: {
    handleEnableEditing: function () {
      this.newValue = this.value
      this.isEditable = true
    },
    handleDisableEditing: function () {
      this.newValue = null
      this.isEditable = false
    },
    handleSave: function () {
      this.value = this.newValue
      this.handleDisableEditing()
    }
  }
}
</script>

<style lang="scss">
  .editable-field {
    min-height: 3em;
    display: flex;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      p {
        margin-top: 0;
      }
      svg {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .eva-hover {
        &:hover {
          svg {
            fill: #f99e1a;
          }
        }
      }
  }
</style>
