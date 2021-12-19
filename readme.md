# Readme

## Setup
Remeber to run npm install on . and ./client.
```
ng build --output-path path/to/desired/location
```
is the build command but your probably already know that lmao.

## What I did lol
- So the two big files are /src/enviroments/environment.prod.ts and /src/assets/scss/config.scss.
- I tried to make config.scss as easily conifigurable as possible and used _logic.scss do the heavy lifting
- I renamed a few of the id/classes but they should still be straight forward. home -> landing, etc.. 
- The enviroment.prod.ts file has settings for the actual code/api
- It expects two API endpoints: getJson which is self explainitory and shouldUpdate which is there to update the style configuration from the server.
- When you run ng build angular generates a unique hash for each file. shouldUpdate expects the name of the css file that was generated.
- The app stores the name and checks again at a set interval. If the file name is different it reloads itself to get the new css.
- I tested this on the test server(.js) and it works as intended lol.

### Hopefully everything works out. Give me a holler if anything goes wrong. I used html 5 features whcih means IE wont like it but nothing should be using IE in 2021... If this is then ill change it. Its only a few things anyway.

