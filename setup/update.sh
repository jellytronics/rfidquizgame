cd ~/rfidquizgame
git pull
cd ~/rfidquizstash/website
cp ~/rfidquizgame/website/public/views/playQuiz.html ~/rfidquizstash/website/public/views/playQuiz.html
cp ~/rfidquizgame/website/public/controllers/playQuiz.js ~/rfidquizstash/website/public/controllers/playQuiz.js
cp ~/rfidquizgame/website/public/views/manageQuiz.html ~/rfidquizstash/website/public/views/manageQuiz.html
cp ~/rfidquizgame/website/public/controllers/manageQuiz.js ~/rfidquizstash/website/public/controllers/manageQuiz.js
cp ~/rfidquizgame/website/public/views/login.html ~/rfidquizstash/website/public/views/login.html
cp ~/rfidquizgame/website/public/controllers/login.js ~/rfidquizstash/website/public/controllers/login.js
cp ~/rfidquizgame/website/public/app.js ~/rfidquizstash/website/public/app.js
cp ~/rfidquizgame/website/server.js ~/rfidquizstash/website/server.js
cp ~/rfidquizgame/website/node_app.js ~/rfidquizstash/website/node_app.js
node ~/rfidquizstash/website/node_app.js
