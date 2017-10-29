<template>
  <el-row>
    <el-col :span="12" :offset="6">
      <!-- Content will be placed here -->
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script>
  /* ============
   * Minimal Layout
   * ============
   *
   * Used for the register and login pages.
   *
   * Layouts are used to store a lot of shared code.
   * This way the app stays clean.
   */

  export default {};
</script>
