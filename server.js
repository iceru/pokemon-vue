const express = require('express');
const app = express()
const { PORT, mongoUri } = require('./config')
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const pokemonRoutes = require('./routes/api/Pokemons')

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

mongoose
    .connect(mongoUri, {
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB database Connected'))
    .catch((err) => console.log(err))

app.use('/api/pokemons', pokemonRoutes)

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))