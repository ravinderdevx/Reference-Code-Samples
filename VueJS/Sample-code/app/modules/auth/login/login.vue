<template>
  <div class="container">
    <div class="card card-container">
      <div v-if="alert.message" :class="'alert ' + alert.type">{{alert.message}}</div>

      <form @submit.prevent="handleSubmit" class="form-signin" autocomplete="off">
        <div class="form-group">
          <input
            type="text"
            id="username"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.username.$error}"
            placeholder="Email"
            name="username"
            v-model="user.username"
            autofocus
            :disabled="submitted"
          />
          <div
            v-if="$v.$invalid && !$v.user.username.required"
            class="invalid-feedback"
          >Email is required</div>
          <span v-if="!$v.user.username.email">Email is invalid</span>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.password.$error }"
            name="password"
            v-model="user.password"
            placeholder="Password"
            :disabled="submitted"
          />

          <div
            v-if="$v.$invalid && !$v.user.password.required"
            class="invalid-feedback"
          >Password is required</div>
        </div>
        <div id="remember">
          <label class="checkbox">
            <input type="checkbox" name="rememberMe" v-model="user.rememberMe" id="rememberMe" />
            <span class="primary"></span>
          </label>
          <span class="checkActive">Remember me</span>
          <!-- <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>-->
        </div>
        <div class="signIn">
          <button :disabled="submitted" class="btn btn-lg btn-primary btn-block btn-signin">Sign in</button>
        </div>
      </form>
      <!-- /form -->
      <div class="forgot-password">
        <router-link to="/forgot-password">Forgot the password?</router-link>
      </div>
      <hr />
      <div class="signUp">
        Don't have an account?
        <router-link to="/register">Sign Up</router-link>
      </div>
    </div>
    <!-- /card-container -->
  </div>
  <!-- /container -->
</template>

<script>
import { mapState } from "vuex";
import { required, email } from "vuelidate/lib/validators";
import { LOGIN } from "@/app/store/action-types";

export default {
  name: "auth-login",
  data() {
    return {
      user: {
        username: "",
        password: "",
        rememberMe: ""
      },
      submitted: false
    };
  },
  validations: {
    user: {
      username: { required, email },
      password: { required }
    }
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitted = false;
        return;
      }
      this.$store.dispatch(LOGIN, this.user).then(success => {
        this.submitted = false;
        if (success) this.$router.push({ name: "home" });
      });
    }
  },
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  }
};
</script>
