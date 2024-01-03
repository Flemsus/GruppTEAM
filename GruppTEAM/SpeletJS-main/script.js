document.addEventListener("DOMContentLoaded", function () {
    const cardsContainer = document.getElementById("memory-cards");
    const startButton = document.querySelector('[data-action="start-game"]');
    const resetButton = document.querySelector('.details button');
    const flipsCounter = document.querySelector('.flips span b');
    const cardCount = 12; // Ändra denna beroende på antal img vi har gånger två.
    let gameDuration = 45; 
    let timer;


    const cardImages = Array.from({ length: cardCount / 2 }, (_, index) => index + 1); //Skapar en array för cardImages
    const allCardImages = [...cardImages, ...cardImages]; // Ger oss en ny cardImage för varje cardImage, helt enkelt duplicerar

    // Fisher-Yates algorithm kallas detta och jag är inte 100% säker på varför men jag vet att det på något sätt fungerar
    for (let i = allCardImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCardImages[i], allCardImages[j]] = [allCardImages[j], allCardImages[i]];
    }

    let flippedCards = [];
    let isFlipping = false;

    


    
    function handleCardClick() {
        if (isFlipping) return;  
        const card = this;
        const frontView = card.querySelector('.front-view');
        const backView = card.querySelector('.back-view');

        if (flippedCards.length < 2 && frontView.style.display === 'block') {
// Bytar "håll" på bilden när man klickar på den
            frontView.style.display = 'none';
            backView.style.display = 'block';
            flippedCards.push({ card, image: allCardImages[parseInt(card.dataset.index)] });
// När man klickat på exakt två stycken kollar den om det är en match via checkForMatch
            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 400);
            }

            
        }
    }



// Starta upp spelet

    function startGame() {
        if (timer) {
           
            return;
        }
    
      
        flippedCards = [];
        isFlipping = false;
        updateTimerDisplay();
        flipsCounter.textContent = gameDuration;
    
        
        cardsContainer.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', handleCardClick);
        });
    
      
        timer = setInterval(() => {
            gameDuration--;
    
            if (gameDuration < 0) {
                gameDuration = 0; 
            }
    
            updateTimerDisplay(); 
    
            if (gameDuration === 0) {
                endGame();
                clearInterval(timer); 
                timer = null; 
            }
        }, 1000);
    }
    
// Startar om spelet/rullar om alla kort på nytt

    function resetGame() {
       
        cardsContainer.innerHTML = '';

        points = 0;
        updatePointsDisplay(); 
    
        reshuffleCards();
    
        clearInterval(timer);
        timer = null;
    
        gameDuration = parseInt(document.getElementById('time-dropdown').value);
        updateTimerDisplay();
    
        startGame();
    }

// Game over, man.
// När tiden tar slut kan man inte längre klicka på korten förrän man startar ett nytt spel och man får en alert med antalet poäng man skaffa.
    function endGame() {

        clearInterval(timer);
        isFlipping = true;


        cardsContainer.querySelectorAll('.card').forEach(card => {
            card.removeEventListener('click', handleCardClick);
        });


        alert(`Game Over! Antal poäng: ${points}`);
    }





    function checkForMatch() {
        isFlipping = true;
    
        // Kollar om båda bilderna som är flipped har samma namn
        const [card1, card2] = flippedCards;
        const match = card1.image === card2.image;
    
        setTimeout(() => {
            if (match) {
                // Om det är en "match", stanna kvar uppe (om inte alla redan blivit det) och ge poäng.
                card1.card.removeEventListener('click', handleCardClick);
                card2.card.removeEventListener('click', handleCardClick);
                card1.card.classList.add('matched');
                card2.card.classList.add('matched');
                points++;
                
                updatePointsDisplay();
    
                if (allPairsMatched()) {
                    reshuffleCards();
                }
            } else {
                // Om de inte matchar vänd tillbaks dem
                card1.card.querySelector('.front-view').style.display = 'block';
                card1.card.querySelector('.back-view').style.display = 'none';
    
                card2.card.querySelector('.front-view').style.display = 'block';
                card2.card.querySelector('.back-view').style.display = 'none';
            }
    
            flippedCards = [];
            isFlipping = false;
        }, 200);
    }
    
    


    for (let i = 0; i < cardCount; i++) {
        const card = document.createElement("li");
        card.classList.add("card");
        card.dataset.index = i;


        const frontView = document.createElement("div");
        frontView.classList.add("view", "front-view");
        frontView.style.display = 'block'; 

        const frontImage = document.createElement("img");
        frontImage.classList.add("img-front");
        frontImage.src = "img/qmark.png";
        frontImage.alt = "icon";


//Framsida/baksida av korten
        frontView.appendChild(frontImage);
        card.appendChild(frontView);

        const backView = document.createElement("div");
        backView.classList.add("view", "back-view");
        backView.style.display = 'none';  


        const backImage = document.createElement("img");
        backImage.classList.add("img-back");
        backImage.src = `img/img${allCardImages[i]}.jpg`; //Kollar i mappen img efter filerna som heter img med en siffra efter, hur många som används beror på cardCount
        backImage.alt = "card-img";

        backView.appendChild(backImage);
        card.appendChild(backView);

        // Lägger till vad som händer när man faktiskt klickar på korten
        card.addEventListener('click', handleCardClick);

        cardsContainer.appendChild(card);
    }



    


// Rullar om alla korten på nytt
    function reshuffleCards() {

        cardsContainer.innerHTML = '';
    
        for (let i = allCardImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCardImages[i], allCardImages[j]] = [allCardImages[j], allCardImages[i]];
        }
    
        for (let i = 0; i < cardCount; i++) {
            const card = document.createElement("li");
            card.classList.add("card");
            card.dataset.index = i;
    
            const frontView = document.createElement("div");
            frontView.classList.add("view", "front-view");
            frontView.style.display = 'block';
    
            const frontImage = document.createElement("img");
            frontImage.classList.add("img-front");
            frontImage.src = "img/qmark.png";
            frontImage.alt = "icon";
    
            frontView.appendChild(frontImage);
            card.appendChild(frontView);
    
            const backView = document.createElement("div");
            backView.classList.add("view", "back-view");
            backView.style.display = 'none';
    
            const backImage = document.createElement("img");
            backImage.classList.add("img-back");
            backImage.src = `img/img${allCardImages[i]}.jpg`;
            backImage.alt = "card-img";
    
            backView.appendChild(backImage);
            card.appendChild(backView);
    
            card.addEventListener('click', handleCardClick);
    
            cardsContainer.appendChild(card);
        }
    }
    



    function updateTimerDisplay() {
        document.getElementById('countdown').textContent = gameDuration;
    }

    function updatePointsDisplay() {
        const pointsElement = document.getElementById('points');
    
        if (!isNaN(points)) {
            pointsElement.textContent = points;
        } else {
            pointsElement.textContent = 'Träningsläge!';
        }
    }
    
    
    function allPairsMatched() {
        return document.querySelectorAll('.card:not(.matched)').length === 0;
    }
    
    

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
    
});
