/// <reference types="node" />

/** Server-side only — never import from src/ client code */
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export const OPENAI_MODEL_DEFAULT = "gpt-4o-mini";

export const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
