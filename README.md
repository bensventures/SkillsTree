# SkillsTree

Example of data organisation of the Pole Emploie ROM. Use the Pole Emploie's API to retrieve data and then display it in different ways

## Usage

This supposes you have `node.js` and `yarn` or `npm` installed;

* Clone or download repo
* from a commend line run `yarn install` or `npm install`
* Register at `https://www.emploi-store-dev.fr/portail-developpeur-cms/home.html` to get api access
* Create a file called `config.js` at the root with the following:
```
module.exports = {
    id: '[yourappid]',
    secret:  '[yourappsecret]',
};
```
* from a command line run `node access.js` to get a temporary token. The generated token will be outputed in the console.
* put the token in `getData.js`
* Uncomment one of the examples functions in getData.js. There are different methods to get different ressources, poke around.
* run `node getData.js` to generate a json file containing your data.
* run `webpack-dev-server` to start the frontend dev server
* open `localhost:8080` to see the visiualisation
* Change `app/app.js` to load different examples
