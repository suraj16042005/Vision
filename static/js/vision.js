// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUUJVBsswXDZ2mC1wmCLnLcTlUT3HVIdU",
    authDomain: "vision-dbdc4.firebaseapp.com",
    projectId: "vision-dbdc4",
    storageBucket: "vision-dbdc4.appspot.com",
    messagingSenderId: "913317427494",
    appId: "1:913317427494:web:1abd0c48d75b2de014469e",
    measurementId: "G-1LRV2EZ4ER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    
    // ✅ Login Form Event Listener
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login successful!");
                setTimeout(() => window.location.href = "http://127.0.0.1:5000/", 500);
            } catch (error) {
                console.error("Login Error:", error);
                handleAuthError(error);
            }
        });
    }

    // ✅ Signup Form Event Listener
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                await createUserWithEmailAndPassword(auth, email, password);
                alert("Account created successfully! Redirecting...");
                setTimeout(() => window.location.href = "http://127.0.0.1:5000/", 500);
            } catch (error) {
                console.error("Signup Error:", error);
                handleAuthError(error);
            }
        });
    }

    // ✅ Search Functionality
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("stockInput");
    const searchIcon = document.querySelector(".fa-magnifying-glass");

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            fetchStockData();
        });

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                fetchStockData();
            }
        });

        searchIcon.addEventListener("click", fetchStockData);
    }

    document.getElementById("searchButton")?.addEventListener("click", function () {
        document.querySelector(".hero").style.display = "none";
    });

});

// ✅ Function to Handle Firebase Auth Errors
function handleAuthError(error) {
    const errorMessages = {
        "auth/email-already-in-use": "This email is already registered. Please log in instead.",
        "auth/weak-password": "Password should be at least 6 characters long.",
        "auth/invalid-email": "Invalid email format. Please try again.",
        "auth/user-not-found": "User not found. Please check your email or sign up.",
        "auth/wrong-password": "Incorrect password. Please try again.",
    };

    alert(errorMessages[error.code] || "Error: " + error.message);
}

// ✅ Function to Fetch Stock Data
async function fetchStockData() {
    let stock = document.getElementById("stockInput").value.trim();
    if (!stock) {
        alert("Please enter a stock name.");
        return;
    }

    console.log("Fetching data for:", stock);

    try {
        let response = await fetch(http://127.0.0.1:5000/predict?ticker=${stock});
        let data = await response.json();

        let predictions = data.predictions.map(val => val[0]);
        let dates = data.dates;

        renderChart(dates, predictions);
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}

// ✅ Function to Render Chart.js Graph
function renderChart(dates, predictions) {
    let ctx = document.getElementById("stockChart").getContext("2d");

    if (window.stockChartInstance) {
        window.stockChartInstance.destroy(); // Clear previous chart
    }

    window.stockChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                label: "Predicted Price",
                data: predictions,
                borderColor: "red",
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    document.querySelector(".chart-container").style.display = "block";
}