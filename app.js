import { supabase, supabaseConfigured } from './supabase-client.js';
import { strFromU8, unzipSync } from 'fflate';

const problems = [
  {
    title: '합계 구하기', category: '입출력', level: '입문',
    description: '숫자 N개가 주어집니다.\n주어진 숫자들의 합을 구해 출력해 보세요.',
    input: '첫째 줄에 숫자의 개수 N이 주어집니다.\n둘째 줄에 N개의 정수가 공백으로 구분되어 주어집니다.',
    output: 'N개의 정수의 합을 출력합니다.',
    sampleInput: '5\n1 2 3 4 5', sampleOutput: '15',
    hint: '둘째 줄은 split()과 map(int, ...)을 이용하면 편하게 숫자로 바꿀 수 있어요.',
    interpretation: { given: '개수 N과 정수 N개가 차례로 주어집니다.', goal: '정수들을 모두 더한 하나의 값을 출력하는 문제예요.', steps: ['먼저 몇 개의 숫자가 입력되는지 확인하세요.', '정수 목록을 빠짐없이 살펴보세요.', '각 숫자를 합친 뒤 결과 하나를 출력하세요.'] },
    solution: 'n = int(input())\nnumbers = list(map(int, input().split()))\nprint(sum(numbers))\n',
    starter: 'n = int(input())\nnumbers = list(map(int, input().split()))\n\n# 숫자들의 합을 출력해 보세요\n',
    tests: [ ['3\n1 2 3\n','6'], ['5\n1 2 3 4 5\n','15'], ['4\n10 -2 7 0\n','15'], ['1\n42\n','42'], ['6\n100 200 300 400 500 600\n','2100'] ]
  },
  {
    title: '짝수는 몇 개일까?', category: '조건문', level: '입문',
    description: '여러 개의 정수가 주어질 때, 그중 짝수가 몇 개인지 세어 보세요.\n짝수는 2로 나누었을 때 나머지가 0인 수입니다.',
    input: '첫째 줄에 정수의 개수 N이 주어집니다.\n둘째 줄에 N개의 정수가 공백으로 구분되어 주어집니다.',
    output: '짝수의 개수를 출력합니다.',
    sampleInput: '6\n1 2 3 4 5 6', sampleOutput: '3',
    hint: '숫자마다 나머지 연산자 %를 사용해 짝수인지 확인해 보세요.',
    interpretation: { given: '정수의 개수와 정수 목록이 주어집니다.', goal: '목록에서 짝수의 개수를 세는 문제예요.', steps: ['숫자를 하나씩 확인하세요.', '2로 나누어떨어지는 수만 골라 표시하세요.', '표시한 수가 몇 개인지 출력하세요.'] },
    solution: 'n = int(input())\nnumbers = list(map(int, input().split()))\nprint(sum(1 for number in numbers if number % 2 == 0))\n',
    starter: 'n = int(input())\nnumbers = list(map(int, input().split()))\n\n# 짝수의 개수를 출력해 보세요\n',
    tests: [ ['6\n1 2 3 4 5 6\n','3'], ['4\n2 4 6 8\n','4'], ['5\n1 3 5 7 9\n','0'], ['3\n0 -2 7\n','2'], ['1\n100\n','1'] ]
  },
  {
    title: '구구단 출력하기', category: '반복문', level: '입문',
    description: '정수 N이 주어집니다.\nN단의 구구단을 1부터 9까지 차례대로 출력해 보세요.',
    input: '한 줄에 정수 N이 주어집니다. (2 ≤ N ≤ 9)',
    output: 'N × 1부터 N × 9까지의 결과를 한 줄에 하나씩 출력합니다.',
    sampleInput: '3', sampleOutput: '3\n6\n9\n12\n15\n18\n21\n24\n27',
    hint: 'range(1, 10)으로 1부터 9까지 반복할 수 있어요.',
    interpretation: { given: '구구단의 기준이 되는 정수 N 하나가 주어집니다.', goal: 'N에 1부터 9까지를 곱한 결과를 순서대로 출력하는 문제예요.', steps: ['곱하는 수가 1에서 시작해 9까지 변합니다.', '각 단계마다 N과 현재 곱하는 수의 결과를 구하세요.', '각 결과를 한 줄씩 출력하세요.'] },
    solution: 'n = int(input())\nfor i in range(1, 10):\n    print(n * i)\n',
    starter: 'n = int(input())\n\nfor i in range(1, 10):\n    # 계산 결과를 출력해 보세요\n    pass\n',
    tests: [ ['2\n','2\n4\n6\n8\n10\n12\n14\n16\n18'], ['3\n','3\n6\n9\n12\n15\n18\n21\n24\n27'], ['7\n','7\n14\n21\n28\n35\n42\n49\n56\n63'], ['9\n','9\n18\n27\n36\n45\n54\n63\n72\n81'] ]
  },
  {
    title: '가장 큰 수 찾기', category: '리스트', level: '입문',
    description: '여러 개의 정수 중에서 가장 큰 수를 찾아 출력해 보세요.\n모든 수는 서로 다르지 않을 수 있습니다.',
    input: '첫째 줄에 정수의 개수 N이 주어집니다.\n둘째 줄에 N개의 정수가 공백으로 구분되어 주어집니다.',
    output: '주어진 정수 중 가장 큰 수를 출력합니다.',
    sampleInput: '5\n3 17 -2 8 11', sampleOutput: '17',
    hint: '파이썬의 max() 함수에 리스트를 넣으면 가장 큰 값을 찾을 수 있어요.',
    interpretation: { given: '비교할 정수 N개가 주어집니다.', goal: '주어진 수 가운데 가장 큰 값 하나를 찾는 문제예요.', steps: ['처음 값을 기준으로 삼으세요.', '나머지 수와 비교하며 더 큰 값이 나오면 기준을 바꾸세요.', '끝까지 확인한 뒤 가장 큰 값을 출력하세요.'] },
    solution: 'n = int(input())\nnumbers = list(map(int, input().split()))\nprint(max(numbers))\n',
    starter: 'n = int(input())\nnumbers = list(map(int, input().split()))\n\n# 가장 큰 수를 출력해 보세요\n',
    tests: [ ['5\n3 17 -2 8 11\n','17'], ['4\n-8 -3 -12 -1\n','-1'], ['1\n7\n','7'], ['5\n9 9 2 9 1\n','9'], ['6\n100 50 250 30 200 10\n','250'] ]
  },
  {
    title: '거꾸로 읽어도 같은 단어', category: '문자열', level: '기초',
    description: '단어 하나가 주어집니다.\n앞에서 읽어도 뒤에서 읽어도 같은 단어인지 확인해 보세요.\n예를 들어 "level"은 같은 단어입니다.',
    input: '알파벳 소문자로 이루어진 단어 하나가 주어집니다.',
    output: '앞뒤가 같으면 YES, 다르면 NO를 출력합니다.',
    sampleInput: 'level', sampleOutput: 'YES',
    hint: '문자열[::-1]은 문자열을 거꾸로 뒤집은 결과예요.',
    interpretation: { given: '영어 소문자로 이루어진 단어 하나가 주어집니다.', goal: '단어를 거꾸로 읽었을 때 원래 단어와 같은지 판단하는 문제예요.', steps: ['단어의 양 끝 글자부터 비교해 보세요.', '가운데로 이동하면서 다른 글자가 있는지 확인하세요.', '모두 같으면 YES, 다르면 NO를 출력하세요.'] },
    solution: 'word = input().strip()\nprint("YES" if word == word[::-1] else "NO")\n',
    starter: 'word = input().strip()\n\n# 앞뒤가 같은지 확인해 보세요\n',
    tests: [ ['level\n','YES'], ['python\n','NO'], ['a\n','YES'], ['racecar\n','YES'], ['abba\n','YES'], ['hello\n','NO'] ]
  },
  {
    title: '별 계단 만들기', category: '반복문', level: '기초',
    description: '정수 N이 주어지면 별(*)을 이용해 계단을 만들어 보세요.\n첫째 줄에는 별 하나, 다음 줄에는 별 두 개를 출력하는 식으로 늘어납니다.',
    input: '한 줄에 계단의 높이 N이 주어집니다. (1 ≤ N ≤ 20)',
    output: '총 N줄의 계단을 출력합니다.',
    sampleInput: '4', sampleOutput: '*\n**\n***\n****',
    hint: '문자열에 정수를 곱하면 그만큼 반복할 수 있어요. 예: "*" * 3',
    interpretation: { given: '계단의 높이 N이 주어집니다.', goal: '첫 줄부터 마지막 줄까지 별의 개수가 하나씩 늘어나는 모양을 출력하는 문제예요.', steps: ['출력할 줄 번호를 1부터 N까지 생각하세요.', '각 줄의 별 개수는 그 줄 번호와 같습니다.', '줄마다 별을 출력하고 다음 줄로 넘어가세요.'] },
    solution: 'n = int(input())\nfor i in range(1, n + 1):\n    print("*" * i)\n',
    starter: 'n = int(input())\n\nfor i in range(1, n + 1):\n    # 별을 출력해 보세요\n    pass\n',
    tests: [ ['1\n','*'], ['3\n','*\n**\n***'], ['4\n','*\n**\n***\n****'], ['6\n','*\n**\n***\n****\n*****\n******'] ]
  },
  {
    title: '평균과 등급', category: '계산', level: '기초',
    description: '학생들의 점수가 주어집니다. 점수의 평균과 평균에 맞는 등급을 구해 보세요.\n90점 이상은 A, 80점 이상은 B, 70점 이상은 C, 60점 이상은 D, 그 미만은 F입니다.',
    input: '첫째 줄에 점수의 개수 N이 주어집니다.\n둘째 줄에 0점 이상 100점 이하의 점수 N개가 주어집니다.',
    output: '첫째 줄에 평균을 소수점 첫째 자리까지 출력합니다.\n둘째 줄에 등급을 출력합니다.',
    sampleInput: '4\n80 90 70 100', sampleOutput: '85.0\nB',
    hint: '평균을 먼저 구한 뒤 if, elif, else로 등급을 나눠 보세요.',
    interpretation: { given: '학생 수와 각 학생의 점수가 주어집니다.', goal: '평균 점수를 구하고, 평균이 속한 구간의 등급도 출력하는 문제예요.', steps: ['모든 점수를 더해 학생 수로 나누세요.', '평균을 문제에서 요구한 소수점 자리로 표시하세요.', '점수 구간을 높은 기준부터 확인해 등급을 정하세요.'] },
    solution: 'n = int(input())\nscores = list(map(int, input().split()))\naverage = sum(scores) / n\nif average >= 90:\n    grade = "A"\nelif average >= 80:\n    grade = "B"\nelif average >= 70:\n    grade = "C"\nelif average >= 60:\n    grade = "D"\nelse:\n    grade = "F"\nprint(f"{average:.1f}")\nprint(grade)\n',
    starter: 'n = int(input())\nscores = list(map(int, input().split()))\naverage = sum(scores) / n\n\n# 평균과 등급을 출력해 보세요\n',
    tests: [ ['4\n80 90 70 100\n','85.0\nB'], ['3\n100 100 100\n','100.0\nA'], ['2\n60 60\n','60.0\nD'], ['4\n50 50 50 50\n','50.0\nF'], ['5\n70 70 70 70 71\n','70.2\nC'] ]
  },
  {
    title: '모음 세기', category: '문자열', level: '기초',
    description: '영어 문장이 한 줄 주어집니다.\n문장에 들어 있는 모음 a, e, i, o, u의 개수를 세어 보세요. 대문자 모음도 포함합니다.',
    input: '영문자와 공백으로 이루어진 문장 한 줄이 주어집니다.',
    output: '문장에 포함된 모음의 개수를 출력합니다.',
    sampleInput: 'Hello World', sampleOutput: '3',
    hint: '각 글자를 하나씩 살펴보고, "aeiou" 안에 있는지 확인하면 돼요.',
    interpretation: { given: '공백을 포함한 영어 문장 한 줄이 주어집니다.', goal: '문장 속 모음의 총개수를 세는 문제예요.', steps: ['문장을 글자 단위로 확인하세요.', '대문자와 소문자를 모두 모음으로 처리하세요.', '모음에 해당하는 글자 수만 출력하세요.'] },
    solution: 'sentence = input()\nprint(sum(1 for letter in sentence.lower() if letter in "aeiou"))\n',
    starter: 'sentence = input()\n\n# 모음의 개수를 세어 출력해 보세요\n',
    tests: [ ['Hello World\n','3'], ['AEIOU\n','5'], ['rhythm\n','0'], ['Python is fun!\n','3'], ['Education\n','5'] ]
  },
  {
    title: '동전으로 거스름돈', category: '그리디', level: '도전',
    description: '편의점에서 거스름돈을 동전으로 돌려주려고 합니다.\n500원, 100원, 50원, 10원 동전을 사용해 필요한 동전 수를 가장 적게 만들어 보세요.',
    input: '거스름돈 금액 N이 한 줄에 주어집니다. N은 10의 배수입니다.',
    output: '필요한 동전의 최소 개수를 출력합니다.',
    sampleInput: '1260', sampleOutput: '6',
    hint: '가장 큰 동전부터 최대한 사용하는 방법을 생각해 보세요.',
    interpretation: { given: '10의 배수인 거스름돈 금액이 주어집니다.', goal: '정해진 네 종류의 동전으로 동전 개수를 최소화하는 문제예요.', steps: ['사용할 수 있는 동전을 큰 금액부터 살펴보세요.', '현재 남은 금액에서 각 동전을 몇 개 쓸지 정하세요.', '동전 개수를 모두 더해 출력하세요.'] },
    solution: 'change = int(input())\ncount = 0\nfor coin in [500, 100, 50, 10]:\n    count += change // coin\n    change %= coin\nprint(count)\n',
    starter: 'change = int(input())\ncoins = [500, 100, 50, 10]\ncount = 0\n\n# 동전 개수를 구해 출력해 보세요\n',
    tests: [ ['1260\n','6'], ['700\n','3'], ['40\n','4'], ['1860\n','8'], ['990\n','10'], ['10\n','1'] ]
  },
  {
    title: '숫자 뒤집기', category: '문자열', level: '도전',
    description: '양의 정수 하나가 주어집니다.\n숫자의 순서를 거꾸로 바꾸어 출력해 보세요. 뒤집은 결과의 맨 앞에 오는 0은 생략합니다.',
    input: '양의 정수 N이 한 줄에 주어집니다. (1 ≤ N ≤ 1,000,000,000)',
    output: '숫자를 거꾸로 뒤집은 정수를 출력합니다.',
    sampleInput: '1200', sampleOutput: '21',
    hint: '문자열로 바꾼 뒤 뒤집고, 다시 int로 바꾸면 앞의 0이 사라져요.',
    interpretation: { given: '양의 정수 N 하나가 주어집니다.', goal: '숫자 자리의 순서를 반대로 바꾼 정수를 출력하는 문제예요.', steps: ['숫자를 왼쪽에서 오른쪽 순서로 살펴보세요.', '마지막 자리부터 거꾸로 읽는 순서를 생각하세요.', '뒤집은 결과 맨 앞의 0은 출력하지 않도록 하세요.'] },
    solution: 'number = input().strip()\nprint(int(number[::-1]))\n',
    starter: 'number = input().strip()\n\n# 숫자를 뒤집어 출력해 보세요\n',
    tests: [ ['1200\n','21'], ['12345\n','54321'], ['7\n','7'], ['1001\n','1001'], ['908070\n','70809'] ]
  }
];

