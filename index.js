//console.log('js script working')


document.querySelector('#addNotes').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#addNotes')
    //console.log(e.target.day.value)
    const notes = document.createElement('p')
    notes.innerText = e.target.notes.value
    const deleteContent = document.createElement('button')
    deleteContent.innerText = 'x'
    notes.appendChild(deleteContent)
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
    deleteContent.addEventListener ('click', () => {
        //debugger
        const parentElement = deleteContent.parentElement
        parentElement.remove()
    })
    form.reset()
})

document.querySelector('#addGroceries').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#addGroceries')
    //console.log(e.target.day.value)
    const newItem = document.createElement('li')
    newItem.innerText = e.target.item.value
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'x'
    newItem.appendChild(deleteButton)
    document.querySelector('ul').appendChild(newItem)
    deleteButton.addEventListener ('click', () => {
        // debugger
        const parentNode = deleteButton.parentNode
        parentNode.remove()
    })
    form.reset()
})



//Questions
//For the week plan, using parentElement for the delete button works (but not parentNode). 
//For thte groceries, parentNode does work (and parentElemtn works too)... why the difference?