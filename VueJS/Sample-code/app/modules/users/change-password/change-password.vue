<template>
  <div class="container">
    <div class="card card-container">
      <div v-if="alert.message" :class="'alert ' + alert.type">{{alert.message}}</div>

      <form @submit.prevent="handleSubmit" class="form-signin">
        <span id="reauth-email" class="reauth-email"></span>
        <div class="form-group">
          <input
            type="password"
            id="oldPassword"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.oldPassword.$error}"
            placeholder="Old Password"
            name="oldPassword"
            v-model="user.oldPassword"
            autofocus
          />
          <div
            v-if="$v.$invalid && !$v.user.oldPassword.required"
            class="invalid-feedback"
          >Old Password is required</div>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="password"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.password.$error}"
            placeholder="New Password"
            name="password"
            v-model="user.password"
            autofocus
          />
          <div
            v-if="$v.$invalid && !$v.user.password.required"
            class="invalid-feedback"
          >Password is required</div>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="confirmPassword"
            class="form-control"
            :class="{ 'is-invalid': $v.$invalid && $v.user.confirmPassword.$error }"
            name="confirmPassword"
            v-model="user.confirmPassword"
            placeholder="Confirm Password"
          />

          <div
            v-if="$v.$invalid && !$v.user.confirmPassword.required"
            class="invalid-feedback"
          >Password is required</div>
          <span v-else-if="!$v.user.confirmPassword.sameAsPassword">Passwords must be identical</span>
        </div>

        <div class="signIn">
          <button class="btn btn-lg btn-primary btn-block btn-signin">Reset Password</button>
        </div>
      </form>
    </div>
    <!-- /card-container -->
  </div>
  <!-- /container -->
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { required, sameAs, minLength } from "vuelidate/lib/validators";
import { CHANGEPASSWORD } from "@/app/store/action-types";

export default {
  name: "auth-change-password",
  data() {
    return {
      user: {
        oldPassword: "",
        password: "",
        confirmPassword: ""
      },
      submitted: false
    };
  },

  validations: {
    user: {
      oldPassword: { required },
      password: { required, minLength: minLength(8) },
      confirmPassword: { required, sameAsPassword: sameAs("password") }
    }
  },
  computed: {
    ...mapGetters(["currentUser", "authError"]),
    ...mapState({
      alert: state => state.alert
    })
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
      var user = {
        username: this.currentUser.Username,
        newPassword: this.user.confirmPassword,
        oldPassword: this.user.oldPassword
      };

      this.$store.dispatch(CHANGEPASSWORD, user).then(success => {
        this.submitted = false;
        if  (success)this.resetForm();
      });
    },

    resetForm() {
      this.submitted = false;
      this.user = {
        oldPassword: "",
        confirmPassword: ""
      };
    }
  }
};
</script>
