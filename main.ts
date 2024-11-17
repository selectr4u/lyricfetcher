const LyricApiURL = "https://api.lyrics.ovh/v1/";

async function suggestSong(songName: string) {
    const url = "https://api.lyrics.ovh/suggest/" + songName;
    try {
        const response = await fetch(url);
        const jsonData = await response.json();

        if (jsonData.error) {
            console.error("error: " + jsonData.error);
            return;
        }

        console.log();
        console.log("suggestions: ");
        jsonData.data.forEach((song: any, index: number) => {
            console.log(
                index + 1 + ". " + song.artist.name + " - " + song.title,
            );
        });
        console.log();
        const songIndex = prompt("enter song index: ") as string;

        if (songIndex === "") {
            return;
        }

        const song = jsonData.data[parseInt(songIndex) - 1];

        console.log();
        await getLyrics(song.title, song.artist.name);
    } catch (error) {
        console.error("error: " + error);
    }
}

async function getLyrics(songName: string, artistName: string) {
    const url = LyricApiURL + artistName + "/" + songName;
    try {
        const response = await fetch(url);

        if (response.status === 404) {
            await suggestSong(songName);
            return;
        }

        const jsonData = await response.json();
        console.log(jsonData);

        if (jsonData.error) {
            if (jsonData.error === "No lyrics found") {
                await suggestSong(songName);
                return;
            } else {
                console.error("error: " + jsonData.error);
                return;
            }
        }
        console.log();
        console.log("title: " + songName + " - " + artistName);
        console.log("lyrics: ");
        console.log("%c" + jsonData.lyrics, "color: red");
    } catch (error) {
        console.error("error: " + error);
        return;
    }
}

while (true) {
    console.clear();
    const songName = prompt("enter song name: ") as string; // if you don't enter anything not my problem
    const artistName = prompt("enter artist name (optional): ");

    if (artistName && artistName !== "") {
        await getLyrics(songName, artistName);
    } else {
        await getLyrics(songName, "");
    }

    console.log();
    console.log("---------------");
    prompt("press enter to reset...");
}
