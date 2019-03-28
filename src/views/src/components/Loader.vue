<template>
  <div>
    <v-flex id="flex">
      <v-progress-circular
        v-if="!loaded"
        :size="100"
        :width="9"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </v-flex>
  </div>
</template>

<style>
    #flex {
        text-align: center;
        top: 40%;
        left: 47%;
        position: absolute;
    }
</style>
