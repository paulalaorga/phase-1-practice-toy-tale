let addToy = false;
const toyList = document.getElementById("toy-collection");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyList = document.getElementById("toy-collection");
  const toyForm = document.getElementById("toy-form");
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

toyForm.addEventListener("submit", async (event)=>{
  event.preventDefault();

  const name = toyForm.querySelector("input[name='name']").value;
  const image = toyForm.querySelector("input[name='image']").value;

  const newToy = {
    name,
    image,
    likes: 0,
  };
  try {
    const response = await fetch("http://localhost:3000/toys", {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newToy),
    });
    if (response.ok) {
      const createdToy = await response.json();
      renderToyCard(createdToy, toyList);
    } else {
      console.error("Failed to add the toy.")
    }
  } catch (error) {
    console.error("Error while sending POST request:", error);
  }
  });
});

fetchToys();

async function fetchToys() {
  const res = await fetch("http://localhost:3000/toys");
  const toys = await res.json();
  renderToyList(toys);
}

function renderToyList(toys) {

  toys.forEach(({ id }) => {
    const url = `http://localhost:3000/toys/${id}`; 
    fetchSingleToy(url, toyList);
  });
}

async function fetchSingleToy(url, toyList) {
  const res = await fetch(url);
  const toy = await res.json();
  renderToyCard(toy, toyList);
}

function renderToyCard(toy, toyList) {
  const toyCard = document.createElement('div');
  toyCard.className = 'card';
  const img = document.createElement('img');
  img.className = 'toy-avatar'
  img.src = toy.image;

  const title = document.createElement('h2');
  title.innerText = toy.name;

  const likes = document.createElement('p');
  likes.innerText = `${toy.likes} Likes`;

  const likeButton = document.createElement('button');
  likeButton.className = 'like-btn';
  likeButton.id = toy.id;
  likeButton.innerText = 'Like ❤️';
  likeButton.addEventListener('click', () => {
    toy.likes = toy.likes + 1;
    likes.innerText = `${toy.likes} Likes`;

  });

  toyCard.append(img, title, likes, likeButton);
  toyList.append(toyCard);
}




