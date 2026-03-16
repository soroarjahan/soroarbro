/**
 * User Profile Image Upload Handler
 * Handles image upload, validation, preview, and storage
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const removeImageBtn = document.getElementById('removeImage');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const saveProfileBtn = document.getElementById('saveProfile');
    const profileImageWrapper = document.querySelector('.profile-image-wrapper');
    
    // Configuration
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    // Load saved profile data on page load
    loadProfileData();
    
    /**
     * Handle file input change
     */
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });
    
    /**
     * Handle drag and drop
     */
    profileImageWrapper.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('drag-over');
    });
    
    profileImageWrapper.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
    });
    
    profileImageWrapper.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });
    
    /**
     * Handle remove image button click
     */
    removeImageBtn.addEventListener('click', function() {
        removeImage();
    });
    
    /**
     * Handle save profile button click
     */
    saveProfileBtn.addEventListener('click', function() {
        saveProfileData();
    });
    
    /**
     * Process and validate uploaded image
     * @param {File} file - The uploaded file
     */
    function handleImageUpload(file) {
        hideMessages();
        
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            showError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
            resetFileInput();
            return;
        }
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            showError('File size exceeds 5MB limit. Please choose a smaller image.');
            resetFileInput();
            return;
        }
        
        // Read and display the image
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Validate that it's actually an image by loading it
            const img = new Image();
            img.onload = function() {
                displayImage(e.target.result);
                showSuccess('Image uploaded successfully!');
            };
            img.onerror = function() {
                showError('The file appears to be corrupted or is not a valid image.');
                resetFileInput();
            };
            img.src = e.target.result;
        };
        
        reader.onerror = function() {
            showError('Error reading the file. Please try again.');
            resetFileInput();
        };
        
        reader.readAsDataURL(file);
    }
    
    /**
     * Display the uploaded image
     * @param {string} imageData - Base64 encoded image data
     */
    function displayImage(imageData) {
        profileImage.src = imageData;
        profileImage.classList.add('visible');
        imagePlaceholder.classList.add('hidden');
        removeImageBtn.style.display = 'block';
    }
    
    /**
     * Remove the current profile image
     */
    function removeImage() {
        profileImage.src = '';
        profileImage.classList.remove('visible');
        imagePlaceholder.classList.remove('hidden');
        removeImageBtn.style.display = 'none';
        resetFileInput();
        
        // Remove from localStorage
        const savedData = JSON.parse(localStorage.getItem('userProfile') || '{}');
        delete savedData.profileImage;
        localStorage.setItem('userProfile', JSON.stringify(savedData));
        
        showSuccess('Image removed successfully!');
    }
    
    /**
     * Reset the file input
     */
    function resetFileInput() {
        imageUpload.value = '';
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    /**
     * Show success message
     * @param {string} message - Success message to display
     */
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        
        // Auto-hide after 3 seconds
        setTimeout(function() {
            successMessage.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Hide all messages
     */
    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }
    
    /**
     * Save profile data to localStorage
     */
    function saveProfileData() {
        const userName = document.getElementById('userName').value.trim();
        const userEmail = document.getElementById('userEmail').value.trim();
        const userBio = document.getElementById('userBio').value.trim();
        
        // Basic email validation
        if (userEmail && !isValidEmail(userEmail)) {
            showError('Please enter a valid email address.');
            return;
        }
        
        const imageSource = profileImage.src && profileImage.src !== '' ? profileImage.src : null;
        const profileData = {
            userName: userName,
            userEmail: userEmail,
            userBio: userBio,
            profileImage: imageSource,
            lastUpdated: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            showSuccess('Profile saved successfully!');
        } catch (e) {
            // Handle localStorage quota exceeded
            if (e.name === 'QuotaExceededError') {
                showError('Storage limit exceeded. Try using a smaller image.');
            } else {
                showError('Error saving profile. Please try again.');
            }
        }
    }
    
    /**
     * Load profile data from localStorage
     */
    function loadProfileData() {
        try {
            const savedData = JSON.parse(localStorage.getItem('userProfile') || '{}');
            
            if (savedData.userName) {
                document.getElementById('userName').value = savedData.userName;
            }
            if (savedData.userEmail) {
                document.getElementById('userEmail').value = savedData.userEmail;
            }
            if (savedData.userBio) {
                document.getElementById('userBio').value = savedData.userBio;
            }
            if (savedData.profileImage) {
                displayImage(savedData.profileImage);
            }
        } catch (e) {
            console.error('Error loading profile data:', e);
        }
    }
    
    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
