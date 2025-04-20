document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('authModal');
    const profileMain = document.querySelector('.profile-main');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');

    // Check if user is logged in
    const checkAuth = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            authModal.style.display = 'flex'; 
            profileMain.style.display = 'none';
        } else {
            authModal.style.display = 'none';
            profileMain.style.display = 'block';
            loadUserProfile();
        }
    };

    // Switch between auth tabs
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Active class for clicked tab and corresponding form
            tab.classList.add('active');
            const formId = tab.dataset.tab === 'signin' ? 'signInForm' : 'signUpForm';
            document.getElementById(formId).classList.add('active');
        });
    });

    // Handle sign in
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;

        try {
            // Check if we have stored user data for this email
            const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};
            
            // If this is a new sign in without registration, create basic user data
            if (!storedUserData.email) {
                const userData = {
                    name: 'User',
                    email: email,
                    bio: 'This Guy is Lazy to write any discription ',
                    location: 'Your Location'
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                // Set join date if not already set
                if (!localStorage.getItem('joinDate')) {
                    const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    localStorage.setItem('joinDate', joinDate);
                }
            } else {
                // Update email if different from stored
                storedUserData.email = email;
                localStorage.setItem('userData', JSON.stringify(storedUserData));
            }
            
            localStorage.setItem('isLoggedIn', 'true');
            
            // Hide auth modal and show profile
            authModal.style.display = 'none';
            profileMain.style.display = 'block';
            
            // Load the user profile
            loadUserProfile();
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    });

    // Handle sign up
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('signUpConfirmPassword').value;

        if (password !== confirmPassword) {
            alert('Try again , Can`t you remeber your password ');
            return;
        }

        try {
            // Store join date
            const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            localStorage.setItem('joinDate', joinDate);
            
            // Create user data
            const userData = {
                name: name,
                email: email,
                bio: 'This Guy is Lazy to write any discription ',
                location: 'Your Location'
            };
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));

            // Hide auth modal and show profile
            authModal.style.display = 'none';
            profileMain.style.display = 'block';
            
            // Load the user profile with the new data
            loadUserProfile();
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        }
    });

    // Load user profile data
    const loadUserProfile = () => {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        const joinDate = localStorage.getItem('joinDate') || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Set user data in profile
        document.querySelector('.profile-info h1').textContent = userData.name || 'User';
        document.querySelector('.profile-bio').textContent = userData.bio || 'No bio available';
        
        // Set email
        const emailElement = document.querySelector('.detail-item:nth-child(1) p');
        if (emailElement) emailElement.textContent = userData.email || 'No email available';
        
        // Set join date
        const joinDateElement = document.getElementById('memberSince');
        if (joinDateElement) joinDateElement.textContent = joinDate;
        
        // Set location
        const locationElement = document.querySelector('.detail-item:nth-child(3) p');
        if (locationElement) locationElement.textContent = userData.location || 'Not specified';
        
        // Check if user has an avatar
        if (userData.avatar) {
            const avatarIcon = document.querySelector('.profile-avatar i');
            if (avatarIcon) {
                avatarIcon.style.display = 'none';
                
                // Check if image already exists
                let img = document.querySelector('.profile-avatar img');
                if (!img) {
                    img = document.createElement('img');
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.borderRadius = '50%';
                    img.style.objectFit = 'cover';
                    document.getElementById('profileAvatar').appendChild(img);
                }
                img.src = userData.avatar;
            }
        }
    };

    // Initialize
    checkAuth();

    const editBtn = document.querySelector('.edit-btn');
    const modal = document.getElementById('editProfileModal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const editProfileForm = document.getElementById('editProfileForm');

    // Current profile data
    const profileData = {
        name: document.querySelector('.profile-info h1').textContent,
        bio: document.querySelector('.profile-bio').textContent,
        email: document.querySelector('.detail-item p').textContent,
        location: document.querySelector('.detail-item:last-child p').textContent
    };

    // Open modal
    editBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        // Populate form with current data
        document.getElementById('editName').value = profileData.name;
        document.getElementById('editBio').value = profileData.bio;
        document.getElementById('editEmail').value = profileData.email;
        document.getElementById('editLocation').value = profileData.location;
    });

    // Close modal functions
    const closeModal = () => {
        modal.style.display = 'none';
        editProfileForm.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(editProfileForm);
        
        // Create updated user data object
        const updatedData = {
            name: formData.get('name'),
            bio: formData.get('bio'),
            email: formData.get('email'),
            location: formData.get('location')
        };

        try {
            // Handle avatar upload
            const avatarFile = formData.get('avatar');
            if (avatarFile && avatarFile.size > 0) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Save avatar to user data
                    updatedData.avatar = e.target.result;
                    
                    // Update localStorage with all user data
                    localStorage.setItem('userData', JSON.stringify(updatedData));
                    
                    // Update UI
                    loadUserProfile();
                };
                reader.readAsDataURL(avatarFile);
            } else {
                // Preserve existing avatar if available
                const existingData = JSON.parse(localStorage.getItem('userData')) || {};
                if (existingData.avatar) {
                    updatedData.avatar = existingData.avatar;
                }
                
                // Update localStorage and UI
                localStorage.setItem('userData', JSON.stringify(updatedData));
                loadUserProfile();
            }

            // Show success message
            alert('Nice looking Bro !');
            closeModal();

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    });

    // Sign out functionality
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            // Clear user data from localStorage
            localStorage.removeItem('isLoggedIn');
            
            // Optional: keep user data for easier sign in next time
            // localStorage.removeItem('userData');
            
            // Show sign in form
            authModal.style.display = 'block';
            profileMain.style.display = 'none';
            
            // Reset to sign in tab
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Activate sign in tab and form
            authTabs[0].classList.add('active');
            signInForm.classList.add('active');
            
            // Show confirmation
            alert('Come on Bro !');
        });
    }
});
