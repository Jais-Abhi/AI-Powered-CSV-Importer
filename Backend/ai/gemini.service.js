import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import instruction from "./instruction.js";
dotenv.config();

const ai = new GoogleGenAI({});


const generateResponse = async ({batch,responseSchema}) => {
    try {
        console.log( "batch", batch)
        console.log("schema",responseSchema)
        const prompt =`Convert the following CSV records into GrowEasy CRM records.
        CSV Records: ${JSON.stringify(batch)}`
        
        // Convert to JSON Schema using Zod v4's native toJSONSchema()
        const rawSchema = responseSchema.toJSONSchema();
        
        // Strip the '$schema' key to prevent the SDK from stripping responseSchema
        const { $schema, ...jsonSchema  } = rawSchema;
        const response = await ai.models.generateContent({
            // model: "gemini-2.5-flash",
            // model: "gemini-2.5-flash-lite",
            model: "gemini-3.1-flash-lite",
            
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jsonSchema,
                systemInstruction: instruction
            }
        });
        const parsedJson = JSON.parse(response.text);
        console.log("parsedJson", parsedJson)
        return parsedJson;
    } catch (error) {
        console.error("Failed to generate report:", error);
    }
};

export default generateResponse;