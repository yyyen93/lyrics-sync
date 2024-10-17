
function parseLyrics(){
    let lines = lyrics.split('\n');
    const result = [];
    for(let i=0; i<lines.length; i++){
        let strings = lines[i];
        let parts = strings.split(']');
        let durationStrings = parts[0].substring(1);
        const obj = {
            time: parseDuration(durationStrings),
            words: parts[1],
        }
        result.push(obj);
    }
    return result;
}

function parseDuration(durationStrings){
    let parts = durationStrings.split(':');
    return +parts[0] * 60 + +parts[1];
}

const lyricsData = parseLyrics();


const doms = {
    container: document.querySelector('.container'),
    ul: document.querySelector('.container ul'),
    audio: document.querySelector('audio'),
}

function findIndex(){
    let currentTime = doms.audio.currentTime;
    for(let i=0; i<lyricsData.length; i++){
        if(currentTime < lyricsData[i].time){
            return i - 1;
        }
    }
    return lyricsData.length - 1;
}

function renderLyrics(){
    const fragment = document.createDocumentFragment();
    for(let i=0; i<lyricsData.length; i++){
        let li = document.createElement('li');
        li.textContent = lyricsData[i].words;
        fragment.appendChild(li);
    }
    doms.ul.appendChild(fragment);
}
renderLyrics();

const containerHeight = doms.container.clientHeight;
const liHeight = doms.ul.children[0].clientHeight;
const offsetMax = doms.ul.clientHeight - containerHeight;

function setDisplayOffset(){
    let index = findIndex();
    let offset = liHeight * index + liHeight/2 - containerHeight/2;
    if(offset < 0){
        offset = 0;
    };
    if(offset > offsetMax){
        offset = offsetMax;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;

    let li = doms.ul.querySelector('.active');
    if(li){
        li.classList.remove('active');
    }

    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate', setDisplayOffset)