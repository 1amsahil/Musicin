
console.log("Javascript");

let currentSong = new Audio;
let songs;
let currFolder= `songs/Mix` ;
let duration;
let volumeValue = 50

// Get Song
async function getSongs()
{
    try {
        let response = await fetch("/songs");
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching songs:", error);
    }
}

// Play Music function
playMusic = (track)=>{
    console.log(track);
    
    currentSong.src = `songs/Mix/${track}`;
    currentSong.play();

    document.querySelector(".song-info").innerHTML = `<label>${track}</label>`;
}

// Next Song Play logic
nextSong = () =>
{
    var index = songs.indexOf(currentSong.src.split("/")[5].replaceAll("%20"," "));

    if(index == songs.length-1)
    {
        currentSong.src = `songs/Mix/${songs[1]}`;
        currentSong.play();

        document.querySelector(".song-info").innerHTML = `<label>${songs[0]}</label>`;
    }
    else
    {
        currentSong.src = `/${currFolder}/`+songs[index+1];
        currentSong.play();

        document.querySelector(".song-info").innerHTML = `<label>${songs[index+1]}</label>`;
    }

    if(currentSong.play)
    {
        play.src = "svg/pause.svg"
    }
}

// Album Function
async function displayAlbums()
{
    let link = await fetch(`/public/songs`);
    let response = await link.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    
    let anchors = div.getElementsByTagName("a");
    
    let array = Array.from(anchors);
    
    for (let index = 0; index < array.length; index++) {    
        const e = array[index];
        
        if(e.href.includes("/songs"))
        {
            let cardContainer = document.querySelector(".card-container");
            
            // Folder name
            let folder = e.href.split("/").slice(-2)[0];

            // Get Meta-Data of the folders
            let a = await fetch(`http://127.0.0.1:/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML +`<div class="card" data-folder="${folder}">
                            <img src="songs/${folder}/cover.jpg" alt="" class="thumbnail">
                            <img class="thumbnail-play-btn " src="svg/playlistplay.svg" alt="play-btn">
                            <h2><label>${response.title}</label></h2>
                            <p><label>${response.description}</label></p>
                        </div>`       
        }
    };


    // Add Event-Listener to PlayList
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Playlist : ",item.currentTarget.dataset.folder.replace("%20"," "));

            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

            // Showing all Songs in Playlist
            let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
            songUL.innerHTML = "";

            for(var s of songs)
            {
                songUL.innerHTML = songUL.innerHTML + `<li>
                                        <img src="svg/music.svg" class="invert" alt="">
                                        <div class="song">
                                            <div>${s}</div>
                                        </div>
                                        <img src="svg/play.svg" class="invert play-btn" alt="">
                                    </li>`
            }

            // Add an Event-Listener to song-list (li)
            Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
                
                e.addEventListener("click", element => {
                    playMusic(e.querySelector(".song").firstElementChild.innerHTML);

                    if(currentSong.play)
                    {
                        play.src = "svg/pause.svg"
                    }
                })
            })
            console.log("Song Name :",songs[0]);
            
            document.querySelector(".song-info").innerHTML = `<label>${songs[0]}</label>`;
            
            currentSong.src = `/${currFolder}/`+songs[0];

        })
    }) 

    
}

// Main Function
async function main()
{
    songs = await getSongs();
    
    console.log("Playlist : Mix");
    console.log("Song Name :",songs[0]);
    console.log("Folder Name :",currFolder);
    console.log("Curent Song :",currentSong);

    // Display All the Albums
    // displayAlbums();
    
    // metadata load
    currentSong.src = `${currFolder}/`+songs[0];
    currentSong.preload = "metadata";

    document.querySelector(".song-info").innerHTML = `<label>${songs[0]}</label>`;
    
    
    // Showing all Songs in Playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";

    for(var s of songs)
    {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                <img src="svg/music.svg" class="invert music-btn" alt="">
                                <div class="song">
                                    <div>${s}</div>
                                </div>
                                <img src="svg/play.svg" class="invert play-icon" alt="">
                            </li>`
    }

    // Add an Event-Listener to song-list (li)
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".song").firstElementChild.innerHTML);

            if(currentSong.play)
            {
                play.src = "svg/pause.svg"
            }
        })
    })

    // Song duration without play
    duration = currentSong.addEventListener("loadedmetadata",() => {
        console.log("Song Duration :",secondsToMinutes(currentSong.duration));
        document.querySelector(".song-duration").innerHTML = `<label>00:00 | ${secondsToMinutes(currentSong.duration)}</label>`;
    })

    // Click Play button Event-Listener
    play.addEventListener("click", () => {
        
        if(currentSong.paused)
        {               
            currentSong.play();
            play.src = "svg/pause.svg";
            play.alt = "pause"
        }
        else
        {
            currentSong.pause();
            play.src = "svg/play.svg";
        }
    })

    // Add an Event-Listener to Hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
    document.querySelector(".left").style.left = "0";
    })

    // Add an Event-Listener to Remove Hamburger
    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%";
    })
    document.querySelector(".playlist-header").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%";
    })
    document.querySelector(".musicin-playlist").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%";
    })


    // Add an Event-Listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100;
    })

    // Add an Event-Listener to previous
    previous.addEventListener("click", () => {
        console.log(currentSong.src.split("/"));
        
        var index = songs.indexOf(currentSong.src.split("/")[5].replaceAll("%20"," "));

        if(index == 0)
        {
            currentSong.src = `/${currFolder}/`+songs[songs.length-1];
            currentSong.play();

            document.querySelector(".song-info").innerHTML = `<label>${songs[songs.length-1]}</label>`;
        }
        else
        {
            currentSong.src = `/${currFolder}/`+songs[index-1];
            currentSong.play();

            document.querySelector(".song-info").innerHTML = `<label>${songs[index-1]}</label>`;
        }

        if(currentSong.play)
        {
            play.src = "svg/pause.svg"
        }
    })

    // Add an Event-Listener to next
    next.addEventListener("click", () => {
        nextSong();
    })

    // Add an Event-Listener to Volume-bar
    document.querySelector("#volume").addEventListener("click", (e) => {

        console.log("volume value : ",e.target.value);
    
        volumeValue = parseInt(e.target.value);   
        currentSong.volume = volumeValue/100;
        
        var img = document.querySelector("#volume-img");
        img.src = img.src.replace("mute.svg","volume.svg");
    })

    // Add an Event-Listener to mute Volume
    document.querySelector("#volume-img").addEventListener("click", (e) => {

        if(e.target.src.includes("volume.svg"))
        {
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            
            volumeValue = 0;   
            document.querySelector("#volume").value = volumeValue;
            
            currentSong.volume = volumeValue/100;
        }
        else
        {
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            
            volumeValue = 30;
            document.querySelector("#volume").value = volumeValue;
            
            currentSong.volume = volumeValue/100;
        }
        
    })

    // Song Timelaspe Event-Listener
    currentSong.addEventListener("timeupdate", () => {

        var curr = secondsToMinutes(currentSong.currentTime);
        var total = secondsToMinutes(currentSong.duration);

        if(total == `${NaN}:${NaN}`)
        {
            total = "00:00";
            document.querySelector(".circle").style.left = "0%"
        }

        document.querySelector(".song-duration").innerHTML = `<label>${curr} | ${total}</label>`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 +"%"

        if(currentSong.paused)
        {
            play.src = "svg/play.svg";
        }

        if(currentSong.currentTime == currentSong.duration)
        {
            nextSong();
        }

    });

    // seconds to minutes converter
    function secondsToMinutes(time)
    {
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time%60);
        
        return `${(minutes.toString()).padStart(2,"0")}:${(seconds.toString()).padStart(2,"0")}`;
    }

}

main();