const listElement = document.querySelector('#problem-list');
const editor = document.querySelector('#code-editor');
const submitButton = document.querySelector('#submit-button');
const submitLabel = document.querySelector('#submit-label');
const resultPanel = document.querySelector('#result-panel');
const runtimePill = document.querySelector('#runtime-pill');
const runtimeLabel = document.querySelector('#runtime-label');
let activeProblem = 0;
let worker;
let runtimeReady = false;
let isSubmitting = false;
let timeoutId;
const storagePrefix = 'codemaru-python-';
const interpretationCache = new Map();
let activeUser = null;
let activeProfile = null;
let authSyncId = 0;
let historyUserId = null;
let loginMode = 'student';
let studentLoginInProgress = false;
const authDialog = document.querySelector('#auth-dialog');
const accountButton = document.querySelector('#account-button');
const historyOpenButton = document.querySelector('#history-open-button');

function solvedStorageKey() {
  return activeUser ? `codemaru-solved-${activeUser.id}` : 'codemaru-solved';
}

function codeStorageKey(index = activeProblem) {
  return `${storagePrefix}${activeUser?.id ?? 'guest'}-${index}`;
}

function getSolved() {
  try {
    const value = JSON.parse(localStorage.getItem(solvedStorageKey()) || '[]');
    return Array.isArray(value) ? value.filter(index => Number.isInteger(index) && index >= 0 && index < problems.length) : [];
  }
  catch { return []; }
}

