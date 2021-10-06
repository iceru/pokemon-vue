<template>
  <div>
    <div class="list row">
      <div class="col-6 col-md-4 mb-3" v-for="(pokemon, index) in pokemons"
        :key="'poke'+index"
        @click="setPokemonUrl(pokemon.url, pokemon.my_id)">
        <div class="list-card " >
            <img :src="imageUrl + pokemon.id + '.png'" width="96" height="96" alt="">
            <h5 class="pokemon-name">{{ pokemon.name }}</h5>
            <p v-show="pokemon.nickname">"{{ pokemon.nickname }}"</p>
        </div>
      </div>
    </div>
    <div id="scroll-trigger" ref="infinitescrolltrigger" >
        <div class="loader" v-show="load"></div>
    </div>
  </div>
</template>

<script>

  export default {
    props: [
      'myPokemon'
    ],
    data: () => {
      return {
        nextUrl: '',
        currentUrl: '',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/',
        load: true,
        observer: null
      }
    },
    methods: {
      fetchData() {
        let req = new Request(this.currentUrl);
        fetch(req)
          .then((resp) => {
            if(resp.status === 200)
              return resp.json();
          })
          .then((data) => {
            this.nextUrl = data.next;
            data.results.forEach(pokemon => {
              pokemon.id = pokemon.url.split('/')
                .filter(function(part) { return !!part }).pop();
              this.pokemons.push(pokemon);
            });
          })
          .catch((error) => {
            console.log(error);
          })
      },
      scrollTrigger() {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if(entry.intersectionRatio > 0 && this.nextUrl) {
              this.next();
            }
          });
        });
        this.observer.observe(this.$refs.infinitescrolltrigger);
      },
      next() {
        if(this.myPokemon)
          this.$store.dispatch('fetchMyPokemons');
        else {
          this.currentUrl = this.nextUrl;
          this.fetchData();
        }
          
      },
      setPokemonUrl(url, my_id) {
        if(this.myPokemon)
          this.$emit('setPokemonId', my_id)
        else
          this.$emit('setPokemonUrl', url);
      }
    },
    computed: {
      pokemons(){
        if(this.myPokemon)
          return this.$store.getters.allMyPokemons
        return this.$store.getters.allPokemons
      }
    },
    created() {
      this.currentUrl = 'https://pokeapi.co/api/v2/pokemon/'
      if(this.myPokemon)
        this.$store.dispatch('fetchMyPokemons');
      else
        this.fetchData()
    },
    mounted() {
      if(!this.myPokemon) {
        this.scrollTrigger();
      }
      else
        this.load = false
    },
  }
</script>

<style lang="scss">
    .list-card {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #121212;
        border-radius: 10px;
        padding: .5rem;
        text-align: center;

      .pokemon-name{
          text-transform: capitalize;
      }
    }

    #scroll-trigger {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .loader,
    .loader:after {
        border-radius: 50%;
        width: 10px;
        height: 10px;
    }
    .loader {
        margin: 20px auto;
        font-size: 8px;
        position: relative;
        text-indent: -9999em;
        border-top: .75rem solid rgba(255, 255, 255, 0.2);
        border-right: .75rem solid rgba(255, 255, 255, 0.2);
        border-bottom: .75rem solid rgba(255, 255, 255, 0.2);
        border-left: .75rem solid #ffffff;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
    }

    @-webkit-keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

</style>
