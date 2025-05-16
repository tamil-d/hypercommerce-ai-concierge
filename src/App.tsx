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
			message: "Hi I am your AI Concierge !" +
					"\nYou have a Reservation: 1234567" +
					"\nDo you wish to checkin ?",
			options: ["Yes", "May be Later"],
			chatDisabled: true,
			path: (params) => {
				if (params.userInput == 'Yes') {
					return "show_checkin_details";
				} else {
					return "ask_what_else_to_help";
				}
			},
		},
		show_checkin_details: {
			message: () =>
				"Here are your check-in details:\n" +
				"- Card on file: **** 5678\n" +
				"- Room preference: King Room, Non-Smoking, Near Elevator\n" +
				"Please verify your ID here:",
			component: (
				<div>
					<a href="https://api.id.me/en/session/new" target="_blank" rel="noopener noreferrer">
						https://a.id.me/uahg=
					</a>
				</div>
			),
			transition: {duration: 2},
			path: "user_acknowledges",
		},
	
		user_acknowledges: {
			message: "Let me know once you've completed the verification.",
			options: ["I'm Done !!!"],
			chatDisabled: true,
			path: "show_room_assignment",
		},

		show_room_assignment: {
			message: "You're all set! Room #504, It's a Deluxe King." +
					 "\nDo you any additional preferences? ",
			checkboxes: {items: ["High Floor", "Low Floor", "Near Elevator", "Lake View"], min:0, max: 3},
			function: (params: Params) => 
				alert(`Let me check availability based on your preferences...\n ${JSON.stringify(params.userInput)}!`),
			chatDisabled: true,
			path: "check_availability",
		},
		
		check_availability: {
			message: "\nGood news! I found a room with your preferences. Assigning it now...." +
					 "\nYou're all set! Room #1502. Here's your mobile key 🔑",
			function: () => console.log("Checking availability..."),
			path: "final_greeting",
		},
		
		final_greeting: {
			message: "Is there anything else I can help you with?",
			path: "loop",
		},
			
	
		proceed_to_check_in: {
			message: () => "Let's Begin the check-in process !!!"
		},
		ask_what_else_to_help: {
			message: () => "Ok !!\n" + 
			"What else can I help with?"
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