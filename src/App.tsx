import React, { useCallback , useEffect, useState } from "react";
import ChatBot from "./components/ChatBot";
import { Flow } from "./types/Flow";
import ChatBotProvider from "./context/ChatBotContext";
import { getChatbotResponse } from './OpenAiService';

// Speech synthesis utility
const useSpeech = () => {
	const synth = window.speechSynthesis;
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    
	useEffect(() => {
		const loadVoices = () => {
			const availableVoices = synth.getVoices();
			setVoices(availableVoices);
		};
    
		// Some browsers load voices asynchronously
		if (synth.onvoiceschanged !== undefined) {
			synth.onvoiceschanged = loadVoices;
		}
    
		loadVoices();
	}, [synth]);
    
	const speak = useCallback(
		(text: string) => {
			synth.cancel(); // Stop current speech
			const utterance = new SpeechSynthesisUtterance(text);
    
			// Select a female voice (you can refine this based on language or name)
			const femaleVoice = voices.find(
				(voice) =>
					voice.name.toLowerCase().includes("female") ||
              voice.name.toLowerCase().includes("woman")
			) || voices.find((voice) => voice.name.toLowerCase().includes("google us english"));
    
			if (femaleVoice) {
				utterance.voice = femaleVoice;
			}
    
			// Customize pitch, rate, and volume
			utterance.pitch = 1.2; // 0 to 2 (default is 1)
			utterance.rate = 1.05; // 0.1 to 10 (default is 1)
			utterance.volume = 1; // 0 to 1 (default is 1)
    
			synth.speak(utterance);
		},
		[synth, voices]
	);
    
	return { speak };
};
 
