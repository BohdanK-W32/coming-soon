(function (html) {
  'use strict';

  const config = {
    finalDate: 'February 1, 2023 00:00:00',
    mailChimpURL:
      'https://tech.us17.list-manage.com/subscribe/post?u=bacc7b7cd52c6b9b81c11eacd&amp;id=1d1e2fa314&amp;f_id=001e6fe0f0',
  };

  const preloader = function () {
    const body = document.querySelector('body');
    const preloader = document.querySelector('#preloader');
    const info = document.querySelector('.info');

    if (!(preloader && info)) return;

    html.classList.add('preload');

    window.addEventListener('load', function () {
      html.classList.remove('preload');
      html.classList.add('loaded');

      preloader.addEventListener('transitionstart', function gotoTop(e) {
        if (e.target.matches('#preloader')) {
          window.scrollTo(0, 0);
          preloader.removeEventListener(e.type, gotoTop);
        }
      });

      preloader.addEventListener('transitionend', function afterTransition(e) {
        if (e.target.matches('#preloader')) {
          body.classList.add('show');
          e.target.style.display = 'none';
          preloader.removeEventListener(e.type, afterTransition);
        }
      });
    });

    window.addEventListener('beforeunload', function () {
      body.classList.remove('show');
    });
  };

  const countdown = function () {
    const finalDate = new Date(config.finalDate).getTime();
    const daysSpan = document.querySelector('.counter .days');
    const hoursSpan = document.querySelector('.counter .hours');
    const minutesSpan = document.querySelector('.counter .minutes');
    const secondsSpan = document.querySelector('.counter .seconds');
    let timeInterval;

    if (!(daysSpan && hoursSpan && minutesSpan && secondsSpan)) return;

    function timer() {
      const now = new Date().getTime();
      let diff = finalDate - now;

      if (diff <= 0) {
        if (timeInterval) clearInterval(timeInterval);

        return;
      }

      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      let minutes = Math.floor((diff / 1000 / 60) % 60);
      let seconds = Math.floor((diff / 1000) % 60);

      if (days <= 9) days = '0' + days;

      hours <= 9 ? (hours = '0' + hours) : hours;
      minutes <= 9 ? (minutes = '0' + minutes) : minutes;
      seconds <= 9 ? (seconds = '0' + seconds) : seconds;

      daysSpan.textContent = days;
      hoursSpan.textContent = hours;
      minutesSpan.textContent = minutes;
      secondsSpan.textContent = seconds;
    }

    timer();
    timeInterval = setInterval(timer, 1000);
  };

  // MailChimp
  const mailChimpForm = function () {
    const mcForm = document.querySelector('#mc-form');

    if (!mcForm) return;

    mcForm.setAttribute('novalidate', true);

    function hasError(field) {
      if (
        field.disabled ||
        field.type === 'file' ||
        field.type === 'reset' ||
        field.type === 'submit' ||
        field.type === 'button'
      )
        return;

      let validity = field.validity;

      if (validity.valid) return;

      if (validity.valueMissing) return 'Please enter an email address.';

      if (validity.typeMismatch) {
        if (field.type === 'email') return 'Please enter a valid email address.';
      }

      if (validity.patternMismatch) {
        if (field.hasAttribute('title')) return field.getAttribute('title');

        return 'Please match the requested format.';
      }

      return 'The value you entered for this field is invalid.';
    }

    function showError(field, error) {
      let id = field.id || field.name;

      if (!id) return;

      let errorMessage = field.form.querySelector('.mc-status');

      errorMessage.classList.remove('succemessage');
      errorMessage.classList.add('error-message');
      errorMessage.innerHTML = error;
    }

    window.displayMailChimpStatus = function (data) {
      if (!data.result || !data.msg || !mcStatus) return;

      mcStatus.innerHTML = data.msg;

      if (data.result === 'error') {
        mcStatus.classList.remove('succemessage');
        mcStatus.classList.add('error-message');

        return;
      }

      mcStatus.classList.remove('error-message');
      mcStatus.classList.add('succemessage');
    };

    function submitMailChimpForm(form) {
      let url = config.mailChimpURL;
      let emailField = form.querySelector('#mce-EMAIL');
      let serialize = '&' + encodeURIComponent(emailField.name) + '=' + encodeURIComponent(emailField.value);

      if (url == '') return;

      url = url.replace('/post?u=', '/post-json?u=');
      url += serialize + '&c=displayMailChimpStatus';

      // Create script with url and callback (if specified)
      var ref = window.document.getElementsByTagName('script')[0];
      var script = window.document.createElement('script');
      script.src = url;

      // Create global variable for the status container
      window.mcStatus = form.querySelector('.mc-status');
      window.mcStatus.classList.remove('error-message', 'succemessage');
      window.mcStatus.innerText = 'Submitting...';

      // Insert script tag into the DOM
      ref.parentNode.insertBefore(script, ref);

      // After the script is loaded (and executed), remove it
      script.onload = function () {
        this.remove();
      };
    }

    // Check email field on submit
    mcForm.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();

        let emailField = event.target.querySelector('#mce-EMAIL');
        let error = hasError(emailField);

        if (error) {
          showError(emailField, error);
          emailField.focus();
          return;
        }

        submitMailChimpForm(this);
      },
      false
    );
  };

  /* Smooth Scrolling
   * ------------------------------------------------------ */
  const moveTo = function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      },
    };

    const triggers = document.querySelectorAll('.smoothscroll');

    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 600,
        easing: 'easeInOutCubic',
        container: window,
      },
      easeFunctions
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  };

  (function init() {
    preloader();
    countdown();
    mailChimpForm();
    moveTo();
  })();
})(document.documentElement);
