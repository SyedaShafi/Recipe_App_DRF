document.addEventListener('DOMContentLoaded', () => {
  fetchAllRecipes();
});

document.addEventListener('DOMContentLoaded', function () {
  swiffyslider.init();
});

document.addEventListener('DOMContentLoaded', () => {
  allComments();
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/profile/') {
    fetchProfileData();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const recipeId = new URLSearchParams(window.location.search).get('id');
  if (recipeId) {
    fetchRecipeDetails(recipeId);
  } else {
    console.error('Recipe ID not found in URL');
  }
});

const getValue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const displayErrors = (errors) => {
  for (const key in errors) {
    const errorField = document.getElementById(`${key}-error`);
    if (errorField) {
      errorField.textContent = errors[key][0];
    }
  }
};

const handleRegistration = (event) => {
  event.preventDefault();
  const username = getValue('username');
  const first_name = getValue('firstname');
  const last_name = getValue('lastname');
  const bio = getValue('bio');
  const email = getValue('email');
  const password = getValue('password');
  const confirm_password = getValue('confirm_password');

  const info = {
    username: username,
    first_name: first_name,
    last_name: last_name,
    bio: bio,
    password: password,
    confirm_password: confirm_password,
    email: email,
  };

  fetch('https://recipe-app-drf.onrender.com/user/signup/', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    'X-CSRFToken': getCookie('csrftoken'),
    body: JSON.stringify(info),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (
        data.username ||
        data.first_name ||
        data.last_name ||
        data.bio ||
        data.email ||
        data.password ||
        data.confirm_password
      ) {
        displayErrors(data);
      } else {
        var element = document.getElementById('registrationForm');
        element.reset();

        const msgField = document.getElementById(`registration_msg`);
        if (msgField) {
          msgField.textContent = data;
        }
      }
    })
    .catch((err) => console.log(err));
};

const handleLogin = (event) => {
  event.preventDefault();
  const username = getValue('login-username');
  const password = getValue('login-password');
  const info = {
    username: username,
    password: password,
  };

  if ((username, password)) {
    fetch('https://recipe-app-drf.onrender.com/user/login/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(info),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data.token && data.user_id) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', data.user_id);
          alert('User Logged In');
          var element = document.getElementById('loginForm');
          element.reset();
          window.location.href = '/profile';
        }

        if (data.error) {
          const msgField = document.getElementById(`login-error`);
          if (msgField) {
            msgField.textContent = data.error;
          }
        } else {
          displayErrors(data);
        }
      });
  } else {
    alert('You must provide username and password fields.');
  }
};

const handlelogOut = () => {
  if (!confirm('Are you sure you want to logout?')) {
    return;
  }
  var token = localStorage.getItem('token');

  fetch('https://recipe-app-drf.onrender.com/user/logout/', {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (response.ok) {
        alert('User Logged Out');
        localStorage.clear();
        window.location.href = '/login/';
      } else {
        console.error('Logout failed');
      }
    })
    .catch((error) => console.error('Error:', error));
};

function fetchProfileData() {
  event.preventDefault();
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    window.location.href = '/login';
    return;
  }
  fetch(`https://recipe-app-drf.onrender.com/user/list/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      document.getElementById('username').innerText = `${data.username}`;
      document.getElementById('user-bio').innerText = `${data.bio}`;
    })
    .catch((error) => {
      console.error('Error fetching profile:', error);
    });

  fetch(`https://recipe-app-drf.onrender.com/recipe/list?user_id= ${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      const parent = document.getElementById('user-recipe-cards');
      parent.innerHTML = '';
      data.forEach((d) => {
        const child = `
        <div class="col-md-6">
         <div class="card mx-2 h-100"    data-recipe-id="${d.id}">
              <img src="${d.image}" class="w-100 card-img-top" alt="..." style="height:400px;" />

              <div class="card-body">
                <h5 class="card-title">${d.title}</h5>
                <p class="card-text">
                  <strong>Instructions: </strong> ${d.instructions}
                </p>
                <p class="card-text">
                  <strong>Ingredients: </strong> ${d.ingredients}
                </p>
              </div>

              <div class="flex align-items-end pb-3 ps-4">
                <a href="#" class="btn btn-primary" onclick="editRecipe(${d.id})">Edit</a>
                <a href="#" class="btn btn-danger" onclick="deleteRecipe(${d.id})">Delete</a>
              
              </div>

          </div>
        </div>
         
        `;
        parent.innerHTML += child;
      });
    })
    .catch((error) => {
      console.error('Error fetching recipes:', error);
    });
}