function saveSolved(index) {
  const solved = getSolved();
  if (solved.includes(index)) return;
  solved.push(index);
  localStorage.setItem(solvedStorageKey(), JSON.stringify(solved));
  if (activeUser && supabase) {
    supabase.from('problem_progress').insert({ user_id: activeUser.id, problem_id: index + 1 })
      .then(({ error }) => {
        if (error) document.querySelector('#save-indicator').textContent = '계정 저장 실패';
        else document.querySelector('#save-indicator').textContent = '계정에 저장됨';
      });
  }
}

function getUnlockedIndex() {
  const solved = new Set(getSolved());
  const firstUnsolved = problems.findIndex((_, index) => !solved.has(index));
  return firstUnsolved === -1 ? problems.length - 1 : firstUnsolved;
}

function renderProblemList() {
  const solved = getSolved();
  const unlockedIndex = getUnlockedIndex();
  listElement.innerHTML = problems.map((problem, index) => {
    const locked = index > unlockedIndex;
    return `
    <button class="problem-item${index === activeProblem ? ' active' : ''}${solved.includes(index) ? ' solved' : ''}${locked ? ' locked' : ''}" type="button" data-index="${index}" aria-current="${index === activeProblem ? 'page' : 'false'}" aria-label="문제 ${String(index + 1).padStart(2, '0')}: ${problem.title}${locked ? ', 다음 문제를 먼저 해결하세요' : solved.includes(index) ? ', 해결함' : ''}"${locked ? ' disabled' : ''}>
      <span class="problem-index">${String(index + 1).padStart(2, '0')}</span>
      <span class="problem-item-copy"><span class="problem-item-title">${problem.title}</span><span class="problem-item-meta">${problem.category} · ${problem.level}</span></span>
      ${locked ? '<span class="problem-lock">대기</span>' : solved.includes(index) ? '<span class="problem-check" aria-hidden="true">✓</span>' : ''}
    </button>`;
  }).join('');
  listElement.querySelectorAll('.problem-item').forEach(button => {
    button.addEventListener('click', () => selectProblem(Number(button.dataset.index)));
  });
  const count = solved.length;
  document.querySelector('#progress-count').textContent = `${count} / ${problems.length}`;
  document.querySelector('#progress-fill').style.width = `${count / problems.length * 100}%`;
}

function selectProblem(index) {
  if (isSubmitting || index < 0 || index > getUnlockedIndex()) return;
  activeProblem = (index + problems.length) % problems.length;
  const problem = problems[activeProblem];
  document.querySelector('#problem-category').textContent = problem.category;
  document.querySelector('#problem-level').textContent = problem.level;
  document.querySelector('#problem-number').textContent = `문제 ${String(activeProblem + 1).padStart(2, '0')}`;
  document.querySelector('#problem-title').textContent = problem.title;
  document.querySelector('#problem-description').textContent = problem.description;
  document.querySelector('#interpret-given').textContent = problem.interpretation.given;
  document.querySelector('#interpret-goal').textContent = problem.interpretation.goal;
  document.querySelector('#interpret-steps').replaceChildren(...problem.interpretation.steps.map(step => {
    const item = document.createElement('li');
    item.textContent = step;
    return item;
  }));
  document.querySelector('#interpret-panel').hidden = true;
  document.querySelector('#interpret-button').setAttribute('aria-expanded', 'false');
  document.querySelector('#problem-input').textContent = problem.input;
  document.querySelector('#problem-output').textContent = problem.output;
  document.querySelector('#sample-input').textContent = problem.sampleInput;
  document.querySelector('#sample-output').textContent = problem.sampleOutput;
  document.querySelector('#problem-hint').textContent = problem.hint;
  updateProblemNavigation();
  document.querySelector('#solved-stamp').hidden = !getSolved().includes(activeProblem);
  editor.value = localStorage.getItem(codeStorageKey()) ?? (!activeUser ? localStorage.getItem(storagePrefix + activeProblem) : null) ?? problem.starter;
  resultPanel.hidden = true;
  updateLineNumbers();
  renderProblemList();
}

function updateProblemNavigation() {
  document.querySelector('#position-label').textContent = `${activeProblem + 1} / ${problems.length}`;
  document.querySelector('#previous-button').disabled = activeProblem === 0;
  document.querySelector('#next-button').disabled = activeProblem >= getUnlockedIndex() || activeProblem === problems.length - 1;
}

function updateLineNumbers() {
  const lineCount = editor.value.split('\n').length;
  document.querySelector('#line-numbers').textContent = Array.from({ length: lineCount }, (_, index) => index + 1).join('\n');
}

function setRuntimeState(state, label) {
  runtimePill.classList.toggle('ready', state === 'ready');
  runtimePill.classList.toggle('error', state === 'error');
  runtimeLabel.textContent = label;
  if (state === 'ready') {
    runtimeReady = true;
    submitButton.disabled = false;
    submitLabel.textContent = '코드 제출하기';
  } else if (state === 'error') {
    runtimeReady = false;
    submitButton.disabled = true;
    submitLabel.textContent = '실행 환경을 불러오지 못했어요';
  }
}

