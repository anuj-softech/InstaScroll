
let scrollingEnabled = true;

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'w') {
        scrollingEnabled = !scrollingEnabled;
        console.log(`Auto-scroll is now ${scrollingEnabled ? 'enabled' : 'disabled'}`);
    }
});

function getCurrentReelVideo() {
    const videos = Array.from(document.querySelectorAll('video'));
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const rect = video.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        const isPlaying = !video.paused && video.currentTime > 0 && !video.ended;

        if (isVisible && isPlaying) {
            console.log(`[DEBUG] Found playing video at index ${i}`);
            return video;
        }
    }
    return null;
}

let VIDEOS_LIST = [];
let currentIndex = -1;

function updateVideoList() {
    VIDEOS_LIST = Array.from(document.querySelectorAll('video'));
}

function findCurrentVideoIndex() {
    updateVideoList();
    currentIndex = VIDEOS_LIST.findIndex(v => {
        const r = v.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= window.innerHeight;
    });
}

function scrollToNextVideo(scrollDirection = "down") {
    findCurrentVideoIndex(); // updates list + index
    if (currentIndex === -1) {
        console.warn("No current video found in view.");
        return;
    }

    const nextIndex = currentIndex + (scrollDirection === "down" ? 1 : -1);
    const nextVideo = VIDEOS_LIST[nextIndex];

    if (nextVideo) {
        console.log(`Scrolling to ${scrollDirection} video: index ${nextIndex}`);
        nextVideo.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    } else {
        console.warn("No next video available.");
    }
}


function waitForVideoAndScroll() {
    const video = getCurrentReelVideo();

    if (!video) {
        setTimeout(waitForVideoAndScroll, 1000);
        return;
    }


    video.addEventListener('ended', () => {
        if (!video.paused && scrollingEnabled) {
            scrollToNextVideo("down");
        }
    });
    setTimeout(waitForVideoAndScroll, 2000);
}

waitForVideoAndScroll();
