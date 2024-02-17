'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (K/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
    // these client height and width here are not counting with the scroll bars. It's dusty dimensions of the view port, that are actually available for the content. And of course that excludes any scroll bars.
  );

  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset, // current position + current scroll = absolute position of the element relative to the document (entire page)
  //   s1coords.top + window.pageYOffset // current position + current scroll =  absolute position of the element relative to the document (entire page)
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// So in event delegation, we use the fact that events bubble up. And we do that by putting the eventListener on a common parent of all the elements that we are interested in.

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

// tabs.forEach(t =>
//   t.addEventListener('click', function () {
//     console.log('TABS');
//   })
// ); // this is NOT advisable to do becuse if we have 20 tabs them the func will be repeated, so we use events delegation. In events delegation, we find the common parent and work with it.

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // null is the results of the closest method here when there is no matching parent element to be found.
  // console.log(clicked);

  // Guard clause
  if (!clicked) return; // when we have null which is a faulty value, then not faulty will become true and then the function will return and none of the code that's after it will be executed. This is called a guard clause

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate Tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
}); // the whole idea when we build components like this is to just add and remove classes is necessary to manipulate the content to our needs.

///////////////////////////////////////
// Menu Fade Animation
const handleHover = function (e) {
  // console.log(this, e.currentTarget); // So by default, this keyword is the same as the current target, so the element on which the event listener is attached to, but when we then set this keyword manually, of course, it becomes whatever we set it to.

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; // It is impossible to pass another argument into an eventHandler function. So any handler function like this one can only ever have one real argument. But if we want to pass additional values into the handler function, then we need to use the this keywords, like we just did here.
      logo.style.opacity = this;
    });
  }
};

// Passing 'argument' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5)); // recall, JavaScript expects here a function in the second parameter, remember that the bind method creates a copy of the function that it's called on, and it will set the this keyword in this function call to whatever value that we pass into bind, okay?

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // we have one threshold, so only one entry
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // So when 0% of the header here is visible, then we want something to happen.
  rootMargin: `-${navHeight}px`, // pixels is one of the only units that can be used here
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSections = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy Loading Images
// So, the main ingredient to this lazy loading strategy is that we have a very low resolution image, which is really small and which is loaded, right in the beginning.
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  erootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  // it is a good practice to keep this kind of functionality here, maybe in its own function.
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length; // and our node list slides, we can also read the length property, just like on an array.

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}' ></button>`
      );
    });
  }; // So basically, nicely organizing the entire code of this slider here into different functions.

  const activateDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

///////////////////////////////////////
// Selecting, Creating, and Deleting Elements
/*
// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header2 = document.querySelector('.header');
const allSections2 = document.querySelectorAll('.section');
console.log(allSections2);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // This method actually returns an HTML collection. So that's different from a node list because an HTML collection is actually a so-called life collection. And that means that if the DOM changes then this collection is also immediately updated automatically. Now the same does not happen with a node list, instead it's the opposite.
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); // returns a HTML collection

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <buttons class="btn btn--close-cookie">Got it</buttons>';

// header2.prepend(message);
header2.append(message); // So what this means is that we can use the prepend and append methods not only to insert elements but also to move them.
// header2.append(message.cloneNode(true));

// header2.before(message);
// header2.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message); // This way of moving up and down in the DOM tree like selecting, the parent element is called DOM traversing.
  });

// styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%'; //  These styles are actually set as inline styles, so styles set directly here in the DOM.

console.log(message.style.height); // This won't work because I didn't set the height property myself
console.log(message.style.backgroundColor); // Using the style property like this here only works for inline styles that we set ourselves also using this style property.

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src); // absolute link
console.log(logo.getAttribute('src')); // relative link

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
// So data, and data attributes are a special kind of attributes that start with the words data.
console.log(logo.dataset.versionNumber); // So for these special attributes, they are always stored in the dataset object

// Classes
logo.classList.add('c', 'j'); // you can also add multiple classes by passing in multiple values.
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use: this will override all the existing classes and also it allows us to only put one class on any element,
logo.className = 'Jonas';
*/

///////////////////////////////////////
// 190. Types of Events and Event Handlers
/*
// So, an event is basically a signal that is generated by a certain dumb node and a signal means that something has happened, for example, a click somewhere or the mouse moving, or the user triggering the full screen mode and really anything of importance, that happens on our webpage, generates an event.

const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1); // 1 -> addEventListener allows us to add multiple event listeners to the same event. 2 -> And the second one even more important is that we can actually remove an event handler in case we don't need it anymore.

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// }; // But if we added multiple event listeners to the same event with this property onmouseenter, then the second function would basically simply override the first one.
*/