function createWorker() {
  worker = new Worker(new URL('./judge-worker.js', import.meta.url));
  worker.addEventListener('message', event => {
    const message = event.data;
    if (message.type === 'ready') {
      setRuntimeState('ready', 'Python 실행 준비 완료');
    } else if (message.type === 'result') {
      clearTimeout(timeoutId);
      finishSubmission(message.results);
    } else if (message.type === 'fatal') {
      clearTimeout(timeoutId);
      finishSubmission(null, message.error);
    }
  });
  worker.addEventListener('error', event => {
    clearTimeout(timeoutId);
    if (isSubmitting) finishSubmission(null, event.message || '실행 환경에서 오류가 발생했어요.');
    else setRuntimeState('error', 'Python을 불러오지 못했어요');
  });
}

function showResults(results, runtimeError) {
  resultPanel.hidden = false;
  if (runtimeError) {
    resultPanel.className = 'result-panel result-failed';
    resultPanel.dataset.tutorError = runtimeError;
    resultPanel.dataset.passed = '0';
    resultPanel.dataset.total = '0';
    resultPanel.innerHTML = `<div class="result-heading"><div class="result-title"><span aria-hidden="true">!</span> 실행 오류</div><span class="result-summary">다시 확인해 주세요</span></div><pre class="error-output"></pre><div class="tutor-actions"><button class="tutor-action-button" type="button" data-tutor-intent="error">오류 설명 받기</button><span>누르면 오류 내용만 튜터에 전달돼요.</span></div>${tutorPanelMarkup()}`;
    resultPanel.querySelector('.error-output').textContent = runtimeError;
    return;
  }
  if (activeUser && supabase) {
    const passed = results.filter(result => result.pass).length;
    const verdict = results.some(result => result.error) ? 'runtime_error' : passed === results.length ? 'accepted' : 'wrong_answer';
    supabase.from('submissions').insert({
      user_id: activeUser.id,
      problem_id: activeProblem + 1,
      source_code: editor.value,
      verdict,
      passed_tests: passed,
      total_tests: results.length
    }).then(({ error }) => {
      document.querySelector('#save-indicator').textContent = error ? '제출 기록 저장 실패' : '제출 기록 저장됨';
    });
  }
  const passed = results.filter(result => result.pass).length;
  const accepted = passed === results.length;
  const errorResult = results.find(result => result.error);
  const tutorIntent = accepted ? '' : errorResult ? 'error' : 'hint';
  resultPanel.dataset.tutorError = errorResult?.error ?? '';
  resultPanel.dataset.passed = String(passed);
  resultPanel.dataset.total = String(results.length);
  resultPanel.className = `result-panel ${accepted ? 'result-accepted' : 'result-failed'}`;
  const tutorActions = tutorIntent
    ? `<div class="tutor-actions"><button class="tutor-action-button" type="button" data-tutor-intent="${tutorIntent}">${tutorIntent === 'error' ? '오류 설명 받기' : '풀이 힌트 받기'}</button><span>${tutorIntent === 'error' ? '오류 원인만 설명하고 코드는 작성하지 않아요.' : '힌트는 한 번에 한 단계씩 제공돼요.'}</span></div>${tutorPanelMarkup()}`
    : '';
  resultPanel.innerHTML = `<div class="result-heading"><div class="result-title"><span aria-hidden="true">${accepted ? '✓' : '×'}</span> ${accepted ? '정답입니다!' : '아직 정답이 아니에요'}</div><span class="result-summary">${passed} / ${results.length} 테스트 통과</span></div><p class="result-detail">${accepted ? '모든 테스트케이스를 통과했어요. 다음 문제도 풀어볼까요?' : '출력 형식과 문제 조건을 다시 확인하고 고쳐보세요.'}</p><div class="test-results">${results.map((result, index) => `<span class="test-chip ${result.pass ? 'pass' : 'fail'}">테스트 ${index + 1}<b>${result.pass ? '통과' : result.error ? '오류' : '실패'}</b></span>`).join('')}</div>${errorResult ? '<pre class="error-output"></pre>' : ''}${tutorActions}`;
  if (errorResult) resultPanel.querySelector('.error-output').textContent = errorResult.error;
  if (accepted) {
    saveSolved(activeProblem);
    document.querySelector('#solved-stamp').hidden = false;
    renderProblemList();
    updateProblemNavigation();
  }
}

function tutorPanelMarkup() {
  return `<section class="attempt-tutor-panel" data-tutor-panel hidden><p class="tutor-status" data-tutor-status role="status"></p><div class="tutor-output"><div><span>파악한 점</span><p data-tutor-summary></p></div><div><span>다음 한 걸음</span><p data-tutor-next></p></div><div><span>생각해 볼 질문</span><p data-tutor-question></p></div></div></section>`;
}

function fillTutorPanel(panel, answer) {
  panel.querySelector('[data-tutor-summary]').textContent = answer.summary;
  panel.querySelector('[data-tutor-next]').textContent = answer.nextStep;
  const question = panel.querySelector('[data-tutor-question]');
  if (question.tagName === 'OL') {
    const item = document.createElement('li');
    item.textContent = answer.question;
    question.replaceChildren(item);
  } else {
    question.textContent = answer.question;
  }
}

async function requestTutor(kind, panel, options = {}) {
  if (!panel) return null;
  panel.hidden = false;
  const status = panel.querySelector('[data-tutor-status], #interpret-status');
  status.classList.remove('error');
  status.textContent = 'AI 튜터가 생각 중이에요...';
  const sessionResult = supabase ? await supabase.auth.getSession() : null;
  const accessToken = sessionResult?.data?.session?.access_token;
  if (!activeUser || !accessToken) {
    status.textContent = '학번 PIN 또는 교사 계정으로 로그인한 뒤 이용해 주세요.';
    status.classList.add('error');
    return null;
  }
  const problemId = activeProblem + 1;
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: kind,
        problemId,
        code: kind === 'interpret' ? '' : editor.value.slice(0, 5000),
        passedTests: Number(resultPanel.dataset.passed || 0),
        totalTests: Number(resultPanel.dataset.total || 0),
        errorMessage: options.errorMessage ?? resultPanel.dataset.tutorError ?? ''
      })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || '튜터 요청을 처리하지 못했어요.');
    fillTutorPanel(panel, payload.answer);
    status.textContent = kind === 'hint' && Number.isInteger(payload.remainingHints)
      ? `힌트를 받았어요 · 이 문제에 남은 단계별 힌트 ${payload.remainingHints}회`
      : '현재 문제에만 한정해 설명했어요. 정답 코드는 제공하지 않아요.';
    return payload.answer;
  } catch (error) {
    status.textContent = error.message || 'AI 튜터에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
    status.classList.add('error');
    if (kind === 'interpret') {
      const fallback = problems[activeProblem].interpretation;
      document.querySelector('#interpret-given').textContent = fallback.given;
      document.querySelector('#interpret-goal').textContent = fallback.goal;
      document.querySelector('#interpret-steps').replaceChildren(...fallback.steps.map(step => {
        const item = document.createElement('li');
        item.textContent = step;
        return item;
      }));
      status.textContent += ' 미리 준비된 문제 해석을 대신 보여드립니다.';
    }
    return null;
  }
}

function finishSubmission(results, error) {
  clearTimeout(timeoutId);
  isSubmitting = false;
  submitButton.disabled = !runtimeReady;
  submitLabel.textContent = runtimeReady ? '코드 제출하기' : 'Python 준비 중';
  showResults(results, error);
}

