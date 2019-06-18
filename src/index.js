window.addEventListener("DOMContentLoaded", init)

function init(){
  console.log("%c エッグモン", "font-size:24px; font-weight:bold; color:red; text-shadow:2px 2px 2px orange")

  const URL = "http://localhost:3000/"
  const userLogin = document.getElementById("user")
  const myPetContainer = document.getElementById("my-pets")
  const otherPetContainer = document.getElementById("other-pets")
  let logButton = ""
  let currentUser = ""
  let allPets = []
  let allUsers = []
  let userNames = []

  function logInButton() {
    userLogin.innerHTML = `
      <button type="submit" data-action="login">Sign Up / Sign In</button>
      <input type="text" name="login" id="login" value="" placeholder="Username">
    `
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
  }
  logInButton()

  // get all pets
  fetch(`${URL}api/v1/pets`).then(r => r.json()).then(petData => {
    petData.forEach(pet => {
      allPets.push(pet)
    })
    console.log(`pets: ${allPets.length}`)
  })

  // get all users
  fetch(`${URL}api/v1/users`).then(r => r.json()).then(userData => {
    userData.forEach(user => {
      allUsers.push(user)
    })
    userNames = allUsers.map(user => user.name.toUpperCase())
    console.log(allUsers)
    console.log(userNames)
  })

  // initialize page
  // get user
  userLogin.addEventListener("submit", event => {
    event.preventDefault()
    const userInput = userLogin.elements.login.value.toUpperCase()

    // user is not logged in
    if (logButton.dataset.action === "login" && userInput !== "") {

      // if user IS found in allUsers array
      if (userNames.includes(userInput)) {
        fetch(`${URL}api/v1/users?name=${userInput}`)
        .then(r => r.json())
        .then(userData => {
          if (userData.length > 0) {
            console.log(userData)
            currentUser = userData[0].id
            logOutButton(userData)

            fetch(`${URL}api/v1/pets?user_id=${currentUser}`)
            .then(r => r.json())
            .then(petData => {
              renderPets(petData)
            })
          }
        })
      }
      // if user is NOT found in allUsers array
      else {
        fetch(`${URL}api/v1/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: userInput
          })
        })
        .then(r => r.json())
        .then(userData => {
          if (userData.length > 0) {
            console.log(userData)
          }
        })
        allUsers.push(userInput)
      }
    }

    // user is logged in
    if (logButton.dataset.action === "logout") {
      currentUser = ""
      myPetContainer.innerHTML = "<p>my pets container splash image</p>"
      logInButton()
    }
  })

  function logOutButton(user) {
    userLogin.innerHTML =
      `<button type="submit" data-action="logout">Sign Out</button> ${user[0].name}`
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
  }

  function renderPets(pets) {
    console.log("renderPets")
    myPetContainer.innerHTML = ""
    if (pets.length > 0) {
      pets.forEach(p => {
        let petHTML = petConverter(p)
        myPetContainer.innerHTML += petHTML
      })
    } else {
      noPets()
    }

    // this could be moved outside the renderPets function if it
    // should happen automatically
    // generate 3 random numbers from 1 - total # of pets
    // render those pets here
    otherPetContainer.innerHTML = ""
    const otherPets = allPets.slice(0, 3)
    otherPets.forEach(p => {
      let petHTML = petConverter(p)
      otherPetContainer.innerHTML += petHTML
    })
  }

  function noPets() {
    myPetContainer.innerHTML =
      `<p>Couldn't find any pets, ${currentUser}!!!!</p>
       <p>This is where the CREATE PET form will be.</p>
       <form>
         <input type="text" value="" placeholder="New Pet Name">
         <button type="submit" name="createPet" id="createPet">create!</button>
       </form>
       `
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
