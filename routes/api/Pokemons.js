const { Router } = require('express');
const Pokemon = require('../../models/Pokemon')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const Pokemons = await Pokemon.find()
        if(!Pokemons) throw new Error('No Pokemons')
        const sorted = Pokemons.sort((a,b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        })
        res.status(200).json(sorted)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const GetPokemon = await Pokemon.findById(id, req.body);
        if(!Pokemon) throw new Error('No Pokemons')
        res.status(200).json(GetPokemon)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async(req, res) => {
    const newPokemon = new Pokemon(req.body)

    try {
        const pokemonItem = await newPokemon.save()
        if (!pokemonItem) throw new Error ('Something went wrong saving the data')
        res.status(200).json(pokemonItem)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/:id', async(req, res) => {
    const { id } = req.params
    try {
        const response = await Pokemon.findByIdAndUpdate(id, req.body)
        if(!response) throw Error ('Something went wrong')
        const updated = { ...response._doc, ...req.body}
        res.status(200).json(updated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params
    try {
        const removed = await Pokemon.findByIdAndDelete(id)
        if(!removed) throw Error('Something went wrong')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router