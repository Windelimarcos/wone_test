document.addEventListener("DOMContentLoaded", function() {
    // Initially hide all sections
    document.getElementById('weeklySchedule').style.display = 'none';
    document.getElementById('dailySchedule').style.display = 'none';
});

    function clearContent() {
        document.getElementById('weeklySchedule').innerHTML = '';
        document.getElementById('dailySchedule').innerHTML = '';
    }
  
    function showWeeklySchedule() {
        if (document.getElementById('weeklySchedule').style.display == 'none') {
            clearContent();
            fetch('workoutPlans.json')
            .then(response => response.json())
            .then(jsonData => {
                displayWorkoutSchedule(jsonData);
                document.getElementById('weeklySchedule').style.display = 'block';
                attachListeners();
                document.getElementById('dailySchedule').style.display = 'none';
            })
            .catch(error => {
                console.error('Error loading the weekly schedule:', error);
            });
        }
    }
  
    function showTodayWorkout() {
        if (document.getElementById('dailySchedule').style.display == 'none') {
            clearContent();
            fetch('workoutPlans.json')
                .then(response => response.json())
                .then(jsonData => {
                    const todaysTraining = getTodaysTraining(jsonData);
                    displayTodaysWorkout(todaysTraining);
                    document.getElementById('weeklySchedule').style.display = 'none';
                    attachListeners();
                    document.getElementById('dailySchedule').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error loading the daily workout:', error);
                });
        }
    }
  
    // Function to display the workout schedule in HTML
    function displayWorkoutSchedule(workoutPlans) {

    let schedule = workoutPlans.workouts[0]

    const title = schedule["tipo_de_treino"];
    let h1_title = `<h4>Treino de ${title}</h4>`
    document.querySelector('#weeklySchedule').innerHTML += h1_title;
        
    const scheduleDiv = document.getElementById('weeklySchedule');

    // Add description information
    const obs = schedule["obs"];
    let intervalHTML = `<p>Descrição: ${obs["Descrição"]}</p>`;
    scheduleDiv.innerHTML += intervalHTML;

    // Add workouts
    Object.keys(schedule).forEach((treino) => {
        if (treino.startsWith('Treino ')) { // Make sure it's a workout key
            const muscleGroup = schedule[treino]["Musculação"];
            let tableHTML = `<h2>${treino} - ${muscleGroup}</h2>`;
            tableHTML += `<table>`;
            tableHTML += `<tr><th>Exercícios</th><th>SxR</th><th>Técnica Avançada</th></tr>`;
            const exercises = schedule[treino]["Exercícios"];
            Object.keys(exercises).forEach((exercise) => {
            const details = exercises[exercise];
            const descanso = details["Descanso"] ? details["Descanso"] : '';
            const tecnicaAvancada = details["Técnica Avançada"] ? details["Técnica Avançada"] : '';
            tableHTML +=    `<tr>
                            <td data-youtube-search="Leandro Twin ${exercise}">${exercise}</td>
                            <td>${details["SxR"]}</td>
                            <td data-youtube-search="Leandro Twin ${tecnicaAvancada}">${tecnicaAvancada}</td>
                            </tr>`;
            });

            // Intervalo de Descanso
            const restInterval = schedule[treino]["Intervalo de descanso"];
            tableHTML += `<tr><th colspan="2">Intervalo de descanso:</th><td> ${restInterval}</td></tr>`;

            tableHTML += `</table>`;
            scheduleDiv.innerHTML += tableHTML;
        }
    });
    }


    function displayTodaysWorkout(workout) {
        const workoutDetails = workout[0]
        const treino = workout[1]

        if (!workoutDetails) {
            document.getElementById('dailySchedule').innerHTML = "<p>Não há treino hoje.</p>";
            return;
        }

        const muscleGroup = workoutDetails["Musculação"];
        let tableHTML = `<h2>${treino} - ${muscleGroup}</h2>`;
                tableHTML += `<table>`;
                tableHTML += `<tr><th>Exercícios</th><th>SxR</th><th>Técnica Avançada</th></tr>`;
                const exercises = workoutDetails["Exercícios"];
                Object.keys(exercises).forEach((exercise) => {
                const details = exercises[exercise];
                //const descanso = details["Descanso"] ? details["Descanso"] : '';
                const tecnicaAvancada = details["Técnica Avançada"] ? details["Técnica Avançada"] : '';
                tableHTML +=    `<tr>
                                <td data-youtube-search="Leandro Twin ${exercise}">${exercise}</td>
                                <td>${details["SxR"]}</td>
                                <td data-youtube-search="Leandro Twin ${tecnicaAvancada}">${tecnicaAvancada}</td>
                                </tr>`;
                });

                // Intervalo de Descanso
                const restInterval = workoutDetails["Intervalo de descanso"];
                tableHTML += `<tr><th colspan="2">Intervalo de descanso:</th><td> ${restInterval}</td></tr>`;

                tableHTML += `</table>`;

        document.getElementById('dailySchedule').innerHTML += tableHTML;
    }

    function getTodaysTraining(schedule) {
        const today = new Date().toLocaleString('en-US', { weekday: 'long' });

        let todaysWorkout = schedule.workouts[0] // degub

        for (const key in todaysWorkout) {
            if (key.startsWith('Treino') && todaysWorkout[key]["Dia"].includes(today)) {
                
            const title = todaysWorkout["tipo_de_treino"];
            let h1_title = `<h4>Treino de ${title}</h4>`
            document.querySelector('#dailySchedule').innerHTML += h1_title;
            
            // Add obs information
            const obs = todaysWorkout["obs"];
            let intervalHTML = `<p>Descrição: ${obs["Descrição"]}</p>`;
            document.querySelector('#dailySchedule').innerHTML += intervalHTML;

            return [todaysWorkout[key], key];
            }
        }
        return null;
    }

    // Abre youtube
    function attachListeners() {
        const clickableItems = document.querySelectorAll('[data-youtube-search]');
        clickableItems.forEach(item => {
            item.addEventListener('click', function() {
                const searchTerm = this.getAttribute('data-youtube-search');
                const query = encodeURIComponent(searchTerm);
                const youtubeUrl = "https://www.youtube.com/results?search_query=" + query;
                window.open(youtubeUrl, '_blank');
            });
        });
    }
