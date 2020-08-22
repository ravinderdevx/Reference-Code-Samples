	<template>
  <div class="container">
    <div class="card card-container">
      <div v-if="alert.message" :class="'alert ' + alert.type">{{alert.message}}</div>
      <form @submit.prevent="handleSubmit" class="form-signin">
        <span id="reauth-email" class="reauth-email"></span>
        <div class="form-group">
          <input
            type="email"
            id="email"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.username.$error}"
            placeholder="Email address"
            name="email"
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

        <div class="signIn">
          <button
            :disabled="submitted"
            class="btn btn-lg btn-primary btn-block btn-signin"
          >Recover Password</button>
        </div>
      </form>
      <hr />
      <!-- /form -->
      <div class="signUp">
        Back to
        <router-link to="/login" class="forgot-password">Login</router-link>
      </div>
    </div>
    <!-- /card-container -->
  </div>
  <!-- /container -->
</template>

<script>
import { required, email } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import { FORGOTPASSWORD } from "@/app/store/action-types";

export default {
  name: "auth-forgot-password",
  data() {
    return {
      user: {
        username: ""
      },
      submitted: false
    };
  },

  validations: {
    user: {
      username: { required, email }
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
      this.$store.dispatch(FORGOTPASSWORD, this.user).then(success => {
        this.submitted = false;
        if (success) {
          setTimeout(() => this.$router.push({ name: "login" }), 5000);
        }
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