const addRecipe = (event) => {
  const userId = localStorage.getItem('user_id');
  event.preventDefault();

  const title = getValue('recipe-title');
  const ingredients = getValue('recipe-ingredients');
  const instructions = getValue('recipe-instructions');
  const imageInput = document.getElementById('recipe-image');

  if (imageInput.files.length === 0) {
    alert('Please select an image file.');
    return;
  }

  const image = imageInput.files[0];
  const formData = new FormData();
  formData.append('title', title);
  formData.append('ingredients', ingredients);
  formData.append('instructions', instructions);
  formData.append('image', image);
  formData.append('user', userId);

  fetch('https://recipe-app-drf.onrender.com/recipe/create/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: formData,
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json();
      }
    })
    .then((data) => {
      // console.log(data);
      var element = document.getElementById('recipeForm');
      element.reset();
      window.location.href = '/profile';
      displayErrors(data);
    });
};

// for editing and deleting recipe

const openModal = () => {
  document.getElementById('editRecipeModal').style.display = 'block';
};

const closeModal = () => {
  document.getElementById('editRecipeModal').style.display = 'none';
};

const editRecipe = (id) => {
  fetch(`https://recipe-app-drf.onrender.com/recipe/list/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById('edit-recipe-id').value = id;
      document.getElementById('edit-recipe-title').value = data.title;
      document.getElementById('edit-recipe-ingredients').value =
        data.ingredients;
      document.getElementById('edit-recipe-instructions').value =
        data.instructions;
      openModal();
    })
    .catch((error) => console.error('Error fetching recipe:', error));
};

const submitEdit = (event) => {
  event.preventDefault();
  const id = document.getElementById('edit-recipe-id').value;
  const title = document.getElementById('edit-recipe-title').value;
  const ingredients = document.getElementById('edit-recipe-ingredients').value;
  const instructions = document.getElementById(
    'edit-recipe-instructions'
  ).value;
  const imageInput = document.getElementById('edit-recipe-image');
  const user = localStorage.getItem('user_id');
  const formData = new FormData();
  formData.append('title', title);
  formData.append('ingredients', ingredients);
  formData.append('instructions', instructions);
  formData.append('user', user);

  if (imageInput.files.length > 0) {
    formData.append('image', imageInput.files[0]);
  }

  fetch(`https://recipe-app-drf.onrender.com/recipe/update/${id}/`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw data;
        });
      }
      location.reload();
      return response.json();
    })
    .then((data) => {
      closeModal();
    })
    .catch((error) => console.error('Error updating recipe:', error));
};

