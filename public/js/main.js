// const createUserBtn = document.getElementById("create-user");
// const username = document.getElementById("username");
// const allusersHtml = document.getElementById("allusers");
// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");
// const endCallBtn = document.getElementById("end-call-btn");




// const chatForm = document.getElementById("chatForm");
// const chatInput = document.getElementById("chatInput");
// const chatMessages = document.getElementById("chatMessages");
// const fileInput = document.getElementById("fileInput");
// const sendFileButton = document.getElementById("sendFileButton");


// const chatToggle = document.querySelector('.chat-toggle');
// const chatContainer = document.querySelector('.chat-container');

// // chatToggle.addEventListener('click', () => {
// //   chatContainer.classList.toggle('expanded');
// // });





// const socket = io();
// let localStream;
// let caller = [];


// // Single Method for peer connection
// const PeerConnection = (function(){
//     let peerConnection;

//     const createPeerConnection = () => {
//         const config = {
//             iceServers: [
//                 {
//                     urls: 'stun:stun.l.google.com:19302'
//                 }
//             ]
//         };
//         peerConnection = new RTCPeerConnection(config);

//         // add local stream to peer connection
//         localStream.getTracks().forEach(track => {
//             peerConnection.addTrack(track, localStream);
//         })
//         // listen to remote stream and add to peer connection
//         peerConnection.ontrack = function(event) {
//             remoteVideo.srcObject = event.streams[0];
//         }
//         // listen for ice candidate
//         peerConnection.onicecandidate = function(event) {
//             if(event.candidate) {
//                 socket.emit("icecandidate", event.candidate);
//             }
//         }

//         return peerConnection;
//     }

//     return {
//         getInstance: () => {
//             if(!peerConnection){
//                 peerConnection = createPeerConnection();
//             }
//             return peerConnection;
//         }
//     }
// })();

// // handle browser events
// createUserBtn.addEventListener("click", (e) => {
//     if(username.value !== "") {
//         const usernameContainer = document.querySelector(".username-input");
//         socket.emit("join-user", username.value);
//         usernameContainer.style.display = 'none';
//     }
// });
// endCallBtn.addEventListener("click", (e) => {
//     socket.emit("call-ended", caller)
// })

// // handle socket events
// socket.on("joined", allusers => {
//     console.log({ allusers });
//     const createUsersHtml = () => {
//         allusersHtml.innerHTML = "";

//         for(const user in allusers) {
//             const li = document.createElement("li");
//             li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

//             if(user !== username.value) {
//                 const button = document.createElement("button");
//                 button.classList.add("call-btn");
//                 button.addEventListener("click", (e) => {
//                     startCall(user);
//                 });
//                 const img = document.createElement("img");
//                 img.setAttribute("src", "/images/phone.png");
//                 img.setAttribute("width", 20);

//                 button.appendChild(img);

//                 li.appendChild(button);
//             }

//             allusersHtml.appendChild(li);
//         }
//     }

//     createUsersHtml();

// })
// socket.on("offer", async ({from, to, offer}) => {
//     const pc = PeerConnection.getInstance();
//     // set remote description
//     await pc.setRemoteDescription(offer);
//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);
//     socket.emit("answer", {from, to, answer: pc.localDescription});
//     caller = [from, to];
// });
// socket.on("answer", async ({from, to, answer}) => {
//     const pc = PeerConnection.getInstance();
//     await pc.setRemoteDescription(answer);
//     // show end call button
//     endCallBtn.style.display = 'block';
//     socket.emit("end-call", {from, to});
//     caller = [from, to];
// });
// socket.on("icecandidate", async candidate => {
//     console.log({ candidate });
//     const pc = PeerConnection.getInstance();
//     await pc.addIceCandidate(new RTCIceCandidate(candidate));
// });
// socket.on("end-call", ({from, to}) => {
//     endCallBtn.style.display = "block";
// });
// socket.on("call-ended", (caller) => {
//     endCall();
// })


// // start call method
// const startCall = async (user) => {
//     console.log({ user })
//     const pc = PeerConnection.getInstance();
//     const offer = await pc.createOffer();
//     console.log({ offer })
//     await pc.setLocalDescription(offer);
//     socket.emit("offer", {from: username.value, to: user, offer: pc.localDescription});
// }

// const endCall = () => {
//     const pc = PeerConnection.getInstance();
//     if(pc) {
//         pc.close();
//         endCallBtn.style.display = 'none';
//     }
// }






// // Écouter l'envoi de messages texte
// chatForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const message = chatInput.value.trim();
//     if (message) {
//         socket.emit("chat-message", { message, from: username.value });
//         addMessageToChat(`You: ${message}`);
//         chatInput.value = ""; // Réinitialise le champ de texte
//     }
// });

// // Écouter l'envoi de fichiers
// sendFileButton.addEventListener("click", () => {
//     const file = fileInput.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = () => {
//             socket.emit("file-share", { fileName: file.name, fileData: reader.result, from: username.value });
//             addMessageToChat(`You sent a file: ${file.name}`);
//         };
//         reader.readAsDataURL(file);
//     }
// });

