<template>
  <div class="container">
    <div class="card card-container">
      <div v-if="alert.message" :class="'alert ' + alert.type">{{alert.message}}</div>

      <form @submit.prevent="handleSubmit" class="form-signin">
        <div class="form-group">
          <input
            type="text"
            id="firstName"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.firstName.$error}"
            placeholder="First Name"
            name="firstName"
            v-model="user.firstName"
            autofocus
            :disabled="submitted"
          />
          <div
            v-if="$v.$invalid && !$v.user.firstName.required"
            class="invalid-feedback"
          >First Name is required</div>
        </div>

        <div class="form-group">
          <input
            type="text"
            id="lastName"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.lastName.$error}"
            placeholder="Last Name"
            name="lastName"
            v-model="user.lastName"
            autofocus
            :disabled="submitted"
          />
          <div
            v-if="$v.$invalid && !$v.user.lastName.required"
            class="invalid-feedback"
          >Last Name is required</div>
        </div>

        <div class="form-group">
          <input
            type="text"
            id="username"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.username.$error}"
            placeholder="Email address"
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
          <span v-if="!$v.user.password.minLength">Password must have at least 8 letters.</span>
        </div>

        <div class="signIn">
          <button :disabled="submitted" class="btn btn-lg btn-primary btn-block btn-signin">Register</button>
        </div>
      </form>
      <hr />
      <!-- /form -->
      <div class="signUp">
        Already have an account?
        <router-link to="/login" class="forgot-password">Login</router-link>
      </div>
    </div>
    <!-- /card-container -->
  </div>
  <!-- /container -->
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import { mapState } from "vuex";
import { REGISTER } from "@/app/store/action-types";

export default {
  name: "auth-register",
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        password: "",
        username: ""
      },
      submitted: false
    };
  },

  validations: {
    user: {
      firstName: { required },
      lastName: { required },
      username: { required, email },
      password: { required, minLength: minLength(8) }
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
      this.$store.dispatch(REGISTER, this.user).then(success => {
        this.submitted = false;
        if (success) {
          setTimeout(() => this.$router.push({ name: "login" }), 5000);
          this.resetForm();
        }
      });
    },
    resetForm() {
      this.submitted = false;
      this.user = {
        firstName: "",
        lastName: "",
        username: "",
        password: ""
      };
    }
  },
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  }
};
</script>
