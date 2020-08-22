<template>
  <div class="container">
    <div class="card card-container">    
      <p id="profile-name" class="profile-name-card"></p>
      <form @submit.prevent="handleSubmit" class="form-signin">
        <p>Your link has been expired.</p> 
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

export default {
  name: "error-link-expired",
  computed: {
    ...mapGetters(["authError"])
  }
};
</script>


