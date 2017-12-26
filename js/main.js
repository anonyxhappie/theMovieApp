$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        sessionStorage.setItem('searchText', searchText);
        getMovies(searchText);
        e.preventDefault();
    });
});

function getMovies(searchText){
    $('#latestText').css('display', 'none');
    axios.get('http://www.omdbapi.com?s='+searchText+'&apikey=b3d8145e')
    .then((response) => {
        console.log(response);
        let movies = response.data.Search;
        let output = '';
        $.each( movies, (index, movie) => {
            //console.log(movie.Poster);
            if(movie.Poster == "N/A") 
                movie.Poster = "img/image-error.png";
            output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${movie.Poster}" />
                        <h5>${movie.Title}</h5>
                        <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                </div>
            `;
        });
        $('#movies').html(output);
    })
    .catch((err) => {
        console.log(err);
    });
}

function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

function getMovie(){
    let movieId = sessionStorage.getItem('movieId');
    axios.get('http://www.omdbapi.com?i='+movieId+'&apikey=b3d8145e')
    .then((response) => {
        console.log(response);
        let movie = response.data;
        if(movie.Poster == "N/A") 
            movie.Poster = "img/image-error.png";
        let output = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${movie.Poster}" class="thumbnail">
                </div>
                <div class="col-md-8">
                    <h2>${movie.Title}</h2>
                    <ul class="list-group">
                    <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                    <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                    <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                    <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                    <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <hr />
                    <h3>Overview</h3>
                    ${movie.Plot}
                    <hr />
                    <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
                    <a href="index.html" class="btn btn-default">Go Back To Search</a>
                    <hr />
                </div>
            </div>
        `;
        $('#movie').html(output);
    })
    .catch((err) => {
        console.log(err);
    });
}

function getNowPlaying(){
    axios.get('https://api.themoviedb.org/3/movie/now_playing?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1')
    .then((response) => {
        console.log(response);
        let movies = response.data.results;
        let output = '';
        $.each( movies, (index, movie) => {    
            output += `
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="${'http://image.tmdb.org/t/p/w185' + movie.poster_path}" />
                        <h5>${movie.original_title}</h5>
                        <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                </div>
            `;
        });
        $('#movies').html(output);
    })
    .catch((err) => {
        console.log(err);
    });
}

function getMovieSelected(){
    let movieId = sessionStorage.getItem('movieId');
    axios.get('https://api.themoviedb.org/3/movie/'+ movieId +'?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1')
    .then((response) => {
        console.log(response);
        let movie = response.data;
        if(movie.homepage == "") 
        movie.homepage = "N/A";
        let output = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${'http://image.tmdb.org/t/p/w185' + movie.poster_path}" class="thumbnail">
                </div>
                <div class="col-md-8">
                    <h2>${movie.original_title}</h2>
                    <ul class="list-group">
                    <li class="list-group-item"><strong>Genre:</strong> ${movie.genres[0].name}</li>
                    <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
                    <li class="list-group-item"><strong>Runtime:</strong> ${movie.runtime}mins</li>
                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.vote_average}/10</li>
                    <li class="list-group-item"><strong>Production:</strong> ${movie.production_companies[0].name}</li>
                    <li class="list-group-item"><strong>Revenue:</strong> ${movie.revenue/1000000}M</li>
                    <li class="list-group-item"><strong>Homepage:</strong> ${movie.homepage}</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <hr />
                    <h3>Overview</h3>
                    ${movie.overview}
                    <hr />
                    <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View IMDB</a>
                    <a href="index.html" class="btn btn-default">Go Back To Search</a>
                    <hr />
                </div>
            </div>
        `;
        $('#movie').html(output);
    })
    .catch((err) => {
        console.log(err);
    });
}

function clearSession(){
    sessionStorage.clear();
}