function App() {
	const { speak } = useSpeech();
	// Serves as an example flow used during the development phase - covers all possible attributes in a block.
	// restore to default state before running selenium tests (or update the test cases if necessary)!
	const flow: Flow = {
		start: {
			message: (params) => {
				const messages = [
					"Welcome! I hope your flight was enjoyable" ,
					"I have arranged for your transportation to the hotel." ,
					"A black Lincoln Navigator will be at the passenger pick up.",
					" The chauffer will have a placard with your name.",
					" When you arrive, the staff will assist you with your luggage.",
					"Would you like to check in now?",
				];
				
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_check_in_request");
							}, 1000); // Optional buffer after last message
						}
					}, index * 3000);
				});
			},			
		},

		capture_check_in_request: {
			options: ["Yes", "Maybe Later"],
			chatDisabled: true,
			path: (params) => {
				if (params.userInput == 'Yes') {
					return "show_checkin_details";
				} else {
					return "airepsonse";
				}
			},
		},

		capture_recommendation_response: {
			options: ["Yes", "Maybe Later"],
			chatDisabled: true,
			path: (params) => {
				if (params.userInput == 'Yes') {
					return "show_entertainment_details";
				} else {
					return "show_checkout";
				}
			},
		},

		show_checkin_details: {
			message: (params) => {
				const messages = [
					"Ok lets review your check-in details:",
					"Check in time: 3:00pm",
					"Room preference: King Room, Near Elevator, Extra Pillows",
					"The card on file I have is a VISA card ending with 5 6 7 8",
					"Do you wish to change the card on file?"
				];
				
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_change_or_use_credit_card");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
		},
		capture_change_or_use_credit_card: {
			options: ["Change", "No"],
			chatDisabled: true,
			path: (params) => {
				if (params.userInput == 'No') {
					return "show_checkin_details_ID_verify";
				} else {
					return "show_credit_card_form_for_chat";
				}
			},
		},
		show_credit_card_form_for_chat: {
			message: "Here is the payment info to be shown upgraded one",
			component: (
				<div style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 10
				}}>
					<form action="" method="post">
						<div className="card-number">
							<label htmlFor="CardNumber">Card Number</label>
							<div className="input-container">
								<input className="" id="CardNumber" type="tel" name="CardNumber" />
								<div className="input-secure"></div>
							</div>
						</div>
						<div className="expiration-date">
							<label htmlFor="ExpirationDate">Expiration Date</label>
							<div className="input-container">
								<input className="required" id="ExpirationDate" type="tel" name="ExpirationDate"/>
							</div>
						</div>
						<div className="security-code">
							<label htmlFor="SecurityCode">Security Code</label>
							<div className="input-container">
								<input className="padding" id="SecurityCode"/>
								<div className="input-secure"></div>
							</div>
						</div>
						<div className="postal-code">
							<label htmlFor="PostalCode">Postal Code</label>
							<div className="input-container">
								<input className="required" id="PostalCode" type="text" name="PostalCode"/>
							</div>
						</div>
					</form>
				</div>
			),
			options: ["Update CC", "Cancel"],
			chatDisabled: true,
			path: (params) => {
				if (params.userInput == 'Update CC') {
					return "show_credit_details";
				} else if (params.userInput == 'UseCOF'){
					return "show_credit_card_form_for_chat";
				}
			},
		},
		show_credit_details: {
			message: (params) => {
				const messages = [
					"Your Payment information has been updated!",
					"Validating ID requirement..."
				];
				
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("show_checkin_details_ID_verify");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
		},

		show_checkin_details_ID_verify: {
			message: (params) => {
				const messages = [
					"Great, now we need to verify your Photo ID",
					"I've sent a verification link to your registered mobile",
					"Let me know once you have completed the verification!!"
				];
				
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_i_am_done");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
		},
	
		capture_i_am_done: {
			options: ["I'm Done !!!"],
			chatDisabled: true,
			path: "show_room_assignment",

			
		},
		capture_recommendations: {
			options: ["Thanks!"],
			chatDisabled: true,
			path: "show_recommendations",
			
		},
		
		capture_checkout: {
			options: ["I will!"],
			chatDisabled: true,
			path: "show_checkout",
			
		},

		capture_checkout2: {
			options: ["Yes that sounds great"],
			chatDisabled: true,
			path: "show_finalcontact",
			
		},

		capture_checkout3: {
			options: ["I am having a great stay here!"],
			chatDisabled: true,
			path: "show_departure",
			
		},

		show_recommendations: {
			message: (params) => {
				const messages = [
					"By the way, I have some recommendations for you:",
					"We have a jazz performance by Soulfire in the main ballroom.",
					 "The show starts in an hour, and tickets cost $75 each.",
					  "Would you like to reserve tickets?",

				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_recommendation_response");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
			
		},

		show_room_assignment: {
			message: (params) => {
				const messages = [
					"Thanks! Verification Completed successfully...",
					"You're all set! Here are the details... ",
					"Your Room number is 5 0 4",
					"It's a King Studio" ,
					"I added the mobile key to your Bonvoy App",
					"Thank you for being a Platinum Elite Member!! ",
					"We hope you enjoy your welcome gift!",
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_recommendations");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
			
		},

		check_box_room_preference_capture: {
			checkboxes: {items: ["High Floor", "Near Stairs", "Near Elevator", "Pool View"], min:0, max: 3},
			chatDisabled: true,
			path: "check_availability",
		},
		
		check_availability: {
			
			message: (params) => {
				const messages = [
					"Good news! I found a room with your preferences.",
					"Assigning it now....",
					"Your new Room is 7 0 2. ",
					"I added the mobile key to your Bonvoy App",
					"Thank you for being a Platinum Elite Member!! ",
					"We hope you enjoy your welcome gift!",
				
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_recommendations");
							}, 1000); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
		},

		show_entertainment_details: {
			message: (params) => {
				const messages = [
					"Great! Let me reserve that now..... ",
					"Done! I've sent the ticket to your email... ",
					"Please show the QR code at the entrance.",
					"Enjoy the show!!",
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_checkout");
							}, 1000); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
			
		},

		show_checkout: {
			message: (params) => {
				const messages = [
					"Please have a lovely evening",
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_checkout3");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
			
		},

		show_departure: {
			message: (params) => {
				const messages = [
					"I see you are checking out today. would you like a 4pm late checkout and help with your luggage?",
					
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("capture_checkout2");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
			
		},

		show_finalcontact: {
			message: (params) => {
				const messages = [
					"Perfect..The associate will accompany you to your car and load the luggage",
					"When you checkout,you will receive your final folio by email.",
					
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("loop_no_user_input");
							}, 900); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},
			
		},


		ask_what_else_to_help: {
			message: (params) => {
				const messages = [
					"Ok! if you need any help let me know"
				];
	
				messages.forEach((msg, index) => {
					setTimeout(() => {
						params.injectMessage(msg);
						speak(msg);
						// After the last message, trigger the path transition
						if (index === messages.length - 1) {
							setTimeout(() => {
								params.goToPath("loop");
							}, 1000); // Optional buffer after last message
						}
					}, index * 4000);
				});
			},			
			path: "loop",
		},
	
		loop_no_user_input: {
			message: (params) => {
				setTimeout(async () => {
					const message = "User dont have any input this time. " + 
					"AI Assistant can thank the user for choosing to stay at the property an wish them a safe flight" ;
					const botResponse = await getChatbotResponse(message);
					params.injectMessage(botResponse);
					speak(botResponse);
				}, 500);
			},
			path: "loop",
		},

		loop: {
			message: (params) => {
				setTimeout(async () => {
					const message = "Users Input/response/question is : " + params.userInput ;
					const botResponse = await getChatbotResponse(message);
					params.injectMessage(botResponse);
					speak(botResponse);
				}, 500);
			},
			path: "loop",
		},

		airepsonse: {
			message: (params) => {
				setTimeout(async () => {
					const message = "Users Input/response/question is : " + params.userInput ;
					const botResponse = await getChatbotResponse(message);
					params.injectMessage(botResponse);
					speak(botResponse);
				}, 500);
			},
			path: "airepsonse",
		},
	
	};

	return (
		<ChatBotProvider>
			<div className="colorstrip">

				<img src="../assets/mi_logo1.png" alt="Human Avatar" class="logo" />
			</div>
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