function submitCode() {
  if (!runtimeReady || isSubmitting) return;
  isSubmitting = true;
  submitButton.disabled = true;
  submitLabel.textContent = '테스트케이스 확인 중...';
  resultPanel.hidden = true;
  const tests = problems[activeProblem].tests.map(([input, expected]) => ({ input, expected }));
  worker.postMessage({ type: 'judge', code: editor.value, tests });
  timeoutId = setTimeout(() => {
    worker.terminate();
    finishSubmission(null, '실행 시간이 너무 길어요. 반복문이 끝나지 않는지 확인해 주세요.');
    createWorker();
  }, 8000);
}

editor.addEventListener('input', () => {
  localStorage.setItem(codeStorageKey(), editor.value);
  document.querySelector('#save-indicator').textContent = '자동 저장됨';
  updateLineNumbers();
});
editor.addEventListener('scroll', () => {
  document.querySelector('#line-numbers').scrollTop = editor.scrollTop;
});
editor.addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.setRangeText('    ', start, end, 'end');
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    submitCode();
  }
});
submitButton.addEventListener('click', submitCode);
document.querySelector('#interpret-button').addEventListener('click', event => {
  const panel = document.querySelector('#interpret-panel');
  const expanded = panel.hidden;
  panel.hidden = !expanded;
  event.currentTarget.setAttribute('aria-expanded', String(expanded));
  if (!expanded) return;
  const cached = interpretationCache.get(activeProblem);
  if (cached) {
    fillTutorPanel(panel, cached);
    document.querySelector('#interpret-status').textContent = '이 문제의 AI 해석을 불러왔어요.';
  } else {
    void requestTutor('interpret', panel).then(answer => {
      if (answer) interpretationCache.set(activeProblem, answer);
    });
  }
});
resultPanel.addEventListener('click', event => {
  const button = event.target.closest('[data-tutor-intent]');
  if (!button) return;
  button.disabled = true;
  const panel = resultPanel.querySelector('[data-tutor-panel]');
  void requestTutor(button.dataset.tutorIntent, panel).finally(() => {
    button.disabled = false;
  });
});
document.querySelector('#previous-button').addEventListener('click', () => selectProblem(activeProblem - 1));
document.querySelector('#next-button').addEventListener('click', () => selectProblem(activeProblem + 1));
document.querySelector('#reset-button').addEventListener('click', () => {
  editor.value = problems[activeProblem].starter;
  localStorage.setItem(codeStorageKey(), editor.value);
  resultPanel.hidden = true;
  updateLineNumbers();
  editor.focus();
});
document.querySelector('#answer-button').addEventListener('click', () => {
  editor.value = problems[activeProblem].solution;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  document.querySelector('#save-indicator').textContent = '모범 답안을 입력했어요';
  resultPanel.hidden = true;
  editor.focus();
});

function setAuthMessage(message, isError = false) {
  const target = document.querySelector('#auth-message');
  target.textContent = message;
  target.classList.toggle('error', isError);
}

function explainAuthError(error) {
  const message = error?.message ?? String(error);
  const normalized = message.toLowerCase();
  if (normalized.includes('email address not authorized')) {
    return 'Supabase 기본 메일러는 프로젝트 팀 주소로만 보낼 수 있어요. 교사 이메일이 팀 주소인지 확인하거나 SMTP를 설정해 주세요.';
  }
  if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
    return '이메일 발송 한도에 도달했어요. 잠시 기다리거나 Supabase Auth에 별도 SMTP 메일 서비스를 연결해 주세요.';
  }
  if (normalized.includes('redirect_to_not_allowed') || normalized.includes('redirect url')) {
    return '로그인 링크가 돌아올 주소가 허용되지 않았어요. Supabase Auth의 Redirect URLs에 현재 웹앱 주소를 추가해 주세요.';
  }
  if (normalized.includes('anonymous') && normalized.includes('disabled')) {
    return '학생 PIN 로그인을 사용하려면 Supabase Auth에서 Anonymous Sign-Ins를 켜야 합니다.';
  }
  return `로그인 링크를 보내지 못했어요: ${message}`;
}

function updateAccountUI() {
  if (historyUserId !== (activeUser?.id ?? null)) {
    historyUserId = activeUser?.id ?? null;
    document.querySelector('#history-panel').hidden = true;
    document.querySelector('#history-list').replaceChildren();
  }
  accountButton.disabled = false;
  accountButton.textContent = activeUser ? '내 계정' : '로그인';
  accountButton.classList.toggle('signed-in', Boolean(activeUser));
  document.querySelector('#storage-note').textContent = activeUser
    ? '풀이 기록과 제출 코드가 계정에 저장돼요.'
    : '로그인 전 기록은 이 기기에만 저장돼요.';
  document.querySelector('#login-mode-switch').hidden = Boolean(activeUser);
  document.querySelector('#student-login-form').hidden = Boolean(activeUser) || loginMode !== 'student';
  document.querySelector('#teacher-pin-login-form').hidden = Boolean(activeUser) || loginMode !== 'teacherPin';
  document.querySelector('#auth-form').hidden = Boolean(activeUser) || loginMode !== 'teacherEmail';
  document.querySelector('#signed-in-panel').hidden = !activeUser;
  document.querySelector('#signed-in-email').textContent = activeUser?.is_anonymous
    ? activeProfile?.role === 'teacher' ? '교사 ID 로그인' : '학생 PIN 로그인'
    : activeUser?.email ?? '';
  document.querySelector('#profile-details').textContent = activeProfile
    ? `${activeProfile.display_name || '이름 미등록'} · ${activeProfile.student_number || '학번 미등록'}`
    : '';
  document.querySelector('#profile-completion-form').hidden = !activeUser || activeProfile?.role === 'teacher' || Boolean(activeProfile?.student_number && activeProfile?.display_name);
  document.querySelector('#teacher-dashboard-button').hidden = activeProfile?.role !== 'teacher';
  document.querySelector('#auth-email').disabled = !supabaseConfigured;
  document.querySelector('#auth-submit').disabled = !supabaseConfigured;
  document.querySelector('#student-login-submit').disabled = !supabaseConfigured;
  document.querySelector('#teacher-pin-login-submit').disabled = !supabaseConfigured;
  document.querySelector('#auth-description').textContent = loginMode === 'student'
    ? '교사가 명단에 등록하고 발급한 학번과 4자리 PIN으로 로그인해요.'
    : loginMode === 'teacherPin'
      ? 'SQL Editor에서 발급한 테스트 교사 아이디와 비밀번호로 로그인해요.'
      : '기존 관리 교사는 이메일 로그인 링크로 접속할 수 있어요.';
  if (!supabaseConfigured) setAuthMessage('Supabase 프로젝트 연결 정보를 먼저 설정해 주세요.', true);
  else setAuthMessage(loginMode === 'student'
    ? 'PIN을 잊어버리면 교사에게 재발급을 요청하세요.'
    : loginMode === 'teacherPin' ? '아이디와 비밀번호는 대소문자를 구분합니다.' : '교사 이메일 주소를 입력해 로그인 링크를 받으세요.');
}

