const start_button = document.querySelector('.start')
const home_div = document.querySelector('.home')

const add_players_div = document.querySelector('.add-players')
const player_name_add_button = document.querySelector('.add-player-btn')
const players_names_div = document.querySelector('.input-section')
const add_players_name_done_button = document.querySelector('.adding-players-names-done')

const players_section_div = document.querySelector('.players-section')

const ready_page_div = document.querySelector('.ready-page')

const game_page_div = document.querySelector('.game-page')

const level_completed_div = document.querySelector('.level-completed')

const overlay = document.querySelector('.overlay')

let state = 'home'
let playerOne
let playerTwo
let players = []
let playerNumebr = 0

let pickedWords = []
let finalWords = []
let guessedWords = []
let wrongWords = []

let levelNumber = 1
let secondLevelMessageShowed = false
let thirdLevelMessageShowed = false

let timer

let score = 0

start_button.addEventListener('click', () => {
	state = 'add-players'
	home_div.style.display = 'none'
	add_players_div.style.display = 'flex'
})


player_name_add_button.addEventListener('click' , createPlayersNameInputsOverlay)

add_players_name_done_button.addEventListener('click' , () => {
	let playersContainer = players_names_div.children
	if (playersContainer.length < 3) return


	Array.from(playersContainer).forEach((playerContainer) => {
		if (playerContainer.classList.contains('group-section')) {
			let name = playerContainer.children[0].textContent
			let wordsForPlayer = pickRandomWords()
			players.push({name : name , words : wordsForPlayer , score: 0})
		}
	})
	Array.from(playersContainer).forEach((playerContainer) => {
		if (playerContainer.classList.contains('group-section')) {
			let name = playerContainer.children[1].textContent
			let wordsForPlayer = pickRandomWords()
			players.push({name : name , words : wordsForPlayer , score: 0})
		}
	})
	
	if (players.length > 1) {
		state = 'players-section'
		add_players_div.style.display = 'none'
		players_section_div.style.display = 'flex'
		createPlayersSection()
	}
})

function createPlayersNameInputsOverlay () {
	overlay.innerHTML = ''

	playerOne = ''
	playerTwo = ''

	state = 'players-group'
	overlay.style.display = 'flex'

	const inputPlayerOne = document.createElement('input')
	inputPlayerOne.type = 'text'
	inputPlayerOne.placeHolder = 'بازیکن اول'
	inputPlayerOne.classList.add('input-name')
	inputPlayerOne.addEventListener('input' , (event) => {
		let value = event.target.value
		playerOne = value
	})

	const inputPlayerTwo = document.createElement('input')
	inputPlayerTwo.type = 'text'
	inputPlayerTwo.placeHolder = 'بازیکن دوم'
	inputPlayerTwo.classList.add('input-name')
	inputPlayerTwo.addEventListener('input' , (event) => {
		let value = event.target.value
		playerTwo = value
	})
	const button = document.createElement('button')
	button.classList.add('start')
	button.classList.add('button')
	button.textContent = 'تمام'
	button.addEventListener('click' , () => {
		if (playerOne && playerTwo) {
			overlay.style.display = 'none'
			addPlayerNameToList()
		}
	})

	overlay.append(inputPlayerOne)
	overlay.append(inputPlayerTwo)
	overlay.append(button)
}

function addPlayerNameToList () {
	const div = document.createElement('div')
	div.classList.add('group-section')

	const spanOne = document.createElement('span')
	spanOne.classList.add('player-name')
	spanOne.textContent = playerOne

	const spanTwo = document.createElement('span')
	spanTwo.classList.add('player-name')
	spanTwo.textContent = playerTwo

	const button = document.createElement('button')
	button.classList.add('delete-player')
	button.classList.add('button')
	button.textContent = 'حذف'
	button.addEventListener('click' , () => {
		div.remove()
	})

	div.append(spanOne)
	div.append(spanTwo)
	div.append(button)
	players_names_div.append(div)
}

function createPlayersSection () {
	const span = document.createElement('span')
	span.classList.add('game-desc')
	span.textContent = 'حالا هر بازیکن از بین هشت کلمه دوتا شو حذف کنه (برای دیدن کلمات روی اسم خودتون بزنین و کلمه هارو بقیه نباید ببینن)'

	players_section_div.append(span)
	players.forEach((player) => {
		const button = document.createElement('button')
		button.classList.add('player-name-button')
		button.classList.add('button')
		button.textContent = player.name
		button.setAttribute('playerName' , player.name)
		button.addEventListener('click' , () => {
			createPlayerWordsSection(player.name, player.words)
		})

		players_section_div.append(button)
	})
}

