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
			message: (params) => {
				const messages = [
					"Hi I am your AI Concierge !" ,
					"You have a Reservation: 1234567" ,
					"Do you wish to checkin ?"
				];
				
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
	
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_check_in_request");
							}, 1000); // Optional buffer after last message
						}
					}, index * 800);
				});
			},			
		},

		capture_check_in_request: {
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
			message: (params) => {
				const messages = [
					"Here are your check-in details:",
					"Card on file: VISA ; ending with 5678; 12/28",
					"Room preference: King Room, Non-Smoking, Near Elevator",
					"Looks like we need to verify your Photo ID",
					"We have sent a verification link to your registered mobile",
					"Let us know once you have completed the verification!!"
				];
				
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
	
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_i_am_done");
							}, 900); // Optional buffer after last message
						}
					}, index * 800);
				});
			},
		},
	
		capture_i_am_done: {
			options: ["I'm Done !!!"],
			chatDisabled: true,
			path: "show_room_assignment",
		},
		show_room_assignment: {
			message: (params) => {
				const messages = [
					"Verification Completed successfully...",
					"You're all set! Room #504, It's a Deluxe King." ,
					 "Do you any additional preferences? "
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
	
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("check_box_room_preference_capture");
							}, 900); // Optional buffer after last message
						}
					}, index * 800);
				});
			},
			
		},

		check_box_room_preference_capture: {
			checkboxes: {items: ["High Floor", "Low Floor", "Near Elevator", "Lake View"], min:0, max: 3},
			function: (params: Params) => 
				alert(`Let me check availability based on your preferences...\n ${JSON.stringify(params.userInput)}!`),
			chatDisabled: true,
			path: "check_availability",
		},
		
		check_availability: {
			
			message: (params) => {
				const messages = [
					"Good news! I found a room with your preferences. Assigning it now....",
					"You're all set! Room #1502. Here's your mobile key 🔑",
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
	
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("loop");
							}, 1000); // Optional buffer after last message
						}
					}, index * 800);
				});
			},
		},

		ask_what_else_to_help: {
			message: "No problem! Is there anything else I can help you with?",
			path: "loop",
		},
	
		loop: {
			message: (params) => {
				setTimeout(() => {
					params.injectMessage("I'm here if you need anything else!");
				}, 500);
			},
			path: "loop",
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