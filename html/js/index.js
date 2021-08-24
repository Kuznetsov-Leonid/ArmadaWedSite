'use strict';

window.addEventListener('load', function () {
	var current = null;
	var header = document.querySelector('header');

	// handler function for making the selected section visible
	function updateVisibleSection() {
		var hash = '' + location.hash;
		var section = undefined;

		// checking the hash to select the correct section
		if (hash.length) {
			section = document.querySelector('section[name="' + hash.substr(1) + '"]');
		} else {
			section = document.querySelector('section');
		}
		if (!section) {
			return;
		}

		// selecting the correct link
		var link = header.querySelector('a[href="#' + section.getAttribute('name') + '"]');

		// updating previously and currently active section
		var previous = current;
		current = section;

		// resetting all sections hidden attribute
		var allSections = Array.from(document.querySelectorAll('.section'));
		for (var _iterator = allSections, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
			var _ref;

			if (_isArray) {
				if (_i >= _iterator.length) break;
				_ref = _iterator[_i++];
			} else {
				_i = _iterator.next();
				if (_i.done) break;
				_ref = _i.value;
			}

			var i = _ref;

			i.setAttribute('hidden', '');
		}

		// making the correct section visible
		current.removeAttribute('hidden');
		// for keeping the z-index correct
		document.body.appendChild(current);

		// resetting all links
		var allLinks = Array.from(header.querySelectorAll('a'));
		for (var _iterator2 = allLinks, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
			var _ref2;

			if (_isArray2) {
				if (_i2 >= _iterator2.length) break;
				_ref2 = _iterator2[_i2++];
			} else {
				_i2 = _iterator2.next();
				if (_i2.done) break;
				_ref2 = _i2.value;
			}

			var i = _ref2;

			i.className = '';
		}

		// active link selection
		if (link) {
			link.className = 'active';
		}

		// animating
		if ('animate' in window) {
			animate(link, current, previous, header);
		}
	}

	// activating the handler function for the first time
	updateVisibleSection();
	// attaching the handler to hashchange event
	window.addEventListener('hashchange', updateVisibleSection);
});

// the animation function
function animate(link, current, previous, header) {
	// creating a new DOM element
	var effectNode = document.createElement('div');
	effectNode.className = 'circleEffect';

	// Element.getBoundingClientRect() method returns an object containing the size of an element and its position relative to the viewport
	var bounds = link.getBoundingClientRect();

	// setting the coordinates for the absolutely positioned effectNode
	effectNode.style.left = bounds.left + bounds.width / 2 + 'px';
	effectNode.style.top = bounds.top + bounds.height / 2 + 'px';

	// appending the effectNode child to the header
	header.appendChild(effectNode);

	// choosing a random color everytime
	var newColor = 'hsl(' + Math.round(Math.random() * 255) + ', 46%, 42%)';
	effectNode.style.background = newColor;

	// the animation properties
	var scaleSteps = [{ transform: 'scale(0)' }, { transform: 'scale(1)' }];
	var timing = {
		duration: 1000,
		easing: 'ease-in-out'
	};

	// creates a KeyframeEffect that encapsulates our change to effectNode, without implicitly playing the animation
	var scaleEffect = new KeyframeEffect(effectNode, scaleSteps, timing);

	// creating sequential fade effects
	var fadeEffect = new SequenceEffect([fadeOut(previous), fadeIn(current)]);

	// grouping all the effects
	var allEffects = [scaleEffect, fadeEffect];

	// creating a GroupEffect
	var groupEffect = new GroupEffect(allEffects);

	// playing all animations within the group
	var anim = document.timeline.play(groupEffect);

	// when animation finishes the newColor becomes the header's new background color and the effectNode is removed from DOM
	anim.addEventListener('finish', function () {
		header.style.backgroundColor = newColor;
		header.removeChild(effectNode);
	});
}

// another effect for fading in new content
function fadeIn(target) {
	var steps = [{
		opacity: 0,
		transform: 'translate(0, 10em)'
	}, {
		opacity: 1,
		transform: 'translate(0)'
	}];
	var timing = {
		duration: 500,
		delay: -1000,
		fill: 'backwards',
		easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
	};
	return new KeyframeEffect(target, steps, timing);
}

// effect for fading out of previous content
function fadeOut(target) {
	var angle = Math.pow(Math.random() * 16 - 6, 3);
	var offset = Math.random() * 20 - 10;
	var transform = 'translate(' + offset + 'em, 20em) rotate(' + angle + 'deg) scale(0)';

	var steps = [{
		visibility: 'visible',
		opacity: 1,
		transform: 'none'
	}, {
		visibility: 'visible',
		opacity: 0,
		transform: transform
	}];
	var timing = {
		duration: 1500,
		easing: 'ease-in'
	};

	return new KeyframeEffect(target, steps, timing);
}