function pickRandomWords() {
	let playerWords = []
	while (playerWords.length < 8) {
		let randomNumber = Math.floor(Math.random() * words.length)
		let word = words[randomNumber]

		if (pickedWords.includes(word)) continue

		playerWords.push(word)
		pickedWords.push(word)
	}

	return playerWords
}

function createPlayerWordsSection (playerName , playerWords) {
	overlay.innerHTML = ''

	state = 'player-words'
	overlay.style.display = 'flex'

	const player_words_div = document.createElement('div')
	player_words_div.classList.add('player-words')

	let wantedWords = 8

	playerWords.forEach((playerWord) => {

		const div = document.createElement('div')
		
		const span = document.createElement('span')
		span.classList.add('word')
		span.textContent = playerWord
		span.setAttribute('word' , playerWord)

		const button = document.createElement('button')
		button.classList.add('delete-word')
		button.classList.add('button')
		button.textContent = 'حذف'
		button.addEventListener('click', () => {
			if (button.textContent === 'حذف' && wantedWords > 6) {
				span.style.textDecoration = 'line-through'
				span.classList.add('unwanted')

				button.style.backgroundColor = '#6fcb9f'
				button.style.borderColor = '#6fdb9f'
				button.textContent = 'برگشت'
				wantedWords--
			}
			else if (button.textContent === 'برگشت') {
				span.style.textDecoration = 'none'
				span.classList.remove('unwanted')

				button.style.backgroundColor = '#fb2e01'
				button.style.borderColor = '#f35c39'
				button.textContent = 'حذف'
				wantedWords++
			}
		})

		div.append(span)
		div.append(button)
		player_words_div.append(div)
	})

	const button = document.createElement('button')
	button.classList.add('button')
	button.classList.add('player-words-selected')
	button.textContent = 'تمومه!'
	button.addEventListener('click' , () => {
		if (wantedWords === 6) {
			playerWords.forEach((word) => {
				let span = document.querySelector(`[word = "${word}"]`)
				if (!span.classList.contains('unwanted')) {
					finalWords.push(word)
				}
			})
			let playerNameButton = document.querySelector(`[playerName = "${playerName}"]`)
			playerNameButton.remove()
			overlay.style.display = 'none'
			checkPlayersDoneChoosingWords()
		}
	})

	player_words_div.append(button)
	overlay.append(player_words_div)
}


function checkPlayersDoneChoosingWords() {
	let donePlayers = players_section_div.children
	let isDone = Array.from(donePlayers).every((player) => player.tagName !== 'BUTTON' ? true : false)
	if (isDone) {
		const button = document.createElement('button')
		button.classList.add('start')
		button.classList.add('button')
		button.textContent = 'شروع'
		button.addEventListener('click' , () => {
			createReadyPage()
		})

		players_section_div.append(button)		
	}
}

function createReadyPage () {
	state = 'ready-page'
	players_section_div.style.display = 'none'
	game_page_div.style.display = 'none'
	level_completed_div.style.display = 'none'
	ready_page_div.style.display = 'flex'

	if (secondLevelMessageShowed) readyPlayer()
	else if (thirdLevelMessageShowed) readyPlayer()
	else createGameDescription()
}

function createGameDescription () {
	ready_page_div.innerHTML = ''

	const span = document.createElement('span')
	span.classList.add('game-desc')

	if (levelNumber === 1) span.textContent = 'توی دور اول. هربازیکن باید سعی کنه با توضیح دادن. کلمات رو به همتیمیش بفهمونه. و فقط یه دقیقه فرصت دارین. توی این دور کلمات رو نمیتونین رد کنین'
	else if (levelNumber === 2) {
		span.textContent = 'توی دور دوم. هربازیکن باید سعی کنه با پانتومیم و فقط گفتن یک کلمه. کلمات رو به همتیمیش بفهمونه. و فقط یه دقیقه فرصت دارین. توی این دور کلمات رو میتونین رد کنین ولی یادتون نره فقط یک کلمه میتونین توضیح بدین'
		secondLevelMessageShowed = true
	}
	else if (levelNumber === 3) {
		span.textContent = 'توی دور سوم. هربازیکن باید سعی کنه با پانتومیم و بدون حرف زدن. کلمات رو به همتیمیش بفهمونه. و فقط یه دقیقه فرصت دارین. توی این دور کلمات رو میتونین رد کنین .لی یادتون نره نباید صبحت کنین'
		thirdLevelMessageShowed = true
	}
	const button = document.createElement('button')
	button.classList.add('button')
	button.classList.add('start')
	button.textContent = 'حله'
	button.addEventListener('click' , () => {
		readyPlayer()
	})

	ready_page_div.append(span)
	setTimeout(() => ready_page_div.append(button), 1000)
}

