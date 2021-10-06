<template>
    <div class="container">
        <PokemonList 
        :myPokemon=false
        @setPokemonUrl="setPokemonUrl" />

        <PokemonDetail 
        v-if="showDetail"
        :myPokemon=false
        :pokemonUrl="pokemonUrl"
        @closeDetail="closeDetail" />
    </div>
</template>

<script>
import PokemonList from '../components/PokemonList.vue';
import PokemonDetail from '../components/PokemonDetail.vue';

export default {
    data: () => {
        return {
            pokemonUrl: '',
            showDetail: false
        }
    },
     components: {
         PokemonList,
         PokemonDetail
     },
     methods: {
         setPokemonUrl(url){
             this.$store.dispatch('fetchPokemon', url)
             this.pokemonUrl = url;
             this.showDetail = true;
         },
         closeDetail() {
            this.pokemonUrl = '';
            this.showDetail = false
            this.$store.getters.allMyPokemons;
         }
     }
}
</script>
