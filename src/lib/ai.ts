import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIResponse(code: string, prompt: string) {
  const genAI = new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_API_KEY || ""
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const _p = constructPrompt(code, prompt);

  const res = await model.generateContent(_p);
  return res.response.text();
}

function constructPrompt(code: string, prompt: string): string {
  return `The user has provided you a prompt explaining what they want to do. The user's active file's code is also attached. You have to listen to their prompt and generate a response. The response should be some react.js code.

Your response should have a message too and documentate your code by using comments in the apportiate language. The message should be in the following format:
// message here
export function ABC(){
 // tell something here
 return <div>Hello world</div>
}

Also remember, your messages should be short and concise, do not get any line (which has a message not code) over 200 characters. Do not ask anything, and if you couldn't generate simply say "// I couldn't do that."

Also you are directly outputting code, no need to use \`\`\` for codeblocks, you are already outputting javascript code.

 User's prompt: ${prompt}


 User's active file code:
 ${code}
`;
}
