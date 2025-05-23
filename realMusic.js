const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const shuffleBtn = document.getElementById('suffle-btn');
const playlist = document.getElementById('playlist-songs');

const allSongs = [
    {id: 0, title: "Who-Says", artist: "Selena Gomez", duration: "4:00",
        src: "Who-Says(PaglaSongs).mp3"},
    {id: 1, title: "Flowers", artist: "Miley Cyrus", duration: "3:21",
        src: "Flowers(PaglaSongs).mp3"},
    {id: 2, title: "Dandelions", artist: "Ruth B", duration: "3:48",
        src: "Who-Says(PaglaSongs).mp3"}
];

let audio = new Audio();// add audio to screen used to manipulate audio
let userData = { //will be used everywhere instead of allSongs
    songs: [...allSongs], //to copy allsongs to songs 
    currentSong: null,
    songCurrentTime: 0
}

//show songs on screen
console.log("Hello There!")
showSongs = (array) => {
    const songsHTML = array.map((song) => {
        return `
        <li id="song-${song.id}" class="playlist-song">
        <button class="playlist-song-info" onclick="playSong(${song.id})" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li><hr>`
    }).join("");
    playlist.innerHTML = songsHTML;
    //reset button
    if (userData?.songs.length === 0) {
        const resetButton = document.createElement("button");
        const resetText = document.createTextNode("Reset Playlist");
        resetButton.id = "reset";
        resetButton.ariaLabel = "Reset playlist";
        resetButton.appendChild(resetText);
        playlist.appendChild(resetButton);

        resetButton.addEventListener("click", () => {
            userData.songs = [...allSongs];
            showSongs(sortSongs());
            resetButton.remove();
        });
    }
}
const sortSongs = () => {
    userData?.songs.sort((a, b) => {
        if(a.title < b.title){
            return -1;
        }
        if(a.title > b.title){
            return 1;
        }
            return 0;
    });
    return userData?.songs;
}
showSongs(sortSongs());
//play song when clicked on song 
playSong = (id) => {
    const song = userData?.songs.find((song) => song.id === id);
    audio.src = song.src;
    audio.title = song.title;
    if(userData?.currentSong === null || userData?.currentSong.id !== id){
        audio.currentTime = 0;
    }
    else{
        audio.currentTime = userData?.songCurrentTime;
    }
    
    userData.currentSong = song;
    playBtn.classList.add("playing");
    setPlayerDisplay();
    audio.play();
}
//display details
setPlayerDisplay = () => {
    const playingSong = document.getElementById("player-song-title");
    const songArtist = document.getElementById("player-song-artist");
    const currentTitle = userData?.currentSong?.title;
    const currentArtist = userData?.currentSong?.artist;
    //ternary operator if we have a sonng playing add it or else display empty string
    playingSong.textContent = currentTitle ? currentTitle : "";
    songArtist.textContent = currentArtist ? currentArtist : "";
}

//play button
playBtn.addEventListener("click", () => {
    if(userData?.currentSong === null){
        playSong(userData?.songs[0].id);
    }
    else{
        playSong(userData?.currentSong.id);
    }
});
//pause button
pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    playBtn.classList.remove("playing");
    audio.pause();
}
stopBtn.addEventListener("click", pauseSong);
//next button
//get index by index of function
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);
playNextSong = () => {
    if(userData?.currentSong === null){
        playSong(userData?.songs[0].id);
    }
    else{
        const nextSong = userData?.songs[getCurrentSongIndex() + 1];
        playSong(nextSong.id);
    }
}
nextBtn.addEventListener("click", playNextSong);
backBtn.addEventListener("click", () => {
    if(userData?.currentSong === null){
        return;
    }
    else{
        const previousSong = userData?.songs[getCurrentSongIndex() - 1];
        playSong(previousSong.id);
    }
})
//previous button
//shuffle button
shuffleBtn.addEventListener("click", () => {
    userData?.songs.sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    showSongs(userData?.songs);
    pauseSong();
    setPlayerDisplay();
})
//delete button
deleteSong = (id) => {
    if(userData?.currentSong?.id === id){
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        pauseSong();
        setPlayerDisplay();
    }// update userData array and display it
    userData.songs = userData?.songs.filter((song) => song.id !== id);
    showSongs(userData?.songs)
}

//play next song when current is ended
audio.addEventListener("ended", () => {
    const nextSongExists = userData?.songs[getCurrentSongIndex() + 1] !== undefined;
    if(nextSongExists){
        playSong(playNextSong);
    }
    else{
        userData.currentSong = null;
        userData.songCurrentTime = 0;
        pauseSong();
        setPlayerDisplay();
    }
})