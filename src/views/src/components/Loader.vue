<template>
    <div>
    <div id="blur">
    </div>
    <v-progress-circular
      v-if="!loaded"
      :size="70"
      :width="7"
      color="purple"
      indeterminate
      style="z-index:2"
    ></v-progress-circular>
    </div>
</template>

<style>
    #blur {
        filter: blur(2px);
        z-index: 1;
    }
</style>
