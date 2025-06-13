// Firebase v8 syntaxe classique (aucun import, pas de initializeApp seul)
var firebaseConfig = {
  apiKey: "AIzaSyBK4rX3Ina6ZMGKgaVxZ7Am6LwiYCM6mGc",
  authDomain: "minichallenge-7abe1.firebaseapp.com",
  projectId: "minichallenge-7abe1",
  storageBucket: "minichallenge-7abe1.appspot.com",
  messagingSenderId: "547330408738",
  appId: "1:547330408738:web:3231684fb375022014657b",
  measurementId: "G-BV8L7T505S"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Récupérer les services
const auth = firebase.auth();
const db = firebase.firestore();

// Sélection des éléments du DOM
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const messageInput = document.getElementById("messageInput");
const postMessageBtn = document.getElementById("postMessage");
const postArea = document.getElementById("postArea");
const messagesContainer = document.getElementById("messages");

// Inscription
signupBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.createUserWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
});

// Connexion
loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
});

// Déconnexion
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// État d'authentification
auth.onAuthStateChanged((user) => {
  if (user) {
    logoutBtn.style.display = "inline";
    postArea.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
    postArea.style.display = "none";
  }
});

// Poster un message
postMessageBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  const message = messageInput.value.trim();
  if (user && message) {
    db.collection("messages").add({
      uid: user.uid,
      email: user.email,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    messageInput.value = "";
  }
});

// Afficher les messages en temps réel
db.collection("messages")
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.timestamp?.toDate().toLocaleString() || "Time not available";
      const msgDiv = document.createElement("div");
      msgDiv.innerHTML = `<p><strong>${data.email}</strong>: ${data.message}<br><small>${date}</small></p>`;
      messagesContainer.appendChild(msgDiv);
    });
  });
