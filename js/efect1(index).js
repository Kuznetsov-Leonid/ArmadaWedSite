window.addEventListener('load', () => {
    let current = null;
    const header = document.querySelector('header');
  
    // handler function for making the selected section visible
    function updateVisibleSection() {
      const hash = '' + location.hash;
      let section;
  
      // checking the hash to select the correct section
      if (hash.length) {
        section = document.querySelector(`section[name="${hash.substr(1)}"]`);
      } else {
        section = document.querySelector(`section`);
      }
      if (!section) {return;}
  
      // selecting the correct link
      const link = header.querySelector(`a[href="#${section.getAttribute('name')}"]`);
  
      // updating previously and currently active section
      const previous = current;
      current = section;
  
      // resetting all sections hidden attribute
      const allSections = Array.from(document.querySelectorAll('.section'));
      for (let i of allSections) {
        i.setAttribute('hidden', '');
      }
  
      // making the correct section visible
      current.removeAttribute('hidden');
      // for keeping the z-index correct
      document.body.appendChild(current);
  
      // resetting all links
      const allLinks = Array.from(header.querySelectorAll('a'));
      for (let i of allLinks) {
        i.className = '';
      }
  
      // active link selection
      if (link) {link.className = 'active';}
  
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
    const effectNode = document.createElement('div');
    effectNode.className = 'circleEffect';
  
    // Element.getBoundingClientRect() method returns an object containing the size of an element and its position relative to the viewport
    const bounds = link.getBoundingClientRect();
  
    // setting the coordinates for the absolutely positioned effectNode
    effectNode.style.left = `${bounds.left + bounds.width / 2}px`;
    effectNode.style.top = `${bounds.top + bounds.height / 2}px`;
  
    // appending the effectNode child to the header
    header.appendChild(effectNode);
  
    // choosing a random color everytime
    const newColor = `hsl(${Math.round(Math.random() * 255)}, 46%, 42%)`;
    effectNode.style.background = newColor;
  
    // the animation properties
    const scaleSteps = [
    { transform: 'scale(0)' },
    { transform: 'scale(1)' }];
  
    const timing = {
      duration: 1000,
      easing: 'ease-in-out' };
  
  
    // creates a KeyframeEffect that encapsulates our change to effectNode, without implicitly playing the animation
    const scaleEffect = new KeyframeEffect(effectNode, scaleSteps, timing);
  
    // creating sequential fade effects
    const fadeEffect = new SequenceEffect([fadeOut(previous), fadeIn(current)]);
  
    // grouping all the effects
    const allEffects = [scaleEffect, fadeEffect];
  
    // creating a GroupEffect
    const groupEffect = new GroupEffect(allEffects);
  
    // playing all animations within the group
    const anim = document.timeline.play(groupEffect);
  
    // when animation finishes the newColor becomes the header's new background color and the effectNode is removed from DOM
    anim.addEventListener('finish', () => {
      header.style.backgroundColor = newColor;
      header.removeChild(effectNode);
    });
  }
  
  // another effect for fading in new content
  function fadeIn(target) {
    const steps = [
    {
      opacity: 0,
      transform: 'translate(0, 10em)' },
  
    {
      opacity: 1,
      transform: 'translate(0)' }];
  
  
    const timing = {
      duration: 500,
      delay: -1000,
      fill: 'backwards',
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' };
  
    return new KeyframeEffect(target, steps, timing);
  }
  
  // effect for fading out of previous content
  function fadeOut(target) {
    const angle = Math.pow(Math.random() * 16 - 6, 3);
    const offset = Math.random() * 20 - 10;
    const transform = `translate(${offset}em, 20em) rotate(${angle}deg) scale(0)`;
  
    const steps = [
    {
      visibility: 'visible',
      opacity: 1,
      transform: 'none' },
  
    {
      visibility: 'visible',
      opacity: 0,
      transform: transform }];
  
  
    const timing = {
      duration: 1500,
      easing: 'ease-in' };
  
  
    return new KeyframeEffect(target, steps, timing);
  }