// // Ajouter un message au chat
// const addMessageToChat = (message) => {
//     const msgDiv = document.createElement("div");
//     msgDiv.textContent = message;
//     chatMessages.appendChild(msgDiv);
// };

// // Écouter les messages texte entrants
// socket.on("chat-message", ({ message, from }) => {
//     addMessageToChat(`${from}: ${message}`);
// });

// // Écouter les fichiers entrants
// socket.on("file-share", ({ fileName, fileData, from }) => {
//     const fileLink = document.createElement("a");
//     fileLink.href = fileData;
//     fileLink.download = fileName;
//     fileLink.textContent = `${from} sent a file: ${fileName}`;
//     chatMessages.appendChild(fileLink);
// });




// // Attendez que le DOM soit chargé
// document.addEventListener('DOMContentLoaded', () => {
//     // Vérifions d'abord si les éléments existent
//     const chatContainer = document.querySelector('.chat-container');
//     if (chatContainer) {
//         // Sur mobile, on ajoute un bouton pour toggle le chat s'il n'existe pas déjà
//         let chatToggle = document.querySelector('.chat-toggle');
//         if (!chatToggle) {
//             chatToggle = document.createElement('button');
//             chatToggle.className = 'chat-toggle';
//             chatToggle.innerHTML = '<img src="/images/chat.png" alt="Toggle chat" width="24" height="24">';
//             document.body.appendChild(chatToggle);
//         }

//         chatToggle.addEventListener('click', () => {
//             chatContainer.classList.toggle('expanded');
//         });
//     }
// });


// // initialize app
// const startMyVideo = async () => {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
//         console.log({ stream });
//         localStream = stream;
//         localVideo.srcObject = stream;
//     } catch(error) {}
// }



// // chatToggle.addEventListener('click', () => {
// //     chatContainer.classList.toggle('expanded');
// // });

// startMyVideo();












const createUserBtn = document.getElementById("create-user");
const username = document.getElementById("username");
const allusersHtml = document.getElementById("allusers");
const localVideo = document.getElementById("localVideo");
const endCallBtn = document.getElementById("end-call-btn");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const fileInput = document.getElementById("fileInput");
const sendFileButton = document.getElementById("sendFileButton");

// let localStream;
let screenStream;
let isScreenSharing = false;
const shareScreenBtn = document.getElementById('share-screen-btn');

const socket = io();
let localStream;
const peerConnections = new Map();

// Configuration de la discussion
const chatToggle = document.querySelector('.chat-toggle');
const chatContainer = document.querySelector('.chat-container');

// Créer une connexion peer
const createPeerConnection = (remoteUser) => {
    const config = {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    };
    
    const pc = new RTCPeerConnection(config);
    
    // Ajouter le flux local
    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
    });
    
    // // Gérer le flux distant
    // pc.ontrack = function(event) {
    //     const remoteVideoContainer = document.createElement('div');
    //     remoteVideoContainer.className = 'remote-video-container';
    //     remoteVideoContainer.id = `video-${remoteUser}`;
        
    //     const remoteVideo = document.createElement('video');
    //     remoteVideo.autoplay = true;
    //     remoteVideo.playsinline = true;
    //     remoteVideo.srcObject = event.streams[0];
        
    //     const userName = document.createElement('div');
    //     userName.className = 'user-name';
    //     userName.textContent = remoteUser;
        
    //     remoteVideoContainer.appendChild(remoteVideo);
    //     remoteVideoContainer.appendChild(userName);
    //     document.getElementById('remoteVideosContainer').appendChild(remoteVideoContainer);
    // };


    pc.ontrack = function(event) {
        // Vérifier si un conteneur existe déjà pour cet utilisateur
        const existingContainer = document.getElementById(`video-${remoteUser}`);
        if (existingContainer) {
            // Si le conteneur existe, mettre à jour uniquement le srcObject de la vidéo
            const existingVideo = existingContainer.querySelector('video');
            if (existingVideo) {
                existingVideo.srcObject = event.streams[0];
                return;
            }
        }
    
        // Si aucun conteneur n'existe, créer un nouveau
        const remoteVideoContainer = document.createElement('div');
        remoteVideoContainer.className = 'remote-video-container';
        remoteVideoContainer.id = `video-${remoteUser}`;
        
        const remoteVideo = document.createElement('video');
        remoteVideo.autoplay = true;
        remoteVideo.playsinline = true;
        remoteVideo.srcObject = event.streams[0];
        
        const userName = document.createElement('div');
        userName.className = 'user-name';
        userName.textContent = remoteUser;
        
        remoteVideoContainer.appendChild(remoteVideo);
        remoteVideoContainer.appendChild(userName);
    
        const remoteVideosContainer = document.getElementById('remoteVideosContainer');
        remoteVideosContainer.appendChild(remoteVideoContainer);
    };



    
    // Gérer les candidats ICE
    pc.onicecandidate = function(event) {
        if (event.candidate) {
            socket.emit("icecandidate", {
                candidate: event.candidate,
                to: remoteUser
            });
        }
    };
    
    return pc;
};

