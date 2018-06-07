const tasks = require("run-task");
const phantom = require("phantom");

const timeout = ms => new Promise(res => setTimeout(res, ms));

function importInstagram(username, password) {

  (async function () {
    const instance = await phantom.create();

    try {
      const page = await instance.createPage();

      // Opening the login page
      page.setting.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";
      page.property("viewportSize", {
        width: 1024,
        height: 3000
      });
      await page.open("https:/instagram.com/accounts/login/");
      await timeout(4000); // let it load

      // Filling the login page
      const ig = await page.evaluate(function () {
        function getCoords(box) {
          return {
            x: box.left,
            y: box.top
          };
        }

        function getPosition(type, name) {
          var input = document.getElementsByTagName(type);
          for (var i = 0; i < input.length; i++) {
            if (name && input[i].name == name)
              return getCoords(input[i].getBoundingClientRect());
            else if (!name && input[i].className)
              return getCoords(input[i].getBoundingClientRect()); // this is for login button
          }
        }

        return {
          user: getPosition("input", "username"),
          pass: getPosition("input", "password"),
          login: getPosition("button")
        };
      });

      await page.sendEvent("click", ig.user.x, ig.user.y);
      await page.sendEvent("keypress", username);
      await page.sendEvent("click", ig.pass.x, ig.pass.y);
      await page.sendEvent("keypress", password);
      await page.sendEvent("click", ig.login.x, ig.login.y);

      await timeout(3000); // let it load

      // Load saved page
      await page.open(`https://www.instagram.com/${username}/saved/`);
      await timeout(3000); // let it load

      // Select saved urls
      const savedContent = await page.content;
      console.log(savedContent);

    } catch (e) {
      throw new Error(e);
    }
    await instance.exit();
  })();
}

tasks({
  importInstagram
});