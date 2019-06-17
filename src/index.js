window.addEventListener('DOMContentLoaded', init)

function init(){
  console.log('%c エッグモン', 'font-size:24px; font-weight:bold; color:red; text-shadow:2px 2px 2px orange')

  const URL = 'http://localhost:3000/'
  const userLogin = document.getElementById('user')
  const myPetContainer = document.getElementById('my-pets')
  const otherPetContainer = document.getElementById('other-pets')
  let userId = ""

  /*
      STATE 1
      - sign in / sign up
      - splash graphic
      - random other pets

      STATE 2
      - sign out
      - pet interaction area
      - random other pets
  */

  // initialize page
  // get user

  if (userId === '') {
    userLogin.innerHTML =
      `<button type='submit'>Sign Up / Sign In</button>
       <input type='text' name='login' id='login' value='' placeholder='Username'>`
  } else {
    userLogin.innerHTML =
      `<button type="submit" id='logout'>Sign Out</button>`
  }

  userLogin.addEventListener('submit', event => {
    event.preventDefault()

    const userInput = userLogin.elements.login
    if (userInput.value !== '') {
      userId = userInput.value
      console.log(`userId: ${userId}`)

      fetch(`${URL}pets?user_id=${userId}`)
      .then(r => r.json())
      .then(r => renderPets(r))
    }
  })

  function renderPets(pets) {
    console.log('renderPets')
    myPetContainer.innerHTML = ""
    if (pets.length > 0) {
      pets.forEach(p => {
        let petHTML = petConverter(p)
        myPetContainer.innerHTML += petHTML
      })
    } else {
      myPetContainer.innerHTML =
        `<p>Couldn't find any pets, ${userId}!!!!</p>
         <p>This is where the CREATE PET form will be.</p>`
    }
  }

  function petConverter(pet) {
    console.log('petConverter')
    return `
    <div class='pet'>
      <p>${pet.id} ~ ${pet.name}</p>
    </div>
    `
        // render data (sprites)
        // render data (info)
  }

  // listen for clicks on:
    // create new pet form
    // 'edit' pet (feed, play, etc) buttons
    // delete pet














}
