<template>
  <div class="home">
    <header>
      <div>
        <img alt="logo" src="../assets/logo.png" width="350" height="auto" max-width="100%">
      </div>
      <div>
        <b>mai-tools</b> is a collection of useful tools for <b>maimai</b> and <b>maimai DX</b>.
      </div>
    </header>
    <main>
      <h3>Score Calculator</h3>
      <span>
        <router-link to="/score-calc"><b>Score Calculator</b></router-link> is an utility
        that can be used to calculate score and achievement for maimai players.
      </span>
      <h3>More utils</h3>
      <span>
        <i>Coming soon...</i>
      </span>
    </main>
    <footer>
      <b>mai-tools</b> is created and maintained by <a href="https://github.com/zetaraku">Raku Zeta</a>.
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {},
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 20px 0 10px 0;
}
header, main, footer {
  margin: 0 0 30px 0;
  padding: 10px auto;
}
</style>
