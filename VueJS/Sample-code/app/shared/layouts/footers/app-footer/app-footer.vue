<template>
  <footer class="footer">
    <div class="container text-center">
      <span class="text-muted">All right reserverd &copy; 2020</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "app-footer"
};
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  /* Set the fixed height of the footer here */
  height: 60px;
  line-height: 60px; /* Vertically center the text there */
  background-color: #f5f5f5;

  .container {
    padding-right: 15px;
    padding-left: 15px;
  }
}
</style>


