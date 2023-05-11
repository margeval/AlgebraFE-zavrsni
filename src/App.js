import "./App.css";
import React, { useState, useEffect, useRef } from "react";

const drone = new window.Scaledrone("BlvvpP4aklgobPlh");
const room = drone.subscribe("soba-s-pogledom");

function randomName() {
    const adjectives = [
        "autumn",
        "hidden",
        "bitter",
        "misty",
        "silent",
        "empty",
        "dry",
        "dark",
        "summer",
        "icy",
        "delicate",
        "quiet",
        "white",
        "cool",
        "spring",
        "winter",
        "patient",
        "twilight",
        "dawn",
        "crimson",
        "wispy",
        "weathered",
        "blue",
        "billowing",
        "broken",
        "cold",
        "damp",
        "falling",
        "frosty",
        "green",
        "long",
        "late",
        "lingering",
        "bold",
        "little",
        "morning",
        "muddy",
        "old",
        "red",
        "rough",
        "still",
        "small",
        "sparkling",
        "throbbing",
        "shy",
        "wandering",
        "withered",
        "wild",
        "black",
        "young",
        "holy",
        "solitary",
        "fragrant",
        "aged",
        "snowy",
        "proud",
        "floral",
        "restless",
        "divine",
        "polished",
        "ancient",
        "purple",
        "lively",
        "nameless",
    ];
    const nouns = [
        "waterfall",
        "river",
        "breeze",
        "moon",
        "rain",
        "wind",
        "sea",
        "morning",
        "snow",
        "lake",
        "sunset",
        "pine",
        "shadow",
        "leaf",
        "dawn",
        "glitter",
        "forest",
        "hill",
        "cloud",
        "meadow",
        "sun",
        "glade",
        "bird",
        "brook",
        "butterfly",
        "bush",
        "dew",
        "dust",
        "field",
        "fire",
        "flower",
        "firefly",
        "feather",
        "grass",
        "haze",
        "mountain",
        "night",
        "pond",
        "darkness",
        "snowflake",
        "silence",
        "sound",
        "sky",
        "shape",
        "surf",
        "thunder",
        "violet",
        "water",
        "wildflower",
        "wave",
        "water",
        "resonance",
        "sun",
        "wood",
        "dream",
        "cherry",
        "tree",
        "fog",
        "frost",
        "voice",
        "paper",
        "frog",
        "smoke",
        "star",
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + noun;
}

function randomColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

const myUsername = randomName();
const myColor = randomColor();

function App() {
    const chatDivRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    useEffect(() => {
        drone.on("open", () => {
            const myClientId = drone.clientId;

            room.on("message", (message) => {
                setMessages((prev) => [
                    ...prev,
                    {
                        isFromMe: myClientId === message.clientId,
                        text: message.data.text,
                        username: message.data.username,
                        color: message.data.color,
                    },
                ]);

                setTimeout(() => {
                    chatDivRef.current.scrollIntoView();
                }, 250);
            });
        });
    }, []);

    const sendMessage = () => {
        if (inputMessage.length === 0) {
            return;
        }

        drone.publish({
            room: "soba-s-pogledom",
            message: {
                text: inputMessage,
                color: myColor,
                username: myUsername,
            },
        });

        setInputMessage("");
    };

    const inputChange = (event) => {
        setInputMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={
                            "chat-msg-outer " +
                            (msg.isFromMe
                                ? "chat-msg-outer-right"
                                : "chat-msg-outer-left")
                        }
                    >
                        <div className="chat-username">{msg.username}</div>

                        <div
                            style={{ backgroundColor: msg.color }}
                            className="chat-msg"
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatDivRef}></div>
            </div>
            <div className="chat-input">
                <input
                    className="chat-input-value"
                    type="text"
                    id="msg"
                    name="msg"
                    onChange={inputChange}
                    value={inputMessage}
                    onKeyDown={handleKeyDown}
                    placeholder="Type anything!"
                />
                <button
                    className="chat-input-btn"
                    type="button"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default App;
