const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const memoryInput = document.getElementById("memoryInput");
const addMemoryBtn = document.getElementById("addMemoryBtn");

// 메시지 보내기
sendBtn.onclick = async () => {
  const text = userInput.value;
  if (!text) return;

  chat.innerHTML += `<div class="msg user">나: ${text}</div>`;
  userInput.value = "";

  const res = await fetch("http://localhost:3000/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text })
  });

  const data = await res.json();
  chat.innerHTML += `<div class="msg memory">죽은 사람: ${data.answer}</div>`;
  chat.scrollTop = chat.scrollHeight;
};

// 추억 추가
addMemoryBtn.onclick = async () => {
  const text = memoryInput.value;
  if (!text) return;

  await fetch("http://localhost:3000/add-memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  chat.innerHTML += `<div class="msg memory">[추억 추가됨]: ${text}</div>`;
  memoryInput.value = "";
  chat.scrollTop = chat.scrollHeight;
};
