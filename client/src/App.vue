<template>
  <div id="app" class="container">
    <div class="main-logo">
        <img :src="require('@/assets/pokemon-logo.png')" width="200" alt="">
    </div>
    <div class="tab-list">
        <div class="tab">
            <router-link to="/" active-class="active">Pokemon Lists</router-link>
        </div>
        <div class="tab">
            <router-link to="/my-pokemon" active-class="active">My Pokemon</router-link>
        </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

  body, h1, h2, h3, h4, h5, h6, p, a {
    margin: 0;
    padding: 0;
    font-family: 'Poppins';
  }
  body {
    background-color: #121212 !important;
  }

  a {
    text-decoration: none !important;
  }

  .container {
    color: white;
    min-height: 100vh;

    .main-logo {
      text-align: center;
      padding: 1rem;
    }

    h1 {
      text-align: center;
    }

    .tab-list {
      display: flex;
      justify-content: center;
      margin: 1rem 0 2rem;

      .tab {
        a {
          color: white;
          text-align: center;
          margin: .5rem;
          width: 40%;
          padding: .5rem 1rem;
          border-radius: 20px;
          white-space: nowrap;
          
          &.router-link-exact-active {
              background: linear-gradient(0deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), #121212;
          }
        }
      }
    }
  }

 

</style>
