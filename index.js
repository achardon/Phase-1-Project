
//make variable for notes for each day
const week = []

document.querySelector('#addNotes').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#addNotes')
    const dayID = e.target.day.value 
    const note = e.target.notes.value

    //PATCH request
    persistNotes(note, dayID)
    
    // const newNote = document.createElement('p')
    // newNote.innerText = note
    // const deleteContent = document.createElement('button')
    // deleteContent.innerText = 'x'
    // newNote.appendChild(deleteContent)

    // document.querySelector(`#day-${dayID}`).appendChild(newNote)

    // deleteContent.addEventListener ('click', () => {
    //     persistDeleteNotes(note, id)
    //     const parentElement = deleteContent.parentElement
    //     parentElement.remove()
    // })
    //debugger;
    form.reset()
})

document.querySelector('#addGroceries').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#addGroceries')
    persistGroceries(e.target.item.value)
    form.reset()
})

document.querySelector('#recipeSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchRequest = e.target.search.value
    document.querySelectorAll('li.search').forEach(li=>li.remove())
    //need to delete current recipe shown
    document.querySelector('#showRecipeIngredients h3').innerText = ''
    document.querySelector('img').src = ''
    document.querySelectorAll('li.ingredient').forEach(li=>li.remove())
    document.querySelectorAll('li.step').forEach(li=>li.remove())
    document.querySelector('#showRecipeIngredients').style.visibility = 'hidden'
    getRecipes(searchRequest);
})

function getRecipes(searchRequest) {
    //console.log('inside getRecipes function')
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=c19ab73b0fea4182a41a6222b727ccea&query=${searchRequest}`)
    .then(res => res.json())
    .then(data => {
        document.querySelector('#searchResults').style.visibility = 'visible'
        data.results.forEach(recipe => {
            //console.log(recipe.title)
            const li = document.createElement('li')
            li.className = 'search'
            li.innerText=recipe.title
            document.querySelector('#searchResults ul').append(li)
            const recipeID = recipe.id
            //console.log('id:' + recipeID)
            li.addEventListener('click', () => {
                const recipeNames = document.querySelectorAll('li.search')
                recipeNames.forEach(recipe => recipe.style.color = 'black')
                li.style.color = 'orange'
                li.style.fontWeight = 'bold'
                //remove previously shown recipe info
                document.querySelectorAll('li.ingredient').forEach(li=>li.remove())
                document.querySelectorAll('li.step').forEach(li=>li.remove())
                getRecipeInfo(recipeID)
            })
        })
    })
}

function getRecipeInfo(recipeID) {
    fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=c19ab73b0fea4182a41a6222b727ccea`)
    .then(res => res.json())
    .then(data => {
        //get recipe title
        document.querySelector('#showRecipeIngredients h3').innerText = data.title
        document.querySelector("#showRecipeIngredients > h3").style.color = 'orange'
        //make section visible
        document.querySelector('#showRecipeIngredients').style.visibility = 'visible'
        document.querySelector('#showRecipeInstructions').style.visibility = 'visible'
        //get recipe image
        const image = document.querySelector('img')
        image.src = data.image
        image.alt = 'picture of recipe'
        image.style.height = 20
        //get recipe ingredients
        data.extendedIngredients.forEach(ingredient => {
            const ingredientInfo = document.createElement('li')
            ingredientInfo.className = 'ingredient'
            ingredientInfo.innerText = (ingredient.amount + ' ' + ingredient.measures.us.unitShort + ' ' + ingredient.name)
            document.querySelector('ul#ingredients').appendChild(ingredientInfo)
            ingredientInfo.style.cursor = 'pointer'
            //add event listener to add ingredient to grocery list
            ingredientInfo.addEventListener('click', (e) => {
                persistGroceries(ingredientInfo.innerText)
                ingredientInfo.style.fontStyle = 'italic'
            })
        })
        //get recipe instructions
        data.analyzedInstructions[0].steps.forEach(instruction => {
            const step = document.createElement('li')
            step.className = 'step'
            step.innerText = instruction.step
            document.querySelector('ol#instructions').appendChild(step)
        })
    })   
}

function getGroceries() {
    fetch('http://localhost:3000/groceries')
    .then(res => res.json())
    .then(data => {
        data.forEach(item => {
            const form = document.querySelector('#addGroceries')
            const newItem = document.createElement('li')
            newItem.innerText = item.name
            const deleteButton = document.createElement('button')
            deleteButton.innerText = 'x'
            newItem.appendChild(deleteButton)
            document.querySelector('ul').appendChild(newItem)
            deleteButton.addEventListener ('click', () => {
                persistDeleteGroceries(item.id, deleteButton)
            })
        })
    })
}

