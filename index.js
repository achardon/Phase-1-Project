console.log('js script working')


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('form')
    console.log(e.target.day.value)
    const notes = document.createElement('p')
    notes.innerText = e.target.notes.value
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'x'
    notes.appendChild(deleteButton)
    if (e.target.day.value === 'monday') {
        document.querySelector('#mon').appendChild(notes)
    }
    else if (e.target.day.value === 'tuesday') {
        document.querySelector('#tues').appendChild(notes)
    }
    else if (e.target.day.value === 'wednesday') {
        document.querySelector('#wed').appendChild(notes)
    }
    else if (e.target.day.value === 'thursday') {
        document.querySelector('#thurs').appendChild(notes)
    }
    else if (e.target.day.value === 'friday') {
        document.querySelector('#fri').appendChild(notes)
    }
    else if (e.target.day.value === 'saturday') {
        document.querySelector('#sat').appendChild(notes)
    }
    else if (e.target.day.value === 'sunday') {
        document.querySelector('#sun').appendChild(notes)
    }
    document.querySelector('button').addEventListener ('click', () => {
        debugger
        const parentElement = document.querySelector('button').parentElement
        parentElement.remove()
    })
    form.reset()
})

