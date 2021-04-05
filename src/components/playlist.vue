<template>
  <div class="overflow-hidden w-1/2 m-auto">
    <button v-for="(file,index) in files" @dblclick="startAudio(file)" :key="index"
      :class="[audioIndex == index ? 'bg-gray-200' : '']"
      class="p-5 block w-full text-left cursor-pointer border-b hover:bg-gray-200 border-gray-300">
      <div class="relative">
        <vue-feather class="absolute" type="music" />
        <span class="text-sm ml-10">{{ file.title }}</span>
      </div>
    </button>
  </div>
</template>

<script>
  import VueFeather from 'vue-feather';
  export default {
    methods: {
      startAudio(file) {
        this.$emit('startAudio', file);
      }
    },
    components: {
      VueFeather
    },
    computed: {
      files() {
        return this.$store.getters.getFiles;
      },
      audioIndex() {
        return this.$store.getters.getIndex;
      }
    },
  }
</script>