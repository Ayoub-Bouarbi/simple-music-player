<template>
  <main class="overflow-hidden relative">
    <playlist @startAudio="startAudio" />
    <player ref="player" class="fixed bg-gray-200 border-t border-gray-300 w-full bottom-0" />

  </main>
</template>

<script>
  import Player from '../components/player.vue';
  import Playlist from '../components/playlist.vue';

  const dialog = require('electron').remote.dialog;
  import * as mm from 'music-metadata';
  import fs from 'fs';
  const electron = window.require("electron")

  function parseMetadata(files) {

    let filesList = []

    for (let file of files) {
      const fileBuffer = fs.readFileSync(file);

      mm.parseBuffer(fileBuffer)
        .then((metadata) => {

          var {
            common: {
              album = 'Unknown',
              artist = "Unknown",
              title = "Unknown"
            },
            format: {
              duration
            }
          } = metadata;

          filesList.push({
            'url': `motta://${file}`,
            title,
            artist,
            album,
            duration
          });
        })
    }
    return filesList;
  }

  export default {
    name: 'Home',
    components: {
      Player,
      Playlist
    },
    mounted() {
      electron.ipcRenderer.on('goToHome', () => {
        this.loadFiles();
      });
    },
    methods: {
      startAudio(file) {
        this.$refs.player.setAudio(file);
      },
      loadFiles() {
        const files = dialog.showOpenDialogSync({
          properties: ['openFile', 'multiSelections'],
          filters: [{
            name: 'Audio',
            extensions: ['mp3', 'acc', 'wma']
          }],
        });
        
        if (files != undefined) {

          let filesList = parseMetadata(files);

          this.$store.dispatch('initFiles', filesList);
        }
      }
    },
  }
</script>