<template>
  <div id="app">
    <header>
      <h1>Task Manager</h1>
    </header>
    <tabs/>
  </div>
</template>

<script>
//
import tabs from './components/tabs'
export default {
  name: 'App',

  components: {
    //HelloWorld,
    tabs
  },

  
};
</script>
<style scoped>
header{
  display:flex;
  justify-content:center;
  align-items:center;
  padding:15px;
  text-align:center;
  font-family:sens serif;
  background-color: #212121;
  color:#fff;
}
</style>
