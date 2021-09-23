
//make variable for notes for each day
const week = []

document.querySelector('#addNotes').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#addNotes')
    //console.log(e.target.day.value)

    //this is where the PATCH fetch request should go for persisting the note to the backend
    persistNotes(e.target.notes.value, e.target.day.value)
    
    const notes = document.createElement('p')
    notes.innerText = e.target.notes.value
    const deleteContent = document.createElement('button')
    deleteContent.innerText = 'x'
    notes.appendChild(deleteContent)

    //need to finish below
    //document.querySelector('#day-${e.target.day.value}').appendChild(notes)

    if (e.target.day.value === '1') {
        document.querySelector('#mon').appendChild(notes)
    }
    else if (e.target.day.value === '2') {
        document.querySelector('#tues').appendChild(notes)
    }
    else if (e.target.day.value === '3') {
        document.querySelector('#wed').appendChild(notes)
    }
    else if (e.target.day.value === '4') {
        document.querySelector('#thurs').appendChild(notes)
    }
    else if (e.target.day.value === '5') {
        document.querySelector('#fri').appendChild(notes)
    }
    else if (e.target.day.value === '6') {
        document.querySelector('#sat').appendChild(notes)
    }
    else if (e.target.day.value === '7') {
        document.querySelector('#sun').appendChild(notes)
    }
    deleteContent.addEventListener ('click', () => {
        //debugger
        const parentElement = deleteContent.parentElement
        parentElement.remove()
    })
    //debugger;
    form.reset()
})

document.querySelector('#addGroceries').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = document.querySelector('#addGroceries')
    //console.log(e.target.day.value)
    
    persistGroceries(e.target.item.value)

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
        //this is where the fetch function needs to go for deleting the item on the server
    })
    form.reset()
})

document.querySelector('#recipeSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchRequest = e.target.search.value
    document.querySelectorAll('li.search').forEach(li=>li.remove())
    //need to delete current recipe shown
    document.querySelector('#showRecipe h3').innerText = ''
    document.querySelector('img').src = ''
    document.querySelectorAll('li.ingredient').forEach(li=>li.remove())
    document.querySelectorAll('li.step').forEach(li=>li.remove())
    document.querySelector('#showRecipe').style.visibility = 'hidden'

    //console.log(searchRequest)
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
                //this line below does not work (recpie stays bolded) - why??
                recipeNames.forEach(recipe => recipe.style.fontweight = 'normal')
                li.style.color = 'orange'
                li.style.fontWeight = 'bold'
                document.querySelectorAll('li.ingredient').forEach(li=>li.remove())
                document.querySelectorAll('li.step').forEach(li=>li.remove())
                getRecipeInfo(recipeID)
            })
        })
    })
}