const deleteRecipe = (id) => {
  if (!confirm('Are you sure you want to delete this recipe?')) {
    return;
  }

  fetch(`https://recipe-app-drf.onrender.com/recipe/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw data;
        });
      }
      alert('Recipe deleted');
      location.reload();
    })
    .catch((error) => console.error('Error deleting recipe:', error));
};

function fetchAllRecipes() {
  fetch('https://recipe-app-drf.onrender.com/recipe/list/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      displayRecipes(data);
    })
    .catch((error) => {
      console.error('Error fetching recipes:', error);
    });
}

function truncateText(text, wordLimit) {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
}

function displayRecipes(recipes) {
  const container = document.getElementById('all-recipe-cards-container');
  container.innerHTML = '';
  recipes.forEach((recipe) => {
    const truncatedInstructions = truncateText(recipe.instructions, 10);
    const truncatedIngredients = truncateText(recipe.ingredients, 10);
    const card = `
    <div class="col-md-6 " >
       <div class="card m-2 border border-black h-100">
        <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" style="object-fit: cover; height: 300px; width:100%;">

        <div class="card-body" >
      
            <h5 class="card-title">${recipe.title}</h5>
            <p class="card-text"> <strong> Ingredients:</strong>  ${truncatedIngredients}</p>
            <p class="card-text"><strong> Instructions: </strong>  ${truncatedInstructions}</p>
  
         
            <a href="/recipe_details?id=${recipe.id}" class="btn btn-primary">Details</a>
        

        </div>
      </div>
    </div>
     
    `;
    container.innerHTML += card;
  });
}

function fetchRecipeDetails(id) {
  fetch(`https://recipe-app-drf.onrender.com/recipe/list/${id}`)
    .then((response) => response.json())
    .then((data) => {
      displayRecipeDetails(data);
    })
    .catch((error) => {
      console.error('Error fetching recipe details:', error);
    });
}

function displayRecipeDetails(recipe) {
  const container = document.getElementById('recipe-detail-container');
  container.innerHTML = `

  <div class="col-md-6 mt-5">
    <h1>${recipe.title}</h1>
    <h3>Ingredients</h3>
    <p>${recipe.ingredients}</p>
    <h3>Instructions</h3>
    <p>${recipe.instructions}</p>
  </div>

  <div class="w-100 col-md-6">
    <img src="${recipe.image}" class="image-resize mx-auto mt-5" alt="${recipe.title}">
  </div>
  
  `;

  fetch(
    `https://recipe-app-drf.onrender.com/comment/list/?recipe_id=${recipe.id}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayComments(data);
    })
    .catch((error) => {
      console.error('Error fetching comments:', error);
    });
}

async function fetchUserDetails(user_id) {
  const response = await fetch(
    `https://recipe-app-drf.onrender.com/user/list/${user_id}/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

async function recipeDetails(recipe_id) {
  const response = await fetch(
    `https://recipe-app-drf.onrender.com/recipe/list/${recipe_id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

async function allComments() {
  try {
    const res = await fetch(
      'https://recipe-app-drf.onrender.com/comment/list/',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      }
    );

    if (!res.ok) {
      throw new Error('Network response was not okay!');
    }

    const data = await res.json();
    const parent = document.getElementById('all-comment-container');

    for (const comment of data) {
      try {
        const userDetails = await fetchUserDetails(comment.user);
        const recipeDetail = await recipeDetails(comment.recipe);
        const commentHTML = `
          <div class="slide-visible mx-2">
            <div>
              <h6> Recipe Title : ${recipeDetail.title}</h6>
              <h3 class="mb-0 h6" style="color:#DF1E1E;">${
                userDetails.username
              } <small class="text-muted text-uppercase inline ps-2">${new Date(
          comment.creation_date
        ).toLocaleDateString()}</small></h3> 
              <div class="pt-3">
                <p class="p-0 m-0">${comment.body}</p>
                <small class="p-0 m-0">${comment.rating}</small>
              </div>
              
            </div>
          </div>
        `;
        parent.innerHTML += commentHTML;
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
    // console.log(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

async function displayComments(comments) {
  if (comments.length == 0) {
    const parent = document.getElementById('no-comment');
    parent.innerHTML += `
      <div class="text-center py-4">
        <img src="/static/images/no-comment.png" alt="" style="width:100px; height:100px; ">
      </div>
      <div class="text-center mb-5">
        <strong>No comments available. Be the first to comment.</strong>
      </div>
    `;
    return;
  }

  const container = document.getElementById('comments-container');
  container.innerHTML = '';

  const userId = localStorage.getItem('user_id');

  // Iterate over each comment to fetch and display user details
  for (const comment of comments) {
    try {
      const userDetails = await fetchUserDetails(comment.user);
      const isCurrentUser = comment.user == userId;

      // console.log(userDetails.username);

      const commentElement = document.createElement('div');
      commentElement.className = 'card m-3 border-dark';
      commentElement.innerHTML = `
        <div class="card-body m-2">
          <h5 class="card-title">${userDetails.username}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${comment.rating}</h6>
          <p class="card-text">${comment.body}</p>
          <small class="text-muted">Posted on ${new Date(
            comment.creation_date
          ).toLocaleDateString()}</small>

          <div class="mt-3">
            ${
              isCurrentUser
                ? `
                  <a href="#" class="btn btn-primary" onclick="editComment(${comment.id})">Edit</a>
                  <a href="#" class="btn btn-danger" onclick="deleteComment(${comment.id})">Delete</a>
                `
                : ''
            }
          </div>
        </div>
      `;
      container.appendChild(commentElement);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }
}

function addComment(event) {
  event.preventDefault();
  const recipeId = new URLSearchParams(window.location.search).get('id');
  const body = document.getElementById('comment-content').value;
  const rating = document.getElementById('comment-rating').value;
  const user = localStorage.getItem('user_id');

  if (user) {
    fetch('https://recipe-app-drf.onrender.com/comment/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({
        body: body,
        rating: rating,
        user: user,
        recipe: recipeId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Comment Added');
        fetchRecipeDetails(recipeId); // Refresh comments
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  } else {
    alert('Please Login to add a comment!');
    window.location.href = '/login';
  }
}

const openCommentModal = () => {
  document.getElementById('editCommentModal').style.display = 'block';
};

const closeCommentModal = () => {
  document.getElementById('editCommentModal').style.display = 'none';
};

const editComment = (id) => {
  fetch(`https://recipe-app-drf.onrender.com/comment/list/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('edit-comment-id').value = data.id;
      document.getElementById('edit-recipe-id').value = data.recipe;
      document.getElementById('edit-comment-title').value = data.body;
      document.getElementById('edit-comment-rating').value = data.rating;
      openCommentModal();
    })
    .catch((error) => console.error('Error fetching recipe:', error));
};

const submitCommentEdit = (event) => {
  event.preventDefault();
  const id = document.getElementById('edit-comment-id').value;
  const recipe_id = document.getElementById('edit-recipe-id').value;
  const title = document.getElementById('edit-comment-title').value;
  const rating = document.getElementById('edit-comment-rating').value;
  const user = localStorage.getItem('user_id');
  console.log(recipe_id);
  fetch(`https://recipe-app-drf.onrender.com/comment/update/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({
      body: title,
      rating: rating,
      user: user,
      recipe: parseInt(recipe_id),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw data;
        });
      }
      location.reload();
      return response.json();
    })
    .then((data) => {
      closeCommentModal();
    })
    .catch((error) => console.error('Error updating comment:', error));
};

const deleteComment = (id) => {
  if (!confirm('Are you sure you want to delete this comment?')) {
    return;
  }

  fetch(`https://recipe-app-drf.onrender.com/comment/delete/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw data;
        });
      }
      alert('Comment deleted');
      location.reload();
    })
    .catch((error) => console.error('Error deleting comment:', error));
};

const handleContactInfo = (event) => {
  event.preventDefault();
  user_email = document.getElementById('contact-user-email').value;
  user_msg = document.getElementById('contact-concern').value;
  const info = {
    email: user_email,
    message: user_msg,
  };
  console.log(info);
  fetch('https://recipe-app-drf.onrender.com/contact/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify(info),
  })
    .then((res) => {
      if (!res.ok) {
        alert('Something Went Wrong!');
      } else {
        return res.json();
      }
    })
    .then((data) => {
      const form = document.getElementById('contactForm');
      form.reset();
      const success_msg = document.getElementById('contact-form-success');
      success_msg.textContent =
        "Thanks for your concern. We'll email you soon!";
      console.log(data);
    });
};
