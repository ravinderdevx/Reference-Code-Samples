<template>
  <div class="container">
    <div class="card card-container">    
      <p id="profile-name" class="profile-name-card"></p>
      <form @submit.prevent="handleSubmit" class="form-signin">
        <p>Your email has been verified.</p> 
         <div class="signUp">
        
        <router-link to="/login" class="forgot-password">Login</router-link>
      </div>
      </form>
      <hr />
      <!-- /form -->

    </div>
    <!-- /card-container -->
  </div>
  <!-- /container -->
</template>

<script>
import { mapGetters } from "vuex";
import { VERIFYEMAIL } from "@/app/store/action-types";

export default {
  name: "auth-verify-email",
  beforeCreate(){
    var userparam=this.$route.query.email;
    if(!userparam)
     {
       this.$router.push({ name: "login" })
       return;
     }

    var  user={
       username:userparam,
     }
      this.$store
        .dispatch(VERIFYEMAIL, user)
         .then((success) => {
          if(!success)
          {
            this.$router.push({ name: "error" });
          }
        });
    },
  computed: {
    ...mapGetters(["authError"])
  }
};
</script>


