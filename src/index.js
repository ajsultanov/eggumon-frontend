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

  const incrementpetContainer = document.getElementById("incrementpet")
  const foodBtn = document.getElementById("foodbtn")
  const trainBtn = document.getElementById("trainbtn")
  const cleanbtn = document.getElementById("cleanbtn")
  const statsbtn = document.getElementById("statsbtn")
  const playbtn = document.getElementById("playbtn")
  const sleepbtn = document.getElementById("sleepbtn")

  const currentpetstatusContainer = document.getElementById("currentpetstatus")
  let currentPetName = document.getElementById("currentPetName")
  let currentPetAge = document.getElementById("currentPetAge")
  let currentPetWeight = document.getElementById("currentPetWeight")
  let currentPetSpecialty = document.getElementById("currentPetSpecialty")
  let currentPetHealth = document.getElementById("currentPetHealth")
  let currentPetHappiness = document.getElementById("currentPetHappiness")
  let currentPetSkills = document.getElementById("currentPetSkills")
  let currentUserName = document.getElementById("currentUserName")

  let logButton = ""
  let currentUser = ""
  let allPets = []
  let allUsers = []
  let currentPet = []

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
    <div class="pet" id=${pet.id}>
      <img src="src/img/egg.png" alt="a speckled egg" id=${pet.id}>
      <img src="src/img/${pet.img}" alt="Pet not Pictured" id=${pet.id}>

      <p id=${pet.id}>id: ${pet.id} &nbsp; ~ &nbsp; ${pet.name}</p>
    </div>
    `
        // render data (sprites)
        // render data (info)
  }

  function renderCurrentPetStatus(pet){
    // console.log("pet status")
    currentPetName.innerText = `name: ${pet.name}`
    currentPetAge.innerText = `age: ${pet.age}`
    currentPetWeight.innerText = `weight: ${pet.weight}`
    currentPetSpecialty.innerText = `specialty: ${pet.specialty}`
    currentPetHealth.innerText = `health: ${pet.health}`
    currentPetHappiness.innerText = `health: ${pet.health}`
    currentPetSkills.innerText = `skill points: ${pet.skill_points}`
    currentUserName.innerText = `user: ${currentUser.name}`
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

      if(event.target.name === "eat" || event.target.id === "burger"){

        if (document.querySelector("#health").getAttribute("src") === halfHealthSRC){
          console.log("eat none")
          document.querySelector("#health").src = fullealthSRC
        } else if (document.querySelector("#health").getAttribute("src") === noHealthSRC){
          console.log("eat half")
          document.querySelector("#health").src = halfHealthSRC
        } else {
          console.log("eat full")
          document.querySelector("#health").src = fullHealthSRC
        }
      }

      if(event.target.name === "toilet" || event.target.id === "toilet"){

        if (document.querySelector("#health").getAttribute("src") === halfHealthSRC){
          console.log("poop none")
          document.querySelector("#health").src = fullHealthSRC
        } else if (document.querySelector("#health").getAttribute("src") === noHealthSRC){
          console.log("poop half")
          document.querySelector("#health").src = halfHealthSRC
        } else {
          console.log("poop full")
          document.querySelector("#health").src = fullHealthSRC
        }
      }
    })

  myPetContainer.addEventListener("click", (e) => {
    // this function just finds and sets the current pet when a user clicks on a pet in the all pets container
    if(e.target.className === "pet" || e.target.tagName === "IMG" || e.target.tagName === "P"){
      currentPet = currentUser.pets.find(pet => {return pet.id === parseInt(e.target.id)})
      // console.log(currentPet);
      // current pet is the clicked on pet
      // then populate the pet's stats in the stat box below
      // debugger
      renderCurrentPetStatus(currentPet)
    }
  })

  incrementpet.addEventListener("click", (e) => {
    // console.log("incrementing stuff");
    if(e.target.id === "foodbtn"){
      // console.log("pushing food btn");

      // if hungry is TRUE
      // hungry boolean needs to change to false
      // increment the health
      // increment the happiness
      if(currentPet.hungry === true){
        // console.log("pet is hungry")
        currentPet.happiness += 1
        currentPet.health += 1
        currentPet.hungry = false
        // console.log(currentPet);
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerText = `health: ${currentPet.health}`
        // console.log('updated the DOM, sending a fetch');
        fetch(`${URL}/api/v1/pets/${currentPet.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "health": currentPet.health,
            "happiness": currentPet.happiness,
            "hungry": false
          })
        })
        // .then(res => res.json())
        // .then(updatedPet => console.log('fetch sent', updatedPet))


      }
      if(currentPet.hungry === false){
        console.log("not hungry");
        currentPet.happiness += 1
        currentPet.health -= 1
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerText = `health: ${currentPet.health}`
        fetch(`${URL}/api/v1/pets/${currentPet.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "health": currentPet.health,
            "happiness": currentPet.happiness
          })
        })
      }

      // if hungry is FALSE
      // decrement health
      // increment happiness
    }
    else if(e.target.id === "trainbtn"){
      console.log("trainbtn");
    }
    else if(e.target.id === "cleanbtn"){
      console.log("cleanbtn");
    }
    else if(e.target.id === "statsbtn"){
      console.log("statsbtn");
    }
    else if(e.target.id === "playbtn"){
      console.log("playbtn");
    }
    else if(e.target.id === "sleepbtn"){
      console.log("sleepbtn");
    }
  })


    // delete pet

}
