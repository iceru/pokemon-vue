import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pokemons: [],
    pokemon: {},
    myPokemons: [],
    myPokemon: {},
  },
  getters: {
    allPokemons: (state) => {
      return state.pokemons
    },
    allMyPokemons: (state) => {
      return state.myPokemons
    },
    myPokemon: (state) => { return state.myPokemon },
    pokemon: (state) => { return state.pokemon },
  },
  mutations: {
    setMyPokemons: (state, myPokemons) => (state.myPokemons = myPokemons),
    setMyPokemon: (state, pokemon) => (state.myPokemon = pokemon),
    addPokemon: (state, newPokemon) => state.myPokemons.unshift(newPokemon),
    setPokemons: (state, pokemons) => (state.pokemons = pokemons),
    setPokemon: (state, data) => (state.pokemon = data),
    updatePokemon: (state, myPokemon) => {state.myPokemon = myPokemon},
    removePokemon: (state, id) => state.myPokemons = state.myPokemons.filter((myPokemon) => myPokemon.my_id !== id ) 
  },
  actions: {
    async fetchMyPokemons({commit}) {
      const response = await axios.get('api/pokemons/')
      var pokemons = []
      response.data.forEach(pokemon => {
        var new_pokemon = pokemon.pokemon_data;
        Object.assign(new_pokemon, {nickname: pokemon.nickname, rename_count: pokemon.rename_count, my_id: pokemon._id})
        pokemons.push(new_pokemon)
      })
      
      commit('setMyPokemons', pokemons)
    },

    async fetchMyPokemon({commit}, id) {
      const response = await axios.get(`/api/pokemons/${id}`)
      var pokemon = response.data.pokemon_data;
      Object.assign(pokemon, {nickname: response.data.nickname, rename_count: response.data.rename_count, my_id: response.data._id})

      commit('setMyPokemon', pokemon)
    },

    async addPokemon({commit}, {nickname,rename_count, pokemon_data}) {
      const response = await axios.post('/api/pokemons/', {
        nickname: nickname,
        rename_count: rename_count,
        pokemon_data: pokemon_data
      })

      commit('addPokemon', response.data)
    },

    async updatePokemon({commit}, {id, nickname, rename_count}) {
      const result = await axios.put(`/api/pokemons/${id}`, {
        nickname: nickname,
        rename_count: rename_count
      })
      commit('updatePokemon', result.data)
    },

    async releasePokemon({commit}, id) {
      await axios.delete(`/api/pokemons/${id}`)
      commit('removePokemon', id)
    },

    // fetchPokemons({commit}) {
    //   let req = new Request('https://pokeapi.co/api/v2/pokemon/');
    //   fetch(req)
    //     .then((resp) => {
    //       if(resp.status === 200)
    //         return resp.json();
    //     })
    //     .then((data) => {
    //       this.nextUrl = data.next;
    //       var pokemons = []
    //       data.results.forEach(pokemon => {
    //         pokemon.id = pokemon.url.split('/')
    //           .filter(function(part) { return !!part }).pop();
    //         pokemons.push(pokemon);
    //       });
    //       commit('setPokemons', pokemons)
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     })
    // },

    fetchPokemon({commit}, url) {
      let req = new Request(url);
      fetch(req)
        .then((resp) => {
          if(resp.status === 200)
            return resp.json();
        })
        .then((data) => {
          commit('setPokemon', data)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }
})
