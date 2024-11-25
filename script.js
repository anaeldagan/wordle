var height = 6;
var width = 5;
var row = 0; // current guess
var col = 0; // current word guess
var gameOver = false;
var currentWord;

const wordDisplay = document.querySelector(".word-display");
const gameModal = document.querySelector(".game-modal");

const getRandomWord = () => {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    console.log(word);
};

const resetGame = () => {
    row = 0;
    col = 0;
    gameOver = false;
    getRandomWord(); // בחירת מילה חדשה

    // איפוס הקוביות בלוח
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let currTile = document.getElementById(r.toString() + '-' + c.toString());
            currTile.innerText = "";
            currTile.className = "title"; // מחיקת כל מחלקות הסטייל שנוספו
        }
    }

    // איפוס כפתורי המקלדת
    document.querySelectorAll(".keyboard button").forEach(button => {
        button.disabled = false;
        button.classList.remove("correct", "present", "absent");
    });

    // הסתרת מודאל המשחק אם הוא פתוח
    gameModal.classList.remove("show");
};

window.onload = function() {
    getRandomWord(); // בחר מילה רנדומלית לפני תחילת המשחק

    // בדיקת האלמנט של המקלדת
    const keyboardDiv = document.querySelector(".keyboard");
    if (!keyboardDiv) {
        console.error("האלמנט של המקלדת לא נמצא ב-DOM");
        return; // יציאה אם האלמנט לא קיים
    }

    initialize(); // אתחול הלוח

    // יצירת כפתורי המקלדת והוספתם ל-DOM
    for (let i = 97; i <= 122; i++) { // מעבר על קוד ה-ASCII של האותיות a-z
        const button = document.createElement("button"); // יצירת כפתור חדש
        const letter = String.fromCharCode(i); // המרת הקוד לאות
        button.innerText = letter; // הגדרת טקסט הכפתור לאות
        button.value = letter.toLowerCase();  // הגדרת ערך הכפתור לאות קטנה
        keyboardDiv.appendChild(button); // הוספת הכפתור למקלדת

        button.addEventListener("click", () => {
            if (gameOver) return; // לא לעשות דבר אם המשחק הסתיים
            if (col < width) {
                let currTile = document.getElementById(row.toString() + '-' + col.toString());
                if (currTile.innerText == "") {
                    currTile.innerText = letter.toUpperCase(); // הכנסה של האות שנלחצה בלוח
                    col += 1;
                }
            }
        });
    }

    // הוספת כפתור "מחיקה"
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "delete";
    deleteButton.value = "delete";
    deleteButton.classList.add("action-button");
    keyboardDiv.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
        if (0 < col && col <= width) {
            col -= 1;
        } 
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    });

    // הוספת כפתור "אנטר"
    const enterButton = document.createElement("button");
    enterButton.innerText = "Enter";
    enterButton.value = "enter";
    enterButton.classList.add("action-button");
    keyboardDiv.appendChild(enterButton);

    enterButton.addEventListener("click", () => {
        if (gameOver) return; // אם המשחק נגמר, לא לעשות כלום
        
        if (col === width) {
            // אם השורה מלאה, נבדוק אם המילה שנכנסה נכונה
            update(); // כאן update() מבצעת בדיקת התאמה, שינוי צבעים וכו'.
        
            // מעבר לשורה הבאה
            row += 1;
            col = 0;

            // בדיקה אם השחקן הגיע לשורה האחרונה
            if (row === height) {
                gameOver = true;
                gameOverModal(false); // קריאה לפונקציה להצגת מודאל הפסד
            }
        } 
    });
};

const gameOverModal = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? `You found the word:` : `The correct word was:`;
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over';
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300);
};

function update() {
    let correct = 0; // משתנה לספירה של מספר האותיות הנכונות

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText.toLowerCase(); // המרת האותיות לאותיות קטנות
        let correctLetter = currentWord[c].toLowerCase(); // המרת האותיות לאותיות קטנות מהמילה הסודית

        if (correctLetter === letter) {
            currTile.classList.add("correct");
            correct += 1;
        } else if (currentWord.includes(letter)) {
            currTile.classList.add("present");
        } else {
            currTile.classList.add("absent");
        }

        // עדכון הסגנון של כפתור המקלדת
        let keyboardButton = document.querySelector(`button[value="${letter}"]`);
        if (keyboardButton) {
            if (correctLetter === letter) {
                keyboardButton.classList.remove("present", "absent");
                keyboardButton.classList.add("correct");
            } else if (currentWord.includes(letter)) {
                if (!keyboardButton.classList.contains("correct")) {
                    keyboardButton.classList.remove("absent");
                    keyboardButton.classList.add("present");
                }
            } else {
                if (!keyboardButton.classList.contains("correct") && !keyboardButton.classList.contains("present")) {
                    keyboardButton.classList.add("absent");
                }
            }
        }
    }

    if (correct === width) {
        gameOver = true;
        gameOverModal(true); // קריאה לפונקציה להצגת מודאל ניצחון
    }
}

function initialize() {
    // יצירת לוח המשחק
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("title");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;
        if ("KeyA" <= e.code && e.code <= "KeyZ") {
            if (col < width) {
                let currTile = document.getElementById(row.toString() + '-' + col.toString());
                if (currTile.innerText == "") {
                    currTile.innerText = e.code[3];
                    col += 1;
                }
            }
        } else if (e.code == "Backspace") {
            if (0 < col && col <= width) {
                col -= 1;
            }
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            currTile.innerText = "";
        } else if (e.code == "Enter") {
            if (col === width) {
                update();
                row += 1;
                col = 0;
            }
        }

        if (!gameOver && row == height) {
            gameOver = true;
            gameOverModal(false); // קריאה לפונקציה להצגת מודאל הפסד
        }
    });
}
