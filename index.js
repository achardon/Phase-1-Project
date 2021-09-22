//console.log('js script working')


//function addNotes(id) {
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
        //debugger;
        //persistNotes(notes.innerText, id)
        form.reset()
    })
//}

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
        //debugger;
        // data.analyzedInstructions[0].steps.forEach(instruction => console.log(instruction.step))
        // data.extendedIngredients.forEach(ingredient => console.log(ingredient.amount + ' ' + ingredient.measures.us.unitShort + ' ' + ingredient.name))

        // const title = document.createElement('h3')
        // title.innerText = data.title
        document.querySelector('#showRecipe h3').innerText = data.title
        document.querySelector("#showRecipe > h3").style.color = 'orange'

        document.querySelector('#showRecipe').style.visibility = 'visible'
        
        const image = document.querySelector('img')
        image.src = data.image
        image.alt = 'picture of recipe'
        image.style.height = 20

        data.extendedIngredients.forEach(ingredient => {
            const ingredientInfo = document.createElement('li')
            ingredientInfo.className = 'ingredient'
            ingredientInfo.innerText = (ingredient.amount + ' ' + ingredient.measures.us.unitShort + ' ' + ingredient.name)
            document.querySelector('ul#ingredients').appendChild(ingredientInfo)
            ingredientInfo.style.cursor = 'pointer'
            ingredientInfo.addEventListener('click', (e) => {

                //copied from grocery item event listener
                const form = document.querySelector('#addGroceries')
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

        data.analyzedInstructions[0].steps.forEach(instruction => {
            const step = document.createElement('li')
            step.className = 'step'
            step.innerText = instruction.step
            document.querySelector('ol#instructions').appendChild(step)
        })
      
    })
    
}

function getNotes() {
    fetch('http://localhost:3000/days')
    .then(res => res.json())
    .then(data => {
        //addNotes(day.id)
        data.forEach(day => {
            console.log(day.name, day.notes)
            if (day.notes !== undefined) {
                //copied from #addNotes event listener above
                const notes = document.createElement('p')
                notes.innerText = day.notes
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
            }
        })
    })
}

// function persistNotes(notes, id) {
//     fetch(`http://localhost:3000/days/${id}`, {
//         method: "PATCH",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
    //// make an array of current notes, to which new notes can be added
//             "notes": notes
//         })
//     })
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//     })
// }

getNotes()

//Questions
//For the week plan, using parentElement for the delete button works (but not parentNode). 
//For thte groceries, parentNode does work (and parentElemtn works too)... why the difference?

//For getting the notes on the page: I do it with the event listener for the notes form, and also from the json. How would I be able to just make one function called renderNotes when I used e.target.day.value for the first and day.name for the second. How do I make that more streamlined?

//For the json template, there is a section for 'deploying the server' using Heroku. What is that for?



//Notes
//this is a successful request for chickpeas and dairy-free: https://api.spoonacular.com/recipes/complexSearch?apiKey=c19ab73b0fea4182a41a6222b727ccea&query=chickpeas&intolerances=dairy
//this is a successful request for all the information about a given recipe (using recipe ID): https://api.spoonacular.com/recipes/641072/information?apiKey=c19ab73b0fea4182a41a6222b727ccea

//json: Any time you want to reset your database back to your original data, run 'npm run seed' again.


//Potential things to add
//line before recipe list: "Click recipe for more info"
//event listener for ingredient to add to grocery list
//filter recipes with dietary restrictions