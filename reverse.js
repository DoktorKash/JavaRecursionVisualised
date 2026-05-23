const steps = [];
let currentStep = 0;

function buildSteps() {

  function printReverseFrom5(i) {

    steps.push({
      action: "CALL",
      i,
      message: `Calling printReverseFrom5(${i})`
    });

    if (i > 5) {

      steps.push({
        action: "BASE",
        i,
        message: `Base case reached: i = ${i}, return`
      });

      steps.push({
        action: "RETURN",
        i,
        message: `Returning from printReverseFrom5(${i})`
      });

      return;
    }

    printReverseFrom5(i + 1);

    steps.push({
      action: "PRINT",
      i,
      message: `Printing ${i} to console`
    });

    steps.push({
      action: "RETURN",
      i,
      message: `Returning from printReverseFrom5(${i})`
    });
  }

  printReverseFrom5(1);
}

function getState() {

  const stack = [];
  const output = [];

  for (let index = 0; index < currentStep; index++) {

    const step = steps[index];

    if (step.action === "CALL") {
      stack.push(step.i);
    }

    if (step.action === "PRINT") {
      output.push(step.i);
    }

    if (step.action === "RETURN") {

      if (stack.length &&
          stack[stack.length - 1] === step.i) {

        stack.pop();
      }
    }
  }

  return { stack, output };
}

function render() {

  const { stack, output } = getState();

  renderStack(stack);
  renderConsole(output);
  renderCurrentStep();

  document.getElementById("counter").textContent =
    `Step ${currentStep} of ${steps.length}`;
}

function renderStack(stack) {

  const stackDiv = document.getElementById("stack");

  stackDiv.innerHTML = "";

  const bottomY = 390;
  const boxHeight = 52;
  const gap = 10;

  stack.forEach((i, index) => {

    const frame = document.createElement("div");

    frame.className = "stack-frame";

    frame.textContent =
      `printReverseFrom5(i = ${i})`;

    const y =
      bottomY - index * (boxHeight + gap);

    frame.style.top = `${y}px`;

    stackDiv.appendChild(frame);
  });
}

function renderConsole(output) {

  document.getElementById("console").textContent =
    output.join("\n");
}

function renderCurrentStep() {

  const icon =
    document.getElementById("icon");

  const message =
    document.getElementById("message");

  const details =
    document.getElementById("details");

  if (currentStep >= steps.length) {

    icon.textContent = "✓";
    icon.style.background = "#2ecc71";

    message.textContent =
      "Program finished";

    details.innerHTML = `
      Stack is empty.<br>
      All recursive calls have returned.
    `;

    return;
  }

  const step = steps[currentStep];

  message.textContent = step.message;

  if (step.action === "CALL") {

    icon.textContent = "↓";
    icon.style.background = "#7b1fd1";

  } else if (step.action === "PRINT") {

    icon.textContent = "⎙";
    icon.style.background = "#2ecc71";

  } else if (step.action === "RETURN") {

    icon.textContent = "↑";
    icon.style.background = "#f28c18";

  } else {

    icon.textContent = "!";
    icon.style.background = "#e74c3c";
  }

  details.innerHTML = `
    <strong>Action:</strong> ${step.action}<br>
    <strong>Function:</strong> printReverseFrom5<br>
    <strong>Parameter:</strong> i = ${step.i}<br><br>

    CALL = push new frame on stack<br>
    PRINT = write value to console<br>
    RETURN = pop top frame from stack
  `;
}

function nextStep() {

  if (currentStep < steps.length) {

    currentStep++;
    render();
  }
}

function previousStep() {

  if (currentStep > 0) {

    currentStep--;
    render();
  }
}

function reset() {

  currentStep = 0;
  render();
}

buildSteps();
render();