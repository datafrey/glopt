import slider from './modules/feed-slider';
import mobileHeader from './modules/mobile-header';
import phoneMask from './modules/phone-mask';

document.addEventListener('DOMContentLoaded', () => {
	slider();
	mobileHeader();
	phoneMask('.consultation__form-inputs input[name="phone"]');
	phoneMask('.questions__form-phone');
});
