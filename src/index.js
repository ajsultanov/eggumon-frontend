window.addEventListener("DOMContentLoaded", init)

function init(){

  console.log("%c エッグモン", "font-size:24px; font-weight:bold; color:red; text-shadow:2px 2px 2px orange")

  const URL = "http://localhost:3000/api/v1/"
  const userLogin = document.getElementById("user")
  const myPetContainer = document.getElementById("my-pets")
  const myPetTitle = document.getElementById("my-pets-title")

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

  // get all users
  fetch(`${URL}users`).then(r => r.json()).then(userData => {
    userData.forEach(user => {
      allUsers.push(user)
    })
    console.log(allUsers)
  })

  // initialize page
  // get user
  userLogin.addEventListener("submit", event => {
    event.preventDefault()

    // user is NOT logged in -> log in
    if (logButton.dataset.action === "login") {
    const userInput = userLogin.elements.login.value

      // if user IS found in allUsers array -> sign in
      if (allUsers.some(user => user.name === userInput)) {
        currentUser = allUsers.find(user => user.name === userInput)
        console.log("current user:", currentUser)

        fetch(`${URL}users/${currentUser.id}`)
        .then(r => r.json())
        .then(userData => {

          logOutButton()

          console.log("current user pets:", currentUser.pets)
          renderPets(currentUser.pets)

          incrementpetContainer.style.display = "inline-grid"
          currentpetstatusContainer.style.display = "inline-flex"
        })
      }
      // if user is NOT found in allUsers array -> create
      else {
        fetch(`${URL}users`, {
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
    // if user is logged in -> log out
    if (logButton.dataset.action === "logout") {
      currentUser = ""
      myPetContainer.innerHTML = "<p>my pets container splash image</p>"
      logInButton()
    }
  })

  function logInButton() {
    userLogin.innerHTML = `
      <button type="submit" data-action="login">Sign Up / Sign In</button>
      <input type="text" name="login" id="login" value="" placeholder="Username">
    `
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
  }
  logInButton()

  function logOutButton() {
    userLogin.innerHTML =
      `<button type="submit" data-action="logout">Sign Out</button> ${currentUser.name}`
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
  }

  function renderPets(pets) {
    myPetContainer.innerHTML = ""
    myPetTitle.innerText = "My Pets"
    if (pets.length > 0) {
      pets.forEach(p => {
        let petHTML = petConverter(p)
        myPetContainer.innerHTML += petHTML

      })
    }
    else {
      noPets()
    }
  }

  // if no pets found -> create pet form
  function noPets() {
    myPetContainer.innerHTML = `
       <p>Couldn't find any pets, ${currentUser.name}!! Why not make one...</p>
       <form id="createPet">
         <input type="text" value="" placeholder="New Pet Name" id="pet-name">
         <select name="specialty" id="special-select">
          <option value="archery">archery</option>
          <option value="baseball">baseball</option>
          <option value="chiropractics">chiropractics</option>
          <option value="judo">judo</option>
        </select>
         <button type="submit" name="create">create!</button>
       </form>
       `
    const form = document.getElementById("createPet")
    const input = document.getElementById("pet-name")
    const select = document.getElementById("special-select")
    form.addEventListener("submit", event => {
      event.preventDefault()
      let name = input.value
      let specialty = select.value

      fetch(`${URL}pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          specialty: specialty
        })
      })
      .then(console.log)
    })
  }

  function petConverter(pet) {
    return `
    <span class="pet" id=${pet.id}>
      <img src="src/img/${pet.img}">

      <p>${pet.name}</p>
    </span>
    `
  }

  function renderCurrentPetStatus(pet){

    // console.log("pet status")
    currentPetName.innerText = `name: ${pet.name}`
    currentPetAge.innerText = `age: ${pet.age}`
    currentPetWeight.innerText = `weight: ${pet.weight}`
    currentPetSpecialty.innerText = `specialty: ${pet.specialty}`
    currentPetHealth.innerText = `health: ${pet.health}`
    currentPetHappiness.innerText = `happiness: ${pet.happiness}`
    currentPetSkills.innerText = `skill points: ${pet.skill_points}`
    currentUserName.innerText = `owner: ${currentUser.name}`

  }

  myPetContainer.addEventListener("click", (e) => {
    // this function just finds and sets the current pet when a user clicks on a pet in the all pets container
    let target = ""
    if (e.target.tagName === "SPAN") {
      target = e.target
    } else if (e.target.tagName === "IMG" || e.target.tagName === "P") {
      target = e.target.parentNode
    }
    if (target !== "") {
      currentPet = currentUser.pets.find(pet => {return pet.id === parseInt(target.id)})
      // current pet is the clicked on pet
      // then populate the pet's stats in the stat box below
      renderCurrentPetStatus(currentPet)
    }
  })

  incrementpet.addEventListener("click", (e) => {
    // console.log("incrementing stuff");

    let target = ""
    if (e.target.tagName === "BUTTON") {
      target = e.target
    } else if (e.target.tagName === "IMG") {
      target = e.target.parentNode
    }

    if(target.id === "foodbtn"){
      console.log("foodbtn");

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
        fetch(`${URL}pets/${currentPet.id}`, {
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
      } // end of hungry === true

      // if hungry is FALSE
      // decrement health
      // increment happiness
      if(currentPet.hungry === false){
        console.log("not hungry");
        currentPet.happiness += 1
        currentPet.health -= 1
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerText = `health: ${currentPet.health}`
        fetch(`${URL}pets/${currentPet.id}`, {
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
      } // end of hungry === false
    }

    if(target.id === "trainbtn"){
      console.log("trainbtn");
    }

    if(target.id === "cleanbtn"){
      console.log("cleanbtn");
      // if dirty is TRUE
      // increment health
      // increment happiness
      // change dirty boolean to false
      if(currentPet.dirty === true){
        // console.log("pet is dirty")
        currentPet.happiness += 1
        currentPet.health += 1
        currentPet.dirty = false
        // console.log(currentPet);
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerText = `health: ${currentPet.health}`
        // console.log('updated the DOM, sending a fetch');
        fetch(`${URL}pets/${currentPet.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "health": currentPet.health,
            "happiness": currentPet.happiness,
            "dirty": false
          })
        })
      } // end of dirty === true

      // if dirty is FALSE
      // increment health
      // decrement happiness
      if(currentPet.dirty === false){
        console.log("not dirty");
        currentPet.happiness -= 1
        currentPet.health += 1
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerText = `health: ${currentPet.health}`
        fetch(`${URL}pets/${currentPet.id}`, {
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
      } // end of hungry === false
    }

    if(target.id === "statsbtn"){
      console.log("statsbtn");
    }

    if(target.id === "playbtn"){
      console.log("playbtn");
    }

    if(target.id === "sleepbtn"){
      console.log("sleepbtn");
    }

  })


    // delete pet

}
