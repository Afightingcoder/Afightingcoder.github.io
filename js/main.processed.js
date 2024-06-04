// main.processed.js
/// 定义问题和答案数组
const questions = [
  {
    question: "Question 1: What is the most spoken language in the world?",
    options: ["A. English", "B. Chinese", "C. Spanish", "D. German"],
  },{
      question: "Question 2: Which is the planet that has life in the solar system?",
      options: ["A. Mercury", "B. Venus", "C. Earth", "D. Jupiter"],
  }
  , {
      question: "Question 3: Which of the cities is a special administrative region?",
      options: ["A. ChengDu", "B. XiAn", "C. HongKong", "D. Wuhan"],
  }, {
      question: "Question 4: Which country is Cambridge University in?",
      options: ["A. The UK", "B. France", "C. Japan", "D. Italy"],
    }, 
    {
      question: "Question 5: Which of the instruments is not a string instrument?",
      options: ["A. Violin", "B. Viola", "C. Cello", "D. Trumpet"],
    }, 
    {
      question: "Question 6: Full English Breakfast is not included:",
      options: ["A. Beef", "B. Chicken", "C. Pancake", "D. Toast"],
    }, 
    {
      question: "Question 7: Which of the established British department stores was founded first?",
      options: ["A. Liberty", "B. Fortnum & Mason", "C. Harrods", "D. Burberry"],
    }, 
    {
      question: "Question 8: In British English, 'football' is",
      options: ["A. football", "B. soccer", "C. rugby", "D. Tennis"],
    }, 
    {
      question: "Question 9: Which place is known as'Back Garden of London'?",
      options: ["A. Kent", "B. York", "C. Brighton", "D. Aberdeen"],
    }, 
    {
      question: "Question 10: What is the capital of Northern Ireland?",
      options: ["A. Cardiff", "B. Dublin", "C. Belfast", "D. Edinburgh"],
    },
  ];
  
  let currentQuestion = 0;
  let correctAnswers = 0;
  var timer;
  var totalTime = 0;
  var startTime;
  let leaderboardData = [];
  
  function startGame() {
    const nameInput = document.getElementById("nameInput");
    const bt=document.getElementById("bt");
    const questionContainer = document.getElementById("questionContainer");
    
    // leaderboardData = []; // 清空排行榜数据
  
    const name = nameInput.value;
    if (name.trim() === "") {
      alert("Please input your name:");
      return;
    }
  
    nameInput.disabled = true; 
    nameInput.style.display="none";
    bt.style.display="none";
    questionContainer.style.display = "block";
    
    nameHeading.style.display = "none"; // 隐藏<h1>元素
    Heading.style.display="none";
    showQuestion();
  }
  
  function showQuestion() {
    startTime = Date.now(); // 记录开始答题的时间
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const resultElement = document.getElementById("result");
    const nextButton = document.getElementById("nextButton");
  
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
  
    optionsElement.innerHTML = "";
    for (let i = 0; i < question.options.length; i++) {
      const option = question.options[i];
      const button = document.createElement("button");
      button.classList.add("custom-button");
      button.textContent = option;
      button.addEventListener("click", () => selectOption(i));
      optionsElement.appendChild(button);
    }
  
    resultElement.textContent = ""; // 清空上一题的答案情况
  
    nextButton.style.display = "none"; // 隐藏下一个问题按钮
  
    timer = startTimer(); // 启动倒计时
    
  }
  
  function startTimer() {
    const timerElement = document.getElementById("timer");
    let timeLeft = 15;
    timerElement.textContent = `Time to answer: ${timeLeft}s`;
  
    const timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `Time to answer:${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(timer);
        submitAnswer();
      }
    }, 1000);
  
    return timer;
  }
  
  function selectOption(index) {
    const options = document.querySelectorAll("#options button");
    options.forEach((option, i) => {
      if (i === index) {
        option.classList.add("selected");
        option.style.backgroundColor = '#eb7da7'; // 浅蓝色背景
      } else {
        option.classList.remove("selected");
        option.style.backgroundColor = '#5c85f1'; 
      }
    });
  }
  
  function submitAnswer() {
    clearInterval(timer);
    
    const endTime = Date.now(); // 记录答题结束的时间
    const questionTime = (endTime - startTime) / 1000; // 计算答题用时（单位：秒）
    totalTime += questionTime; // 累加到总用时中

    const options = document.querySelectorAll("#options button");
    let selectedOption = '';
    options.forEach((option, index) => {
      if (option.classList.contains("selected")) {
        selectedOption = String.fromCharCode(97 + index); // 将选项索引转换为字母
      }
    });
  
    const questionNumber = currentQuestion + 1; // 当前题目的题号
    const data = {
      questionNumber: questionNumber,
      selectedOption: selectedOption
    }; // 构造请求数据
  
    fetch('/submitAnswer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // 将数据转为 JSON 字符串并作为请求体发送
    })
      .then(response => response.text()) // 解析响应的文本数据
      .then(result => {
        if (result === 'Your answer is correct!') {
          correctAnswers++; // 回答正确，将correctAnswers加1
        }
        displayResult(result); // 显示结果
        if (currentQuestion === questions.length - 1) {
          // 最后一题
          document.getElementById('nextButton').style.display = 'none'; // 隐藏下一题按钮
          showFinalResult(); // 显示总体结果
        } else {
          document.getElementById('nextButton').style.display = 'block'; // 显示下一题按钮
        }
      })
      .catch(error => {
        console.error('请求出错:', error);
      });
  }
  
  function showNextQuestion() {
    clearInterval(timer);
  
    currentQuestion++; // 增加当前题目的索引
    if (currentQuestion < questions.length) {
      showQuestion(); // 显示下一题
      document.getElementById('nextButton').style.display = 'none'; // 隐藏下一题按钮
      document.getElementById('result').innerText = ''; // 清空回答结果
    }
  }

  function displayResult(result) {
    const resultElement = document.getElementById("result");
    resultElement.textContent = result;
  }
  
  function showFinalResult() {
    const questionContainer = document.getElementById("questionContainer");
    const resultContainer = document.getElementById("resultContainer");
    const resultElement = document.getElementById("questionResult");
    questionContainer.style.display = "none";
    resultContainer.style.display = "block";
  
    // 设置结果显示文本
    resultElement.textContent = `You completed all the questions! You got ${correctAnswers}  right out of ${questions.length}.`;
  
    const nameInput = document.getElementById("nameInput");
    const name = nameInput.value;
  
    // 将玩家姓名、总用时、正确答案数提交到服务器保存排行榜数据
    const leaderboardData = {
      name: name,
      totalTime: totalTime.toFixed(2),
      correctAnswers: correctAnswers,
    };
  
    fetch("/submitLeaderboardData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaderboardData),
    })
      .then((response) => response.json())
      .then((updatedLeaderboardData) => {
        console.log(updatedLeaderboardData);
        displayLeaderboard(updatedLeaderboardData); // 使用更新后的排行榜数据进行渲染
      })
      .catch((error) => {
        console.log(error);
      });
  }

function displayLeaderboard(leaderboard) {
  const leaderboardContainer = document.getElementById("leaderboardContainer");
  leaderboardContainer.innerHTML = ""; // 清空排行榜容器

  const title = document.createElement("h1");
  title.textContent = "Ranking List";
  leaderboardContainer.appendChild(title);
  const table = document.createElement("table");
  table.classList.add("leaderboard-table"); // 添加样式类名
  const headerRow = document.createElement("tr");
  headerRow.classList.add("leaderboard-header"); // 添加样式类名
  const rankHeader = document.createElement("th");
  rankHeader.textContent = "Ranking";
  const nameHeader = document.createElement("th");
  nameHeader.textContent = "Name";
  const timeHeader = document.createElement("th");
  timeHeader.textContent = "Total Time";
  const correctHeader = document.createElement("th");
  correctHeader.textContent = "Correct Answers";
  headerRow.appendChild(rankHeader);
  headerRow.appendChild(nameHeader);
  headerRow.appendChild(timeHeader);
  headerRow.appendChild(correctHeader);
  table.appendChild(headerRow);

  leaderboard.forEach((entry, index) => {
    const row = document.createElement("tr");
    const rankCell = document.createElement("td");
    rankCell.textContent = index + 1;
    const nameCell = document.createElement("td");
    nameCell.textContent = entry.name;
    const timeCell = document.createElement("td");
    timeCell.textContent = entry.totalTime;
    const correctCell = document.createElement("td");
    correctCell.textContent = entry.correctAnswers;
    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(timeCell);
    row.appendChild(correctCell);
    table.appendChild(row);
  });

  leaderboardContainer.appendChild(table);

  const restartButton = document.createElement("button");
  restartButton.textContent = "Restart Quiz.";
  restartButton.id = "restartQuizButton";
  leaderboardContainer.appendChild(restartButton);

  document.getElementById("restartQuizButton").addEventListener("click", function() {
  
  // 清空排行榜和结果容器
  document.getElementById("leaderboardContainer").innerHTML = "";
  document.getElementById("resultContainer").style.display = "none";

  // 重置页面状态，例如重置计时器、题目计数器等
  correctAnswers = 0; // 假设这是记录正确答案数量的变量
  totalTime = 0; 
  startTime== Date.now();
  currentQuestion = 0; // 假设这是当前题目计数器

  // 重新显示题目容器
  document.getElementById("questionContainer").style.display = "block";

  // 重置按钮状态
  document.getElementById("bt").disabled = false;

  // 重新开始答题
  startGame();
});
}


window.addEventListener("load", () => {
  const submitButton = document.getElementById("submitButton");
  submitButton.addEventListener("click", () => {
    if (currentQuestion === questions.length - 1) {
      setTimeout(async () => {
        try {
          const response = await fetch('/getLeaderboardData');
          const leaderboardData = await response.json();
          const sortedLeaderboard = sortLeaderboard(leaderboardData);
          displayLeaderboard(leaderboardData);
        } catch (error) {
          console.error('请求出错:', error);
        }
      }, 50); // 延迟0.05秒等待写入
    }
  });
});

function sortLeaderboard(leaderboardData) {
  return leaderboardData.sort((a, b) => {
    // 按答对题数进行降序排序
    if (a.correctAnswers > b.correctAnswers) {
      return -1;
    } else if (a.correctAnswers < b.correctAnswers) {
      return 1;
    }

    // 在答对题数相同的情况下，按用时进行降序排序
    if (a.totalTime < b.totalTime) {
      return -1;
    } else if (a.totalTime > b.totalTime) {
      return 1;
    }

    return 0;
  });
}