function getRecipeInfo(recipeID) {
    //console.log('inside getRecipeInfo function')
    //console.log(recipeID)
    fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=c19ab73b0fea4182a41a6222b727ccea`)
    .then(res => res.json())
    .then(data => {
        //get recipe title
        document.querySelector('#showRecipe h3').innerText = data.title
        document.querySelector("#showRecipe > h3").style.color = 'orange'
        //make section visible
        document.querySelector('#showRecipe').style.visibility = 'visible'
        //get recipe image
        const image = document.querySelector('img')
        image.src = data.image
        image.alt = 'picture of recipe'
        image.style.height = 20
        //get reciep ingredients
        data.extendedIngredients.forEach(ingredient => {
            const ingredientInfo = document.createElement('li')
            ingredientInfo.className = 'ingredient'
            ingredientInfo.innerText = (ingredient.amount + ' ' + ingredient.measures.us.unitShort + ' ' + ingredient.name)
            document.querySelector('ul#ingredients').appendChild(ingredientInfo)
            ingredientInfo.style.cursor = 'pointer'
            //add event listener to add ingredient to grocery list
            ingredientInfo.addEventListener('click', (e) => {

                //copied from grocery item event listener
                const form = document.querySelector('#addGroceries')

                persistGroceries(ingredientInfo.innerText)

                const newItem = document.createElement('li')
                newItem.innerText = ingredientInfo.innerText
                const deleteButton = document.createElement('button')
                deleteButton.innerText = 'x'
                newItem.appendChild(deleteButton)
                document.querySelector('ul').appendChild(newItem)
                deleteButton.addEventListener ('click', () => {
                    // debugger
                    const parentNode = deleteButton.parentNode
                    parentNode.remove()
                })
                //above copied from grocery item event listener

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
            //console.log (item.name)
            const form = document.querySelector('#addGroceries')
            const newItem = document.createElement('li')
            newItem.innerText = item.name
            const deleteButton = document.createElement('button')
            deleteButton.innerText = 'x'
            newItem.appendChild(deleteButton)
            document.querySelector('ul').appendChild(newItem)
            deleteButton.addEventListener ('click', () => {
            const parentNode = deleteButton.parentNode
            parentNode.remove()
            })
        })
    })
}

function getNotes() {
    fetch('http://localhost:3000/days')
    .then(res => res.json())
    .then(data => {
        //addNotes(day.id)
        data.forEach(day => {
            week.push(day)
            //console.log(day.name, day.notes)
            if (day.notes[0] !== undefined) {

                //debugger;
                //copied from #addNotes event listener above
                
                day.notes.forEach(note => {
                    
                    const notes = document.createElement('p')
                    notes.innerText = note //how to get rid of x?
                    const deleteContent = document.createElement('button')
                    deleteContent.innerText = 'x'
                    notes.appendChild(deleteContent)
                    
                    if (day.name === 'Monday') {
                        document.querySelector('#mon').appendChild(notes)
                    }
                    else if (day.name === 'Tuesday') {
                        document.querySelector('#tues').appendChild(notes)
                    }
                    else if (day.name === 'Wednesday') {
                        document.querySelector('#wed').appendChild(notes)
                    }
                    else if (day.name === 'Thursday') {
                        document.querySelector('#thurs').appendChild(notes)
                    }
                    else if (day.name === 'Friday') {
                        document.querySelector('#fri').appendChild(notes)
                    }
                    else if (day.name === 'Saturday') {
                        document.querySelector('#sat').appendChild(notes)
                    }
                    else if (day.name === 'Sunday') {
                        document.querySelector('#sun').appendChild(notes)
                    }
                    deleteContent.addEventListener ('click', () => {
                        //debugger
                        const parentElement = deleteContent.parentElement
                        parentElement.remove()
                    })
                })
            }
        })
    })
}

//is this supposed to POST or PATCH? I'm getting two errors that don't make sense...
//this should be a POST
//once this function works, it needs to be added to event listener for adding groceries to list (AND to event listener for ingredients after a recipe search)
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
    .then(data => {})
}

//Still need to persist DELETING notes and grocery items. Would that be a DELETE or a PATCH?

getNotes()

getGroceries()

//Questions
//For the week plan, using parentElement for the delete button works (but not parentNode). 
//For thte groceries, parentNode does work (and parentElemtn works too)... why the difference?

//For getting the notes on the page: I do it with the event listener for the notes form, and also from the json. How would I be able to just make one function called renderNotes when I used e.target.day.value for the first and day.name for the second. How do I make that more streamlined?

//For the json template, there is a section for 'deploying the server' using Heroku. What is that for?

//For some of the recipes, the amount has way too many decimal places (0.333333 cups of oil) - is this easy to fix? (ex: spaghetti squash boats)

//For styling the page, how could I make a block for the grocery list and search functions all in one line? Or have the recipe picture be next to the ingredients and next to the steps?

//after I added the json server and pushed my newest repo to github, it said something about warning: json server something something... can I still push it to github and to the website even though it's running with json?



//Notes
//this is a successful request for chickpeas and dairy-free: https://api.spoonacular.com/recipes/complexSearch?apiKey=c19ab73b0fea4182a41a6222b727ccea&query=chickpeas&intolerances=dairy
//this is a successful request for all the information about a given recipe (using recipe ID): https://api.spoonacular.com/recipes/641072/information?apiKey=c19ab73b0fea4182a41a6222b727ccea

//JSON Notes
// to run the server in development mode: "npm run dev"
// Any time you want to reset your database back to your original data, run 'npm run seed' again.



//Potential things to add
//line before recipe list: "Click recipe for more info"
//event listener for ingredient to add to grocery list
//filter recipes with dietary restrictions