function readyPlayer () {
	ready_page_div.innerHTML = ''

	const nameSpan = document.createElement('span')
	nameSpan.textContent = players[playerNumebr].name

	const readyBtn = document.createElement('button')
	readyBtn.classList.add('button')
	readyBtn.classList.add('start')
	readyBtn.textContent = 'آماده'
	readyBtn.addEventListener('click' , () => {
		startGame()
	})

	ready_page_div.append(nameSpan)
	ready_page_div.append(readyBtn)
}

function startGame () {
	clearInterval(timer)
	state = 'game-page'
	ready_page_div.style.display = 'none'
	game_page_div.style.display = 'flex'

	score = 0

	let word = selectWord()
	if (word) {
		createGamePageSection(word)
		startTimer()
	}
	else {
		timesUp()
	}
}

function createGamePageSection (word) {
	game_page_div.innerHTML = ''
	const timerSpan = document.createElement('span')
	timerSpan.classList.add('timer')
	timerSpan.textContent = '01 : 00'

	const wordSpan = document.createElement('span')
	wordSpan.classList.add('guess-word')
	wordSpan.textContent = word

	const btns_container = document.createElement('div')
	btns_container.classList.add('guess-buttons')

	const right_btn = document.createElement('button')
	right_btn.classList.add('right-guess')
	right_btn.classList.add('button')
	right_btn.textContent = 'درسته'
	right_btn.addEventListener('click' , () => {
		let shownWord = document.querySelector('.guess-word')
		guessedWords.push(shownWord.textContent)
		players[playerNumebr].score += 1
		nextWord()
	})

	const wrong_btn = document.createElement('button')
	wrong_btn.classList.add('wrong-guess')
	wrong_btn.classList.add('button')
	wrong_btn.textContent = 'غلطه'
	wrong_btn.addEventListener('click' , () => {
		let shownWord = document.querySelector('.guess-word')
		wrongWords.push(shownWord.textContent)
		nextWord()
	})

	game_page_div.append(timerSpan)
	game_page_div.append(wordSpan)

	btns_container.append(right_btn)
	if (levelNumber > 1) btns_container.append(wrong_btn)

	game_page_div.append(btns_container)
}

function nextWord () {
	let word = selectWord()
	if (word) {
		let wordSpan = document.querySelector('.guess-word')
		wordSpan.textContent = word	
	}
	else {
		timesUp()
	}
}

function selectWord () {
	let unGuessedWords = []
	finalWords.forEach((word) => {
		if (!guessedWords.includes(word) && !wrongWords.includes(word)) unGuessedWords.push(word)
	})
	let randomNumber = Math.floor(Math.random() * unGuessedWords.length)

	if (unGuessedWords[randomNumber]) return unGuessedWords[randomNumber]
	else return false
}

function startTimer () {
	let counter = 59
	timer = setInterval(() => {
		let timerSpan = document.querySelector('.timer')
		if (counter < 1) {
			timesUp()
		}
		timerSpan.textContent = `00 : ${counter}`
		counter--
	} , 1000)
}

function timesUp() {
	clearInterval(timer)
	wrongWords = []
	playerNumebr++
	if (playerNumebr >= players.length) playerNumebr = 0

	if (finalWords.length === guessedWords.length) {
		levelCompleted()
	}
	else {
		createReadyPage()
	}
}

function levelCompleted() {
	state = 'level-completed'
	game_page_div.style.display = 'none'
	level_completed_div.style.display = 'flex'

	createLevelCompletedSection()
}

function createLevelCompletedSection () {
	level_completed_div.innerHTML = ''

	players.forEach((player) => {
		const div = document.createElement('div')

		const nameSpan = document.createElement('span')
		nameSpan.textContent = `${player.name} : `
		const scoreSpan = document.createElement('span')
		scoreSpan.textContent = player.score

		div.append(nameSpan)
		div.append(scoreSpan)

		level_completed_div.append(div)
	})
	const button = document.createElement('button')
	button.classList.add('next-level-btn')
	button.classList.add('button')

	if (levelNumber < 3) {
		button.textContent = "مرحله بعدی"
		button.addEventListener('click' , () => {
			goToNextLevel()
		})
	}
	else if (levelNumber === 3) {
		button.textContent = "دوباره"
		button.addEventListener('click' , () => {
			document.reload()
		})
	}
	setTimeout(() => level_completed_div.append(button), 1000)
}

function goToNextLevel () {
	guessedWords = []

	levelNumber ++

	createReadyPage()
}