async function loadAccountProgress(user) {
  const requestId = ++authSyncId;
  if (!user || !supabase) return;
  const [profileResult, progressResult] = await Promise.all([
    supabase.from('profiles').select('student_number, display_name, role').eq('id', user.id).maybeSingle(),
    supabase.from('problem_progress').select('problem_id').eq('user_id', user.id)
  ]);
  if (requestId !== authSyncId || activeUser?.id !== user.id) return;
  if (profileResult.error || progressResult.error) {
    document.querySelector('#save-indicator').textContent = '계정 기록을 불러오지 못했어요';
    return;
  }
  activeProfile = profileResult.data;
  document.querySelector('#profile-student-number').value = activeProfile?.student_number ?? '';
  document.querySelector('#profile-display-name').value = activeProfile?.display_name ?? '';
  document.querySelector('#profile-message').textContent = activeProfile?.student_number
    ? ''
    : '학번과 이름을 등록하면 교사가 풀이 현황을 확인할 수 있어요.';
  updateAccountUI();
  const solved = new Set(getSolved());
  progressResult.data.forEach(row => solved.add(row.problem_id - 1));
  localStorage.setItem(solvedStorageKey(), JSON.stringify([...solved]));
  renderProblemList();
  if (activeProblem > getUnlockedIndex()) selectProblem(getUnlockedIndex());
  else {
    document.querySelector('#solved-stamp').hidden = !getSolved().includes(activeProblem);
    updateProblemNavigation();
  }
  document.querySelector('#save-indicator').textContent = '계정 기록 불러옴';
}

function activateAuthUser(user) {
  if (activeUser?.id === user.id) return;
  activeUser = user;
  activeProfile = null;
  updateAccountUI();
  void loadAccountProgress(user);
}

async function restoreAnonymousStudent(user) {
  const { data, error } = await supabase.rpc('student_session_is_linked');
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session?.user.id !== user.id) return;
  if (!error && data === true) activateAuthUser(user);
  else if (activeUser?.id === user.id) {
    activeUser = null;
    activeProfile = null;
    updateAccountUI();
  }
}

async function loadTeacherRoster() {
  if (!activeUser || activeProfile?.role !== 'teacher' || !supabase) return;
  const status = document.querySelector('#teacher-status');
  const rows = document.querySelector('#teacher-rows');
  status.textContent = '학생 정보를 불러오는 중...';
  rows.replaceChildren();
  const { data, error } = await supabase.rpc('teacher_roster_stats');
  if (activeProfile?.role !== 'teacher') return;
  if (error) {
    status.textContent = '학생 목록을 불러오지 못했어요. student-pin.sql 적용 여부를 확인해 주세요.';
    return;
  }
  status.textContent = data.length ? `명단 ${data.length}명` : '등록된 학생이 아직 없습니다. CSV 또는 Excel 파일을 올려주세요.';
  data.forEach(student => {
    const row = document.createElement('tr');
    [student.class_name || '—', student.student_number, student.display_name, student.account_linked ? '연결됨' : '미연결', student.pin_issued ? '발급됨' : '미발급', `${student.solved_count} / ${problems.length}`, student.submission_count].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.append(cell);
    });
    const actionCell = document.createElement('td');
    const issueButton = document.createElement('button');
    issueButton.className = 'pin-issue-button';
    issueButton.type = 'button';
    issueButton.dataset.studentNumber = student.student_number;
    issueButton.textContent = student.pin_issued ? '재발급' : 'PIN 발급';
    actionCell.append(issueButton);
    row.append(actionCell);
    rows.append(row);
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i++) {
    const character = source[i];
    if (character === '"') {
      if (quoted && source[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && source[i + 1] === '\n') i++;
      row.push(field);
      if (row.some(value => String(value).trim())) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }
  row.push(field);
  if (row.some(value => String(value).trim())) rows.push(row);
  if (quoted) throw new Error('CSV 파일의 따옴표 짝이 맞지 않습니다.');
  return rows;
}

function xlsxPath(target) {
  const parts = (target.startsWith('/') ? target.slice(1) : `xl/${target}`).split('/');
  const path = [];
  parts.forEach(part => {
    if (part === '..') path.pop();
    else if (part !== '.' && part) path.push(part);
  });
  return path.join('/');
}

function parseXlsx(buffer) {
  const entries = unzipSync(new Uint8Array(buffer));
  const xml = path => {
    const bytes = entries[path];
    if (!bytes) throw new Error(`Excel 시트 파일을 읽을 수 없습니다: ${path}`);
    const document = new DOMParser().parseFromString(strFromU8(bytes), 'application/xml');
    if (document.querySelector('parsererror')) throw new Error('Excel 파일의 XML 형식이 올바르지 않습니다.');
    return document;
  };
  const workbook = xml('xl/workbook.xml');
  const firstSheet = workbook.getElementsByTagNameNS('*', 'sheet')[0];
  if (!firstSheet) throw new Error('Excel 파일에 시트가 없습니다.');
  const relationId = firstSheet.getAttribute('r:id') || [...firstSheet.attributes].find(attribute => attribute.localName === 'id')?.value;
  const relationships = xml('xl/_rels/workbook.xml.rels');
  const relation = [...relationships.getElementsByTagNameNS('*', 'Relationship')].find(item => item.getAttribute('Id') === relationId);
  if (!relation) throw new Error('Excel 파일에서 첫 번째 시트를 찾을 수 없습니다.');
  const sheet = xml(xlsxPath(relation.getAttribute('Target')));
  const sharedStrings = entries['xl/sharedStrings.xml']
    ? [...xml('xl/sharedStrings.xml').getElementsByTagNameNS('*', 'si')].map(item => [...item.getElementsByTagNameNS('*', 't')].map(text => text.textContent).join(''))
    : [];
  const rows = [...sheet.getElementsByTagNameNS('*', 'sheetData')[0]?.getElementsByTagNameNS('*', 'row') ?? []];
  return rows.map(sourceRow => {
    const values = [];
    [...sourceRow.getElementsByTagNameNS('*', 'c')].forEach(cell => {
      const columnLetters = cell.getAttribute('r').match(/^[A-Z]+/i)?.[0] ?? 'A';
      const columnIndex = [...columnLetters.toUpperCase()].reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1;
      const type = cell.getAttribute('t');
      const value = type === 'inlineStr'
        ? [...cell.getElementsByTagNameNS('*', 't')].map(text => text.textContent).join('')
        : cell.getElementsByTagNameNS('*', 'v')[0]?.textContent ?? '';
      values[columnIndex] = type === 's' ? sharedStrings[Number(value)] ?? '' : value;
    });
    return values;
  }).filter(row => row.some(value => String(value ?? '').trim()));
}

async function parseRosterFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'csv') return parseCsv(await file.text());
  if (extension === 'xlsx') return parseXlsx(await file.arrayBuffer());
  throw new Error('CSV(.csv) 또는 Excel 통합 문서(.xlsx) 파일을 선택해 주세요.');
}

