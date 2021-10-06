<template>
    <div class="container">
        <PokemonList 
        :apiUrl="apiUrl"
        :myPokemon=true
        @setPokemonId="setPokemonId" />

        <PokemonDetail 
        v-if="showDetail"
        :myPokemon=true
        :pokemonId="pokemonId"
        @closeDetail="closeDetail" />
    </div>
</template>

<script>
import PokemonList from '../components/PokemonList.vue';
import PokemonDetail from '../components/PokemonDetail.vue';

export default {
    data: () => {
        return {
            apiUrl: 'api/pokemons/',
            pokemonId: '',
            showDetail: false
        }
    },
     components: {
         PokemonList,
         PokemonDetail
     },
     methods: {
         setPokemonId(my_id){
             this.$store.dispatch('fetchMyPokemon', my_id)
             this.pokemonId = my_id;
             this.showDetail = true
         },
         closeDetail() {
            this.pokemonId = '';
            this.showDetail = false
            this.$store.dispatch('fetchMyPokemons');
         }
     }
}
</script>
