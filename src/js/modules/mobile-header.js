function mobileHeader() {
  const header = document.querySelector('.header'),
				headerHamburger = document.querySelector('.header__hamburger'),
				headerMenu = document.querySelector('.header__menu'),
				headerMenuItems = document.querySelectorAll('.header__menu-item');

	let menuItemClicked = false;

  function toggleMenu() {
    headerHamburger.classList.toggle('header__hamburger_active');
		headerMenu.classList.toggle('header__menu_visible');

		if (window.innerWidth < 576) {
			if (headerHamburger.classList.contains('header__hamburger_active')) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
  }

	headerHamburger.addEventListener('click', toggleMenu);

	headerMenuItems.forEach(item => {
		item.addEventListener('click', () => {
			toggleMenu();
			menuItemClicked = true;
		});
	});

  const delta = 2;
  const headerHeight = header.clientHeight;
  
	let didScroll;
	let lastScrollTop = 0;

	window.addEventListener('scroll', () => didScroll = true);

  function hasScrolled() {
		const scrollPosition = window.scrollY;

		if (Math.abs(lastScrollTop - scrollPosition) <= delta) {
			return;
		}

		if (scrollPosition > lastScrollTop && 
				scrollPosition > headerHeight || 
				menuItemClicked) {
			
			header.classList.add('header_hidden');
			headerHamburger.classList.remove('header__hamburger_active');
			headerMenu.classList.remove('header__menu_visible');
			if (menuItemClicked) {
				menuItemClicked = false;
			}
		} else {
			if (scrollPosition + window.innerHeight < 
          document.documentElement.offsetHeight) {
				header.classList.remove('header_hidden');
			}
		}

		lastScrollTop = scrollPosition;
	}

	setInterval(() => {
		if (window.innerWidth < 768 && didScroll) {
			hasScrolled();
			didScroll = false;
		}
	}, 250);
}

export default mobileHeader;
