document.addEventListener("DOMContentLoaded", function() {
    // Initially hide all sections
    document.getElementById('weeklySchedule').style.display = 'none';
    document.getElementById('dailySchedule').style.display = 'none';
  });
  
  function showWeeklySchedule() {
    fetch('workoutPlans.json')
      .then(response => response.json())
      .then(jsonData => {
        displayWeeklySchedule(jsonData);
        document.getElementById('weeklySchedule').style.display = 'block';
        document.getElementById('dailySchedule').style.display = 'none';
      })
      .catch(error => {
        console.error('Error loading the weekly schedule:', error);
      });
  }
  
  function showTodayWorkout() {
    fetch('workoutPlans.json')
      .then(response => response.json())
      .then(jsonData => {
        const todaysTraining = getTodaysTraining(jsonData);
        displayTodaysWorkout(todaysTraining);
        document.getElementById('weeklySchedule').style.display = 'none';
        document.getElementById('dailySchedule').style.display = 'block';
      })
      .catch(error => {
        console.error('Error loading the daily workout:', error);
      });
  }
  
    // Function to display the workout schedule in HTML
    function displayWorkoutSchedule(schedule) {
    const title = schedule["Assessoria Esportiva"];
    document.querySelector('#weekSchedule').innerHTML += title;
        
    const scheduleDiv = document.getElementById('schedule');

    // Add interval information
    const obs = schedule["obs"];
    let intervalHTML = `<h2>Descrição:</h2>`;
    intervalHTML += `<p>${obs["Descrição"]}</p>`;
    scheduleDiv.innerHTML += intervalHTML;

    // Add workouts
    console.log(schedule)
    Object.keys(schedule).forEach((treino) => {
        if (treino.startsWith('Treino ')) { // Make sure it's a workout key
            const muscleGroup = schedule[treino]["Musculação"];
            let tableHTML = `<h2>${treino} - ${muscleGroup}</h2>`;
            tableHTML += `<table>`;
            tableHTML += `<tr><th>Exercícios</th><th>SxR</th><th>Técnica Avançada</th><th>Descanso</th></tr>`;
            const exercises = schedule[treino]["Exercícios"];
            Object.keys(exercises).forEach((exercise) => {
            const details = exercises[exercise];
            const descanso = details["Descanso"] ? details["Descanso"] : '';
            const tecnicaAvancada = details["Técnica Avançada"] ? details["Técnica Avançada"] : '';
            tableHTML += `<tr>
                            <td>${exercise}</td>
                            <td>${details["SxR"]}</td>
                            <td>${tecnicaAvancada}</td>
                            <td>${descanso}</td>
                            </tr>`;
            });

            // Intervalo de Descanso
            const restInterval = schedule[treino]["Intervalo de descanso"];
            tableHTML += `<tr><th colspan="3">Intervalo de descanso:</th><td> ${restInterval}</td></tr>`;

            tableHTML += `</table>`;
            scheduleDiv.innerHTML += tableHTML;
        }
    });
    }


    function displayTodaysWorkout(workout) {
    console.log(workout)
    const workoutDetails = workout[0]
    const treino = workout[1]

    if (!workoutDetails) {
        document.getElementById('dailySchedule').innerHTML = "<p>Não há treino hoje.</p>";
        return;
    }

    const muscleGroup = workoutDetails["Musculação"];
    let tableHTML = `<h2>${treino} - ${muscleGroup}</h2>`;
            tableHTML += `<table>`;
            tableHTML += `<tr><th>Exercícios</th><th>SxR</th><th>Técnica Avançada</th><th>Descanso</th></tr>`;
            const exercises = workoutDetails["Exercícios"];
            Object.keys(exercises).forEach((exercise) => {
            const details = exercises[exercise];
            const descanso = details["Descanso"] ? details["Descanso"] : '';
            const tecnicaAvancada = details["Técnica Avançada"] ? details["Técnica Avançada"] : '';
            tableHTML += `<tr>
                            <td>${exercise}</td>
                            <td>${details["SxR"]}</td>
                            <td>${tecnicaAvancada}</td>
                            <td>${descanso}</td>
                            </tr>`;
            });

            // Intervalo de Descanso
            const restInterval = workoutDetails["Intervalo de descanso"];
            tableHTML += `<tr><th colspan="3">Intervalo de descanso:</th><td> ${restInterval}</td></tr>`;

            tableHTML += `</table>`;

    document.getElementById('dailySchedule').innerHTML = tableHTML;
    }

    function getTodaysTraining(schedule) {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    console.log(today,schedule['Treino A']["Dia"], schedule)
    for (const key in schedule) {
        if (key.startsWith('Treino') && schedule[key]["Dia"].includes(today)) {
        
        const title = schedule["Assessoria Esportiva"];
        document.querySelector('#dailyTraining').innerHTML += title;
            
        return [schedule[key], key];
        }
    }
    return null;
    }

    /* Fetch the workout schedule JSON data
    fetch('workoutPlans.json')
    .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
    })
    .then(jsonData => {
    // Run the display function
    const todaysTraining = getTodaysTraining(jsonData);
    displayTodaysWorkout(todaysTraining);
    //displayWorkoutSchedule(jsonData);
    })
    .catch(e => {
    console.error('Error loading workout schedule:', e);
    }); 
    */