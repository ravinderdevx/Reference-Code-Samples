<template>
  <header class="fixed-top bg-dark">
    <div class="container">
      <div class="row">
        <nav class="navbar navbar-expand-md navbar-dark">
          <a class="navbar-brand" href="#">POC App</a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav ml-auto" v-if="!isAuthenticated">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'login' }"
                >Login</router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'register' }"
                >Register</router-link>
              </li>
            </ul>
            <ul class="navbar-nav ml-auto" v-if="isAuthenticated">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'home' }"
                >Home</router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  active-class="active"
                  exact
                  :to="{ name: 'change-password' }"
                >Change Password</router-link>
              </li>
              <li class="nav-item">
                <button v-on:click="logout">Log Out</button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { LOGOUT } from "@/app/store/action-types";
export default {
  name: "app-header",
  data() {
    return {
      visible: false
    };
  },

  methods: {
    logout() {
      this.$store.dispatch(LOGOUT, this.user);
      debugger;
      this.$router.push({ name: "login" })
    }
  },


  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  }
};
</script>




