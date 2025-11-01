const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(cors())

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p>
        <p>${now}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    const existingPerson = phonebook.find(p => p.name === body.name)
    if (existingPerson) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 120000)),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
