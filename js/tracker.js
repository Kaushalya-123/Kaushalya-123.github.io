/**
 * Habit and Mood Tracker functionality
 * Manages user's habits, moods, and their tracking data
 */

document.addEventListener('DOMContentLoaded', () => {
    class HabitTracker {
        constructor() {
            // Initialize tracker state and DOM elements
            this.habits = this.loadHabits();
            this.moods = this.loadMoods();
            this.currentDate = new Date();
            
            // Cache DOM elements for better performance
            this.habitList = document.querySelector('.habit-list');
            this.addHabitBtn = document.querySelector('.add-habit-btn');
            this.newHabitInput = document.querySelector('#newHabit');
            this.calendar = document.querySelector('#calendar');
            this.moodButtons = document.querySelectorAll('.mood-btn');
            this.moodNotes = document.querySelector('#moodNotes');
            this.saveMoodBtn = document.querySelector('.save-mood');

            // Set up the tracker
            this.initializeEventListeners();
            this.renderHabits();
            this.renderCalendar();
            this.loadTodaysMood();
            this.updateProgressBars();
        }

        /**
         * Load saved habits from localStorage or initialize with defaults
         * @returns {Object} Habits data structure
         */
        loadHabits() {
            const savedHabits = localStorage.getItem('habits');
            return savedHabits ? JSON.parse(savedHabits) : {
                habits: [
                    { id: 1, name: 'Drink 8 glasses of water', streak: 0, logs: {} },
                    { id: 2, name: 'Exercise for 30 minutes', streak: 0, logs: {} },
                    { id: 3, name: 'Read for 20 minutes', streak: 0, logs: {} },
                    { id: 4, name: 'Meditate', streak: 0, logs: {} }
                ],
                lastId: 4
            };
        }

        /**
         * Load saved moods from localStorage
         * @returns {Object} Moods data structure
         */
        loadMoods() {
            const savedMoods = localStorage.getItem('moods');
            return savedMoods ? JSON.parse(savedMoods) : {};
        }

        /**
         * Save current moods state to localStorage
         */
        saveMoods() {
            localStorage.setItem('moods', JSON.stringify(this.moods));
        }

        loadTodaysMood() {
            const today = this.formatDate(this.currentDate);
            const todaysMood = this.moods[today];
            
            if (todaysMood) {
                // Clear previous selections
                this.moodButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Select today's mood
                const moodBtn = document.querySelector(`[data-mood="${todaysMood.mood}"]`);
                if (moodBtn) moodBtn.classList.add('selected');
                
                // Set notes
                if (this.moodNotes) this.moodNotes.value = todaysMood.notes || '';
            }
        }

        saveHabits() {
            localStorage.setItem('habits', JSON.stringify(this.habits));
        }

        initializeEventListeners() {
            this.addHabitBtn.addEventListener('click', () => this.addNewHabit());
            this.habitList.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    this.toggleHabitCompletion(e.target);
                }
            });

            // Mood tracking events
            this.moodButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.moodButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.saveMoodSelection();
                });
            });

            if (this.saveMoodBtn) {
                this.saveMoodBtn.addEventListener('click', () => this.saveMoodSelection());
            }

            // Add delegation for remove buttons
            this.habitList.addEventListener('click', (e) => {
                if (e.target.closest('.remove-habit-btn')) {
                    this.removeHabit(e);
                }
            });
        }

        /**
         * Add a new habit to the tracker
         */
        addNewHabit() {
            const habitName = this.newHabitInput.value.trim();
            if (habitName) {
                // Create new habit object
                this.habits.lastId++;
                this.habits.habits.push({
                    id: this.habits.lastId,
                    name: habitName,
                    streak: 0,
                    logs: {}
                });
                this.saveHabits();
                this.renderHabits();
                this.newHabitInput.value = '';
            }
        }

        /**
         * Format date to YYYY-MM-DD string
         * @param {Date} date Date to format
         * @returns {string} Formatted date string
         */
        formatDate(date) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }

        /**
         * Handle habit completion toggle
         * @param {HTMLElement} checkbox Checkbox element that was toggled
         */
        toggleHabitCompletion(checkbox) {
            const habitId = parseInt(checkbox.id.replace('habit', ''));
            const today = this.formatDate(this.currentDate);
            const habit = this.habits.habits.find(h => h.id === habitId);
            
            if (habit) {
                // Update habit completion status
                if (checkbox.checked) {
                    habit.logs[today] = true;
                    habit.streak = this.calculateStreak(habit);
                } else {
                    delete habit.logs[today];
                    habit.streak = this.calculateStreak(habit);
                }
                this.saveHabits();
                this.renderHabits();
                this.renderCalendar();
                this.updateProgressBars();
            }
        }

        calculateStreak(habit) {
            let streak = 0;
            const today = new Date();
            let currentDate = new Date();

            while (true) {
                const dateStr = this.formatDate(currentDate);
                if (!habit.logs[dateStr]) {
                    break;
                }
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
                
                // Break if we go back more than 30 days
                if (streak > 30) break;
            }
            return streak;
        }

        renderHabits() {
            this.habitList.innerHTML = this.habits.habits.map(habit => {
                const isChecked = habit.logs[this.formatDate(this.currentDate)] ? 'checked' : '';
                return `
                    <div class="habit-item">
                        <div class="habit-main">
                            <div class="habit-check">
                                <input type="checkbox" id="habit${habit.id}" ${isChecked}>
                                <label for="habit${habit.id}">${habit.name}</label>
                            </div>
                            <div class="habit-actions">
                                <span class="streak">${habit.streak > 0 ? '🔥 ' + habit.streak + ' days' : ''}</span>
                                <button class="remove-habit-btn" data-habit-id="${habit.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Add event listeners for remove buttons
            this.habitList.querySelectorAll('.remove-habit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.removeHabit(e));
            });
        }

        removeHabit(e) {
            const habitId = parseInt(e.currentTarget.dataset.habitId);
            
            // Show confirmation dialog
            if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
                // Remove habit from array
                this.habits.habits = this.habits.habits.filter(habit => habit.id !== habitId);
                
                // Save updated habits
                this.saveHabits();
                
                // Re-render habits
                this.renderHabits();
                this.renderCalendar();
                this.updateProgressBars();
            }
        }

        saveMoodSelection() {
            const selectedMood = document.querySelector('.mood-btn.selected');
            if (selectedMood) {
                const today = this.formatDate(this.currentDate);
                this.moods[today] = {
                    mood: selectedMood.dataset.mood,
                    notes: this.moodNotes ? this.moodNotes.value : '',
                    timestamp: new Date().toISOString()
                };
                this.saveMoods();
                this.renderCalendar();
                this.updateProgressBars();
            }
        }

        renderCalendar() {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            let calendarHTML = `
                <div class="calendar-header">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
            `;

            // Add empty cells for days before the first day of the month
            for (let i = 0; i < firstDay.getDay(); i++) {
                calendarHTML += '<div class="calendar-day empty"></div>';
            }

            // Add cells for each day of the month
            for (let day = 1; day <= lastDay.getDate(); day++) {
                const date = new Date(today.getFullYear(), today.getMonth(), day);
                const dateStr = this.formatDate(date);
                
                // Count completed habits for this day
                const completedHabits = this.habits.habits.filter(habit => habit.logs[dateStr]).length;
                const totalHabits = this.habits.habits.length;
                
                let progressClass = '';
                if (completedHabits > 0) {
                    progressClass = completedHabits === totalHabits ? 'complete' : 'partial';
                }

                // Get mood for this day
                const dayMood = this.moods[dateStr];
                const moodEmoji = this.getMoodEmoji(dayMood?.mood);

                calendarHTML += `
                    <div class="calendar-day ${progressClass}">
                        <span class="day-number">${day}</span>
                        ${completedHabits > 0 ? `<span class="habit-count">${completedHabits}/${totalHabits}</span>` : ''}
                        ${moodEmoji ? `<span class="mood-emoji" title="${dayMood.mood}">${moodEmoji}</span>` : ''}
                    </div>
                `;
            }

            this.calendar.innerHTML = calendarHTML;
        }

        getMoodEmoji(mood) {
            const moodEmojis = {
                'amazing': '😍',
                'happy': '😊',
                'okay': '😐',
                'sad': '😢',
                'terrible': '😫'
            };
            return mood ? moodEmojis[mood] : '';
        }

        updateProgressBars() {
            // Update Overall Progress
            const totalHabits = this.habits.habits.length;
            const completedToday = this.habits.habits.filter(habit => 
                habit.logs[this.formatDate(this.currentDate)]).length;
            const weeklyProgress = (completedToday / totalHabits) * 100;
            
            const weeklyProgressBar = document.querySelector('.overall-progress .bg-success');
            if (weeklyProgressBar) {
                weeklyProgressBar.style.width = `${weeklyProgress}%`;
                weeklyProgressBar.textContent = `${Math.round(weeklyProgress)}%`;
            }

            // Update Individual Habit Progress
            this.habits.habits.forEach((habit, index) => {
                const progressBar = document.querySelector(`#habit${index + 1}`).closest('.habit-item').querySelector('.progress-bar');
                if (progressBar) {
                    const progress = habit.logs[this.formatDate(this.currentDate)] ? 100 : 0;
                    progressBar.style.width = `${progress}%`;
                    progressBar.textContent = habit.logs[this.formatDate(this.currentDate)] ? 'Completed' : 'Not Started';
                }
            });

            // Update Mood Progress
            const moodCounts = {
                amazing: 0, happy: 0, okay: 0, sad: 0, terrible: 0
            };
            
            // Count moods for the last 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = this.formatDate(date);
                const mood = this.moods[dateStr]?.mood;
                if (mood) {
                    moodCounts[mood]++;
                }
            }

            // Update mood progress bars
            Object.entries(moodCounts).forEach(([mood, count]) => {
                const percentage = (count / 7) * 100;
                const moodBar = document.querySelector(`.mood-stats .progress-bar[title="${mood.charAt(0).toUpperCase() + mood.slice(1)}"]`);
                if (moodBar) {
                    moodBar.style.width = `${percentage}%`;
                    moodBar.textContent = `${Math.round(percentage)}%`;
                }
            });
        }
    }

    // Initialize the habit tracker
    const habitTracker = new HabitTracker();
});








