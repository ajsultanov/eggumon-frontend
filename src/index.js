window.addEventListener("DOMContentLoaded", init)

function init(){

  console.log("%c エッグモン", "font-size:24px; font-weight:bold; color:red; text-shadow:2px 2px 2px orange")

  const URL = "http://localhost:3000/api/v1/"
  const userLogin = document.getElementById("user")
  const myPetTitle = document.getElementById("my-pets-title")
  const myFormContainer = document.getElementById("my-pets-form")
  const myPetContainer = document.getElementById("my-pets")
  const formBtn = document.getElementById("new")
  const sprite = document.getElementById("sprite")
  const status = document.getElementById("status")

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
    console.log(allUsers.map(user => user.name))
  })

  // initialize page
  // get user
  userLogin.addEventListener("submit", event => {
    event.preventDefault()

    // user is NOT logged in -> log in
    if (logButton.dataset.action === "login" && userLogin.elements.login.value !== "") {
    const userInput = userLogin.elements.login.value

      // if user IS found in allUsers array -> sign in
      if (allUsers.some(user => user.name === userInput)) {
        currentUser = allUsers.find(user => user.name === userInput)
        //console.log("current user:", currentUser)

        fetch(`${URL}users/${currentUser.id}`)
        .then(r => r.json())
        .then(userData => {

          logOutButton()

          //console.log("current user pets:", currentUser.pets)
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
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: userInput
          })
        })
        .then(r => r.json())
        .then(userData => {
          //console.log("current user:", userData)
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
      myPetTitle.innerText = ""
      myPetContainer.innerHTML = `
      <img src="./src/img/good.png" alt="">
      <img src="./src/img/splash.png" alt="">
      <img src="./src/img/bye.png" alt="">
      `
      incrementpetContainer.style.display = "none"
      currentpetstatusContainer.style.display = "none"
      logInButton()
    }
  })

  function logInButton() {
    userLogin.innerHTML = `
      <button type="submit" data-action="login">Sign Up / Sign In</button>
      <input type="text" name="login" id="login" value="" placeholder="Username">
    `
    logButton = userLogin.getElementsByTagName('BUTTON')[0]
    myFormContainer.style.display = "none"
    sprite.innerHTML = `<img src="" alt="">`
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
      if (pets.length < 3){
        myPetContainer.innerHTML += `<span class="pet" id="new">new pet</span>`
      }
    }
    else {
      noPets()
    }
  }

  // if no pets found -> create pet form
  function noPets() {
    myPetContainer.innerHTML = `
       <p class="no-pets">Couldn't find any pets, ${currentUser.name}!! Why not make one... &#x2191;&#x2191;&#x2191;</p>
       `
    newForm()
  }

  function newForm() {
    myFormContainer.style.display = "flex"
    const form = document.getElementById("createPet")
    const input = document.getElementById("pet-name")
    const select = document.getElementById("special-select")
    const p = myFormContainer.getElementsByTagName("P")[0]

    form.addEventListener("submit", event => {
      event.preventDefault()

      let name = input.value
      let specialty = select.value

      if (name !== "" && specialty !== "") {
        myFormContainer.style.display = "none"

        incrementpetContainer.style.display = "inline-grid"
        currentpetstatusContainer.style.display = "inline-flex"

        form.reset()

        fetch(`${URL}pets`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name,
            specialty: specialty,
            user: currentUser.id
          })
        })
        .then(r => r.json())
        .then(petData => {
          currentPet = petData
          renderIncrementPet()
          renderCurrentPetStatus(currentPet)
          // couldnt get the user model to reload otherwise
          fetch(`${URL}users/${currentUser.id}`)
          .then(r => r.json()).then(r => {
            currentUser = r
            renderPets(currentUser.pets)
          })
        })
      }
      else if (!myFormContainer.contains(p)) {
        myFormContainer.innerHTML += "<p>Please complete the above form</p>"
        form.reset()
      }
    })
  }

  function petConverter(pet) {
    if (pet.health > 0 && pet.happiness > 0) {
      return `
      <span class="pet" id=${pet.id}>
        <img src="./src/img/${pet.img}">
        <p>${pet.name}</p>
      </span>
      `
    } else {
      return `
      <span class="kaput">
        <img src="./src/img/grave.png">
        <p>&#10013; ${pet.name}</p>
      </span>
      `
    }
  }

  function renderCurrentPetStatus(pet){

    // console.log("pet status")
    currentPetName.innerText = `name: ${pet.name}`
    currentPetAge.innerText = `age: ${pet.age}`
    currentPetWeight.innerText = `weight: ${pet.weight}`
    currentPetSpecialty.innerText = `specialty: ${pet.specialty}`
    currentPetHealth.innerHTML = "health: "
    for (let i = 0; i < currentPet.health; i++) {
      currentPetHealth.innerHTML += `<img src="./src/img/heart16_full.png">`
    }
    currentPetHappiness.innerText = "happiness: "
    for (let i = 0; i < currentPet.happiness; i++) {
      currentPetHappiness.innerHTML += `<img src="./src/img/happyface.png">`
    }
    currentPetSkills.innerText = `skill points: ${pet.skill_points}`
    currentUserName.innerText = `owner: ${currentUser.name}`
  }

  myPetContainer.addEventListener("click", (e) => {
    // this function just finds and sets the current pet when a user clicks on a pet in the all pets container

    if (currentPet.age === "egg") {
      //console.log("EGGGGG!")
      currentPet.img = "egg_open.png"
      mutate(currentPet)
      renderIncrementPet()
    }

    let target = ""
    if (e.target.tagName === "SPAN") {
      target = e.target
    } else if (e.target.tagName === "IMG" || e.target.tagName === "P") {
      target = e.target.parentNode
    }

      if (target.className === "kaput") {
        console.log("%c☹", "font-size:72pt;")
        return ""
      }

      if (target.id === "new") {
        newForm()
      }
      else if (target !== "" && target.className !== "pet-container") {
      currentPet = currentUser.pets.find(pet => {return pet.id === parseInt(target.id)})
      // current pet is the clicked on pet
      // then populate the pet's stats in the stat box below
      renderCurrentPetStatus(currentPet)
      renderIncrementPet()
    }
  })

  function renderIncrementPet() {
    sprite.innerHTML = `<img src="./src/img/${currentPet.img}" alt="">`
    if (currentPet.dirty === true) {
      status.innerHTML = `<img src="./src/img/make.png" alt="">`
    }
    else if (currentPet.hungry === true) {
      status.innerHTML = `<img src="./src/img/hungry.png" alt="">`
      //console.log("in hungry statement")
      //window.setTimeout(() => {
        //console.log(currentPet.health)
      //}, 2000)
    } else {
      status.innerHTML = `<img src="" alt="">`
    }

    if (currentPet.dirty === false) {
        //window.setTimeout(() => {
        //console.log("clean him up")
      //}, 2000)
    }
  }

  function mutate(pet) {
    currentPet.skill_points = 0

    const babies = ["1a.gif", "1b.gif", "1c.gif"]
    const teens = ["2a.gif", "2b.gif", "2c.gif", "2d.gif", "2e.gif", "2f.gif"]
    const adults = ["3a.gif", "3b.gif", "3c.gif", "3d.gif", "3e.gif", "3f.gif", "3g.gif", "3h.gif", "3i.gif",]
    let i = 0

    switch (pet.age) {
      case "egg":
        pet.age = "baby"
        pet.weight++
        i = Math.floor(Math.random() * Math.floor(3))
        pet.img = babies[i]
        break
      case "baby":
        pet.age = "teen"
        pet.weight++
        i = Math.floor(Math.random() * Math.floor(6))
        pet.img = teens[i]
        break
      case "teen":
        pet.age = "adult"
        pet.weight++
        i = Math.floor(Math.random() * Math.floor(9))
        pet.img = adults[i]
        break
    }

    fetch(`${URL}pets/${currentPet.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "age": pet.age,
        "weight": pet.weight,
        "img": pet.img,
        "skill_points": pet.skill_points,
        "happiness": 3,
        "health": 3
      })
    }).then(() => {
      renderIncrementPet()
      renderCurrentPetStatus(pet)
      renderPets(currentUser.pets)
    })
  }

  incrementpetContainer.addEventListener("click", (e) => {
    // console.log("incrementing stuff");

    let target = ""
    if (e.target.tagName === "BUTTON") {
      target = e.target
    } else if (e.target.tagName === "IMG") {
      target = e.target.parentNode
    }

    if(target.id === "foodbtn"){
      //console.log("foodbtn");

      // if hungry is TRUE
      // hungry boolean needs to change to false
      // increment the health
      // increment the happiness
      if(currentPet.hungry === true) {
        status.innerHTML = ""

        // console.log("pet is hungry")
        if (currentPet.happiness < 5) {
          currentPet.happiness += 1
        }
        if (currentPet.health < 5) {
          currentPet.health += 1
        }
        currentPet.hungry = false
        console.log("yum yum")
        // console.log(currentPet);
        currentPetHappiness.innerText = "happiness: "
        for (let i = 0; i < currentPet.happiness; i++) {
          currentPetHappiness.innerHTML += `<img src="./src/img/happyface.png">`
        }
        currentPetHealth.innerHTML = "health: "
        for (let i = 0; i < currentPet.health; i++) {
          currentPetHealth.innerHTML += `<img src="./src/img/heart16_full.png">`
        }
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
        .then(r => r.json())
        .then(r => {
          //console.log(r)
          currentPet.dirty = true
          renderIncrementPet()
          renderCurrentPetStatus(currentPet)
        })
      } // end of hungry === true

      // if hungry is FALSE
      // decrement health
      // increment happiness
      else if(currentPet.hungry === false) {
        console.log("not hungry");
        if (currentPet.happiness < 5) {
          currentPet.happiness += 1
        }
        if (currentPet.health > 0) {
          currentPet.health -= 1
        }
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerHTML = "health: "
        for (let i = 0; i < currentPet.health; i++) {
          currentPetHealth.innerHTML += `<img src="./src/img/heart16_full.png">`
        }
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
        }).then(() => {
          renderIncrementPet()
          renderCurrentPetStatus(currentPet)
        })
      } // end of hungry === false
    }

    if(target.id === "trainbtn"){
      //console.log("trainbtn");
      currentPet.hungry = true
      if (currentPet.skill_points < 5) {
        currentPet.skill_points += 1
      }
      if (currentPet.happiness > 0) {
        currentPet.happiness -= 1
      }
      if (currentPet.health > 0) {
        currentPet.health -= 1
      }
      renderIncrementPet()
      renderCurrentPetStatus(currentPet)

      fetch(`${URL}pets/${currentPet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "skill_points": currentPet.skill_points
        })
      })
    }

    if(target.id === "cleanbtn"){
      //console.log("cleanbtn");
      // if dirty is TRUE
      // increment health
      // increment happiness
      // change dirty boolean to false
      if(currentPet.dirty === true){
        // console.log("pet is dirty")
        if (currentPet.happiness < 5) {
          currentPet.happiness += 1
        }
        if (currentPet.health < 5) {
          currentPet.health += 1
        }
        currentPet.dirty = false
        // console.log(currentPet);
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerHTML = "health: "
        for (let i = 0; i < currentPet.health; i++) {
          currentPetHealth.innerHTML += `<img src="./src/img/heart16_full.png">`
        }
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
        }).then(() => {
          renderIncrementPet()
          renderCurrentPetStatus(currentPet)
        })
      } // end of dirty === true

      // if dirty is FALSE
      // increment health
      // decrement happiness
      else if(currentPet.dirty === false){
        console.log("not dirty");
        if (currentPet.happiness > 0) {
          currentPet.happiness -= 1
        }
        if (currentPet.health < 5) {
          currentPet.health += 1
        }
        currentPetHappiness.innerText = `happiness: ${currentPet.happiness}`
        currentPetHealth.innerHTML = "health: "
        for (let i = 0; i < currentPet.health; i++) {
          currentPetHealth.innerHTML += `<img src="./src/img/heart16_full.png">`
        }
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
        }).then(() => {
          renderIncrementPet()
          renderCurrentPetStatus(currentPet)
        })
      } // end of hungry === false
    }

    if(target.id === "statsbtn"){
      //console.log("statsbtn");
      if (currentPet.skill_points >= 5) {
        mutate(currentPet)
      }
    }

    if(target.id === "playbtn"){
      //console.log("playbtn");
      if (currentPet.happiness < 5) {
        currentPet.happiness += 1
      }
      currentPet.hungry = true
      renderIncrementPet()
      renderCurrentPetStatus(currentPet)
    }

    if(target.id === "sleepbtn"){
      //console.log("sleepbtn");
      if (currentPet.happiness > 0) {
        currentPet.happiness -= 1
      }
      if (currentPet.health < 5) {
        currentPet.health += 1
      }
      renderIncrementPet()
      renderCurrentPetStatus(currentPet)

      fetch(`${URL}pets/${currentPet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "happiness": currentPet.happiness
        })
      })
    }

    if (currentPet.health <= 0 || currentPet.happiness <= 0) {
      currentPet.img = "grave.png"
      renderPets(currentUser.pets)
      incrementpet.style.display = "none"
      currentpetstatus.style.display = "none"
      console.log()
    }

  })
    // delete pet
}
