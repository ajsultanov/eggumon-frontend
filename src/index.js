window.addEventListener("DOMContentLoaded", init)

function init(){
  console.log("%c エッグモン", "font-size:24px; font-weight:bold; color:red; text-shadow:2px 2px 2px orange")

  const URL = "http://localhost:3000/"
  const userLogin = document.getElementById("user")
  const myPetContainer = document.getElementById("my-pets")
  const otherPetContainer = document.getElementById("other-pets")
  let userId = ""

  // get all pets
  let allPets = []
  fetch(`${URL}pets`).then(r => r.json()).then(petData => {
    petData.forEach(pet => {
      allPets.push(pet)
    })
    console.log(`pets: ${allPets.length}`)
  })

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

  if (userId === "") {
    userLogin.innerHTML =
      `<button type="submit">Sign Up / Sign In</button>
       <input type="text" name="login" id="login" value="" placeholder="Username">`
  } else {
    userLogin.innerHTML =
      `<button type="submit" id="logout">Sign Out</button>`
  }

  userLogin.addEventListener("submit", event => {
    event.preventDefault()

    const userInput = userLogin.elements.login
    if (userInput.value !== "") {
      userId = userInput.value
      console.log(`userId: ${userId}`)

      // if user already exists {
      // userLogin.innerHTML =
      //   `<button type="submit" id="logout">Sign Out</button>`
      // }

      fetch(`${URL}pets?user_id=${userId}`)
      .then(r => r.json())
      .then(petData => renderPets(petData))
    }
  })

  function renderPets(pets) {
    console.log("renderPets")
    myPetContainer.innerHTML = ""
    if (pets.length > 0) {
      pets.forEach(p => {
        let petHTML = petConverter(p)
        myPetContainer.innerHTML += petHTML
      })
    } else {
      myPetContainer.innerHTML =
        `<p>Couldn"t find any pets, ${userId}!!!!</p>
         <p>This is where the CREATE PET form will be.</p>
         <form>
           <input type="text" value="" placeholder="New Pet Name">
           <button type="submit" name="createPet" id="createPet">create!</button>
         </form>
         `
    }
    // generate 3 random numbers from 1 - total # of pets
    // render those pets here
    otherPetContainer.innerHTML = ""
    const otherPets = allPets.slice(0, 3)
    otherPets.forEach(p => {
      let petHTML = petConverter(p)
      otherPetContainer.innerHTML += petHTML
    })
  }

  function petConverter(pet) {
    console.log("petConverter")
    return `
    <div class="pet">
      <img src="src/img/egg.png" alt="a speckled egg">
      <p>pet id: ${pet.id} &nbsp; ~ &nbsp; ${pet.name}</p>
    </div>
    `
        // render data (sprites)
        // render data (info)
  }

  // listen for clicks on:
    // create new pet form
    // "edit" pet (feed, play, etc) buttons
    // delete pet

}
