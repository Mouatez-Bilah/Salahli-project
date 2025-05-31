 // Auto-focus next input when a digit is entered
 const codeInputs = document.querySelectorAll(".code-input");
 const verifyButton = document.getElementById("verify-btn");
 const errorMessage = document.getElementById("validation-error");

 // Function to validate the form
 function validateForm() {
   let isValid = true;
   let isEmpty = false;

   codeInputs.forEach((input) => {
     if (!input.value) {
       isValid = false;
       isEmpty = true;
     }
   });

   if (isEmpty) {
     errorMessage.textContent =
       "Please enter all 4 digits of the verification code";
     errorMessage.classList.add("visible");
   } else {
     errorMessage.classList.remove("visible");
   }

   verifyButton.disabled = !isValid;
   return isValid;
 }

 // Add event listeners to inputs
 codeInputs.forEach((input, index) => {
   input.addEventListener("input", function () {
     // Remove any error styling
     this.classList.remove("error");

     // Auto-focus next input
     if (this.value.length === 1) {
       // Only allow numbers
       if (!/^\d+$/.test(this.value)) {
         this.value = "";
         return;
       }

       if (index < codeInputs.length - 1) {
         codeInputs[index + 1].focus();
       }
     }

     validateForm();
   });

   input.addEventListener("keydown", function (e) {
     // Allow backspace to go to previous input
     if (e.key === "Backspace" && !this.value && index > 0) {
       codeInputs[index - 1].focus();
     }
   });

   input.addEventListener("focus", function () {
     this.select(); // Select all text when focused
   });
 });

 // Add event listener to verify button
 verifyButton.addEventListener("click", function (e) {
   if (!validateForm()) {
     e.preventDefault();

     // Highlight empty inputs
     codeInputs.forEach((input) => {
       if (!input.value) {
         input.classList.add("error");
       }
     });

     // Focus the first empty input
     for (let i = 0; i < codeInputs.length; i++) {
       if (!codeInputs[i].value) {
         codeInputs[i].focus();
         break;
       }
     }
   } else {
     // Form is valid, you can submit or process the code here
     window.location.href = '../page7/password-reset.html';}
 });

 // Initial validation
 validateForm();