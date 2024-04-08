const cols = document.querySelectorAll('.col')

document.addEventListener('keydown', event => {
	event.preventDefault()
	// Проверяем, является ли нажатая клавиша пробелом
	if (event.code.toLowerCase() === 'space') {
		// Если да, вызываем функцию установки случайных цветов
		setRandomColors()
	}

	// Проверяем, является ли нажатая клавиша `Esc`
	if (event.code.toLowerCase() === 'escape') {
		// Если да, то закрываем модальное окно
		closeModal()
	}
})

document.addEventListener('click', event => {
	// Получаем тип элемента, на который был совершен клик
	const type = event.target.dataset.type

	// Если тип элемента - 'lock'
	if (type === 'lock') {
		// Определяем, является ли целевой элемент иконкой или его дочерним элементом
		const node =
			event.target.tagName.toLowerCase() === 'i'
				? event.target
				: event.target.children[0]

		// Переключаем классы для иконки, изменяя её с заблокированной на разблокированную и наоборот
		node.classList.toggle('fa-lock-open')
		node.classList.toggle('fa-lock')
	} else if (type === 'copy') {
		// Если тип элемента - 'copy', копируем текст этого элемента в буфер обмена
		copyToClickboard(event.target.textContent)
	}
})

// Функция генерации случайного цвета
function gerenerateRandomColor() {
	// Определение возможных символов в HEX-представлении цвета
	const hexCodes = '0123456789ABCDEF'
	let color = ''
	for (let i = 0; i < 6; i++) {
		// Случайным образом выбираем символы для составления цвета
		color += hexCodes[Math.floor(Math.random() * hexCodes.length)]
	}
	// Возвращаем цвет в HEX формате
	return '#' + color
}

// Функция копирования текста в буфер обмена
function copyToClickboard(text) {
	return navigator.clipboard.writeText(text)
}

// Функция установки случайных цветов
function setRandomColors(isInitial) {
	// Если это начальная установка, получаем цвета из хэша URL, иначе - пустой массив
	const colors = isInitial ? getColorsFromHash() : []

	cols.forEach((col, index) => {
		// Проверяем, заблокирован ли элемент
		const isLocked = col.querySelector('i').classList.contains('fa-lock')
		const text = col.querySelector('h2')
		const button = col.querySelector('button')

		if (isLocked) {
			// Если элемент заблокирован, сохраняем его текущий цвет
			colors.push(text.textContent)
			return
		}

		// Генерируем случайный цвет или используем сохраненный цвет при начальной установке
		const color = isInitial
			? colors[index]
				? colors[index]
				: chroma.random()
			: chroma.random()

		if (!isInitial) {
			// Если это не начальная установка, добавляем цвет в массив
			colors.push(color)
		}

		// Устанавливаем текстовое содержимое и фоновый цвет колонки
		text.textContent = color
		col.style.background = color

		// Устанавливаем цвет текста в зависимости от яркости фона
		setTextColor(text, color)
		setTextColor(button, color)
	})

	// Обновляем хэш URL соответственно установленным цветам
	updateColorsHash(colors)
}

// Функция установки цвета текста в зависимости от яркости фона
function setTextColor(text, color) {
	const luminance = chroma(color).luminance()
	text.style.color = luminance > 0.5 ? 'black' : 'white'
}

// Функция обновления хэша URL
function updateColorsHash(colors = []) {
	document.location.hash = colors
		.map(col => {
			return col.toString().substring(1)
		})
		.join('-')
}

// Функция получения цветов из хэша URL
function getColorsFromHash() {
	if (document.location.hash.length > 1) {
		return document.location.hash
			.substring(1)
			.split('-')
			.map(color => '#' + color)
	}
	return []
}

// Вызываем функцию установки случайных цветов при загрузке страницы
setRandomColors(true)


// Модальное окно. Автоматически показывать и скрыть по клику на кнопку, оверлей и Esc
const modal = document.querySelector('.modal'),
	overlap = document.querySelector('.overlap'),
	modalClose = document.querySelector('.modal__close'),
	infoBtn = document.querySelector('.info')

function openModal() {
	overlap.classList.add('overlap__active')
}

function closeModal() {
	overlap.classList.remove('overlap__active')
}

window.onload = function () {
	setTimeout(function () {
		openModal()
	}, 2000) 
}

infoBtn.addEventListener('click', () => {
	openModal()
})

modalClose.addEventListener('click', () => {
	closeModal()
})

overlap.addEventListener('click', event => {
	if (event.target === overlap) {
		closeModal()
	}
})