// Fonction pour gérer le partage d'écran
const toggleScreenSharing = async () => {
    try {
        if (!isScreenSharing) {
            // Démarrer le partage d'écran
            screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            // Remplacer la piste vidéo pour tous les pairs
            const videoTrack = screenStream.getVideoTracks()[0];
            
            peerConnections.forEach((pc, user) => {
                const sender = pc.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });

            // Remplacer la vidéo locale
            localVideo.srcObject = screenStream;

            // Écouter la fin du partage d'écran
            videoTrack.onended = () => {
                toggleScreenSharing();
            };

            isScreenSharing = true;
            shareScreenBtn.classList.add('active');
        } else {
            // Arrêter le partage d'écran
            if (screenStream) {
                screenStream.getTracks().forEach(track => track.stop());
            }

            // Rétablir la caméra pour tous les pairs
            const videoTrack = localStream.getVideoTracks()[0];
            
            peerConnections.forEach((pc, user) => {
                const sender = pc.getSenders().find(s => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });

            // Rétablir la vidéo locale
            localVideo.srcObject = localStream;

            isScreenSharing = false;
            shareScreenBtn.classList.remove('active');
        }
    } catch (error) {
        console.error('Error sharing screen:', error);
    }
};


shareScreenBtn.addEventListener('click', toggleScreenSharing);

// Démarrer un appel
const startCall = async (user) => {
    let pc = createPeerConnection(user);
    peerConnections.set(user, pc);
    
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", {
        from: username.value,
        to: user,
        offer: pc.localDescription
    });
};

// Gérer les événements d'interface utilisateur
createUserBtn.addEventListener("click", () => {
    if(username.value !== "") {
        const usernameContainer = document.querySelector(".username-input");
        socket.emit("join-user", username.value);
        usernameContainer.style.display = 'none';
    }
});

endCallBtn.addEventListener("click", () => {
    peerConnections.forEach((_, user) => {
        endCall(user);
    });
    socket.emit("end-all-calls", username.value);
});

// Gérer les événements socket
socket.on("joined", allusers => {
    allusersHtml.innerHTML = "";
    
    for(const user in allusers) {
        const li = document.createElement("li");
        li.textContent = `${user} ${user === username.value ? "(You)" : ""}`;

        if(user !== username.value) {
            const button = document.createElement("button");
            button.classList.add("call-btn");
            button.addEventListener("click", () => startCall(user));
            
            const img = document.createElement("img");
            img.setAttribute("src", "/images/phone.png");
            img.setAttribute("width", 20);

            button.appendChild(img);
            li.appendChild(button);
        }

        allusersHtml.appendChild(li);
    }
});

socket.on("offer", async ({from, to, offer}) => {
    let pc = createPeerConnection(from);
    peerConnections.set(from, pc);
    
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socket.emit("answer", {
        from,
        to,
        answer: pc.localDescription
    });
});

socket.on("answer", async ({from, to, answer}) => {
    const pc = peerConnections.get(to);
    if (pc) {
        await pc.setRemoteDescription(answer);
        endCallBtn.style.display = 'block';
    }
});

socket.on("icecandidate", async ({candidate, from}) => {
    const pc = peerConnections.get(from);
    if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
});

socket.on("user-disconnected", username => {
    endCall(username);
});

// Fonctions de gestion des appels
const endCall = (user) => {
    const pc = peerConnections.get(user);
    if (pc) {
        pc.close();
        peerConnections.delete(user);
    }
    
    const videoContainer = document.getElementById(`video-${user}`);
    if (videoContainer) {
        videoContainer.remove();
    }

    if (peerConnections.size === 0) {
        endCallBtn.style.display = 'none';
    }
};

// Gestion du chat
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        socket.emit("chat-message", { message, from: username.value });
        addMessageToChat(`You: ${message}`);
        chatInput.value = "";
    }
});

// Gestion des fichiers
sendFileButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            socket.emit("file-share", { 
                fileName: file.name, 
                fileData: reader.result, 
                from: username.value 
            });
            addMessageToChat(`You sent a file: ${file.name}`);
        };
        reader.readAsDataURL(file);
    }
});

// Fonctions utilitaires
const addMessageToChat = (message) => {
    const msgDiv = document.createElement("div");
    msgDiv.textContent = message;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

// Gestion des événements de chat
socket.on("chat-message", ({ message, from }) => {
    addMessageToChat(`${from}: ${message}`);
});

socket.on("file-share", ({ fileName, fileData, from }) => {
    const fileLink = document.createElement("a");
    fileLink.href = fileData;
    fileLink.download = fileName;
    fileLink.textContent = `${from} sent a file: ${fileName}`;
    chatMessages.appendChild(fileLink);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Initialisation de l'application
const startMyVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true, 
            video: true 
        });
        localStream = stream;
        localVideo.srcObject = stream;
    } catch(error) {
        console.error("Error accessing media devices:", error);
    }
};

// Toggle chat sur mobile
document.addEventListener('DOMContentLoaded', () => {
    if (chatContainer && chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('expanded');
        });
    }
});

// Démarrer l'application
startMyVideo();