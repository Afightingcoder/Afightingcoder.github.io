// server.js

// 服务器端代码 (Node.js + Express)

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { Console } = require('console');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 排行榜数据文件路径
const leaderboardFilePath = './leaderboard.json';

// 设置静态文件目录
app.use(express.static(__dirname));

// 字典存储每道题的答案
const answers = {
  1: 'b',
  2: 'c',
  3: 'c',
  4: 'a',
  5: 'd',
  6: 'c',
  7: 'b',
  8: 'a',
  9: 'c',
  10: 'c'
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Home.html');
});

// POST请求处理
app.post('/submitAnswer', (req, res) => {
  const questionNumber = req.body.questionNumber; // 获取题号
  const selectedOption = req.body.selectedOption; // 获取用户选择的选项
  const answer = answers[questionNumber]; // 获取题目的答案
  let result = '';

  if (selectedOption === answer) {
    result = 'Your answer is correct!';
  } else {
    result = 'Your answer is incorrect!';
  }

  res.send(result); // 将结果字符串发送回客户端
});

app.get('/nextQuestion', (req, res) => {
  currentQuestion++; // 增加当前题目的索引
  if (currentQuestion < questions.length) {
    const nextQuestion = questions[currentQuestion];
    res.send(nextQuestion); // 将下一题发送回客户端
  } else {
    res.send(showFinalResult); // 表示所有题目回答完毕
  }
});

// 处理提交排行榜数据的请求
app.post('/submitLeaderboardData', (req, res) => {
  const name = req.body.name;
  const correctAnswers = req.body.correctAnswers;
  const totalTime = req.body.totalTime;

  // 读取现有的排行榜数据
  let leaderboardData = [];
  try {
    leaderboardData = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf8'));
  } catch (error) {
    console.error('Failed to read leaderboard data:', error);
    res.status(500).send('Error');
    return;
  }

  // 创建新的排行榜数据对象
  const newEntry = {
    name: name,
    correctAnswers: correctAnswers,
    totalTime: totalTime
  };

  // 将新的排行榜数据添加到数组
  leaderboardData.push(newEntry);

  // 将更新后的排行榜数据写入文件
  try {
    fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboardData));
    console.log('Leaderboard data saved');
    res.send('Success');
  } catch (error) {
    console.error('Failed to save leaderboard data:', error);
    res.status(500).send('Error');
  }
});

// 获取排行榜数据的请求
app.get('/getLeaderboardData', (req, res) => {
  // 读取排行榜数据文件
  try {
    const leaderboardData = JSON.parse(fs.readFileSync(leaderboardFilePath, 'utf8'));
    res.json(leaderboardData);
  } catch (error) {
    console.error('Failed to get leaderboard data:', error);
    res.status(500).send('Error');
  }
});

// 启动服务器
app.listen(3000, () => {
  console.log('http://localhost:3000/');
});