function normalizeRosterRows(rows) {
  if (rows.length < 2) throw new Error('첫 줄에 열 제목이 있고, 그 아래에 학생 정보가 있어야 합니다.');
  const aliases = {
    student_number: ['학번', '학생번호', '번호', 'studentnumber', 'studentid', 'id'],
    display_name: ['이름', '성명', '학생이름', 'name', 'displayname', 'studentname'],
    class_name: ['반', '학급', '학급명', 'class', 'classname', 'class_name']
  };
  const normalize = value => String(value ?? '').trim().toLowerCase().replace(/[\s_-]/g, '');
  const columns = {};
  rows[0].forEach((heading, index) => {
    const key = Object.keys(aliases).find(field => aliases[field].some(alias => normalize(alias) === normalize(heading)));
    if (key && columns[key] === undefined) columns[key] = index;
  });
  if (columns.student_number === undefined || columns.display_name === undefined) {
    throw new Error('열 제목에서 학번과 이름을 찾지 못했습니다. CSV 양식을 확인해 주세요.');
  }
  const records = [];
  const seen = new Set();
  rows.slice(1).forEach((values, index) => {
    const studentNumber = String(values[columns.student_number] ?? '').trim();
    const displayName = String(values[columns.display_name] ?? '').trim();
    if (!studentNumber && !displayName) return;
    if (!studentNumber || !displayName) throw new Error(`${index + 2}번째 줄에 학번 또는 이름이 비어 있습니다.`);
    if (seen.has(studentNumber)) throw new Error(`파일 안에 학번 ${studentNumber}이(가) 중복되어 있습니다.`);
    seen.add(studentNumber);
    records.push({
      student_number: studentNumber,
      display_name: displayName,
      class_name: columns.class_name === undefined ? null : String(values[columns.class_name] ?? '').trim() || null
    });
  });
  if (!records.length) throw new Error('파일에 올릴 학생 정보가 없습니다.');
  return records;
}

async function importStudentRoster() {
  if (!activeUser || activeProfile?.role !== 'teacher' || !supabase) return;
  const fileInput = document.querySelector('#roster-file');
  const button = document.querySelector('#roster-import-button');
  const message = document.querySelector('#roster-import-status');
  const file = fileInput.files[0];
  if (!file) return;
  button.disabled = true;
  button.textContent = '명단을 확인하는 중...';
  message.textContent = '';
  message.classList.remove('error');
  try {
    const records = normalizeRosterRows(await parseRosterFile(file));
    const payload = records.map(record => ({ ...record, imported_by: activeUser.id }));
    const { error } = await supabase.from('student_roster').upsert(payload, { onConflict: 'student_number' });
    if (error) throw new Error('저장하지 못했어요. student-roster.sql 적용 여부와 교사 권한을 확인해 주세요.');
    await loadTeacherRoster();
    message.textContent = `${records.length}명의 학생을 등록하거나 최신 정보로 갱신했어요.`;
    fileInput.value = '';
  } catch (error) {
    message.textContent = error.message || '파일을 읽지 못했습니다.';
    message.classList.add('error');
  } finally {
    button.disabled = !fileInput.files.length;
    button.textContent = '명단 올리기';
    if (!fileInput.files.length) document.querySelector('#roster-file-name').textContent = '파일을 선택해 주세요.';
  }
}

