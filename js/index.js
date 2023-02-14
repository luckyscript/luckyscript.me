/**
 * Created by luckyscript on 2022/02/13.
 */


document.addEventListener("DOMContentLoaded", function () {
  setToggle();
}, false);

function loadScript(url, callback) {
  var script = document.createElement("script")
  script.type = "text/javascript";
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" ||
        script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = function () {
      callback();
    };
  }
  script.src = url;
  document.body.appendChild(script);
}

function setToggle() {

  var theme = window.theme || localStorage.getItem('theme');

  var userPrefers = getComputedStyle(document.documentElement).getPropertyValue('content');

  if (theme === "dark") {
    document.querySelector('#mode-toggle').className = 'react-toggle react-toggle--checked';
  } else if (theme === "light") {
    document.querySelector('#mode-toggle').className = 'react-toggle';
  } else if (userPrefers === "dark") {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.localStorage.setItem('theme', 'dark');
    document.querySelector('#mode-toggle').className = 'react-toggle react-toggle--checked';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    window.localStorage.setItem('theme', 'light');
    document.querySelector('#mode-toggle').className = 'react-toggle';
  }

  function setTheme() {
    var currentMode = document.documentElement.getAttribute('data-theme');
    var theme = currentMode === 'dark' ? 'light' : 'dark';
    if (currentMode === "dark") {
      document.documentElement.setAttribute('data-theme', 'light');
      window.localStorage.setItem('theme', 'light');
      document.querySelector('#mode-toggle').className = 'react-toggle';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      window.localStorage.setItem('theme', 'dark');
      document.querySelector('#mode-toggle').className = 'react-toggle react-toggle--checked';
    }

    function sendMessage(message) {
      const iframe = document.querySelector('iframe.giscus-frame');
      if (!iframe) return;
      iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }

    sendMessage({
      setConfig: {
        theme: theme
      }
    });
  }

  document.querySelector('#mode-toggle').addEventListener('click', function (e) {
    setTheme();
  })
}
