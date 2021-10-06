const { Schema, model } = require('mongoose')

const PokemonSchema = new Schema ({
    nickname: {
        type: String,
        required: true
    },
    rename_count: {
        type: Number,
    },
    pokemon_data: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const Pokemon = model('pokemon', PokemonSchema)

module.exports = Pokemon