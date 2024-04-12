// write your code here
const film_info =document.getElementById('film-info')
const filmList = document.getElementById('films');
const movieTitle = document.getElementById('title');
const runtimeMinutes = document.getElementById('runtime');
const showTime = document.getElementById('showtime');
const availableTickets = document.getElementById('ticket-num');

const url = "http://localhost:3000/films";

// fetch movie details and renders them in HTML
function movieDetails(movie) {
    fetch(url)
        .then(response => response.json())
        .then(movieDetails => {
            console.log("Fetched movie details:", movieDetails);
            const detailsContainer = document.getElementById('film-info');
            detailsContainer.innerHTML = movieDetails.movieDescription;
            // You can also update other movie details here if needed
        })
        .catch(error => {
            console.error('Error in movie details:', error);
        });

    }
// lists the movies depending on the titles
function getMovieLists(movie) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log("Fetched movie list)
            // const films = data.films; // Updated to data.films
            const movieList = document.createElement("ul");

            for (let movie of data) {
                // console.log(movie.title);
                const title = movie.title
                const listItem = document.createElement("li");
                listItem.textContent = title;

                listItem.addEventListener('click', function() {
                    displayMovieDetails(movie);
                })   
                movieList.appendChild(listItem)
            }


            document.body.appendChild(movieList);
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}

// display movie details
function displayMovieDetails(movie) {
    movieTitle.textContent = movie.title;
    runtimeMinutes.textContent = movie.runtime + " minutes";
    showTime.textContent = movie.showtime;

    poster.src = movie.poster;
    availableTickets.textContent = movie.capacity - movie.tickets_sold + " remaining tickets";


    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteMovie(movie.title);
  
        film_info.innerHTML = "";
    });
    film_info.appendChild(deleteButton);
}

const movie = true;
    // delete button
  const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteMovie(movie.title);
    });
    document.body.appendChild(deleteButton);




//  update available movie tickets 
function newAvailableTickets(updatedCapacity, availableTickets) {
    fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "capacity": updatedCapacity,
            "availableTickets": availableTickets
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Updated movie details:', data);
    })
    .catch(error => {
        console.error('Error updating movie details:', error);
    });
}

//delete a movie
function deleteMovie(movieId) {
    const deleteUrl = ${url}/${movieId};
    fetch(deleteUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": movieTitle
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Movie deleted successfully');
        } else {
            console.error('Failed to delete movie:', response.status);
        }
    })
    .catch(error => {
        console.error('Error deleting movie:', error);
    });
}


const buyTicketButton = document.getElementById('buy-ticket');
buyTicketButton.addEventListener('click', function() {
    if (availableTickets.textContent === "0 remaining tickets") {
        buyTicketButton.textContent = "Sold Out";
    } else {
        const remainingTickets = parseInt(availableTickets.textContent.split(" ")[0]) - 1;
        availableTickets.textContent = remainingTickets + " remaining tickets";

        // Update available tickets 
        newAvailableTickets(movie.capacity, remainingTickets);
    }
});



movieDetails();
getMovieLists();
