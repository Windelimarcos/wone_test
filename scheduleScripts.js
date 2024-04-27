let workoutId;

document.addEventListener("DOMContentLoaded", function() {
    // Initially hide all sections
    document.getElementById('weeklySchedule').style.display = 'none';
    document.getElementById('dailySchedule').style.display = 'none';

    const urlParams = new URLSearchParams(window.location.search);
    workoutId = urlParams.get('workoutId');
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
                Swal.fire({
                    title: 'Erro!',
                    text: 'Não conseguimos carregar seu treino.',
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                  }); 
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
                    if (todaysTraining) {
                        displayTodaysWorkout(todaysTraining);
                    } else {
                        Swal.fire({
                            title: 'Sem treino hoje!',
                            text: 'Aproveite para fazer um cardio.',
                            icon: 'error',
                            confirmButtonText: 'Fechar'
                          });                          
                    }
                    document.getElementById('weeklySchedule').style.display = 'none';
                    attachListeners();
                    document.getElementById('dailySchedule').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error loading the daily workout:', error);
                });
        }
    }
  
    // Mostra treino completo da semana toda
    function displayWorkoutSchedule(workoutPlans) {

        //console.log(workoutPlans, workoutId)
        const schedule = workoutPlans.workouts.find(w => w.id === workoutId);

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
                let tableHTML = `<h2 onclick="displaySingleWorkout('${treino}', '${workoutId}')">${treino} - ${muscleGroup}</h2>`;
                tableHTML += `<table>`;
                tableHTML += `<tr><th>Exercícios</th><th>SxR</th><th>Técnica Avançada</th></tr>`;
                const exercises = schedule[treino]["Exercícios"];
                Object.keys(exercises).forEach((exercise) => {
                const details = exercises[exercise];
                const descanso = details["Descanso"] ? details["Descanso"] : '';
                const tecnicaAvancada = details["Técnica Avançada"] ? details["Técnica Avançada"] : '';
                tableHTML +=    `<tr>
                                <td data-image-search="${exercise}">${exercise}</td>
                                <td>${details["SxR"]}</td>
                                <td data-youtube-search="${tecnicaAvancada}">${tecnicaAvancada}</td>
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

    function displaySingleWorkout(trainingName, workoutId) {
        clearContent();
        fetch('workoutPlans.json')
            .then(response => response.json())
            .then(jsonData => {
                const selectedTraining = getSelectedTraining(jsonData,trainingName,workoutId);
                if (selectedTraining) {
                    displayTodaysWorkout(selectedTraining);
                } else {
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Não foi possível carregar seu treino.',
                        icon: 'error',
                        confirmButtonText: 'Fechar'
                        });                          
                }
                document.getElementById('weeklySchedule').style.display = 'none';
                attachListeners();
                document.getElementById('dailySchedule').style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading the daily workout:', error);
        });
    }
    
    function getSelectedTraining(workoutPlans, trainingName, workoutId) {
        let selectedWorkout = workoutPlans.workouts.find(w => w.id === workoutId);
        //console.log(selectedWorkout)

        for (const key in selectedWorkout) {
            if (key.startsWith(trainingName)) {
                const title = selectedWorkout["tipo_de_treino"];
                let h1_title = `<h4>Treino de ${title}</h4>`
                document.querySelector('#dailySchedule').innerHTML += h1_title;
                
                // Add obs information
                const obs = selectedWorkout["obs"];
                let intervalHTML = `<p>Descrição: ${obs["Descrição"]}</p>`;
                document.querySelector('#dailySchedule').innerHTML += intervalHTML;

                return [selectedWorkout[key], key];
            }
        }
        return null;
    }

    function displayTodaysWorkout(workout) {
        //console.log(workout)
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
                        <td data-image-search="${exercise}">${exercise}</td>
                        <td>${details["SxR"]}</td>
                        <td data-youtube-search="${tecnicaAvancada}">${tecnicaAvancada}</td>
                        </tr>`;
        });

        // Intervalo de Descanso
        const restInterval = workoutDetails["Intervalo de descanso"];
        tableHTML += `<tr><th colspan="2">Intervalo de descanso:</th><td> ${restInterval}</td></tr>`;

        tableHTML += `</table>`;

        document.getElementById('dailySchedule').innerHTML += tableHTML;
        
        let timer_div = `<div id="timer">
                            <h3>Cronômetro</h3>
                            <span id="js-timer-minutes">00</span>:
                            <span id="js-timer-seconds">00</span>
                            <br>
                            <button onclick="startTimer()">Iniciar</button>
                            <button onclick="stopTimer()" class="danger">Concluir</button>
                        </div>
                        `
                    //
        document.getElementById('dailySchedule').innerHTML += timer_div;
    
    }

    function getTodaysTraining(workoutPlans) {
        const today = new Date().toLocaleString('en-US', { weekday: 'long' });

        let todaysWorkout = workoutPlans.workouts.find(w => w.id === workoutId);
        //console.log(todaysWorkout)

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
        const trainingItems = document.querySelectorAll('[data-image-search]');
        const techiniqueItems = document.querySelectorAll('[data-youtube-search]');

        trainingItems.forEach(item => {
            item.addEventListener('click', function() {
                const image = this.getAttribute('data-image-search');
                if (image) {
                    const query = encodeURIComponent(image);
                    const googleImage = `https://www.google.com/search?tbm=isch&q=${query}`
                    window.open(googleImage, '_blank');
                }    
            });
        });
        techiniqueItems.forEach(item => {
            item.addEventListener('click', function() {
                const youtube = this.getAttribute('data-youtube-search');
                if (youtube) {
                    const query = encodeURIComponent(youtube);
                    const youtubeUrl = "https://www.youtube.com/results?search_query=" + query;
                    window.open(youtubeUrl, '_blank');
                }
            });
        });
    }

    let timer;
    function startTimer() {
        if (!timer) {
            timer = new easytimer.Timer();

            timer.start({precision: 'seconds'});
        
            timer.addEventListener('secondsUpdated', function (e) {
                document.getElementById('js-timer-minutes').innerHTML = timer.getTimeValues().minutes;
                document.getElementById('js-timer-seconds').innerHTML = timer.getTimeValues().seconds;
            });        
        } else {
            timer.reset();
        }
    }
    
    function stopTimer() {
        if (timer) {
            let training_time = timer.getTimeValues().toString();
            timer.stop();
            training_time = training_time.split(':');

            Swal.fire({
                title: 'Parabéns!',
                text: `Você concluiu o seu treino em ${training_time[0]} horas, ${training_time[1]} minutos e ${training_time[2]} segundos.`,
                icon: 'success',
                confirmButtonText: 'Home page'
            }).then((result) => {
                window.location.reload();
            });
        }
    }