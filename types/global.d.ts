import { EventHandler } from "react";
import { RcbPreInjectMessageEvent } from "../src/types/events/RcbPreInjectMessageEvent";
import { RcbPostInjectMessageEvent } from "../src/types/events/RcbPostInjectMessageEvent";
import { RcbPreLoadChatBotEvent } from "../src/types/events/RcbPreLoadChatBotEvent";
import { RcbPostLoadChatBotEvent } from "../src/types/events/RcbPostLoadChatBotEvent";
import { RcbLoadChatHistoryEvent } from "../src/types/events/RcbLoadChatHistoryEvent";
import { RcbToggleChatWindowEvent } from "../src/types/events/RcbToggleChatWindowEvent";
import { RcbStartSpeakAudioEvent } from "../src/types/events/RcbStartSpeakAudioEvent";
import { RcbToggleAudioEvent } from "../src/types/events/RcbToggleAudioEvent";
import { RcbToggleVoiceEvent } from "../src/types/events/RcbToggleVoiceEvent";
import { RcbToggleNotificationsEvent } from "../src/types/events/RcbToggleNotificationsEvent";
import { RcbStartSimulateStreamMessageEvent } from "../src/types/events/RcbStartSimulateStreamMessageEvent";
import { RcbStopSimulateStreamMessageEvent } from "../src/types/events/RcbStopSimulateStreamMessageEvent";
import { RcbStartStreamMessageEvent } from "../src/types/events/RcbStartStreamMessageEvent";
import { RcbChunkStreamMessageEvent } from "../src/types/events/RcbChunkStreamMessageEvent";
import { RcbStopStreamMessageEvent } from "../src/types/events/RcbStopStreamMessageEvent";
import { RcbRemoveMessageEvent } from "../src/types/events/RcbRemoveMessageEvent";
import { RcbChangePathEvent } from "../src/types/events/RcbChangePathEvent";
import { RcbShowToastEvent } from "../src/types/events/RcbShowToastEvent";
import { RcbDismissToastEvent } from "../src/types/events/RcbDismissToastEvent";
import { RcbUserSubmitTextEvent } from "../src/types/events/RcbUserSubmitTextEvent";
import { RcbUserUploadFileEvent } from "../src/types/events/RcbUserUploadFileEvent";
import { RcbTextAreaChangeValueEvent } from "../src/types/events/RcbTextAreaChangeValue";
import { RcbPreProcessBlockEvent } from "../src/types/events/RcbPreProcessBlockEvent";
import { RcbPostProcessBlockEvent } from "../src/types/events/RcbPostProcessBlockEvent";

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Navigator {
		virtualKeyboard?: VirtualKeyboard;
	}

	/**
	 * Represents the virtual keyboard API, which extends the browser's navigator object.
	 * 
	 * Note: VirtualKeyboard is not natively supported by TypeScript. The implementation 
	 * provided here is based on the proposed specification available at 
	 * {@link https://w3c.github.io/virtual-keyboard/#dom-navigator-virtualkeyboard}.
	 */
	type VirtualKeyboard = EventTarget & {
		hide(): void
		show(): void;
		boundingRect: DOMRect;
		overlaysContent: boolean;
		ongeometrychange: EventHandler;
	}

	// for custom rcb events
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface WindowEventMap {
		// audio
		"rcb-start-speak-audio": RcbStartSpeakAudioEvent;
		"rcb-toggle-audio": RcbToggleAudioEvent;

		// notifications:
		"rcb-toggle-notifications": RcbToggleNotificationsEvent;

		// voice
		"rcb-toggle-voice": RcbToggleVoiceEvent;

		// chat window
	   	"rcb-toggle-chat-window": RcbToggleChatWindowEvent;

		// messages
		"rcb-pre-inject-message": RcbPreInjectMessageEvent;
		"rcb-post-inject-message": RcbPostInjectMessageEvent;
		"rcb-start-simulate-stream-message": RcbStartSimulateStreamMessageEvent;
		"rcb-stop-simulate-stream-message": RcbStopSimulateStreamMessageEvent;
		"rcb-start-stream-message": RcbStartStreamMessageEvent;
		"rcb-chunk-stream-message": RcbChunkStreamMessageEvent;
		"rcb-stop-stream-message": RcbStopStreamMessageEvent;
		"rcb-remove-message": RcbRemoveMessageEvent;

		// chat history
		"rcb-load-chat-history": RcbLoadChatHistoryEvent;

		// path
		"rcb-change-path": RcbChangePathEvent;

		// toast
		"rcb-show-toast": RcbShowToastEvent;
		"rcb-dismiss-toast": RcbDismissToastEvent;

		// user input submission
		"rcb-user-submit-text": RcbUserSubmitTextEvent;
		"rcb-user-upload-file": RcbUserUploadFileEvent;

		// textarea change value
		"rcb-text-area-change-value": RcbTextAreaChangeValueEvent;

		// chatbot loading
		"rcb-pre-load-chatbot": RcbPreLoadChatBotEvent;
		"rcb-post-load-chatbot": RcbPostLoadChatBotEvent;

		// block processing
		"rcb-pre-process-block": RcbPreProcessBlockEvent;
		"rcb-post-process-block": RcbPostProcessBlockEvent;
	}
}
