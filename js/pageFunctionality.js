const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

/// api URL ///
const apiURL = "https://api.lyrics.ovh";

/// adding event listener in form

prev.style.display = "none";
next.style.display = "none";
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchValue = search.value.trim();
  if (!searchValue) {
    alert("There is nothing to search");
  } else {
    searchSong({ url: `${apiURL}/suggest/${searchValue}` });
  }
});

//search song
async function searchSong({ url }) {
  const searchResult = await fetch(url);
  const data = await searchResult.json();
  showData(data);
}

//display final result in html
function showData(data) {
  const prevButton = data.prev;
  const nextButton = data.next;
  result.innerHTML = `
    <ul class="song-list">
      ${data.data
        .map(
          (song) => `<li>
                    <div>
                        <strong>${song.artist.name}</strong> -${song.title} 
                    </div>
                    <p data-artist="${song.artist.name}" data-songtitle="${song.title}"> get lyrics</p>
                </li>`
        )
        .join("")}
    </ul>
  `;
  displayButtons(data);
}

function displayButtons(data) {
  if (data.next) {
    next.style.display = "flex";
    next;
  } else if (data.prev) {
    prev.style.display = "flex";
  }
}

//event listener in get lyrics button
result.addEventListener("click", (e) => {
  const clickedElement = e.target;
  //checking clicked elemet is button or not
  if (clickedElement.tagName === "P") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <p>${lyrics}</p>`;
}
