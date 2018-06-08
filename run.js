const tasks = require("run-task");

const timeout = ms => new Promise(res => setTimeout(res, ms));

function importInstagram() {
  // I'd love to automate instagram, but the official API
  // can't do it at this moment. I'll import a list manually regularly
  //
  // var linklist = document.querySelectorAll('article a')
  // for (i = 0; i < linklist.length; i++) { console.log(linklist[i].href) }
}
tasks({
  importInstagram
});