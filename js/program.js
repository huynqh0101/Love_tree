const cube = document.querySelector(".cube");
const introButton = document.querySelector(".intro-button");
const loveTreeFrame = document.querySelector(".tree-panel iframe");
const backgroundMusic = document.querySelector(".background-music");
const musicToggle = document.querySelector(".music-toggle");
const musicLabel = musicToggle.querySelector(".music-label");

let rotationX = -18;
let rotationY = 0;
let velocityX = 0;
let velocityY = 0.12;
let dragging = false;
let previousX = 0;
let previousY = 0;
let previousTime = performance.now();

const dragSensitivity = 0.35;
const autoRotateSpeed = 0.035;

backgroundMusic.volume = 0.45;

function updateMusicButton(isPlaying) {
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute(
        "aria-label",
        isPlaying ? "Turn music off" : "Turn music on"
    );
    musicLabel.textContent = isPlaying ? "Music On" : "Music Off";
}

async function playMusic() {
    try {
        await backgroundMusic.play();
        updateMusicButton(true);
    } catch {
        updateMusicButton(false);
    }
}

introButton.addEventListener("click", async () => {
    introButton.disabled = true;

    if (!loveTreeFrame.hasAttribute("src")) {
        loveTreeFrame.src = loveTreeFrame.dataset.src;
    }

    document.body.classList.remove("intro-active");
    document.body.classList.add("intro-complete");
    await playMusic();
});

musicToggle.addEventListener("click", () => {
    if (backgroundMusic.paused) {
        playMusic();
        return;
    }

    backgroundMusic.pause();
    updateMusicButton(false);
});

cube.querySelectorAll("img").forEach((image) => {
    image.draggable = false;
});

cube.addEventListener("dragstart", (event) => {
    event.preventDefault();
});

function render(currentTime) {
    const elapsed = Math.min(currentTime - previousTime, 32);
    previousTime = currentTime;

    if (!dragging) {
        rotationX += velocityX * elapsed;
        rotationY += velocityY * elapsed;

        velocityX *= Math.pow(0.94, elapsed / 16);
        velocityY = autoRotateSpeed + (velocityY - autoRotateSpeed)
            * Math.pow(0.96, elapsed / 16);
    }

    rotationX = Math.max(-80, Math.min(80, rotationX));
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    requestAnimationFrame(render);
}

cube.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;
    velocityX = 0;
    velocityY = 0;
    cube.classList.add("is-dragging");
    cube.setPointerCapture(event.pointerId);
});

cube.addEventListener("pointermove", (event) => {
    if (!dragging) {
        return;
    }

    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;

    rotationY += deltaX * dragSensitivity;
    rotationX -= deltaY * dragSensitivity;
    velocityY = deltaX * 0.025;
    velocityX = -deltaY * 0.025;
    previousX = event.clientX;
    previousY = event.clientY;
});

function stopDragging(event) {
    if (!dragging) {
        return;
    }

    dragging = false;
    cube.classList.remove("is-dragging");

    if (cube.hasPointerCapture(event.pointerId)) {
        cube.releasePointerCapture(event.pointerId);
    }
}

cube.addEventListener("pointerup", stopDragging);
cube.addEventListener("pointercancel", stopDragging);

requestAnimationFrame(render);
