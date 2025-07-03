const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = {
    // State
    songs: [
        {
            name: "00",
            author: "RPT MCK",
            src: "./music/1.mp3",
            thumbnail: "./imgs/1.jpg",
        },
        {
            name: "Chìm Sâu",
            author: "RPT MCK",
            src: "./music/2.mp3",
            thumbnail: "./imgs/2.jpg",
        },
        {
            name: "Suit & Tie",
            author: "RPT MCK",
            src: "./music/3.mp3",
            thumbnail: "./imgs/3.jpg",
        },
        {
            name: "Va Vào Giai Điệu Này",
            author: "RPT MCK",
            src: "./music/4.mp3",
            thumbnail: "./imgs/4.jpg",
        },
        {
            name: "Tối Nay Ta Đi Đâu Nhờ",
            author: "RPT MCK",
            src: "./music/5.mp3",
            thumbnail: "./imgs/5.jpg",
        },
        {
            name: "Chỉ Một Đêm Nữa Thôi",
            author: "RPT MCK",
            src: "./music/6.mp3",
            thumbnail: "./imgs/6.jpg",
        },
        {
            name: "Thôi Em Đừng Đi",
            author: "RPT MCK",
            src: "./music/7.mp3",
            thumbnail: "./imgs/7.jpg",
        },
        {
            name: "50/50",
            author: "RPT MCK",
            src: "./music/8.mp3",
            thumbnail: "./imgs/8.jpg",
        },
        {
            name: "Cuốn Cho Anh Một Điếu Nữa Đi",
            author: "RPT MCK",
            src: "./music/9.mp3",
            thumbnail: "./imgs/9.jpg",
        },
        {
            name: "Show Me Love",
            author: "RPT MCK",
            src: "./music/10.mp3",
            thumbnail: "./imgs/10.jpg",
        },
        {
            name: "Tại Vì Sao",
            author: "RPT MCK",
            src: "./music/11.mp3",
            thumbnail: "./imgs/11.jpg",
        },
        {
            name: "Thờ Er",
            author: "RPT MCK",
            src: "./music/12.mp3",
            thumbnail: "./imgs/12.jpg",
        },
        {
            name: "Ai Mới Là Kẻ Xấu Xa",
            author: "RPT MCK",
            src: "./music/13.mp3",
            thumbnail: "./imgs/13.jpg",
        },
        {
            name: "Anh Đã Ổn Hơn",
            author: "RPT MCK",
            src: "./music/14.mp3",
            thumbnail: "./imgs/14.jpg",
        },
        {
            name: "Badtrip",
            author: "RPT MCK",
            src: "./music/15.mp3",
            thumbnail: "./imgs/15.jpg",
        },
        {
            name: "99",
            author: "RPT MCK",
            src: "./music/16.mp3",
            thumbnail: "./imgs/16.jpg",
        },
    ],
    currentIndex: 0,
    isPlaying: false,
    isRepeat: localStorage.getItem("repeat") === "true",
    isRandom: localStorage.getItem("random") === "true",

    // Element
    audioElement: $("#audio"),
    playlistElement: $(".playlist"),
    songItemsElement: [],
    progressElement: $(".progress-bar"),

    currentThumbElement: $("#current-thumbnail"),
    currentSongNameElement: $("#current-name"),
    currentAuthorElement: $("#current-author"),
    startTimeElement: $(".current-time"),
    endTimeElement: $(".duration"),

    playBtn: $("#play-button"),
    prevBtn: $("#prev-button"),
    nextBtn: $("#next-button"),
    repeatBtn: $("#repeat-button"),
    shuffleBtn: $("#shuffle-button"),
    volumnProgress: $("#progress-volumn"),

    // Method
    start() {
        this.render();
        this.loadCurrentSong();
        this.playBtn.onclick = this.togglePlay.bind(this);
        this.audioElement.ontimeupdate = this.handleProgress.bind(this);
        this.progressElement.oninput = this.handleChangeTime.bind(this);

        this.audioElement.onended = this.handleEndSong.bind(this);
        this.nextBtn.onclick = () => {
            if (this.isRandom) {
                const randomIndex = this.handleRandomSongIndex();
                this.handleChangeIndex(randomIndex);
            } else {
                this.handleChangeIndex(1);
            }
            this.loadCurrentSong();
            this.render();
        };
        this.prevBtn.onclick = () => {
            this.handleChangeIndex(-1);
            this.loadCurrentSong();
            this.render();
        };

        this.repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.repeatBtn.classList.toggle("active", this.isRepeat);
            localStorage.setItem("repeat", JSON.stringify(this.isRepeat));
        };
        this.shuffleBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            this.shuffleBtn.classList.toggle("active", this.isRandom);
            localStorage.setItem("random", JSON.stringify(this.isRandom));
        };

        this.volumnProgress.oninput = () => {
            const volumeValue = this.volumnProgress.value / 100;
            this.audioElement.volume = volumeValue;
            this.volumnProgress.style.background = `linear-gradient(to right, #ccc ${this.volumnProgress.value}%, #4a4a4a ${this.volumnProgress.value}%)`;
        };

        document.onkeydown = (event) => {
            const key = event.code;

            if (key === "Space") {
                this.playBtn.click();
            }
            if (key === "ArrowLeft") {
                this.prevBtn.click();
            }
            if (key === "ArrowRight") {
                this.nextBtn.click();
            }
        };
    },

    loadCurrentSong() {
        const currentSong = this.songs[this.currentIndex];

        this.audioElement.src = currentSong.src;

        this.currentThumbElement.src = currentSong.thumbnail;
        this.currentAuthorElement.textContent = currentSong.author;
        this.currentSongNameElement.textContent = currentSong.name;

        this.audioElement.oncanplay = () => {
            this.startTimeElement.textContent = this.handleTimer(
                this.audioElement.currentTime
            );
            this.endTimeElement.textContent = this.handleTimer(
                this.audioElement.duration
            );
            this.isPlaying
                ? this.audioElement.play()
                : this.audioElement.pause();
        };
    },

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.playBtn.classList.toggle("active", this.isPlaying);

        if (this.isPlaying) {
            this.audioElement.play();
        } else {
            this.audioElement.pause();
        }
    },

    handleChoiceSong() {
        this.songItemsElement.forEach((song, index) => {
            song.onclick = () => {
                if (index === this.currentIndex) return;
                const songIndex = song.dataset.index;
                this.currentIndex = Number(songIndex);

                this.loadCurrentSong();
                this.render();
            };
        });
    },

    handleProgress() {
        const currentTime = this.audioElement.currentTime;

        const duration = this.audioElement.duration;
        const progress = (currentTime / duration) * 100 || 0;

        this.startTimeElement.textContent = this.handleTimer(currentTime);

        this.progressElement.style.background = `linear-gradient(to right, #ccc ${progress}%, #4a4a4a ${progress}%)`;
        this.progressElement.value = progress;
    },

    handleChangeTime() {
        const progressValue = this.progressElement.value;
        const audioValue = (progressValue / 100) * this.audioElement.duration;

        this.audioElement.currentTime = audioValue;
    },

    handleRandomSongIndex() {
        let randomIndex = null;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomIndex === this.currentIndex);

        return randomIndex;
    },

    handleEndSong() {
        if (this.isRepeat) {
            this.audioElement.load();
        } else {
            if (this.isRandom) {
                const randomIndex = this.handleRandomSongIndex();
                this.handleChangeIndex(randomIndex);
            } else {
                this.handleChangeIndex(1);
            }
            this.loadCurrentSong();
            this.render();
        }
    },

    render() {
        const html = this.songs
            .map((song, index) => {
                return ` <div class="playlist-item ${
                    this.currentIndex === index ? "active" : ""
                }" data-index="${index}">
                    <img
                        src="${song.thumbnail}"
                        alt="${song.name}"
                    />
                    <div class="playlist-item-info">
                        <span>${song.name}</span>
                        <span class="artist">${song.author}</span>
                    </div>
                </div>`;
            })
            .join("");
        this.playlistElement.innerHTML = html;

        this.songItemsElement = $$(".playlist-item");
        this.handleChoiceSong();

        this.repeatBtn.classList.toggle("active", this.isRepeat);
        this.shuffleBtn.classList.toggle("active", this.isRandom);
    },

    handleTimer(time) {
        let minute = Math.floor(time / 60).toString();
        let second = Math.ceil(time % 60).toString();

        if (minute === "60") minute = "0";
        if (second === "60") {
            minute = "1";
            second = "0";
        }

        return `${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
    },

    handleChangeIndex(step) {
        this.currentIndex =
            (this.currentIndex + step + this.songs.length) % this.songs.length;
    },
};

player.start();
