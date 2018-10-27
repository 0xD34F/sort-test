<template lang="pug">
  v-dialog(
    v-model="opened"
    persistent
    width="80%"
  )
    v-card
      v-card-title
        span.headline {{ title }}
      v-textarea(
        v-model="text"
        class="ma-3"
        box
      )
      v-divider
      v-card-actions
        v-spacer
        v-btn(
          @click="close(true)"
          flat
          color="primary"
        ) OK
        v-btn(
          @click="close(false)"
          flat
          color="primary"
        ) Cancel
</template>

<script>
export default {
  name: 'TestOptionDialog',
  props: {
    title: String,
    value: String,
    show: Boolean,
  },
  data() {
    return {
      text: '',
    };
  },
  computed: {
    opened: {
      get() {
        return this.show;
      },
      set(val) {
        if (!val) {
          this.$emit('close', this.text);
        }
      },
    },
  },
  watch: {
    opened(val) {
      if (val) {
        this.text = this.value;
      }
    },
  },
  methods: {
    close(saveChanges) {
      this.text = saveChanges ? this.text : this.value;
      this.opened = false;
    },
  },
};
</script>

<style scoped>
.v-dialog textarea {
  font-family: monospace;
}
</style>
