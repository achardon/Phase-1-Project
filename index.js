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

document.querySelector('#recipeSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    const searchRequest = e.target.search.value
    document.querySelectorAll('li.search').forEach(li=>li.remove())
    //need to delete current recipe shown
    document.querySelectorAll('li.ingredient').forEach(li=>li.remove())
    document.querySelectorAll('li.step').forEach(li=>li.remove())

    //console.log(searchRequest)
    getRecipes(searchRequest);
})

function getRecipes(searchRequest) {
    //console.log('inside getRecipes function')
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=c19ab73b0fea4182a41a6222b727ccea&query=${searchRequest}`)
    .then(res => res.json())
    .then(data => {
        data.results.forEach(recipe => {
            //console.log(recipe.title)
            const li = document.createElement('li')
            li.className = 'search'
            li.innerText=recipe.title
            document.querySelector('#searchResults ul').append(li)
            const recipeID = recipe.id
            //console.log('id:' + recipeID)
            li.addEventListener('click', () => {
                getRecipeInfo(recipeID)
                
            })
        })
    })
}

function getRecipeInfo(recipeID) {
    console.log('inside getRecipeInfo function')
    console.log(recipeID)
    fetch(`https://api.spoonacular.com/recipes/${recipeID}/information?apiKey=c19ab73b0fea4182a41a6222b727ccea`)
    .then(res => res.json())
    .then(data => {
        //debugger;
        // data.analyzedInstructions[0].steps.forEach(instruction => console.log(instruction.step))
        // data.extendedIngredients.forEach(ingredient => console.log(ingredient.amount + ' ' + ingredient.measures.us.unitShort + ' ' + ingredient.name))

        data.extendedIngredients.forEach(ingredient => {
            const ingredientInfo = document.createElement('li')
            ingredientInfo.className = 'ingredient'
            ingredientInfo.innerText = (ingredient.amount + ' ' + ingredient.measures.us.unitShort + ' ' + ingredient.name)
            document.querySelector('ul#ingredients').appendChild(ingredientInfo)
        })

        data.analyzedInstructions[0].steps.forEach(instruction => {
            const step = document.createElement('li')
            step.className = 'step'
            step.innerText = instruction.step
            document.querySelector('ol#instructions').appendChild(step)
        })
      
    })
    
}

//Questions
//For the week plan, using parentElement for the delete button works (but not parentNode). 
//For thte groceries, parentNode does work (and parentElemtn works too)... why the difference?



//Notes
//this is a successful request for chickpeas and dairy-free: https://api.spoonacular.com/recipes/complexSearch?apiKey=c19ab73b0fea4182a41a6222b727ccea&query=chickpeas&intolerances=dairy
//this is a successful request for all the information about a given recipe (using recipe ID): https://api.spoonacular.com/recipes/641072/information?apiKey=c19ab73b0fea4182a41a6222b727ccea