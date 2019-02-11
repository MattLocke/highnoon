<template lang="pug">
  .editable-field
    b-field(v-if="isEditable")
      b-input(v-model="newValue")
      p.control
        button.button.is-primary(@click="handleSave")
          eva-icon(name="save" fill="white")
          span Save
        button.button.is-primary(@click="handleDisableEditing")
          eva-icon(name="close-circle" fill="white")
          span Cancel
    div.columns(v-else)
      h2.is-inline.column.is-narrow {{ value }}
      .column(@click="handleEnableEditing")
        eva-icon(name="edit" fill="white")
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
      if (this.newValue !== this.value) {
        this.value = this.newValue
        this.$emit('updated-value', this.newValue)
      }
      this.handleDisableEditing()
    }
  },
  created () {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.handleDisableEditing()
      }
      if (event.key === 'Enter') {
        this.handleSave()
      }
    })
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
