window.addEventListener("DOMContentLoaded", init)

function init(){
  console.log("%c エッグモン", "font-size:24px; font-weight:bold; color:red; text-shadow:2px 2px 2px orange")

  const URL = "http://localhost:3000/"
  const userLogin = document.getElementById("user")
  const myPetContainer = document.getElementById("my-pets")
  const otherPetContainer = document.getElementById("other-pets")
  const panelContainer = document.getElementById("pet-control-panel")
  const fullHealthSRC = `src/img/fullhealth.png`
  const halfHealthSRC = `src/img/halfhealth.png`
  const noHealthSRC = `src/img/nohealth.png`

  let logButton = ""
  let currentUser = ""
  let allPets = []
  let allUsers = []

  function logInButton() {
    userLogin.innerHTML = `
      <button type="submit" data-action="login">Sign Up / Sign In</button>
      <input type="text" name="login" id="login" value="" placeholder="Username">
    `
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
  }
  logInButton()

  // get all users
  fetch(`${URL}api/v1/users`).then(r => r.json()).then(userData => {
    userData.forEach(user => {
      allUsers.push(user)
    })
    console.log(allUsers)
  })

  // initialize page
  // get user
  userLogin.addEventListener("submit", event => {
    event.preventDefault()

    // user is not logged in
    if (logButton.dataset.action === "login") {
    const userInput = userLogin.elements.login.value

      // if user IS found in allUsers array
      if (allUsers.some(user => user.name === userInput)) {
        currentUser = allUsers.find(user => user.name === userInput)
        console.log("current user:", currentUser)

        fetch(`${URL}api/v1/users/${currentUser.id}`)
        .then(r => r.json())
        .then(userData => {

          logOutButton()

          console.log("current user pets:", currentUser.pets)
          renderPets(currentUser.pets)

          // fetch(`${URL}api/v1/pets?user_id=${currentUser}`)
          // .then(r => r.json())
          // .then(petData => {
          //   renderPets(petData)
          //   console.log(petData)
          // })

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
          console.log("current user:", userData)
          currentUser = userData
          allUsers.push(userData)
          renderPets(userData.pets)
          logOutButton()
        })
      }
    }
    // user is logged in
    if (logButton.dataset.action === "logout") {
      currentUser = ""
      myPetContainer.innerHTML = "<p>my pets container splash image</p>"
      panelContainer.innerHTML = ""
      logInButton()
    }
  })

  function logOutButton() {
    userLogin.innerHTML =
      `<button type="submit" data-action="logout">Sign Out</button> ${currentUser.name}`
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
  }

  function renderPets(pets) {
    myPetContainer.innerHTML = ""
    panelContainer.innerHTML = ""
    if (pets.length > 0) {
      pets.forEach(p => {
        let petHTML = petConverter(p)
        myPetContainer.innerHTML += petHTML
        //render pet control panel html here
        let controlHTML = renderControlPanel(p)
        panelContainer.innerHTML += controlHTML

      })
    }
    else {
      noPets()
    }
    // generate 3 random numbers from 1 - total # of pets
    // render those pets here
    // this could be moved outside the renderPets
    // function if it should happen automatically
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
    return `
    <div class="pet">
      <img src="src/img/egg.png" alt="a speckled egg">
      <img src="src/img/${pet.img}" alt="Pet not Pictured">

      <p>id: ${pet.id} &nbsp; ~ &nbsp; ${pet.name}</p>
    </div>
    `
        // render data (sprites)
        // render data (info)
  }

  function renderControlPanel(pet){
    console.log("petcontrolpanel")
    return `
        <div class="pet-panel">
        <img src="src/img/${pet.img}" alt="Pet not Pictured">

        <span id="panel-button" name="heart">
          <img id="health" src="src/img/fullhealth.png" alt="health">
        </span>
        </div>


        <div id="btn-group" class="btn-group">
          <button id="panel-button" name="eat">
          <img id="burger" src="src/img/burger.png" alt="feed">
          </button>
          <button id="panel-button" name="toilet">
          <img id="toilet" src="src/img/toilet-paper.png" alt="toilet">
          </button>

        </div>

    `
  }

  // listen for clicks on:
    // create new pet form
    // "edit" pet (feed, play, etc) buttons
    panelContainer.addEventListener('click', event => {

      if(event.target.id === "toilet" || "burger"){

        if (document.querySelector("#health").getAttribute("src") === fullHealthSRC){
          console.log("full -> no")
          document.querySelector("#health").src = noHealthSRC
        } else if (document.querySelector("#health").getAttribute("src") === noHealthSRC){
          console.log("no -> half")
          document.querySelector("#health").src = halfHealthSRC
        } else {
          console.log("half -> full")
          document.querySelector("#health").src = fullHealthSRC
        }
      }
    })

    // delete pet

}
