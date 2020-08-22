<template>
  <div>
    <app-header></app-header>

    <main role="main" class="container">
      <router-view></router-view>
    </main>

    <app-footer></app-footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { AppHeader, AppFooter } from "./shared/layouts";

import { ALERT_CLEAR } from './store/action-types';

export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter
  },
  methods: {
      ...mapActions({
          clearAlert: ALERT_CLEAR
      })
  },
  watch: {
      $route (/*to, from*/){
          // clear alert on location change
          this.clearAlert();
      }
  } 
};
</script>

<style>
</style>