///////////////////////////////////////
// Event Propagation in Practice
/*
// Now by default, events can only be handled in the target, and in the bubbling phase. However, we can set up event listeners in a way that they listen to events in the capturing phase instead. actually not all types of events that do have a capturing and bubbling phase. Some of them are created right on the target element, and so we can only handle them there. But really, most of the events do capture and bubble. We can also say that events propagate, which is really what capturing and bubbling is. It's events propagating from one place to another

// rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(); // the this keyword is also the one pointing to the element on which the EventListener is attached to.
  console.log('LINK', e.target, e.currentTarget); // the target is essentially where the event originated. So where the event first happened.
  console.log(e.currentTarget === this); // the this keyword and event.currentTarget are gonna be exactly the same in any event handler.

  // Stop propagaton
  // e.stopPropagation(); // that's usually not a good idea to stop propagation, So stopping the event propagation like this can sometimes fix problems in very complex applications with many handlers for the same events, but in general, it's not really a good idea to stop the propagation of events.
}); // remember that in an event handler that this keyword, points always to the element on which that event handler is attached. addEventListener method has a default behavior of only listening for events only in the bubbling phase

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
    console.log(e.currentTarget === this);
  }
  //, true // By default this is set to false And so in this case where this used capture parameter is set to true, the event handler will no longer listen to bubbling events, but instead, to capturing events. the NAV is now the first one to show up because this, of course, is the first one to happen. Because first event travels down all the way to the target and only then, it bubbles back up. So, as I said, capturing is actually rarely used these days.
);
*/

///////////////////////////////////////
// 194. DOM Traversing
/*
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // this would work no matter how deep these child elements would be inside of the h1 element. Okay, and also if there were other highlight elements on the page, so elements with this class, they would not get selected, because they would not be children of the h1 element.
console.log(h1.childNodes);
console.log(h1.children); // this one works only for direct children.
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)'; // querySelector, finds children, no matter how deep in the Dom tree, while the closest method finds parents no matter how far UP in the Dom tree.

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

///////////////////////////////////////
// Sticky Navigation
/*
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener('scroll', function () {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}); // using scroll event for performing a certain action at a certain position of the page is bad for perfomance because the scroll event here fires all the time, no matter how small the change is here in the scroll.
*/

///////////////////////////////////////
// Sticky Navigation: The Intersection Observer API
// This API allows our code to basically observe changes to the way that a certain target element intersects another element, or the way it intersects the viewport.
// /*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
}; // So this callback function here will get called each time that the observed element, so our target element here, is intersecting the root element at the threshold that we defined. So take note of this because this is actually a bit hard to figure out from reading the documentation.

const obsOptions = {
  root: null, // And this root is the element that the target is intersecting. The root will be null, because we are again interested in the entire viewport, and then the threshold.
  threshold: [0, 0.2], // this is basically the percentage of intersection at which the observer callback obsCallback will be called and it can contain multiple values
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); // this here section1 is the target, and the root element will be the element that we want our target element to intersect. Whenever the first section, so our target here, is intersecting the viewport at 10%, so the viewport, because that's the root, and 10% because that's the threshold. So whenever that happens, then the function obsCallback will get called and that's no matter if we are scrolling up or down
// */

///////////////////////////////////////
// Lifecycle DOM Events
/*
when we say lifecycle, we mean right from the moment that the page is first accessed, until the user leaves it. And let's do that right here at the end of this file. 
Now, the first event that we need to talk about is called DOM content loaded. And this event is fired by the document as soon as the HTML is completely parsed, which means that the HTML has been downloaded and been converted to the DOM tree. Also, all scripts must be downloaded and executed before the DOM content loaded event can happen. All right, now this event does actually not wait for images and other external resources to load.
So just HTML and JavaScript need to be loaded. this hear we can now execute code that should only be executed after the DOM is available.  Since when we have the script tag at the end of the HTML, then we do not need to listen for the DOM content loaded event. There is also the load event and the load event is fired by the window. As soon as not only the HTML is parsed, but also all the images and external resources like CSS files are also loaded.
*/
/*
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault(); // not necessary for chrome but for other browsers
  console.log(e);
  e.returnValue = '';
}); // And this event here is created immediately before a user is about to leave a page. So for example, after clicking the close button in the browser tab. So really please don't abuse this kind of feature because a message like this is of course pretty intrusive and it should only be displayed when necessary. So the only time you should prompt the user, if they really want to leave the page is in a situation in which data could actually be lost by accident.
*/

///////////////////////////////////////
// Efficient Script Loading: defer and async
/*
Never include the script in the head in the regular way. __p.g 49
So in practice, defer attribute loading time is similar to the async attribute, but with the key difference that would defer the HTML parsing is never interrupted, because the script is only executed at the end. async simply don't make sense there. Because in the body, fetching and executing the script always happens after parsing the HTML anyway. And so async and defer have no practical effect there. They will make no difference all right.

So one important thing about loading an async script is that the DOM content loaded event will not wait for the script to be downloaded and executed. In async, so the script that arrives first gets executed first.

using defer in the HTML head is overall the best solution. So you should use it for your own scripts. And for scripts where the order of execution is important. For example, if your script relies on some third party library that you need to include you will include that library before your own script, so that your script can then use the library's code. And in this case, you have to use defer and not async. Now, for third party scripts, where the order does not matter, for example, an analytics software like Google Analytics, or an ad script, or something like that, then in this case, you should totally use async. So for any code that your own code will not need to interact with async is just fine. So it's a good use case for this kind of scripts.

Okay, now, what's important to note is that only modern browsers support async and defer. And they will basically get ignored in older browsers. So if you need to support all browsers, then you need to put your script tag at the end of the body and not in the head. That's because this is actually not a JavaScript feature, but an HTML5 feature. And so you can't really work around this limitation, like you can do with modern JavaScript features by transpiling, or poly-filling.
*/
