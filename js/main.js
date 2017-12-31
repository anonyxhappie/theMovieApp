$('.container').toggleClass("animated pulse"); 
$('img').hover(
    function(){$(this).addClass("animated pulse")},
    function(){$(this).removeClass("animated pulse")}
);     

/**
 * For index.html
 */
$(document).ready(() => {
    getMovies('now_playing', 'default');
    getMovies('top_rated', 'default');
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val();
        sessionStorage.setItem('searchText', searchText);
        getMovies('search', searchText);
        e.preventDefault();
    });
});

function getMovies(keyword, searchText){
    let url = '', id = '';
    let movieId = sessionStorage.getItem('movieId');
    if(keyword == 'now_playing'){
        url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1';
        id = '#latestMovies';
    }else if(keyword == 'top_rated'){
        url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1';
        id = '#topRatedMovies';
    }else if(keyword == 'recommended'){
        url = 'https://api.themoviedb.org/3/movie/' + movieId + '/recommendations?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1';
        id = '#recommendedMovies';
    }else if(keyword == 'search'){
        $('.textHeading').css('display', 'none');
        $('#latestMovies').css('display', 'none');
        $('#topRatedMovies').css('display', 'none');
        url = 'https://api.themoviedb.org/3/search/movie?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1&include_adult=false&query=' + searchText;
        id = '#searchMovies';
    }else{
        return false;
    }
    axios.get(url)
    .then((response) => {
        console.log(response);
        let movies = response.data.results;
        let output = '', imgUrl = '';
        $.each( movies, (index, movie) => {
            console.log(movie.poster_path);    
            if(movie.poster_path) 
                imgUrl = 'http://image.tmdb.org/t/p/w185' + movie.poster_path;
            else
                imgUrl= 'img/image-error.png';
            output += `
                <div class="animated rotateIn">
                    <img onclick="movieSelected('${movie.id}')" src="${imgUrl}" />
                </div>
            `;
        });
        $(id).html(output);
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
/**
 * For movies.html
 */

 function getMovieSelected(){
    let movieId = sessionStorage.getItem('movieId');
    let imgUrl = 'img/image-error.png';
    axios.get('https://api.themoviedb.org/3/movie/'+ movieId +'?api_key=3a6b37f95c6a73b59ec674e0c91b2156&language=en-US&page=1')
    .then((response) => {
        console.log(response);
        let movie = response.data;
        if(movie.homepage == "") 
            movie.homepage = "N/A";
        if(movie.poster_path) 
            imgUrl = 'http://image.tmdb.org/t/p/w185' + movie.poster_path;
            let pclist = '', genrelist = '';
            movie.production_companies.forEach(element => {
                pclist += element.name + ' ';
            });
            movie.genres.forEach(element => {
                genrelist += element.name + ' ';
            });
        let output = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${imgUrl}" class="thumbnail">
                </div>
                <div class="col-md-8">
                    <h2>${movie.original_title}</h2>
                    <ul class="list-group">
                    <li class="list-group-item"><strong>Genre:</strong> ${genrelist}</li>
                    <li class="list-group-item"><strong>Released:</strong> ${movie.release_date}</li>
                    <li class="list-group-item"><strong>Runtime:</strong> ${movie.runtime}mins</li>
                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.vote_average}/10</li>
                    <li class="list-group-item"><strong>Production:</strong> ${pclist}</li>
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