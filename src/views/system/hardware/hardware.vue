<template>
  <div class="single-page">
     <keep-alive :include="cachePage">
         <router-view></router-view>
     </keep-alive>           
  </div>
</template>
<script>
export default {
  name: 'HardWare'
}
</script>