function getNotes() {
    fetch('http://localhost:3000/days')
    .then(res => res.json())
    .then(data => {
        data.forEach(day => {
            week.push(day)
            if (day.notes[0] !== undefined) {
                day.notes.forEach(note => {
                    const newNote = document.createElement('p')
                    newNote.innerText = note 
                    const deleteContent = document.createElement('button')
                    deleteContent.innerText = 'x'
                    newNote.appendChild(deleteContent)
                    document.querySelector(`#day-${day.id}`).appendChild(newNote)
                    deleteContent.addEventListener ('click', () => {
                        persistDeleteNotes(note, day.id)
                        const parentElement = deleteContent.parentElement
                        parentElement.remove()
                    })
                })
            }
        })
    })
}

function persistGroceries(item) {
    fetch('http://localhost:3000/groceries', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        //
        body: JSON.stringify({name: item})
        })
    .then(res => res.json())
    .then(data => {
        const newItem = document.createElement('li')
        newItem.innerText = data.name
        const deleteButton = document.createElement('button')
        deleteButton.innerText = 'x'
        newItem.appendChild(deleteButton)
        document.querySelector('ul').appendChild(newItem)
        deleteButton.addEventListener ('click', () => {
            persistDeleteGroceries(data.id, deleteButton)
        })
    })
}

function persistNotes(note, id) {
    idIntoInt = parseInt(id) 
    const day = week.find((day) => (day.id === idIntoInt))
    const newArray = [...day.notes, note]
    week[idIntoInt - 1].notes = newArray
    fetch(`http://localhost:3000/days/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "notes": newArray
        })
    })
    .then(res => res.json())
    .then(data => {
        const newNote = document.createElement('p')
        newNote.innerText = note
        const deleteContent = document.createElement('button')
        deleteContent.innerText = 'x'
        newNote.appendChild(deleteContent)
    
        document.querySelector(`#day-${id}`).appendChild(newNote)
    
        deleteContent.addEventListener ('click', () => {
            persistDeleteNotes(note, id)
            const parentElement = deleteContent.parentElement
            parentElement.remove()
        })
    
    })
}

function persistDeleteGroceries(itemID, deleteButton) {
    fetch(`http://localhost:3000/groceries/${itemID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        const parentNode = deleteButton.parentNode
        parentNode.remove()
    })
}

function persistDeleteNotes(note, id) {
    console.log(note)
    console.log(id)

    idIntoInt = parseInt(id) 
    const day = week.find((day) => (day.id === idIntoInt))
    //NEED TO DELETE INSTEAD OF ADD NOTE
    //debugger
    //const item = day.notes.find(item => (item === note))
    //item is the item we want to delete, need index of item in array so we can delete that item from the array
    //can I use findIndex()
    //day.notes.findIndex(FUNCTION THAT RETURNS ITEM)
    const index = day.notes.findIndex(x => x === note)
    //need to remove 'index' declared above from day's notes array
    day.notes.splice(index, 1)
    const newArray = day.notes
    week[idIntoInt - 1].notes = newArray
    //debugger
    fetch(`http://localhost:3000/days/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "notes": newArray
        })
    })
    .then(res => res.json())
    .then(data => {})
}

getNotes()

getGroceries()

//Questions
//For the week plan, using parentElement for the delete button works (but not parentNode). 
//For the groceries, parentNode does work (and parentElemtn works too)... why the difference?

//For getting the notes on the page: I do it with the event listener for the notes form, and also from the json. How would I be able to just make one function called renderNotes when I used e.target.day.value for the first and day.name for the second. How do I make that more streamlined?

//For the json template, there is a section for 'deploying the server' using Heroku. What is that for?

//For some of the recipes, the amount has way too many decimal places (0.333333 cups of oil) - is this easy to fix? (ex: spaghetti squash boats)

//after I added the json server and pushed my newest repo to github, it said something about warning: json server something something... can I still push it to github and to the website even though it's running with json?



//Notes
//this is a successful request for chickpeas and dairy-free: https://api.spoonacular.com/recipes/complexSearch?apiKey=c19ab73b0fea4182a41a6222b727ccea&query=chickpeas&intolerances=dairy
//this is a successful request for all the information about a given recipe (using recipe ID): https://api.spoonacular.com/recipes/641072/information?apiKey=c19ab73b0fea4182a41a6222b727ccea

//JSON Notes
// to run the server in development mode: "npm run dev"
// Any time you want to reset your database back to your original data, run 'npm run seed' again.
