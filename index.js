// Interaction 1
// when I click the play button
// - change the icon to a pause button
// - decrease counter
// - animations start

// Interaction 2
// when first timer ends, second timer starts
// - change the background colour
// - decrease counter

// Interaction 3
// When break time ends
// - stop everything

// Interaction 4
// When I click the add 1 minute button
// - add time to the current timer

// Interaction 5
// As timer decrements
// - rotate the arm
// - change the length of the svg circle

// Interaction 6
// When I click the pause button
// - animations stop
// - timers stop
// - button changes from pause to play

// declare variables that hold unchanging state
const controlBtn = document.querySelector(".control-btn")
const workTimer = document.querySelector("#workTimer")
const breakTimer = document.querySelector("#breakTimer")
const addTimeBtn = document.querySelector("#addTimeBtn")
const arm = document.querySelector(".arm")
const circle = document.querySelector("#circleTimer")
const workSeconds = 10
const breakSeconds = 10
const increment = 60
const circumference = 2 * Math.PI * 50

// declare variables that hold changing state
let isPaused, timerInterval, currentSeconds, currentTimer, isWorkPhase, currentTotal
isPaused = true
isWorkPhase = true
currentSeconds = workSeconds
currentTotal = workSeconds
currentTimer = workTimer
circle.style.strokeDasharray = circumference
circle.style.strokeDashoffset = circumference

// Initialise app
updateTimer(workTimer, workSeconds)
updateTimer(breakTimer, breakSeconds)

controlBtn.addEventListener("click", () => {
  // toggle isPaused value
  isPaused = !isPaused
  // apply the appropriate control icon to the element
  controlBtn.classList.toggle("control-btn--pause", !isPaused)
  // start the timer
  if (!timerInterval) {
    timerInterval = setInterval(decrement, 1000)
  }
})

addTimeBtn.addEventListener("click", () => {
  // add to the total time
  currentSeconds += increment
  currentTotal += increment

  //update the timer
  updateTimer(currentTimer, currentSeconds)
})

function updateTimer(timer, numSeconds) {
  const minutes = Math.floor(numSeconds / 60) //integer divisions
  const seconds = numSeconds % 60
  const formattedSeconds = seconds.toString().padStart(2, '0')
  // calculate the right time before updating
  timer.innerText = `${minutes}:${formattedSeconds}`
}

// calculate new times, update the page, handle ending timer
function decrement() {
  // don't do anything if paused
  if (isPaused) return

  // update the count
  currentSeconds--

  // format the count and update the page
  updateTimer(currentTimer, currentSeconds)

  // update progress based on new count
  const percentage = (currentTotal - currentSeconds) / currentTotal
  // update the progress bar
  setProgress(percentage)

  // if timer ends
  if (currentSeconds === 0) {
    // stop the interval
    clearInterval(timerInterval)

    if (isWorkPhase) {
      isWorkPhase = false
      // switch timers *phases
      currentSeconds = breakSeconds
      // currentTotal = breakTotal
      currentTimer = breakTimer
      workTimer.classList.remove("timer--active")
      breakTimer.classList.add("timer--active")
      // change the colours
      document.body.classList.add("break-phase")
      // start the new timer
      timerInterval = setInterval(decrement, 1000)
    } else {
      // disable the buttons
      controlBtn.classList.remove("control-btn-pause")
      controlBtn.setAttribute("disabled", "disabled")
      addTimeBtn.setAttribute("disabled", "disabled")
    }
  }
}

function setProgress(newPercentageValue) {
  // and fills in the circle border
  const offset = circumference - (newPercentageValue * circumference)
  circle.style.strokeDashoffset = offset

  // sets the arm to rotate
  const rotation = newPercentageValue * 360
  arm.style.transform = `rotate(${rotation}deg)`
}
