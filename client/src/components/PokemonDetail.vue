<template>
  <div class="detail">
    <div class="detail-view" v-if="show && pokemon">
      <div v-if="pokemon" class="image">
        <img :src="pokemon.sprites.front_default" width="120" height="120" alt="">
      </div>
      <div v-if="pokemon" class="data">
        <h2 class="name">{{ pokemon.name }}</h2>
        <p class="name" v-show="myPokemon">"{{ pokemon.nickname }}"</p>
        <div class="property">
          <div class="left">Base Experience</div>
          <div class="right">{{ pokemon.base_experience }} XP</div>
        </div>
        <div class="property">
          <div class="left">Height</div>
          <div class="right">{{ pokemon.height / 10 }} m</div>
        </div>
        <div class="property">
          <div class="left">Weight</div>
          <div class="right">{{ pokemon.weight / 10 }} kg</div>
        </div>
        <h5>Pokemon Types</h5>
        <div class="types">
          <div class="type" 
            v-for="(value, index) in pokemon.types"
            :key="'value'+index">
            {{ value.type.name }}
          </div>
        </div>
        <h5>Abilities</h5>
        <div class="abilities">
          <div class="ability" 
            v-for="(value, index) in pokemon.abilities"
            :key="'value'+index">
            {{ value.ability.name }}
          </div>
        </div>
        <div v-show="!myPokemon">
          <div class="button" @click="catchPokemon">
            <div>Catch Pokemon!</div>
          </div>
          <div class="status-catch">
            <p v-html="status">
            </p>
            <div v-if="chance">
              <div class="d-flex">
                <input type="text" placeholder="Pokemon's Nickname" class="form-control me-2" v-model="nickname">
                <button class="btn btn-primary" @click="addPokemon">Submit</button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="myPokemon">
          <div class="button">
            <div @click="renamePokemon(pokemon.my_id)" class="rename">Rename</div>
            <div @click="releasePokemon(pokemon.my_id)">Release</div>
          </div>
          <p class="mt-2 text-center" v-show="status_release">{{ status_release }}</p>
        </div>
      </div>
      <h2 v-else>The pokemon was not found</h2>
      <div class="close" @click="closeDetail"></div>

    </div>
    <div v-else class="loader"></div>
  </div>
</template>

<script>
  export default {
    props: [
      'pokemonId',
      'pokemonUrl',
      'imageUrl',
      'myPokemon'
    ],
    data: () => {
      return {
        show: false,
        chance: false,
        status: '',
        nickname: '',
        catch_count: 0,
        status_release: '',
        fibonacci: 0,
        release_count: 0
      }      
    },
    methods: {
      releasePokemon() {
        var num = Math.floor(Math.random() * 100);
        for(let i = 2; i < num; i++)
          if(num % i === 0) {
            this.release_count++
            this.status_release = 'Failed to Release the Pokemon. Attempt ('+this.release_count+')'
            return false;
          }
        
        if(num > 1) {
          this.$store.dispatch("releasePokemon", this.pokemon.my_id)
          this.status_release = ''
          this.closeDetail();
        }
      },
      renamePokemon(){
        var fib = [];
        var result = [];
        
        fib[0] = 0; 
        fib[1] = 1;
        for (var i = 2; i < this.pokemon.rename_count+1; i++) {
          fib[i] = fib[i - 2] + fib[i - 1];
          result.push(fib[i]);
        }
        result.unshift(1);
        result.unshift(0);
        
        this.fibonacci = result.slice(-1)[0];
      
        if(result.length < 3)
          if(this.pokemon.rename_count < 1)
            this.fibonacci = 0
          else
            this.fibonacci = 1

        var pos = this.pokemon.nickname.indexOf("-")
        var name = this.pokemon.nickname
        if (pos > 0) {
          name = this.pokemon.nickname.slice(0, pos)
        }
        
        var fibonacci_name = name+'-'+this.fibonacci
        this.pokemon.rename_count++
        this.$store.dispatch("updatePokemon", {id: this.pokemon.my_id, nickname: fibonacci_name, rename_count: this.pokemon.rename_count})
        this.closeDetail()
      },
      closeDetail() {
        this.$emit('closeDetail');
      },
      catchPokemon() {
        this.chance = Math.random() < 0.5
        this.catch_count++
        this.status = 'Pokemon failed to catch! Attempt ('+this.catch_count+')'
        if (this.chance) {
          this.status = this.pokemon.name .charAt(0).toUpperCase() + this.pokemon.name.slice(1) + ' has been catched! <br> Please add a nickname to your Pokemon.'
          this.catch_count = 0
        }
        return this.status
      },
      async addPokemon() {
        this.$store.dispatch('addPokemon', {nickname: this.nickname, 
            rename_count: 0, 
            pokemon_data: {
              name: this.pokemon.name,
              id: this.pokemon.id,
              url: this.pokemonUrl,
              base_experience: this.pokemon.base_experience,
              height: this.pokemon.height,
              weight: this.pokemon.weight,
              types: this.pokemon.types,
              abilities: this.pokemon.abilities,
              sprites: {
                front_default: this.pokemon.sprites.front_default
              }
            }
          })
        this.closeDetail();
      },
    },
    computed: {
      pokemon() {
        if (this.myPokemon)
          return this.$store.getters.myPokemon
        else
          return this.$store.getters.pokemon
      }
    },
    created() {
      this.show = true
    }
  }
</script>

<style lang="scss" scoped>
    .detail {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow-y: auto;
    } 

    .close {
      &:after{
        display: inline-block;
        content: "\00d7";
        font-size: 2rem;
        position: absolute;
        top: 10px;
        right: 20px;
      }
    }

    .detail-view {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      position: relative;
      width: 100%;
      height: 100%;
      padding: 30px 0;
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #121212;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      box-shadow: 0 15px 30px rgba(0,0,0,.2),
                  0 10px 10px rgba(0,0,0,.2);
      
      .name {
        text-transform: capitalize;
        text-align: center;
        margin-bottom: .5rem;
      }

      h5 {
        margin-top: 1.5rem;
        margin-bottom: .25rem;
      }

      .data {
        width: 80%;
      }

      .property {
        display: flex;
        
        .left {
          font-weight: bold;
          &:after {
            content: ':';
            margin-left: 4px;
          }
          margin-right: .5rem;
        }
      }

      .types, .abilities {
        display: flex;
        flex-wrap: wrap;
        .type, .ability {
          text-transform: capitalize;
          padding: .25rem 1rem;
          margin-right: .5rem;
          margin-bottom: .5rem;
          border-radius: 20px;
          background-color: #ffcb05;
          color: #121212;
        }
      }

      .abilities {
        .ability {
          background-color: #2a75bb;
          color: white;
        }
      }
      
      .button {
        display: flex;
        justify-content: center;
        margin-top: 2rem;
        div {
          background: rgb(153, 36, 36);
          padding: .5rem 2rem;
          border-radius: 20px;
          font-size: 1.15rem;
          margin: 0 .5rem;
          cursor: pointer;
        }

        .rename {
            background: rgb(34, 105, 56);
        }
      }

      .status-catch {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
        flex-direction: column;
        align-items: center;

        p {
          text-align: center;
          margin-bottom: .5rem;
        }
      }
    }
</style>