function downloadRosterTemplate() {
  const csv = '\uFEFF학번,이름,반\r\n';
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'student-roster-template.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function loadSubmissionHistory() {
  if (!activeUser || !supabase) return;
  const userId = activeUser.id;
  const summary = document.querySelector('#history-summary');
  const list = document.querySelector('#history-list');
  summary.textContent = '학습 기록을 불러오고 있어요.';
  list.replaceChildren();
  document.querySelector('#history-panel').hidden = false;
  const [progressResult, submissionsResult] = await Promise.all([
    supabase.from('problem_progress').select('problem_id').eq('user_id', userId),
    supabase.from('submissions').select('problem_id, verdict, passed_tests, total_tests, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
  ]);
  if (activeUser?.id !== userId) return;
  if (progressResult.error || submissionsResult.error) {
    summary.textContent = '기록을 불러오지 못했어요. Supabase 테이블과 접근 정책을 확인해 주세요.';
    summary.classList.add('history-error');
    return;
  }
  summary.classList.remove('history-error');
  summary.textContent = `해결 ${progressResult.data.length} / ${problems.length}문제 · 최근 제출 ${submissionsResult.data.length}건`;
  if (!submissionsResult.data.length) {
    const empty = document.createElement('li');
    empty.className = 'history-empty';
    empty.textContent = '아직 제출 기록이 없습니다.';
    list.append(empty);
    return;
  }
  const verdictLabels = { accepted: '통과', wrong_answer: '오답', runtime_error: '실행 오류' };
  submissionsResult.data.forEach(record => {
    const item = document.createElement('li');
    item.className = `history-item ${record.verdict}`;
    const title = problems[record.problem_id - 1]?.title ?? `문제 ${record.problem_id}`;
    const time = new Date(record.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    item.innerHTML = `<div class="history-item-top"><span></span><span class="history-verdict"></span></div><p></p>`;
    item.querySelector('.history-item-top > span:first-child').textContent = title;
    item.querySelector('.history-verdict').textContent = verdictLabels[record.verdict] ?? '제출';
    item.querySelector('p').textContent = `${record.passed_tests} / ${record.total_tests} 테스트 통과 · ${time}`;
    list.append(item);
  });
}

accountButton.addEventListener('click', () => {
  updateAccountUI();
  authDialog.showModal();
});
document.querySelector('#auth-close').addEventListener('click', () => authDialog.close());
function setLoginMode(mode) {
  loginMode = mode;
  document.querySelector('#student-mode-button').classList.toggle('active', mode === 'student');
  document.querySelector('#teacher-pin-mode-button').classList.toggle('active', mode === 'teacherPin');
  document.querySelector('#teacher-mode-button').classList.toggle('active', mode === 'teacherEmail');
  document.querySelector('#student-mode-button').setAttribute('aria-pressed', String(mode === 'student'));
  document.querySelector('#teacher-pin-mode-button').setAttribute('aria-pressed', String(mode === 'teacherPin'));
  document.querySelector('#teacher-mode-button').setAttribute('aria-pressed', String(mode === 'teacherEmail'));
  document.querySelector('#auth-title').textContent = mode === 'student'
    ? '학생 로그인'
    : mode === 'teacherPin' ? '교사 ID 로그인' : '교사 이메일 로그인';
  updateAccountUI();
}
document.querySelector('#student-mode-button').addEventListener('click', () => setLoginMode('student'));
document.querySelector('#teacher-pin-mode-button').addEventListener('click', () => setLoginMode('teacherPin'));
document.querySelector('#teacher-mode-button').addEventListener('click', () => setLoginMode('teacherEmail'));
document.querySelector('#student-login-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase || studentLoginInProgress) return;
  const studentNumber = document.querySelector('#student-login-number').value.trim();
  const pin = document.querySelector('#student-login-pin').value;
  const button = document.querySelector('#student-login-submit');
  button.disabled = true;
  button.textContent = '로그인 확인 중...';
  studentLoginInProgress = true;
  try {
    const { data: current } = await supabase.auth.getSession();
    let session = current.session;
    if (session && !session.user.is_anonymous) {
      setAuthMessage('먼저 현재 계정에서 로그아웃해 주세요.', true);
      return;
    }
    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        const message = error.message.toLowerCase();
        setAuthMessage(message.includes('anonymous')
          ? 'Supabase Auth의 User Signups에서 Allow new users to sign up과 Anonymous Sign-Ins를 모두 켜고 저장해 주세요.'
          : `로그인을 시작하지 못했어요: ${error.message}`, true);
        return;
      }
      session = data.session;
    }
    const { data: accepted, error } = await supabase.rpc('student_pin_login', {
      p_student_number: studentNumber,
      p_pin: pin
    });
    if (error) {
      setAuthMessage('학생 PIN 설정이 아직 적용되지 않았어요. Supabase에서 student-pin.sql을 실행해 주세요.', true);
      return;
    }
    if (!accepted) {
      setAuthMessage('학번과 PIN을 확인해 주세요. PIN을 5회 틀리면 15분 동안 잠깁니다.', true);
      return;
    }
    const { data: signedIn } = await supabase.auth.getSession();
    if (!signedIn.session) {
      setAuthMessage('로그인 세션을 만들지 못했어요. 다시 시도해 주세요.', true);
      return;
    }
    activateAuthUser(signedIn.session.user);
    document.querySelector('#student-login-pin').value = '';
    authDialog.close();
  } catch {
    setAuthMessage('로그인 중 연결 오류가 발생했어요. 잠시 후 다시 시도해 주세요.', true);
  } finally {
    studentLoginInProgress = false;
    button.disabled = !supabaseConfigured;
    button.textContent = '학생 로그인';
  }
});
document.querySelector('#teacher-pin-login-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase || studentLoginInProgress) return;
  const username = document.querySelector('#teacher-login-id').value.trim().toLowerCase();
  const password = document.querySelector('#teacher-login-password').value;
  const button = document.querySelector('#teacher-pin-login-submit');
  button.disabled = true;
  button.textContent = '교사 계정 확인 중...';
  studentLoginInProgress = true;
  try {
    const { data: current } = await supabase.auth.getSession();
    let session = current.session;
    if (session && !session.user.is_anonymous) {
      setAuthMessage('먼저 현재 계정에서 로그아웃해 주세요.', true);
      return;
    }
    if (!session) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        setAuthMessage('Supabase Auth의 User Signups에서 Allow new users to sign up과 Anonymous Sign-Ins를 모두 켜고 저장해 주세요.', true);
        return;
      }
      session = data.session;
    }
    const { data: accepted, error } = await supabase.rpc('teacher_password_login', {
      p_username: username,
      p_password: password
    });
    if (error) {
      setAuthMessage('교사 아이디 로그인을 사용하려면 통합 SQL 설정을 먼저 실행해 주세요.', true);
      return;
    }
    if (!accepted) {
      setAuthMessage('교사 아이디 또는 비밀번호를 확인해 주세요. 5회 실패하면 15분간 잠깁니다.', true);
      return;
    }
    const { data: signedIn } = await supabase.auth.getSession();
    if (!signedIn.session) {
      setAuthMessage('로그인 세션을 만들지 못했어요. 다시 시도해 주세요.', true);
      return;
    }
    activateAuthUser(signedIn.session.user);
    document.querySelector('#teacher-login-password').value = '';
    authDialog.close();
  } catch {
    setAuthMessage('교사 로그인 중 연결 오류가 발생했어요. 잠시 후 다시 시도해 주세요.', true);
  } finally {
    studentLoginInProgress = false;
    button.disabled = !supabaseConfigured;
    button.textContent = '교사 로그인';
  }
});
document.querySelector('#auth-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase) return;
  const button = document.querySelector('#auth-submit');
  const studentNumber = document.querySelector('#auth-student-number').value.trim();
  const displayName = document.querySelector('#auth-display-name').value.trim();
  if (Boolean(studentNumber) !== Boolean(displayName)) {
    setAuthMessage('학번과 이름을 함께 입력하거나, 둘 다 비워두세요.', true);
    return;
  }
  const { data: current } = await supabase.auth.getSession();
  if (current.session?.user.is_anonymous) await supabase.auth.signOut();
  button.disabled = true;
  button.textContent = '링크 보내는 중...';
  setAuthMessage('로그인 링크를 보내고 있어요.');
  const { error } = await supabase.auth.signInWithOtp({
    email: document.querySelector('#auth-email').value.trim(),
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname,
      data: {
        student_number: studentNumber,
        display_name: displayName
      }
    }
  });
  button.disabled = false;
  button.textContent = '교사 로그인 링크 보내기';
  setAuthMessage(error ? explainAuthError(error) : '메일함에서 교사 로그인 링크를 확인해 주세요.', Boolean(error));
});
document.querySelector('#profile-completion-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!activeUser || !supabase) return;
  const button = document.querySelector('#profile-save-button');
  button.disabled = true;
  const { error } = await supabase.from('profiles').upsert({
    id: activeUser.id,
    student_number: document.querySelector('#profile-student-number').value.trim(),
    display_name: document.querySelector('#profile-display-name').value.trim()
  }, { onConflict: 'id' });
  button.disabled = false;
  if (error) {
    document.querySelector('#profile-message').textContent = '정보를 저장하지 못했어요. 입력 내용을 확인해 주세요.';
    return;
  }
  await loadAccountProgress(activeUser);
  document.querySelector('#profile-message').textContent = '학번과 이름을 저장했어요.';
});
document.querySelector('#signout-button').addEventListener('click', async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) setAuthMessage('로그아웃하지 못했어요. 다시 시도해 주세요.', true);
  else authDialog.close();
});
document.querySelector('#history-button').addEventListener('click', loadSubmissionHistory);
historyOpenButton.addEventListener('click', () => {
  if (!activeUser) {
    updateAccountUI();
    authDialog.showModal();
    setAuthMessage('로그인하면 내 학습 기록을 확인할 수 있어요.');
    return;
  }
  updateAccountUI();
  authDialog.showModal();
  void loadSubmissionHistory();
});
document.querySelector('#teacher-dashboard-button').addEventListener('click', () => {
  if (activeProfile?.role !== 'teacher') return;
  document.querySelector('#teacher-dialog').showModal();
  void loadTeacherRoster();
});
document.querySelector('#teacher-close').addEventListener('click', () => document.querySelector('#teacher-dialog').close());
document.querySelector('#teacher-rows').addEventListener('click', async event => {
  const button = event.target.closest('.pin-issue-button');
  if (!button || activeProfile?.role !== 'teacher' || !supabase) return;
  button.disabled = true;
  const { data: pin, error } = await supabase.rpc('issue_student_pin', { p_student_number: button.dataset.studentNumber });
  button.disabled = false;
  if (error) {
    document.querySelector('#teacher-status').textContent = 'PIN을 발급하지 못했어요. student-pin.sql과 교사 권한을 확인해 주세요.';
    return;
  }
  document.querySelector('#pin-dialog-title').textContent = `${button.dataset.studentNumber} 학생 PIN`;
  document.querySelector('#issued-pin').textContent = pin;
  document.querySelector('#pin-dialog').showModal();
  await loadTeacherRoster();
});
document.querySelector('#pin-dialog-close').addEventListener('click', () => {
  document.querySelector('#issued-pin').textContent = '';
  document.querySelector('#pin-dialog').close();
});
document.querySelector('#pin-dialog').addEventListener('close', () => {
  document.querySelector('#issued-pin').textContent = '';
});
document.querySelector('#roster-file').addEventListener('change', event => {
  const file = event.target.files[0];
  document.querySelector('#roster-file-name').textContent = file?.name ?? '파일을 선택해 주세요.';
  document.querySelector('#roster-import-button').disabled = !file;
});
document.querySelector('#roster-import-button').addEventListener('click', importStudentRoster);
document.querySelector('#roster-template-button').addEventListener('click', downloadRosterTemplate);

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    const nextUser = session?.user ?? null;
    if (nextUser?.is_anonymous) {
      if (!studentLoginInProgress) void restoreAnonymousStudent(nextUser);
      return;
    }
    if (activeUser?.id === nextUser?.id) return;
    activeUser = nextUser;
    activeProfile = null;
    updateAccountUI();
    if (activeUser) void loadAccountProgress(activeUser);
    else {
      authSyncId++;
      selectProblem(Math.min(activeProblem, getUnlockedIndex()));
    }
  });
}

selectProblem(0);
updateAccountUI();
createWorker();
