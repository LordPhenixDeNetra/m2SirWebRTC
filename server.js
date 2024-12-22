import express from "express";
import { createServer } from "https";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const app = express();

// Configuration SSL
const options = {
   key: fs.readFileSync('/etc/certs/privkey.pem'),
   cert: fs.readFileSync('/etc/certs/fullchain.pem')
};

const server = createServer(options, app);

// Configuration CORS pour Socket.IO
const io = new Server(server, {
   cors: {
       origin: "*",
       methods: ["GET", "POST"],
       credentials: true
   },
   transports: ['websocket', 'polling']
});

const allusers = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration sécurité pour Express
app.use((req, res, next) => {
   res.setHeader('X-Content-Type-Options', 'nosniff');
   res.setHeader('X-Frame-Options', 'DENY');
   res.setHeader('X-XSS-Protection', '1; mode=block');
   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
   next();
});

// Servir les fichiers statiques
app.use(express.static("public"));

// Route principale
app.get("/", (req, res) => {
   console.log("GET Request /");
   res.sendFile(join(__dirname + "/app/index.html"));
});

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
   console.log(`New connection established - Socket ID: ${socket.id}`);

   // Gestion de l'entrée d'un utilisateur
   socket.on("join-user", username => {
       console.log(`User joined: ${username}`);
       socket.username = username;
       allusers[username] = { username, id: socket.id };
       io.emit("joined", allusers);
   });

   // Gestion des offres WebRTC
   socket.on("offer", ({from, to, offer}) => {
       console.log(`Offer from ${from} to ${to}`);
       io.to(allusers[to]?.id).emit("offer", {from, to, offer});
   });

   // Gestion des réponses WebRTC
   socket.on("answer", ({from, to, answer}) => {
       console.log(`Answer from ${from} to ${to}`);
       io.to(allusers[from]?.id).emit("answer", {from, to, answer});
   });

   // Gestion des ICE candidates
   socket.on("icecandidate", ({candidate, to}) => {
       console.log(`ICE candidate for ${to}`);
       io.to(allusers[to]?.id).emit("icecandidate", {
           candidate,
           from: socket.username
       });
   });

   // Gestion de la fin d'appel
   socket.on("end-all-calls", (username) => {
       console.log(`${username} ended all calls`);
       io.emit("end-call", {from: username});
   });

   // Gestion des messages de chat
   socket.on("chat-message", ({ message, from }) => {
       console.log(`Chat message from ${from}: ${message}`);
       socket.broadcast.emit("chat-message", { message, from });
   });

   // Gestion du partage de fichiers
   socket.on("file-share", ({ fileName, fileData, from }) => {
       console.log(`File shared by ${from}: ${fileName}`);
       socket.broadcast.emit("file-share", { fileName, fileData, from });
   });

   // Gestion de la déconnexion
   socket.on("disconnect", () => {
       console.log(`Socket ${socket.id} disconnected`);
       // Trouver et supprimer l'utilisateur déconnecté
       for (let username in allusers) {
           if (allusers[username].id === socket.id) {
               delete allusers[username];
               io.emit("user-disconnected", username);
               console.log(`User ${username} removed from active users`);
               break;
           }
       }
   });
});

// Gestion des erreurs
server.on('error', (err) => {
   console.error('Server error:', err);
});



// Démarrage du serveur
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
   console.log(`HTTPS Server running on port ${PORT}`);
   console.log(`WebSocket server is ready for secure connections`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
   console.log('SIGTERM received. Closing server...');
   server.close(() => {
       console.log('Server closed');
       process.exit(0);
   });
});




// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// const app = express();
// const server = createServer(app);
// const io = new Server(server);
// const allusers = {};

// const __dirname = dirname(fileURLToPath(import.meta.url));

// app.use(express.static("public"));

// app.get("/", (req, res) => {
//     console.log("GET Request /");
//     res.sendFile(join(__dirname + "/app/index.html"));
// });

// io.on("connection", (socket) => {
//     console.log(`New connection established - Socket ID: ${socket.id}`);

//     socket.on("join-user", username => {
//         console.log(`User joined: ${username}`);
//         socket.username = username; // Stocker le username dans l'objet socket
//         allusers[username] = { username, id: socket.id };
//         io.emit("joined", allusers);
//     });

//     socket.on("offer", ({from, to, offer}) => {
//         console.log(`Offer from ${from} to ${to}`);
//         io.to(allusers[to]?.id).emit("offer", {from, to, offer});
//     });

//     socket.on("answer", ({from, to, answer}) => {
//         console.log(`Answer from ${from} to ${to}`);
//         io.to(allusers[from]?.id).emit("answer", {from, to, answer});
//     });

//     // Nouveau gestionnaire ICE pour multi-utilisateurs
//     socket.on("icecandidate", ({candidate, to}) => {
//         console.log(`ICE candidate for ${to}`);
//         if (allusers[to]) {
//             io.to(allusers[to].id).emit("icecandidate", {
//                 candidate,
//                 from: socket.username
//             });
//         }
//     });

//     // Gestion de fin d'appel pour tous
//     socket.on("end-all-calls", (username) => {
//         console.log(`${username} ended all calls`);
//         io.emit("end-call", {from: username});
//     });

//     socket.on("chat-message", ({ message, from }) => {
//         console.log(`Chat message from ${from}: ${message}`);
//         socket.broadcast.emit("chat-message", { message, from });
//     });

//     socket.on("file-share", ({ fileName, fileData, from }) => {
//         console.log(`File shared by ${from}: ${fileName}`);
//         socket.broadcast.emit("file-share", { fileName, fileData, from });
//     });

//     socket.on("disconnect", () => {
//         console.log(`Socket ${socket.id} disconnected`);
//         // Trouver et supprimer l'utilisateur déconnecté
//         for (let username in allusers) {
//             if (allusers[username].id === socket.id) {
//                 delete allusers[username];
//                 io.emit("user-disconnected", username);
//                 console.log(`User ${username} removed from active users`);
//                 break;
//             }
//         }
//     });
// });

// const PORT = 9000;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`WebSocket server is ready for connections`);
// });

// // Gestion des erreurs
// server.on('error', (err) => {
//     console.error('Server error:', err);
// });

// // Gestion gracieuse de l'arrêt
// process.on('SIGTERM', () => {
//     console.log('SIGTERM received. Closing server...');
//     server.close(() => {
//         console.log('Server closed');
//         process.exit(0);
//     });
// });