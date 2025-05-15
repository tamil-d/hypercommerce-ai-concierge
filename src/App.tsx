import React from "react";
import ChatBot from "./components/ChatBot";
import { Flow } from "./types/Flow";
import { Params } from "./types/Params";
import ChatBotProvider from "./context/ChatBotContext"; 
 
function App() {
	// Serves as an example flow used during the development phase - covers all possible attributes in a block.
	// restore to default state before running selenium tests (or update the test cases if necessary)!
	const flow: Flow = {
		start: {
			message: "Hello! What is your name?",
			path: "show_name",
		},
		show_name : {
			message: (params: Params) => `Hey ${params.userInput}! Nice to meet you.`,
			chatDisabled: true,
			transition: {duration: 1000},
			path: "ask_token",
		},
		ask_token: {
			message: () => "Before we proceed, we need to verify your profile id, "
             + "Enter your 6 digit profile id",
			isSensitive: true,
			path: (params: Params) => {
				if (params.userInput.length !== 6) {
					return "incorrect_answer"
				} else {
					return "ask_age_group";
				}
			},
		},
		ask_age_group: {
			message: () => `Your account got verified, May i know your age group?`,
			options: ["child", "teen", "adult"],
			chatDisabled: true,
			path: () => "ask_math_question",
		},
		ask_math_question: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return `I see you're a ${params.userInput}. Let's do a quick test! What is 1 + 1?`
			},
			path: (params: Params) => {
				if (params.userInput != "2") {
					return "incorrect_answer"
				} else {
					return "ask_favourite_color";
				}
			},
		},
		ask_favourite_color: {
			message: "Great Job! What is your favourite color?",
			path: "ask_favourite_pet"
		},
		ask_favourite_pet: {
			message: "Interesting! Pick any 2 pets below.",
			checkboxes: {items: ["Dog", "Cat", "Rabbit", "Hamster"], min:2, max: 2},
			function: (params: Params) => alert(`You picked: ${JSON.stringify(params.userInput)}!`),
			chatDisabled: true,
			path: "ask_height",
		},
		ask_height: {
			message: "What is your height (cm)?",
			path: async (params: Params) => {
				if (isNaN(Number(params.userInput))) {
					await params.injectMessage("Height needs to be a number!");
					return;
				}
				return "ask_weather";
			}
		},
		ask_weather: {
			message: (params: Params) => {
				if (params.prevPath == "incorrect_answer") {
					return;
				}
				return "What's my favourite color? Click the button below to find out my answer!"
			},
			component: (
				<div style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 10
				}}>
					<button
						className="secret-fav-color"
						onClick={() => alert("black")}>
						Click me!
					</button>
				</div>
			),
			path: async (params: Params) => {
				if (params.userInput.toLowerCase() != "black") {
					return "incorrect_answer"
				} else {
					await params.toggleChatWindow(false);
					return "close_chat";
				}
			},
		},
		close_chat: {
			message: "I went into hiding but you found me! Ok tell me, what's your favourite food?",
			path: "ask_image"
		},
		ask_image: {
			message: (params: Params) =>
				`${params.userInput}? Interesting. Could you share an image of that?`,
			file: (params: Params) => console.log(params.files),
			function: (params: Params) =>
				params.showToast("Image is uploaded successfully!"),
			path: "end",
		},
		end: {
			message: "Thank you for sharing! See you again!",
			path: "loop"
		},
		loop: {
			message: (params: Params) => {
				// sends the message half a second later to facilitate testing of new message prompt
				setTimeout(async () => {
					await params.injectMessage("You have reached the end of the conversation!");
				}, 500)
			},
			path: "loop"
		},
		incorrect_answer: {
			message: "Your answer is incorrect, try again!",
			transition: {duration: 0},
			path: (params: Params) => params.prevPath
		},
	};

	return (
		<ChatBotProvider>
			<div id="root-inner" style={{
				display: "flex",
				flexDirection: "row",
				width: "90%",
				maxWidth: "1200px",
				margin: "0 auto",
				backgroundColor: "#fff",
				borderRadius: "8px",
				boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				padding: "20px"
			}}>
				<div className="chatbot-container" style={{ flex: 1 }}>
					<ChatBot
						id="chatbot-id"
						flow={flow}
						settings={{
							audio: { disabled: false },
							chatInput: { botDelay: 1000 },
							userBubble: { showAvatar: true },
							botBubble: { showAvatar: true },
							voice: { disabled: false },
							sensitiveInput: { asterisksCount: 6 },
							general: {
								embedded: true,
								showHeader: true,
								showInputRow: true,
								showFooter: false,
								flowStartTrigger: "ON_LOAD",
							},
						}}
					/>
				</div>
				<div className="avatar-container" style={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingLeft: "20px"
				}}>
					<img src="../assets/avatar.png" alt="Human Avatar" className="avatar" style={{
						width: "100%",
						height: "auto",
						maxWidth: "100%",
						maxHeight: "100%",
						objectFit: "contain",
						borderRadius: "8px"
					}} />
				</div>
			</div>
		</ChatBotProvider>

	);
}

export default App;