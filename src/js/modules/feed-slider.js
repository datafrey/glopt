function slider() {
  const slidesContainer = document.querySelector('.feed__slider'),
        feedSliderBackBtn = document.querySelector('.feed__slider-back-btn'),
        feedSliderForwardBtn = document.querySelector('.feed__slider-forward-btn');

	const slidesContent = [
		{
			avatar: 'img/feed/client_avatar1.png',
			name: 'Анисимова Ольга',
			comment: 'Хочу рассказать о компании Global Opt. Самое главное что меня радует, это быстрый поиск и анализ определенного товара. Доставляла через компанию уже много раз, от расходных материалов для отеля, ло дольших партий детской одежды. Буду продолжать пользоваться услугами даной компании'
		},
		{
			avatar: 'img/feed/client_avatar2.png',
			name: 'Мезенцев Дмитрий',
			comment: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum, voluptatum? Eum, velit corrupti. Repudiandae iusto et autem minima facilis maxime, nulla delectus non temporibus fugit, ratione dolorem ipsam dolore fuga.'
		},
		{
			avatar: 'img/feed/client_avatar3.png',
			name: 'Романова Анастасия',
			comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere soluta id vitae, distinctio cum fugit magni ullam libero voluptatum ex tenetur numquam temporibus sed recusandae, dicta esse similique consequuntur itaque.'
		},
		{
			avatar: 'img/feed/client_avatar4.png',
			name: 'Петрова Ксения',
			comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam praesentium rem minima quaerat neque facilis dolorum debitis consequatur delectus nulla temporibus deserunt modi in incidunt dignissimos, quam asperiores. Optio, eos?'
		}
	];

	class Slider {
		constructor(slides) {
			this._ANIMATION_DURATION = 700;

			this._slides = slides;
			this._currentItemIndex = 0;
			this._previousItemIndex = slides.length - 1;
			this._nextItemIndex = 1;

			const elems = [
				this._renderSlide(slides[this._previousItemIndex]),
				this._renderSlide(slides[this._currentItemIndex]),
				this._renderSlide(slides[this._nextItemIndex])
			];

			elems[0].classList.add('feed__slider-item_left');
			elems[1].classList.add('feed__slider-item_current');
			elems[2].classList.add('feed__slider-item_right');

			for (const elem of elems) {
				slidesContainer.appendChild(elem);
			}
		}

		_renderSlide({ avatar, name, comment }) {
			const element = document.createElement('div');
			element.classList.add('feed__slider-item');
			element.innerHTML = `
				<img src="${ avatar }" alt="user avatar" class="feed__slider-item-avatar">
				<div class="feed__slider-item-name">${ name }</div>
				<div class="feed__slider-item-comment">${ comment }</div>
			`;
	
			return element;
		}

		moveOn() {
			this._updateIndexes();
			this._renderForward();
		}

		moveBack() {
			this._updateIndexes(false);
			this._renderBack();
		}

		_getIndexOfNext(index) {
			index += 1;
			if (index == this._slides.length) {
				index = 0;
			}

			return index;
		}

		_getIndexOfPrevious(index) {
			index -= 1;
			if (index == -1) {
				index = this._slides.length - 1;
			}

			return index;
		}

		_updateIndexes(toMoveOn = true) {
			if (toMoveOn) {
				this._currentItemIndex = 
					this._getIndexOfNext(this._currentItemIndex);
			} else {
				this._currentItemIndex = 
					this._getIndexOfPrevious(this._currentItemIndex);
			}

			this._nextItemIndex = this._getIndexOfNext(this._currentItemIndex);
			this._previousItemIndex = 
				this._getIndexOfPrevious(this._currentItemIndex);
		}

		_renderForward() {
			const newElem = this._renderSlide(this._slides[this._nextItemIndex]);
			slidesContainer.appendChild(newElem);

			slidesContainer.childNodes.forEach((item, i) => {
				switch (i) {
					case slidesContainer.childNodes.length - 4:
						item.classList.add('feed__slider-item_hidden');
						setTimeout(() => {
							slidesContainer.removeChild(item);
						}, this._ANIMATION_DURATION);
						break;
					case slidesContainer.childNodes.length - 3:
						item.classList.remove('feed__slider-item_current');
						item.classList.add('feed__slider-item_left');
						break;
					case slidesContainer.childNodes.length - 2:
						item.classList.remove('feed__slider-item_right');
						item.classList.add('feed__slider-item_current');
						break;
					case slidesContainer.childNodes.length - 1:
						item.classList.add('feed__slider-item_right', 
															 'feed__slider-item_visible');
						setTimeout(() => {
							item.classList.remove('feed__slider-item_visible');
						}, this._ANIMATION_DURATION);
						break;
				}
			});
		}

		_renderBack() {
			const newElem = this._renderSlide(this._slides[this._previousItemIndex]);
			slidesContainer.prepend(newElem);

			slidesContainer.childNodes.forEach((item, i) => {
				switch (i) {
					case 3:
						item.classList.add('feed__slider-item_hidden');
						setTimeout(() => {
							slidesContainer.removeChild(item);
						}, this._ANIMATION_DURATION);
						break;
					case 2:
						item.classList.remove('feed__slider-item_current');
						item.classList.add('feed__slider-item_right');
						break;
					case 1:
						item.classList.remove('feed__slider-item_left');
						item.classList.add('feed__slider-item_current');
						break;
					case 0:
						item.classList.add('feed__slider-item_left',
															 'feed__slider-item_visible');
						setTimeout(() => {
							item.classList.remove('feed__slider-item_visible');
						}, this._ANIMATION_DURATION);
						break;
				}
			});
		}
	}

	const slider = new Slider(slidesContent);
	feedSliderForwardBtn.addEventListener('click', () => slider.moveOn());
	feedSliderBackBtn.addEventListener('click', () => slider.moveBack());
}

export default slider;
